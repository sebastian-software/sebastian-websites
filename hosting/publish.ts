/**
 * Uploads one target's build to its storage zone, removes files the build no
 * longer contains, and purges the CDN so the next request sees the new state.
 */
import { createHash } from "node:crypto"
import { readdir, readFile } from "node:fs/promises"
import { setTimeout as pause } from "node:timers/promises"

import type { Log, Provisioned } from "./provision.ts"
import type { Target } from "./targets.ts"

import { type BunnyApi, bunnyError, type Fetch, getZone, isJson, type Json, text } from "./bunny.ts"

export type Asset = { readonly bytes: Uint8Array<ArrayBuffer>; readonly path: string }

const STORAGE_HOST = "https://storage.bunnycdn.com"
const REQUEST_TIMEOUT_MS = 30_000
const UNAUTHORIZED = 401
const TOO_MANY_REQUESTS = 429
const INTERNAL_SERVER_ERROR = 500
const BAD_GATEWAY = 502
const SERVICE_UNAVAILABLE = 503
const GATEWAY_TIMEOUT = 504
const NOT_FOUND = 404
const RETRY_STATUSES = new Set([
  BAD_GATEWAY,
  GATEWAY_TIMEOUT,
  INTERNAL_SERVER_ERROR,
  SERVICE_UNAVAILABLE,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
])
const RETRIES = 4
const RETRY_BASE_MS = 1000

/** Build metadata Vite writes next to the output; it is not part of the site. */
const SKIPPED_DIRECTORIES = new Set([".vite"])

/**
 * Hashes bytes the way Bunny Storage reports checksums.
 *
 * @param bytes - The content.
 * @returns The uppercase hex SHA-256.
 */
export const checksum = (bytes: Uint8Array): string =>
  createHash("sha256").update(bytes).digest("hex").toUpperCase()

async function readDirectory(root: string, relative: string, files: Asset[]): Promise<void> {
  for (const entry of await readdir(`${root}/${relative}`, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue
    const path = relative === "" ? entry.name : `${relative}/${entry.name}`
    if (entry.isDirectory() && !SKIPPED_DIRECTORIES.has(entry.name)) {
      await readDirectory(root, path, files)
    } else if (entry.isFile()) {
      files.push({ bytes: new Uint8Array(await readFile(`${root}/${path}`)), path })
    }
  }
}

/**
 * Reads every file of a build directory.
 *
 * @param root - The build directory.
 * @returns The files with their content, sorted by path.
 */
export async function loadBuild(root: string): Promise<readonly Asset[]> {
  const files = await loadAssets(root)
  if (!files.some((file) => file.path === "index.html")) {
    throw new Error(`${root} holds no index.html; is it a build output?`)
  }
  return files
}

/**
 * Reads a private asset folder without requiring a website document.
 * Hidden files and symbolic links are excluded from the public upload.
 *
 * @param root - The complete source folder for the storage zone.
 * @returns Files sorted by their public path.
 */
export async function loadAssets(root: string): Promise<readonly Asset[]> {
  const files: Asset[] = []
  await readDirectory(root, "", files)
  if (files.length === 0) {
    throw new Error(`${root} holds no assets; refusing an empty publish`)
  }
  return files.toSorted((left, right) => left.path.localeCompare(right.path))
}

/** The storage zone of one target, addressed through its write password. */
type StorageClient = {
  readonly list: (directory: string) => Promise<Map<string, string>>
  readonly put: (asset: Asset) => Promise<void>
  readonly remove: (path: string) => Promise<void>
}

const encodePath = (path: string): string =>
  path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")

async function withRetries(request: Fetch, url: string, init: RequestInit): Promise<Response> {
  for (let attempt = 0; ; attempt += 1) {
    const response = await request(url, {
      ...init,
      redirect: "error",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!RETRY_STATUSES.has(response.status) || attempt === RETRIES - 1) {
      return response
    }
    await response.arrayBuffer()
    await pause(RETRY_BASE_MS * 2 ** attempt)
  }
}

type Listed = {
  readonly directories: readonly string[]
  readonly files: ReadonlyMap<string, string>
}

function parseListing(directory: string, listing: unknown): Listed {
  const directories: string[] = []
  const files = new Map<string, string>()
  const entries = Array.isArray(listing) ? listing.filter((entry) => isJson(entry)) : []
  for (const entry of entries) {
    const name = text(entry, "ObjectName")
    if (name === undefined) {
      continue
    }
    const path = directory === "" ? name : `${directory}/${name}`
    if (entry.IsDirectory === true) {
      directories.push(path)
    } else {
      files.set(path, text(entry, "Checksum") ?? "")
    }
  }
  return { directories, files }
}

function storageClient(request: Fetch, zone: string, password: string): StorageClient {
  const url = (path: string): string => `${STORAGE_HOST}/${zone}/${encodePath(path)}`
  const headers = { AccessKey: password }
  const list = async (directory: string): Promise<Map<string, string>> => {
    const response = await withRetries(request, `${url(directory)}${directory === "" ? "" : "/"}`, {
      headers,
    })
    if (response.status === NOT_FOUND) {
      return new Map()
    }
    if (!response.ok) {
      throw bunnyError("GET", `storage ${directory || "/"}`, response.status)
    }
    const listed = parseListing(directory, await response.json())
    const remote = new Map(listed.files)
    for (const child of listed.directories) {
      for (const [path, hash] of await list(child)) {
        remote.set(path, hash)
      }
    }
    return remote
  }
  const put = async (asset: Asset): Promise<void> => {
    const response = await withRetries(request, url(asset.path), {
      body: asset.bytes,
      headers: { ...headers, Checksum: checksum(asset.bytes) },
      method: "PUT",
    })
    if (!response.ok) {
      throw bunnyError("PUT", asset.path, response.status)
    }
    await response.arrayBuffer()
  }
  const remove = async (path: string): Promise<void> => {
    const response = await withRetries(request, url(path), { headers, method: "DELETE" })
    if (!response.ok && response.status !== NOT_FOUND) {
      throw bunnyError("DELETE", path, response.status)
    }
    await response.arrayBuffer()
  }
  return { list, put, remove }
}

export type PublishOptions = {
  readonly api: BunnyApi
  readonly assets: readonly Asset[]
  readonly ids: Provisioned
  readonly log?: Log
  readonly request?: Fetch
  readonly target: Target
}

export type Published = { readonly removed: number; readonly uploaded: number }

async function uploadChanged(
  storage: StorageClient,
  assets: readonly Asset[],
  state: { readonly log: Log; readonly remote: ReadonlyMap<string, string> }
): Promise<number> {
  // Assets first, documents last: a document never references an asset that is
  // not there yet.
  const ordered = assets.toSorted(
    (left, right) => Number(left.path.endsWith(".html")) - Number(right.path.endsWith(".html"))
  )
  let uploaded = 0
  for (const asset of ordered) {
    if (state.remote.get(asset.path) !== checksum(asset.bytes)) {
      await storage.put(asset)
      state.log(`Uploaded ${asset.path}`)
      uploaded += 1
    }
  }
  return uploaded
}

async function removeStale(
  storage: StorageClient,
  assets: readonly Asset[],
  state: { readonly log: Log; readonly remote: ReadonlyMap<string, string> }
): Promise<number> {
  const local = new Set(assets.map((asset) => asset.path))
  const stale = [...state.remote.keys()].filter((path) => !local.has(path))
  for (const path of stale) {
    await storage.remove(path)
    state.log(`Removed ${path}`)
  }
  return stale.length
}

/**
 * Publishes a build: uploads new and changed files, deletes stale ones, and
 * purges the pull zone.
 *
 * @param options - The client, target, zone ids, build files, and optional fetch and log.
 * @returns The number of uploaded and removed files.
 */
export async function publish(options: PublishOptions): Promise<Published> {
  const { api, assets, ids, log = console.log, request = fetch, target } = options
  const zone: Json = await getZone(api, "/storagezone", ids.storageId)
  const password = text(zone, "Password")
  if (password === undefined || password === "") {
    throw new Error(`Storage zone ${target.name} reports no write password`)
  }
  const storage = storageClient(request, target.name, password)
  const state = { log, remote: await storage.list("") }
  const uploaded = await uploadChanged(storage, assets, state)
  const removed = await removeStale(storage, assets, state)
  await api("POST", `/pullzone/${ids.pullZoneId}/purgeCache`, {})
  log(`Purged ${target.name}`)
  return { removed, uploaded }
}

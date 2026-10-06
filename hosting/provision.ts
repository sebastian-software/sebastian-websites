/**
 * Converges one target's Bunny resources: the storage zone, the pull zone with
 * its caching rules, the path-resolving middleware, and the canonical hostname
 * once the variant is active. Idempotent: every resource is looked up by name,
 * and a setting is written only when it differs.
 */
import { createHash } from "node:crypto"

import type { Target } from "./targets.ts"

import { bundleMiddleware } from "./bundle.ts"
import {
  type BunnyApi,
  contains,
  count,
  findZone,
  getZone,
  isBunnyFailure,
  isJson,
  type Json,
  records,
  text,
  type Zone,
} from "./bunny.ts"

export type Log = (message: string) => void

const STORAGE = { region: "DE", replicationRegions: ["SE", "NY"] } as const
const ONE_YEAR = 31_536_000
const ONE_DAY = 86_400
const FIVE_MINUTES = 300
const BAD_REQUEST = 400
const NOTE_LENGTH = 12

// Bunny edge-rule and trigger codes, as its API names them.
const ACTION = { browserCacheTime: 16, cacheTime: 3, setResponseHeader: 5 } as const
const TRIGGER_URL = 0
const MATCH = { any: 0, none: 2 } as const
const SCRIPT_TYPE_MIDDLEWARE = 2
const STORAGE_ZONES = "/storagezone"
const PULL_ZONES = "/pullzone"

export type EdgeRule = { readonly Description: string } & Json

/**
 * The pull-zone settings every target shares, plus open CORS for the
 * extensions a target exports to other sites.
 *
 * @param target - The target whose exported extensions get open CORS.
 * @returns The settings as Bunny's API names them.
 */
export function pullZoneSettings(target: Target): Json {
  return {
    AccessControlOriginHeaderExtensions: [...target.corsExtensions],
    CacheErrorResponses: false,
    DisableCookies: true,
    EnableAccessControlOriginHeader: target.corsExtensions.length > 0,
    EnableGeoZoneAF: false,
    EnableGeoZoneASIA: false,
    EnableGeoZoneEU: true,
    EnableGeoZoneSA: false,
    EnableGeoZoneUS: true,
    IgnoreQueryStrings: true,
  }
}

type CacheRuleSpec = {
  readonly browser: number
  readonly cdn: number
  readonly description: string
  readonly immutable: boolean
  readonly matching: number
  readonly orderIndex: number
  readonly patterns: readonly string[]
}

function cacheRule(spec: CacheRuleSpec): EdgeRule {
  const cacheControl = `public, max-age=${spec.browser}${spec.immutable ? ", immutable" : ""}`
  return {
    ActionParameter1: String(spec.cdn),
    ActionType: ACTION.cacheTime,
    Description: spec.description,
    Enabled: true,
    ExtraActions: [
      { ActionParameter1: String(spec.browser), ActionType: ACTION.browserCacheTime },
      {
        ActionParameter1: "Cache-Control",
        ActionParameter2: cacheControl,
        ActionType: ACTION.setResponseHeader,
      },
    ],
    OrderIndex: spec.orderIndex,
    TriggerMatchingType: MATCH.any,
    Triggers: [
      { PatternMatches: [...spec.patterns], PatternMatchingType: spec.matching, Type: TRIGGER_URL },
    ],
  }
}

/**
 * The caching rules of a website target: hashed build assets never change,
 * documents are purged on every publish and kept short in browsers.
 *
 * @returns The two rules, matched by description on later runs.
 */
export function cacheRules(): readonly EdgeRule[] {
  return [
    cacheRule({
      browser: ONE_YEAR,
      cdn: ONE_YEAR,
      description: "websites: hashed assets are immutable",
      immutable: true,
      matching: MATCH.any,
      orderIndex: 0,
      patterns: ["*/assets/*"],
    }),
    cacheRule({
      browser: FIVE_MINUTES,
      cdn: ONE_DAY,
      description: "websites: documents are purged on publish",
      immutable: false,
      matching: MATCH.none,
      orderIndex: 1,
      patterns: ["*/assets/*"],
    }),
  ]
}

type Context = { readonly api: BunnyApi; readonly log: Log; readonly target: Target }

type Settings = { readonly current: Json; readonly desired: Json; readonly resource: string }

async function patchSettings(context: Context, settings: Settings): Promise<void> {
  const { current, desired, resource } = settings
  const patch = Object.fromEntries(
    Object.entries(desired).filter(([key, value]) => !contains(current[key], value))
  )
  if (Object.keys(patch).length > 0) {
    await context.api("POST", resource, patch)
    context.log(`Updated ${resource}: ${Object.keys(patch).join(", ")}`)
  }
}

async function createZone(context: Context, resource: string, body: Json): Promise<Zone> {
  await context.api("POST", resource, body)
  const kind = resource === STORAGE_ZONES ? "storage zone" : "pull zone"
  context.log(`Created ${kind} ${context.target.name}`)
  const zone = await findZone(context.api, resource, context.target.name)
  if (zone === undefined) {
    throw new Error(`${resource} ${context.target.name} is missing after creation`)
  }
  return zone
}

async function ensureStorage(context: Context): Promise<Zone> {
  const { api, target } = context
  const found =
    (await findZone(api, STORAGE_ZONES, target.name)) ??
    (await createZone(context, STORAGE_ZONES, {
      Name: target.name,
      Region: STORAGE.region,
      ReplicationRegions: [...STORAGE.replicationRegions],
      ZoneTier: 0,
    }))
  const storage = await getZone(api, STORAGE_ZONES, found.Id)
  if (text(storage, "Region") !== STORAGE.region) {
    throw new Error(`Storage zone ${target.name} lives in another region; refusing to change it`)
  }
  await patchSettings(context, {
    current: storage,
    desired: { Rewrite404To200: false },
    resource: `/storagezone/${storage.Id}`,
  })
  return storage
}

async function applyRule(context: Context, pull: Zone, rule: EdgeRule): Promise<void> {
  const matches = records(pull, "EdgeRules").filter(
    (entry) => entry.Description === rule.Description
  )
  if (matches.length > 1) {
    throw new Error(`Conflicting cache rules: ${rule.Description}`)
  }
  const current = matches.at(0)
  if (contains(current, rule)) {
    return
  }
  const guid = current === undefined ? undefined : text(current, "Guid")
  await context.api("POST", `${PULL_ZONES}/${pull.Id}/edgerules/addOrUpdate`, {
    ...rule,
    ...(guid === undefined ? {} : { Guid: guid }),
  })
  context.log(`Applied rule "${rule.Description}"`)
}

async function ensureEdgeRules(context: Context, pull: Zone): Promise<void> {
  for (const rule of cacheRules()) {
    await applyRule(context, pull, rule)
  }
}

async function ensurePullZone(context: Context, storageId: number): Promise<Zone> {
  const { api, target } = context
  const settings = pullZoneSettings(target)
  const found =
    (await findZone(api, PULL_ZONES, target.name)) ??
    (await createZone(context, PULL_ZONES, {
      Name: target.name,
      StorageZoneId: storageId,
      ...settings,
    }))
  const pull = await getZone(api, PULL_ZONES, found.Id)
  if (count(pull, "StorageZoneId") !== storageId) {
    throw new Error(`Pull zone ${target.name} serves another origin; refusing to repoint it`)
  }
  await patchSettings(context, {
    current: pull,
    desired: settings,
    resource: `/pullzone/${pull.Id}`,
  })
  await ensureEdgeRules(context, pull)
  return pull
}

const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex")

async function findScript(api: BunnyApi, name: string): Promise<undefined | Zone> {
  const page = await api("GET", `/compute/script?search=${encodeURIComponent(name)}&perPage=100`)
  const script = (isJson(page) ? records(page, "Items") : []).find((entry) => entry.Name === name)
  if (script === undefined) {
    return undefined
  }
  const id = count(script, "Id")
  if (id === undefined || text(script, "Name") === undefined) {
    throw new Error(`Invalid script ${name}`)
  }
  return { ...script, Id: id, Name: name }
}

type Release = { readonly code: string; readonly name: string; readonly verb: string }

async function publishScript(context: Context, release: Release): Promise<Zone> {
  const { code, name, verb } = release
  const script = await findScript(context.api, name)
  if (script === undefined) {
    throw new Error(`Script ${name} is missing`)
  }
  await context.api("POST", `/compute/script/${script.Id}/publish`, {
    Note: sha256(code).slice(0, NOTE_LENGTH),
  })
  context.log(`Middleware ${name} ${verb} and published`)
  return script
}

async function ensureScript(context: Context, name: string, code: string): Promise<Zone> {
  const script = await findScript(context.api, name)
  if (script === undefined) {
    await context.api("POST", "/compute/script", {
      Code: code,
      Name: name,
      ScriptType: SCRIPT_TYPE_MIDDLEWARE,
    })
    return publishScript(context, { code, name, verb: "created" })
  }
  const remote = await context.api("GET", `/compute/script/${script.Id}/code`)
  const remoteCode = isJson(remote) ? text(remote, "Code") : undefined
  if (remoteCode !== undefined && sha256(remoteCode) === sha256(code)) {
    return script
  }
  await context.api("POST", `/compute/script/${script.Id}/code`, { Code: code })
  return publishScript(context, { code, name, verb: "updated" })
}

async function ensureMiddleware(context: Context, pull: Zone): Promise<void> {
  const name = `${context.target.name}-middleware`
  const script = await ensureScript(context, name, await bundleMiddleware(context.target.name))
  if (count(pull, "MiddlewareScriptId") !== script.Id) {
    await context.api("POST", `/pullzone/${pull.Id}`, { MiddlewareScriptId: script.Id })
    context.log(`Linked middleware ${name} to ${context.target.name}`)
  }
}

const hostEntry = (pull: Zone, hostname: string): Json | undefined =>
  records(pull, "Hostnames").find((entry) => text(entry, "Value") === hostname)

async function issueCertificate(context: Context, hostname: string): Promise<boolean> {
  try {
    await context.api(
      "GET",
      `/pullzone/loadFreeCertificate?hostname=${encodeURIComponent(hostname)}`
    )
    context.log(`Issued a certificate for ${hostname}`)
    return true
  } catch (error) {
    if (!isBunnyFailure(error) || error.status !== BAD_REQUEST) {
      throw error
    }
    context.log(
      `::warning::No certificate for ${hostname} yet; point its CNAME at ${context.target.name}.b-cdn.net`
    )
    return false
  }
}

async function ensureHostname(context: Context, pullZone: Zone): Promise<void> {
  const { api, log, target } = context
  const hostname = target.hostname
  if (hostname === undefined) {
    return
  }
  let pull = pullZone
  if (hostEntry(pull, hostname) === undefined) {
    await api("POST", `/pullzone/${pull.Id}/addHostname`, { Hostname: hostname })
    log(`Attached ${hostname} to ${target.name}`)
    pull = await getZone(api, PULL_ZONES, pull.Id)
  }
  const certified =
    hostEntry(pull, hostname)?.HasCertificate === true ||
    (await issueCertificate(context, hostname))
  if (certified && hostEntry(pull, hostname)?.ForceSSL !== true) {
    await api("POST", `/pullzone/${pull.Id}/setForceSSL`, { ForceSSL: true, Hostname: hostname })
  }
}

export type Provisioned = { readonly pullZoneId: number; readonly storageId: number }

/**
 * Converges every resource of one target.
 *
 * @param api - The API client.
 * @param target - The target to converge.
 * @param log - Where changes are reported.
 * @returns The ids of the storage and pull zone.
 */
export async function provision(
  api: BunnyApi,
  target: Target,
  log: Log = console.log
): Promise<Provisioned> {
  const context: Context = { api, log, target }
  const storage = await ensureStorage(context)
  const pull = await ensurePullZone(context, storage.Id)
  await ensureMiddleware(context, pull)
  await ensureHostname(context, pull)
  return { pullZoneId: pull.Id, storageId: storage.Id }
}

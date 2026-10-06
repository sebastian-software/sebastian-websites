/**
 * A minimal client for the Bunny REST API, shared by the hosting scripts. It
 * never logs request bodies or credentials.
 */

const REQUEST_TIMEOUT_MS = 30_000
const MAX_LIST_PAGES = 100
const PAGE_SIZE = 1000

/** An API answer with a status Bunny rejected; `status` carries the HTTP code. */
export type BunnyFailure = { readonly status: number } & Error

/**
 * Builds the error for a rejected API call.
 *
 * @param method - The HTTP method.
 * @param path - The called path, without the host.
 * @param status - The HTTP status Bunny answered.
 * @returns An error carrying the status.
 */
export function bunnyError(method: string, path: string, status: number): BunnyFailure {
  return Object.assign(new Error(`Bunny ${method} ${path} answered HTTP ${status}`), { status })
}

/**
 * Whether an error is a rejected API call.
 *
 * @param error - Any thrown value.
 * @returns True for errors built by `bunnyError`.
 */
export function isBunnyFailure(error: unknown): error is BunnyFailure {
  return error instanceof Error && "status" in error && typeof error.status === "number"
}

export type BunnyApi = (method: string, path: string, body?: unknown) => Promise<unknown>
export type Fetch = typeof fetch
export type Json = Record<string, unknown>

/**
 * Reads a required environment variable.
 *
 * @param name - The variable's name, used in the error when it is missing.
 * @returns The single-line value.
 */
export function required(name: string): string {
  const value = process.env[name]
  if (value === undefined || value === "" || /[\r\n]/v.test(value)) {
    throw new Error(`${name} is required as a single-line value`)
  }
  return value
}

/**
 * Narrows an unknown JSON value to an object.
 *
 * @param value - Any parsed JSON value.
 * @returns Whether the value is a non-null object.
 */
export function isJson(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Reads a string field of a JSON object.
 *
 * @param record - The object.
 * @param key - The field name.
 * @returns The string, or undefined when the field is absent or not a string.
 */
export function text(record: Json, key: string): string | undefined {
  const value = record[key]
  return typeof value === "string" ? value : undefined
}

/**
 * Reads a numeric field of a JSON object.
 *
 * @param record - The object.
 * @param key - The field name.
 * @returns The number, or undefined when the field is absent or not a number.
 */
export function count(record: Json, key: string): number | undefined {
  const value = record[key]
  return typeof value === "number" ? value : undefined
}

/**
 * Reads an array field of a JSON object as a list of objects.
 *
 * @param record - The object.
 * @param key - The field name.
 * @returns The objects in the array; non-objects are dropped, a missing field is empty.
 */
export function records(record: Json, key: string): readonly Json[] {
  const value = record[key]
  return Array.isArray(value) ? value.filter((entry) => isJson(entry)) : []
}

/**
 * Creates a client bound to one API key.
 *
 * @param key - The Bunny account API key.
 * @param request - The fetch implementation, replaceable in tests.
 * @returns A function that performs one API call and parses its JSON answer.
 */
export function bunnyApi(key: string, request: Fetch = fetch): BunnyApi {
  return async (method, path, body) => {
    const response = await request(`https://api.bunny.net${path}`, {
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: {
        accept: "application/json",
        AccessKey: key,
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      method,
      redirect: "error",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!response.ok) {
      throw bunnyError(method, path, response.status)
    }
    const answer = await response.text()
    return answer === "" ? undefined : (JSON.parse(answer) as unknown)
  }
}

/**
 * Lists every item of a resource. Bunny answers plain arrays on some list
 * endpoints and paginated objects on others.
 *
 * @param api - The API client.
 * @param resource - The resource path, such as `/pullzone`.
 * @returns All items as objects.
 */
export async function listItems(api: BunnyApi, resource: string): Promise<readonly Json[]> {
  const items: Json[] = []
  for (let page = 1; page <= MAX_LIST_PAGES; page += 1) {
    const result = await api("GET", `${resource}?perPage=${PAGE_SIZE}&page=${page}`)
    if (Array.isArray(result)) {
      return [...items, ...result.filter((entry) => isJson(entry))]
    }
    if (!isJson(result)) {
      throw new Error(`Invalid Bunny list at ${resource}`)
    }
    const pageItems = records(result, "Items")
    items.push(...pageItems)
    const total = count(result, "TotalItems")
    if (result.HasMoreItems === false || (total !== undefined && items.length >= total)) {
      return items
    }
    if (pageItems.length === 0) {
      throw new Error(`Incomplete Bunny list at ${resource}`)
    }
  }
  throw new Error(`Bunny pagination limit reached at ${resource}`)
}

/**
 * Whether `actual` carries every field of `desired` with the same value; Bunny
 * adds fields of its own, which are ignored.
 *
 * @param actual - The value read back from the API.
 * @param desired - The value this repository owns.
 * @returns True when nothing owned differs.
 */
export function contains(actual: unknown, desired: unknown): boolean {
  if (Array.isArray(desired)) {
    return (
      Array.isArray(actual) &&
      actual.length === desired.length &&
      desired.every((value, index) => contains(actual[index], value))
    )
  }
  if (isJson(desired)) {
    return (
      isJson(actual) &&
      Object.entries(desired).every(([key, value]) => contains(actual[key], value))
    )
  }
  return actual === desired
}

export type Zone = { readonly Id: number; readonly Name: string } & Json

/**
 * Narrows a JSON object to a zone with a valid id and name.
 *
 * @param value - The object.
 * @returns Whether it carries a positive integer `Id` and a string `Name`.
 */
export function isZone(value: unknown): value is Zone {
  if (!isJson(value)) {
    return false
  }
  const id = count(value, "Id")
  return id !== undefined && Number.isSafeInteger(id) && id > 0 && text(value, "Name") !== undefined
}

/**
 * Finds the one zone of a resource with an exact name.
 *
 * @param api - The API client.
 * @param resource - `/storagezone` or `/pullzone`.
 * @param name - The exact zone name.
 * @returns The zone, or undefined when none exists.
 */
export async function findZone(
  api: BunnyApi,
  resource: string,
  name: string
): Promise<undefined | Zone> {
  const zones = await listItems(api, resource)
  const matches = zones.filter((entry): entry is Zone => isZone(entry) && entry.Name === name)
  if (matches.length > 1) {
    throw new Error(`Multiple Bunny zones named ${name}`)
  }
  return matches[0]
}

/**
 * Reads one zone by id.
 *
 * @param api - The API client.
 * @param resource - `/storagezone` or `/pullzone`.
 * @param id - The numeric id Bunny assigned.
 * @returns The zone with every field Bunny reports.
 */
export async function getZone(api: BunnyApi, resource: string, id: number): Promise<Zone> {
  const zone = await api("GET", `${resource}/${id}`)
  if (!isZone(zone)) {
    throw new Error(`Invalid zone ${resource}/${id}`)
  }
  return zone
}

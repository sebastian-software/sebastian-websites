// Throwaway probe for the analytics ingest spike. It runs on Bunny Edge
// Scripting as a standalone script and reports what the runtime can do. It is
// bundled and deployed by run.mjs and deleted again after the run.
//
// Nothing here may echo credentials or the database host: the workflow log of
// this public repository is public. Every error passes through `scrub`.
import * as BunnySdk from "@bunny.net/edgescript-sdk"
import nodeProcess from "node:process"
import postgres from "postgres"

const TABLE = "analytics_spike"
const startedAt = Date.now()
let requests = 0
let pooled

function env(name) {
  try {
    const value = globalThis.Deno?.env?.get?.(name)
    if (value) {
      return value
    }
  } catch {
    // Deno.env may be absent or denied; fall through to node:process.
  }
  return nodeProcess.env?.[name] ?? ""
}

function database() {
  const url = new URL(env("SPIKE_DATABASE_URL"))
  return { hostname: url.hostname, port: Number(url.port || "5432"), url }
}

function scrub(value) {
  let message = value instanceof Error ? `${value.name}: ${value.message}` : String(value)
  const code = value?.code === undefined ? "" : ` [code ${String(value.code)}]`
  const secrets = [env("SPIKE_TOKEN"), env("SPIKE_LIBSQL_TOKEN")]
  try {
    const { url } = database()
    secrets.push(url.password, decodeURIComponent(url.password), url.username, url.hostname)
  } catch {
    // No usable database URL; nothing more to hide.
  }
  try {
    secrets.push(new URL(env("SPIKE_LIBSQL_URL")).hostname)
  } catch {
    // The libSQL comparison is optional.
  }
  for (const secret of secrets) {
    if (secret) {
      message = message.split(secret).join("***")
    }
  }
  return (message + code).replaceAll(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g, "x.x.x.x").slice(0, 400)
}

async function probe(run) {
  const begin = performance.now()
  try {
    const detail = await run()
    return { ok: true, ms: Math.round(performance.now() - begin), ...detail }
  } catch (error) {
    return { ok: false, ms: Math.round(performance.now() - begin), error: scrub(error) }
  }
}

function withTimeout(promise, ms, label) {
  let timer
  const timeout = new Promise((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms} ms`)), ms)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))
}

function sql() {
  pooled ??= postgres(env("SPIKE_DATABASE_URL"), {
    connect_timeout: 10,
    idle_timeout: 20,
    max: 1,
    onnotice: () => {},
    // PgBouncer in transaction mode cannot keep prepared statements.
    prepare: false,
    ssl: "require",
  })
  return pooled
}

function maskIp(value) {
  return value.replaceAll(/\b(\d{1,3}\.\d{1,3})\.\d{1,3}\.\d{1,3}\b/g, "$1.x.x")
}

// Which runtime globals and request headers the script can see.
function runtime(request) {
  const headers = {}
  for (const [name, value] of request.headers) {
    if (name === "x-spike-token" || name === "authorization" || name === "cookie") {
      continue
    }
    headers[name] = /ip|forwarded|client|via/i.test(name) ? maskIp(value) : value.slice(0, 120)
  }
  const spoof = request.headers.get("x-spike-spoof") ?? ""
  return {
    deno: globalThis.Deno?.version?.deno ?? null,
    denoConnect: typeof globalThis.Deno?.connect,
    denoStartTls: typeof globalThis.Deno?.startTls,
    headers,
    spoofedRealIpPassedThrough: spoof !== "" && request.headers.get("x-real-ip") === spoof,
    spoofedForwardedForPassedThrough:
      spoof !== "" && (request.headers.get("x-forwarded-for") ?? "").includes(spoof),
  }
}

// Raw outbound TCP, without any driver.
async function tcp() {
  const { hostname, port } = database()
  const denoConnect = await probe(async () => {
    const connection = await withTimeout(Deno.connect({ hostname, port }), 8000, "Deno.connect")
    connection.close()
    return { port }
  })
  const nodeNet = await probe(async () => {
    const net = await import("node:net")
    await withTimeout(
      new Promise((resolve, reject) => {
        const socket = net.connect({ host: hostname, port })
        socket.once("connect", () => {
          socket.destroy()
          resolve()
        })
        socket.once("error", reject)
      }),
      8000,
      "node:net connect"
    )
    return { port }
  })
  // Postgres upgrades a plain socket to TLS after an SSLRequest message.
  const startTls = await probe(async () => {
    const connection = await withTimeout(Deno.connect({ hostname, port }), 8000, "Deno.connect")
    try {
      await connection.write(new Uint8Array([0, 0, 0, 8, 4, 210, 22, 47]))
      const answer = new Uint8Array(1)
      await withTimeout(connection.read(answer), 8000, "SSLRequest answer")
      const letter = String.fromCodePoint(answer[0])
      if (letter !== "S") {
        throw new Error(`Server answered ${letter} to SSLRequest`)
      }
      const secure = await withTimeout(Deno.startTls(connection, { hostname }), 8000, "startTls")
      const handshake = await withTimeout(secure.handshake(), 8000, "TLS handshake")
      secure.close()
      return { sslRequestAnswer: letter, alpn: handshake?.alpnProtocol ?? null }
    } catch (error) {
      try {
        connection.close()
      } catch {
        // Already closed by startTls.
      }
      throw error
    }
  })
  return { denoConnect, nodeNet, startTls }
}

// One driver round trip; the first call in an isolate is the cold one.
async function query(id) {
  const cold = pooled === undefined
  const select = await probe(async () => {
    const rows = await withTimeout(sql()`select 1 as one`, 15_000, "select")
    return { one: rows[0]?.one }
  })
  const create = await probe(async () => {
    await withTimeout(
      sql()`create table if not exists ${sql()(TABLE)} (
        id text primary key, kind text not null, ts timestamptz not null default now())`,
      15_000,
      "create table"
    )
    return {}
  })
  const insert = await probe(async () => {
    await withTimeout(
      sql()`insert into ${sql()(TABLE)} (id, kind) values (${id}, 'direct')`,
      15_000,
      "insert"
    )
    return {}
  })
  return { cold, select, create, insert }
}

// Answers first; the insert is not awaited. A later `check` shows whether the
// runtime let it finish, the stand-in for a missing `waitUntil`.
function deferred(id) {
  setTimeout(() => {
    sql()`insert into ${sql()(TABLE)} (id, kind) values (${id}, 'deferred')`.catch(() => {})
  }, 1500)
  return { scheduled: true }
}

async function check(id) {
  return probe(async () => {
    const rows = await withTimeout(
      sql()`select kind from ${sql()(TABLE)} where id = ${id}`,
      15_000,
      "check"
    )
    return { found: rows.length === 1 }
  })
}

// How a write fails when the database does not answer.
async function unreachable() {
  return probe(async () => {
    const { url } = database()
    url.port = "9"
    const closed = postgres(url.href, {
      connect_timeout: 3,
      max: 1,
      prepare: false,
      ssl: "require",
    })
    try {
      await withTimeout(closed`select 1`, 10_000, "unreachable select")
      throw new Error("A closed port answered")
    } catch (error) {
      await closed.end({ timeout: 1 }).catch(() => {})
      return { failedWith: scrub(error) }
    }
  })
}

// The comparison write: Bunny Database over libSQL's HTTP pipeline.
async function libsql(id) {
  const base = env("SPIKE_LIBSQL_URL")
  if (base === "") {
    return { skipped: "SPIKE_LIBSQL_URL is not set" }
  }
  const endpoint = `${base.replace(/^libsql:/, "https:").replace(/\/+$/, "")}/v2/pipeline`
  const pipeline = async (statements) => {
    const response = await withTimeout(
      fetch(endpoint, {
        body: JSON.stringify({
          requests: [...statements.map((stmt) => ({ stmt, type: "execute" })), { type: "close" }],
        }),
        headers: {
          authorization: `Bearer ${env("SPIKE_LIBSQL_TOKEN")}`,
          "content-type": "application/json",
        },
        method: "POST",
      }),
      15_000,
      "libSQL pipeline"
    )
    const body = await response.json()
    const failed = (body.results ?? []).find((result) => result.type === "error")
    if (!response.ok || failed !== undefined) {
      throw new Error(`HTTP ${response.status} ${failed?.error?.message ?? ""}`)
    }
  }
  const create = await probe(async () => {
    await pipeline([
      {
        sql: `create table if not exists ${TABLE} (id text primary key, kind text not null, ts text not null default current_timestamp)`,
      },
    ])
    return {}
  })
  const insert = await probe(async () => {
    await pipeline([
      {
        args: [{ type: "text", value: id }],
        sql: `insert into ${TABLE} (id, kind) values (?, 'libsql')`,
      },
    ])
    return {}
  })
  return { create, insert }
}

async function cleanup() {
  const postgresTable = await probe(async () => {
    await withTimeout(sql()`drop table if exists ${sql()(TABLE)}`, 15_000, "drop table")
    return {}
  })
  return { postgresTable }
}

async function handle(request) {
  if (env("SPIKE_TOKEN") === "" || request.headers.get("x-spike-token") !== env("SPIKE_TOKEN")) {
    return new Response("Not found", { status: 404 })
  }
  requests += 1
  const parameters = new URL(request.url).searchParams
  const mode = parameters.get("mode") ?? ""
  const id = (parameters.get("id") ?? "").slice(0, 64)
  const modes = {
    check: () => check(id),
    cleanup,
    deferred: () => deferred(id),
    libsql: () => libsql(id),
    query: () => query(id),
    runtime: () => runtime(request),
    tcp,
    unreachable,
  }
  const run = modes[mode]
  if (run === undefined) {
    return new Response("Unknown mode", { status: 400 })
  }
  const begin = performance.now()
  let result
  try {
    result = await run()
  } catch (error) {
    result = { ok: false, error: scrub(error) }
  }
  return Response.json({
    isolate: { ageMs: Date.now() - startedAt, requests },
    mode,
    result,
    totalMs: Math.round(performance.now() - begin),
  })
}

BunnySdk.net.http.serve(async (request) => {
  try {
    return await handle(request)
  } catch (error) {
    return Response.json({ error: scrub(error), ok: false }, { status: 500 })
  }
})

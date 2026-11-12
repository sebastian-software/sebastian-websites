// Deploys probe.mjs as a standalone Bunny Edge Script, calls every probe mode,
// prints the results, and deletes the script again. Run by
// .github/workflows/spike-edge-postgres.yml; see README.md.
//
// The log of this public repository is public: no credential, database host,
// or probe token is ever printed.
import { build } from "esbuild"
import { randomBytes, randomUUID } from "node:crypto"
import { appendFileSync } from "node:fs"
import { builtinModules } from "node:module"
import { setTimeout as sleep } from "node:timers/promises"
import { fileURLToPath } from "node:url"

const SCRIPT_NAME = "analytics-ingest-spike"
const SCRIPT_TYPE_STANDALONE = 1
const WARM_CALLS = 8
const SPOOF_IP = "203.0.113.7"

const secretValues = []

function scrub(text) {
  let clean = String(text)
  for (const secret of secretValues) {
    if (secret) {
      clean = clean.split(secret).join("***")
    }
  }
  return clean
}

function log(message) {
  console.log(scrub(message))
}

// postgres.js imports Node built-ins without the `node:` prefix, which a Deno
// runtime does not resolve. Rewrite them and leave them to the runtime.
const nodeBuiltins = {
  name: "node-builtins",
  setup(context) {
    const names = new Set(builtinModules.filter((name) => !name.startsWith("_")))
    context.onResolve({ filter: /^(?:node:)?[a-z_/]+$/ }, (args) => {
      const name = args.path.replace(/^node:/, "")
      return names.has(name) ? { external: true, path: `node:${name}` } : undefined
    })
  },
}

async function bundle() {
  const result = await build({
    bundle: true,
    conditions: ["import"],
    entryPoints: [fileURLToPath(new URL("probe.mjs", import.meta.url))],
    external: ["@bunny.net/edgescript-sdk"],
    format: "esm",
    logLevel: "silent",
    mainFields: ["module", "main"],
    platform: "neutral",
    plugins: [nodeBuiltins],
    target: "es2022",
    write: false,
  })
  return result.outputFiles[0].text
}

function required(name) {
  const value = process.env[name] ?? ""
  if (value === "" || /[\r\n]/.test(value)) {
    throw new Error(`${name} is required as a single-line secret`)
  }
  secretValues.push(value)
  return value
}

function bunny(key) {
  return async (method, path, body) => {
    const response = await fetch(`https://api.bunny.net${path}`, {
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: {
        accept: "application/json",
        AccessKey: key,
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      method,
      signal: AbortSignal.timeout(30_000),
    })
    const answer = await response.text()
    if (!response.ok) {
      throw new Error(
        `Bunny ${method} ${path} answered HTTP ${response.status}: ${answer.slice(0, 300)}`
      )
    }
    return answer === "" ? undefined : JSON.parse(answer)
  }
}

async function findScripts(api) {
  const page = await api("GET", `/compute/script?search=${SCRIPT_NAME}&perPage=100`)
  return (page?.Items ?? []).filter((script) => script.Name === SCRIPT_NAME)
}

async function removeScripts(api) {
  for (const script of await findScripts(api)) {
    await api("DELETE", `/compute/script/${script.Id}?deleteLinkedPullZones=true`)
    log(`Deleted script ${SCRIPT_NAME} (${script.Id}) and its linked pull zone`)
  }
}

function hostnamesIn(value, found = new Set()) {
  if (typeof value === "string") {
    if (/^[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:bunny\.run|b-cdn\.net)$/i.test(value)) {
      found.add(value)
    }
  } else if (Array.isArray(value)) {
    for (const entry of value) {
      hostnamesIn(entry, found)
    }
  } else if (typeof value === "object" && value !== null) {
    for (const entry of Object.values(value)) {
      hostnamesIn(entry, found)
    }
  }
  return found
}

async function scriptHostname(api, id) {
  const script = await api("GET", `/compute/script/${id}`)
  const found = hostnamesIn(script)
  for (const zone of script?.LinkedPullZones ?? []) {
    if (zone?.Id !== undefined) {
      hostnamesIn(await api("GET", `/pullzone/${zone.Id}`), found)
    }
  }
  const [hostname] = found
  if (hostname === undefined) {
    throw new Error(
      `No hostname found for the script; top-level fields: ${Object.keys(script ?? {}).join(", ")}`
    )
  }
  return hostname
}

async function deploy(api, code, secrets) {
  await removeScripts(api)
  const created = await api("POST", "/compute/script", {
    Code: code,
    CreateLinkedPullZone: true,
    Name: SCRIPT_NAME,
    ScriptType: SCRIPT_TYPE_STANDALONE,
  })
  const id = created?.Id ?? (await findScripts(api))[0]?.Id
  if (id === undefined) {
    throw new Error("Bunny did not report the new script's id")
  }
  log(`Created standalone script ${SCRIPT_NAME} (${id})`)
  for (const [Name, Secret] of Object.entries(secrets)) {
    if (Secret !== "") {
      await api("POST", `/compute/script/${id}/secrets`, { Name, Secret })
      log(`Set script secret ${Name}`)
    }
  }
  await api("POST", `/compute/script/${id}/publish`, { Note: "spike" })
  log("Published the script")
  return scriptHostname(api, id)
}

function caller(hostname, token) {
  return async (mode, id = "") => {
    const begin = performance.now()
    try {
      const response = await fetch(`https://${hostname}/?mode=${mode}&id=${id}`, {
        headers: {
          "x-forwarded-for": SPOOF_IP,
          "x-real-ip": SPOOF_IP,
          "x-spike-spoof": SPOOF_IP,
          "x-spike-token": token,
        },
        signal: AbortSignal.timeout(60_000),
      })
      const text = await response.text()
      let body
      try {
        body = JSON.parse(text)
      } catch {
        body = { raw: text.slice(0, 300) }
      }
      return {
        body,
        clientMs: Math.round(performance.now() - begin),
        server: response.headers.get("server"),
        status: response.status,
      }
    } catch (error) {
      return { clientMs: Math.round(performance.now() - begin), error: String(error) }
    }
  }
}

async function waitUntilLive(call) {
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    const answer = await call("runtime")
    if (answer.status === 200) {
      return answer
    }
    log(`Waiting for the script (attempt ${attempt}): ${answer.status ?? answer.error}`)
    await sleep(5000)
  }
  throw new Error("The script did not answer within 150 seconds")
}

function mark(value) {
  if (value === undefined || value === null) {
    return "n/a"
  }
  if (value.skipped !== undefined) {
    return `skipped (${value.skipped})`
  }
  return value.ok ? `yes (${value.ms} ms)` : `NO (${value.ms} ms): ${value.error}`
}

function summarize(results) {
  const { runtime, tcp, queries, deferred, unreachable, libsql } = results
  const rows = [
    ["Edge location (server header)", runtime.server ?? "n/a"],
    ["Deno version", runtime.body?.result?.deno ?? "n/a"],
    ["Raw TCP via Deno.connect", mark(tcp.body?.result?.denoConnect)],
    ["Raw TCP via node:net", mark(tcp.body?.result?.nodeNet)],
    ["SSLRequest + Deno.startTls", mark(tcp.body?.result?.startTls)],
    ...queries.map((answer, index) => [
      `postgres.js call ${index + 1} (${answer.body?.result?.cold ? "cold" : "warm"}, isolate age ${answer.body?.isolate?.ageMs ?? "?"} ms)`,
      `select ${mark(answer.body?.result?.select)} · insert ${mark(answer.body?.result?.insert)} · client ${answer.clientMs} ms`,
    ]),
    [
      "Insert not awaited before the response",
      mark(deferred.body?.result) +
        (deferred.body?.result?.ok ? `, row found: ${deferred.body.result.found}` : ""),
    ],
    [
      "Unreachable database",
      unreachable.body?.result?.ok
        ? `fails after ${unreachable.body.result.ms} ms: ${unreachable.body.result.failedWith}`
        : mark(unreachable.body?.result),
    ],
    [
      "Bunny Database create (libSQL HTTP)",
      mark(libsql.body?.result?.create ?? libsql.body?.result),
    ],
    [
      "Bunny Database insert (libSQL HTTP)",
      mark(libsql.body?.result?.insert ?? libsql.body?.result),
    ],
    [
      "Client-sent X-Real-IP reaches the script",
      String(runtime.body?.result?.spoofedRealIpPassedThrough ?? "n/a"),
    ],
    [
      "Client-sent X-Forwarded-For reaches the script",
      String(runtime.body?.result?.spoofedForwardedForPassedThrough ?? "n/a"),
    ],
    [
      "Request headers visible to the script",
      Object.keys(runtime.body?.result?.headers ?? {}).join(", ") || "n/a",
    ],
  ]
  return [
    "## Edge Script → Postgres spike",
    "",
    "| Check | Result |",
    "| --- | --- |",
    ...rows.map(([check, result]) => `| ${check} | ${String(result).replaceAll("|", "\\|")} |`),
    "",
  ].join("\n")
}

async function main() {
  const code = await bundle()
  log(`Bundled probe: ${(code.length / 1024).toFixed(1)} kB`)
  if (process.argv.includes("--bundle-only")) {
    return
  }
  const api = bunny(required("BUNNY_API_KEY"))
  const databaseUrl = required("SPIKE_DATABASE_URL")
  const database = new URL(databaseUrl)
  secretValues.push(database.hostname, database.password, decodeURIComponent(database.password))
  if (database.port !== "6432") {
    log(
      "::warning::SPIKE_DATABASE_URL does not use port 6432 (PgBouncer); the spike is meant to test the pooled port"
    )
  }
  const libsqlUrl = process.env.SPIKE_LIBSQL_URL ?? ""
  const libsqlToken = process.env.SPIKE_LIBSQL_TOKEN ?? ""
  secretValues.push(libsqlToken)
  if (libsqlUrl !== "") {
    secretValues.push(new URL(libsqlUrl.replace(/^libsql:/, "https:")).hostname)
  }
  const token = randomBytes(24).toString("hex")
  secretValues.push(token)

  const results = {}
  let call
  try {
    const hostname = await deploy(api, code, {
      SPIKE_DATABASE_URL: databaseUrl,
      SPIKE_LIBSQL_TOKEN: libsqlToken,
      SPIKE_LIBSQL_URL: libsqlUrl,
      SPIKE_TOKEN: token,
    })
    secretValues.push(hostname)
    call = caller(hostname, token)
    results.runtime = await waitUntilLive(call)
    results.tcp = await call("tcp")
    results.queries = []
    for (let index = 0; index < WARM_CALLS; index += 1) {
      results.queries.push(await call("query", randomUUID()))
    }
    const deferredId = randomUUID()
    results.deferredScheduled = await call("deferred", deferredId)
    await sleep(8000)
    results.deferred = await call("check", deferredId)
    results.unreachable = await call("unreachable")
    results.libsql = await call("libsql", randomUUID())
    log(JSON.stringify(results, undefined, 2))
    const summary = scrub(summarize(results))
    log(summary)
    if (process.env.GITHUB_STEP_SUMMARY) {
      appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary)
    }
  } finally {
    if (call !== undefined) {
      const cleaned = await call("cleanup")
      log(`Dropped the spike table: ${JSON.stringify(cleaned.body?.result ?? cleaned.error)}`)
    }
    await removeScripts(api)
  }
}

try {
  await main()
} catch (error) {
  console.error(`::error::${scrub(error instanceof Error ? error.message : error)}`)
  process.exitCode = 1
}

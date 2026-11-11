import { runBuilds } from "@sebastian-websites/site/build"
import { spawn } from "node:child_process"
import { rm } from "node:fs/promises"

async function runScript(script: string, variantId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", [script], {
      cwd: new URL("..", import.meta.url),
      env: { ...process.env, SITE_VARIANT: variantId },
      stdio: "inherit",
    })
    child.once("error", reject)
    child.once("exit", (code, signal) => {
      if (code === 0) resolve()
      else reject(new Error(`${script} failed (code ${String(code)}, signal ${String(signal)}).`))
    })
  })
}

await runBuilds("consulting", {
  async afterBuild(variantId) {
    await runScript("verify:build", variantId)
  },
  async beforeBuild(variantId) {
    await rm(new URL("../public/pdfs", import.meta.url), { force: true, recursive: true })
    await runScript("generate:pdf", variantId)
  },
})

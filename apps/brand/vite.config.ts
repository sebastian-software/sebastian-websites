import { defineConfig } from "vite"

// A static page plus the public token and logo files, served at
// brand.sebastian-software.com (ADR-0013). Paths under public/ are a contract
// for external consumers and never change.
export default defineConfig({
  build: {
    outDir: "build/client",
  },
})

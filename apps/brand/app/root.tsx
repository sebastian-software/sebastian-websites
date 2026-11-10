import type { ReactNode } from "ardo/react"
import { ArdoHead, ArdoOutlet, ArdoScripts } from "ardo/runtime"

import "./styles.css"

export function Layout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link href="/sebastian-software/icon-software-light.svg" rel="icon" type="image/svg+xml" />
        <link href="/tokens/index.css" rel="stylesheet" />
        <link crossOrigin="anonymous" href="/fonts.css" rel="stylesheet" />
        <ArdoHead />
      </head>
      <body>
        {children}
        <ArdoScripts />
      </body>
    </html>
  )
}

export default function App() {
  return <ArdoOutlet />
}

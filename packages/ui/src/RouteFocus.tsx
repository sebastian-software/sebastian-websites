import { useEffect, useRef } from "react"
import { useLocation } from "react-router"

/**
 * Moves keyboard and screen-reader focus to the new page after navigation.
 *
 * @param props - Optional scroll reset for sites that avoid browser storage.
 * @param props.resetScroll - Reset scroll without persisting restoration positions.
 * @returns No visible content.
 */
export function RouteFocus({ resetScroll = false }: { readonly resetScroll?: boolean }): null {
  const { hash, key } = useLocation()
  const previousKeyRef = useRef(key)
  useEffect(() => {
    if (previousKeyRef.current === key) return
    previousKeyRef.current = key
    if (hash) return
    if (resetScroll) globalThis.scrollTo(0, 0)
    const main = document.getElementById("main")
    main?.setAttribute("tabindex", "-1")
    main?.focus({ preventScroll: true })
  }, [hash, key, resetScroll])
  return null
}

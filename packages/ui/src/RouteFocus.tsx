import { useEffect, useRef } from "react"
import { useLocation } from "react-router"

/**
 * Moves keyboard and screen-reader focus to the new page after navigation.
 *
 * @returns No visible content.
 */
export function RouteFocus(): null {
  const { hash, key } = useLocation()
  const previousKeyRef = useRef(key)
  useEffect(() => {
    if (previousKeyRef.current === key) return
    previousKeyRef.current = key
    if (hash) return
    const main = document.getElementById("main")
    main?.setAttribute("tabindex", "-1")
    main?.focus({ preventScroll: true })
  }, [hash, key])
  return null
}

import type { ReactElement } from "react"

export type ArrowProps = {
  readonly className?: string
  /** Forward within a page or site; outward to another website. */
  readonly direction?: "forward" | "outward"
}

const PATHS = {
  forward: "M2.5 8h10.5M9 4l4 4-4 4",
  outward: "M4.5 11.5l7-7M5.5 4.5h6v6",
} as const

/**
 * The single-stroke arrow of editorial links and buttons. It is decorative; the
 * link text carries the meaning.
 *
 * @param props - Direction and class name.
 * @returns An inline SVG that follows the current text color.
 */
export function Arrow(props: ArrowProps): ReactElement {
  const { className, direction = "forward" } = props
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 16 16"
    >
      <path d={PATHS[direction]} />
    </svg>
  )
}

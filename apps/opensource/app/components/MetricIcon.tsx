import type { ReactElement } from "ardo/react"

import { metricIcon } from "./Metrics.css"

// Streamline Sharp Line (new-folder, star-badge, download-box-1), CC BY 4.0.
// https://icon-sets.iconify.design/streamline-sharp/
const paths = {
  downloads: "M12 22V11m-3.5 4.5H5v-9h14v9h-3.5M5 6.5v-1L7.5 2h9L19 5.5v1m-7 0V2M8 18l4 4l4-4",
  projects: "M2 3h6l4 4h10v15H2z",
  stars:
    "M19.153 9.153a7.153 7.153 0 1 1-14.306 0a7.153 7.153 0 0 1 14.306 0ZM11.952 5.437l1.267 2.171l2.17.543l-1.447 1.628l.362 2.533l-2.352-1.085L9.6 12.311l.362-2.533L8.515 8.15l2.17-.543l1.267-2.171ZM5.9 12.89l-3.23 5.594l3.716-.985l1.005 3.71l2.944-5.098M18.1 12.89l3.23 5.594l-3.716-.984l-1.005 3.71l-2.944-5.1",
}

/**
 * Decorative mark for a metric that already has a visible label.
 * @param props - The icon properties.
 * @param props.name - The metric the icon represents.
 * @returns The icon in its original 24 pixel grid.
 */
export function MetricIcon(props: { readonly name: keyof typeof paths }): ReactElement {
  return (
    <svg
      aria-hidden="true"
      className={metricIcon}
      fill="none"
      focusable="false"
      height={24}
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      width={24}
    >
      <path d={paths[props.name]} />
    </svg>
  )
}

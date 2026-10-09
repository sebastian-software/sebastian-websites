import type { ReactNode } from "react"

export type ContactIconName = "email" | "languages" | "location" | "phone" | "workModel"

// Hairline pictograms for the collaboration facts. They stay vector in the
// PDF and inherit the secondary text color, so they print in grayscale.
const PATHS: Record<ContactIconName, ReactNode> = {
  email: (
    <>
      <rect height="9" rx="0.8" width="12" x="2" y="3.5" />
      <path d="m2.5 4.2 5.5 4.6 5.5-4.6" />
    </>
  ),
  languages: <path d="M2.5 3.5h11v7.5h-6l-3 2.5v-2.5h-2z" />,
  location: (
    <>
      <path d="M8 14.5S3.5 10 3.5 6.5a4.5 4.5 0 0 1 9 0C12.5 10 8 14.5 8 14.5Z" />
      <circle cx="8" cy="6.5" r="1.6" />
    </>
  ),
  phone: (
    <path d="M4.6 2.5h2l1 3-1.5 1.1a8 8 0 0 0 3.3 3.3l1.1-1.5 3 1v2c0 .6-.5 1.1-1.1 1.1A10.4 10.4 0 0 1 3.5 3.6c0-.6.5-1.1 1.1-1.1Z" />
  ),
  workModel: (
    <>
      <rect height="7" rx="0.8" width="10" x="3" y="3.5" />
      <path d="M1.5 12.5h13" />
    </>
  ),
}

export function ContactIcon({
  className,
  name,
}: {
  className: string
  name: ContactIconName
}): ReactNode {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.1"
      viewBox="0 0 16 16"
    >
      {PATHS[name]}
    </svg>
  )
}

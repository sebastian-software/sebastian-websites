import type { ReactNode } from "react"

import type { LegalClassNames, LegalReview } from "./model"

export type LegalDocumentFrameProperties = {
  readonly children: ReactNode
  readonly classes: LegalClassNames
  readonly review: LegalReview
  readonly subtitle?: ReactNode
  readonly title: ReactNode
}

export function LegalDocumentFrame({
  children,
  classes,
  review,
  subtitle,
  title,
}: LegalDocumentFrameProperties): ReactNode {
  return (
    <div
      className={classes.page}
      data-legal-review-status={review.legalReviewStatus}
      data-legal-source={review.contentSource}
      data-legal-verified-on={review.contentVerifiedOn}
      data-legal-version-on={review.versionOn}
    >
      <h1 className={classes.pageTitle}>{title}</h1>
      {subtitle === undefined ? null : <p className={classes.subtitle}>{subtitle}</p>}
      <div className={classes.pageContent}>{children}</div>
    </div>
  )
}

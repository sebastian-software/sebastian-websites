import type { MetricsSummary } from "@sebastian-websites/content"
import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { blocks, Section, SectionHead, typography } from "@sebastian-websites/ui"

import { formatCount } from "~/lib/metrics"
import { variant } from "~/lib/site"

export type MetricsBandProps = {
  readonly intro: string
  readonly metrics: MetricsSummary
  readonly title: string
}

/**
 * The Midnight band with the live open-source numbers (ADR-0005).
 *
 * @param props - The section copy and the numbers from the metrics service.
 * @returns The section with the headline, the three numerals, and the source line.
 */
export function MetricsBand(props: MetricsBandProps): ReactElement {
  const { intro, metrics, title } = props
  const numbers = [
    { label: t`Projects on GitHub`, value: metrics.repositories },
    { label: t`Ferramenta: engines and applications in Rust`, value: metrics.ferramentaProjects },
    { label: t`References to our agent skills`, value: metrics.skillReferences },
  ]
  return (
    <Section tone="night">
      <SectionHead eyebrow={t`Open source`} intro={intro} title={title} />
      <dl className={blocks.numbers}>
        {numbers.map((number) => (
          <div key={number.label}>
            <dd className={`${typography.numeral} ${blocks.numberValue}`}>
              {formatCount(number.value, variant.locale)}
            </dd>
            <dt className={blocks.numberLabel}>{number.label}</dt>
          </div>
        ))}
      </dl>
      <p className={blocks.numbersFoot}>
        <i className={blocks.liveDot} />
        {t`Hourly from GitHub, npm, and crates.io`}
      </p>
    </Section>
  )
}

import type { ReactElement } from "ardo/react"
import type { ArdoMetaDescriptor } from "ardo/runtime"

import { t } from "@palamedes/core/macro"
import { Trans } from "@palamedes/react/macro"
import { ImprintDocument } from "@sebastian-websites/legal"
import { pageMeta } from "@sebastian-websites/site/meta"
import { legalClassNames } from "@sebastian-websites/ui"

import { legalConfig } from "~/lib/legal"
import { variant } from "~/lib/site"

// eslint-disable-next-line react-refresh/only-export-components -- Ardo reads meta from the route module
export function meta(): ArdoMetaDescriptor[] {
  return pageMeta(variant, "/imprint", [
    { title: t`Legal Notice – Sebastian Software Open Source` },
  ])
}

export default function Imprint(): ReactElement {
  return (
    <main id="main">
      <ImprintDocument
        additionalSections={
          <section className={legalClassNames.section} data-legal-section="icon-credits">
            <h2 className={legalClassNames.sectionTitle}>
              <Trans>Icon Credits</Trans>
            </h2>
            <p className={legalClassNames.text}>
              <Trans>
                The metrics icons are from{" "}
                <a
                  className={legalClassNames.link}
                  href="https://icon-sets.iconify.design/streamline-sharp/"
                >
                  Sharp Line by Streamline
                </a>{" "}
                and are licensed under{" "}
                <a
                  className={legalClassNames.link}
                  href="https://creativecommons.org/licenses/by/4.0/"
                >
                  CC BY 4.0
                </a>
                .
              </Trans>
            </p>
          </section>
        }
        classes={legalClassNames}
        config={legalConfig}
      />
    </main>
  )
}

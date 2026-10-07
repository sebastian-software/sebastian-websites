import type { ReactElement } from "react"

import { t } from "@palamedes/core/macro"
import { ArrowLink } from "@sebastian-websites/ui"

import { OpenFoundations } from "~/components/OpenFoundations"
import { ProductStory } from "~/components/ProductStory"
import { RegionStory } from "~/components/RegionStory"
import { getProducts } from "~/data/products"

import type { Route } from "./+types/home"

import * as styles from "./home.css.ts"

// eslint-disable-next-line react-refresh/only-export-components -- React Router reads meta from the route module
export function meta(): Route.MetaDescriptors {
  return [
    { title: t`Sebastian Software – Independent software, built for everyday work` },
    {
      content: t`Sebastian Software is a product company from Mainz. We build what we use ourselves: Terminaro for appointment booking, Palamedes+ for managed translations, and VorOrt for local websites.`,
      name: "description",
    },
  ]
}

export default function Home(): ReactElement {
  const products = getProducts()
  return (
    <main className={styles.main} id="main">
      <section aria-labelledby="home-title" className={styles.hero}>
        <h1 className={styles.heroTitle} id="home-title">
          {t`Independent software.`}
          <br />
          {t`Built for everyday work.`}
        </h1>
        <div className={styles.heroIntro}>
          <p className={styles.heroText}>
            {t`Sebastian Software is a product company. We build what we use ourselves, from appointment booking to translation and local websites: practical tools, maintained with care.`}
          </p>
          <p className={styles.heroAction}>
            <ArrowLink href="/products">{t`Discover the products`}</ArrowLink>
          </p>
        </div>
      </section>
      <div className={styles.stories}>
        {products.map((product, index) => (
          <ProductStory index={index} key={product.id} product={product} />
        ))}
      </div>
      <div className={styles.company}>
        <RegionStory />
      </div>
      <div className={styles.company}>
        <OpenFoundations />
      </div>
    </main>
  )
}

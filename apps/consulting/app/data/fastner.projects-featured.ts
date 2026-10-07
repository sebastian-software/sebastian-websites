import { t } from "@palamedes/core/macro"

import { HIDDEN_LOGO } from "~/assets/company"

import type { Project } from "./types"

import { Tech } from "./technologies"

// eslint-disable-next-line max-lines-per-function -- project data array
export function getFeaturedProjects(): Project[] {
  const LOCATION_FRANKFURT = t`Frankfurt am Main, Germany`
  const CUSTOMER_TELEKOM = "Deutsche Telekom"
  const ROLE_SENIOR_FRONTEND_ARCHITECT = t`Senior Frontend Architect`

  return [
    {
      customer: t`Terminaro · Product by Sebastian Software GmbH · SaaS`,
      description: t`For Terminaro, a product by Sebastian Software GmbH, I built a web-based appointment booking system for freelancers and companies as a Product Engineer, moving scheduling coordination out of email threads and into a shareable, multilingual booking link. Visitors can view available time slots without registration, book in their own time zone, and cancel appointments through a personal link. I owned the product from the public booking page to the administration area, with a strong focus on GDPR-oriented workflows, a cookie-free booking page, and reliable availability calculation.

React Router 7, TypeScript, and Convex form the technical foundation. The application integrates Google Calendar via OAuth as well as CalDAV-compatible calendars such as iCloud and Fastmail, generates iCal feeds, sends customizable email templates through customer-owned SMTP servers, and protects sensitive credentials through encryption. Better Auth with Pocket ID, Bunny.net Static Hosting with Edge Middleware, security headers, rate limits, health checks, and an extensive Vitest-/Playwright-oriented test base support operations and ongoing development.`,
      endDate: new Date("2026-08-31"),
      id: "terminaro",
      industry: "SaaS / Produktivität",
      location: t`Rhine-Main, Germany`,
      logo: HIDDEN_LOGO,
      results: "",
      role: "Product Engineer",
      startDate: new Date("2026-01-01"),
      technologies: [
        Tech.ReactRouter,
        Tech.Convex,
        Tech.TypeScript,
        Tech.BetterAuth,
        Tech.CalDAV,
        Tech.Bunny,
      ],
      tier: 1,
      title: t`Appointment Booking System`,
    },
    {
      customer: t`Palamedes · Product by Sebastian Software GmbH · Dev Tools`,
      description: t`For Palamedes, a product by Sebastian Software GmbH, I was responsible as Product Architect for a developer-first product for AI-powered localization designed to move translation work out of the release bottleneck. Instead of optimizing traditional translation tickets, manual exports, and downstream review loops, it focuses on a CLI-first workflow for PO- and MessageFormat-based projects. I brought product strategy, positioning, the open-core split, website, newsletter backend, and API/pipeline infrastructure into a cohesive product approach.

The product core separates an open, local i18n foundation from a commercial translation and control layer. Delta translations, terminology and protected terms, context enrichment, QA reports, targeted retries, and traceable PO metadata form the central product functionality. The website was built with React Router 7, Vanilla Extract, Lingui, and self-hosted Convex; newsletter flows, a preference center, double opt-in, unsubscribe mechanics, Relanto email delivery, Pocket ID admin authentication, and a Convex-based API key and pipeline structure support the product architecture.`,
      endDate: new Date("2026-06-30"),
      id: "palamedes",
      industry: "Developer Tools / Lokalisierung",
      location: t`Rhine-Main, Germany`,
      logo: HIDDEN_LOGO,
      results: "",
      role: "Product Architect",
      startDate: new Date("2025-10-01"),
      technologies: [
        t`AI Applications`,
        t`Localization`,
        Tech.ReactRouter,
        Tech.Convex,
        Tech.TypeScript,
        Tech.Lingui,
        Tech.Relanto,
      ],
      tier: 1,
      title: t`AI-Powered Localization Platform`,
    },
    {
      customer: "Regrello",
      description: t`Regrello Corp., an AI-focused supply chain management startup acquired by Salesforce in late 2025, needed full internationalization using large language models. I led the initiative and evaluated translation quality from English into six target languages: French, German, Chinese, Spanish, Korean, and Thai. The plugin system translated new or changed app content, workflow titles, and task descriptions within seconds using an event-driven workflow, first into participants' native languages and then into all available languages.

A plugin system for GraphQL resolvers and mutations in the Go backend formed the core of the solution. Translations were integrated transparently into the service APIs and cached in Redis. Temporal workflows with queues, workers, retry mechanisms, throttling, and rate limiting controlled processing. Because plain-text user content could not be stored in the queue for security reasons, I developed a performant encryption system for Temporal. I also built CLI and operations tools for job management, testing new workflows, and retrying failed translations. The backend was restructured and decoupled, making it easier to maintain and understand.`,
      endDate: new Date("2025-09-30"),
      id: "regrello-i18n",
      industry: "Enterprise Software",
      location: "San Francisco, USA",
      logo: "regrello",
      results: "",
      role: "Senior Technology Consultant",
      startDate: new Date("2024-10-01"),
      technologies: [
        Tech.React,
        Tech.Go,
        Tech.GraphQL,
        Tech.Redis,
        Tech.Temporal,
        Tech.GoogleGemini,
        Tech.TypeScript,
        Tech.NodeJS,
      ],
      tier: 1,
      title: t`AI-Powered Internationalization`,
    },
    {
      customer: "DWS / MorgenFund",
      description: t`As Senior Frontend Architect, I continued the DWS Robo-Advisor WISE after its 2022 transfer to MorgenFund. I modernized it on Azure, ported the dashboard from React to React Native, and rolled it out to further European and Asian markets.

I introduced continuous deployment for faster, reliable releases and a shared web/mobile architecture. Jest and React Testing Library covered core UI behavior across varying regulatory and localization requirements.`,
      endDate: new Date("2024-07-31"),
      id: "dws-morgenfund",
      industry: "Fintech",
      location: LOCATION_FRANKFURT,
      logo: "morgenfund",
      results: "",
      role: ROLE_SENIOR_FRONTEND_ARCHITECT,
      startDate: new Date("2020-10-01"),
      technologies: [
        Tech.React,
        Tech.ReactNative,
        Tech.TypeScript,
        Tech.Azure,
        Tech.ContinuousDeployment,
        Tech.Jest,
        Tech.ReactTestingLibrary,
        Tech.NodeJS,
      ],
      tier: 1,
      title: t`Investment Management Platform`,
    },
    {
      customer: "Witt-Gruppe (Otto Group)",
      description: t`I led the rebuild of 17 Witt Group online shops as a scalable multi-brand platform for international markets. Contentful enabled reusable, SEO-controlled pages and faster launches.

Next.js, React, and Styled Components formed the frontend; Apollo GraphQL unified the backend services. AWS, Kubernetes, and Vault supported secure continuous deployment, while GraphQL query tests protected releases.`,
      endDate: new Date("2020-09-30"),
      id: "witt-gruppe",
      industry: "Retail / E-Commerce",
      location: t`Weiden in der Oberpfalz, Germany`,
      logo: "witt-weiden",
      results: "",
      role: ROLE_SENIOR_FRONTEND_ARCHITECT,
      startDate: new Date("2019-04-01"),
      technologies: [
        Tech.NextJS,
        Tech.React,
        Tech.TypeScript,
        Tech.ApolloGraphQL,
        Tech.Contentful,
        Tech.AWS,
        Tech.Kubernetes,
        Tech.NodeJS,
      ],
      tier: 1,
      title: t`Multi-Brand E-Commerce Platforms`,
    },
    {
      customer: "DWS (Deutsche Bank)",
      description: t`As Senior Frontend Architect, I took WISE from DWS prototype to production. Its sales-pitch prototype included an investment-profile wizard; the production platform added risk profiling, DocuSign onboarding, and a dashboard across more than ten European and Asian portals.

After a Vue.js/MobX prototype, I ported the frontend to React and TypeScript, built an enterprise React component library, and owned the Webpack, Babel, and ESLint tooling. Spring Boot connected investment and CRM systems; Keycloak handled OpenID/OAuth. REST services and CI/CD ran on Microsoft Azure.`,
      endDate: new Date("2019-03-31"),
      id: "dws-wise",
      industry: "Fintech",
      location: LOCATION_FRANKFURT,
      logo: "dws",
      results: "",
      role: ROLE_SENIOR_FRONTEND_ARCHITECT,
      startDate: new Date("2016-04-01"),
      technologies: [
        Tech.React,
        Tech.TypeScript,
        Tech.Vue,
        Tech.SpringBoot,
        Tech.Keycloak,
        Tech.DocuSign,
        Tech.RESTAPI,
        Tech.Azure,
        Tech.CICD,
        Tech.NodeJS,
      ],
      tier: 1,
      title: t`Robo-Advisor Investment Platform`,
    },
    {
      customer: CUSTOMER_TELEKOM,
      description: t`The second project phase of the OneNumber app for Deutsche Telekom's business customers encompassed further development and optimization of the mobile application. The app enabled business customers to configure OneNumber on various devices – iOS, Android, BlackBerry, Amazon Fire Phone, and Windows Phone. The broad device support addressed the heterogeneous device landscape in enterprises.

Development was carried out using HTML5 and AngularJS for the mobile frontend. Integration of the respective platform's address book and connection to Deutsche Telekom's MultiManager on Android extended the functionality. REST-based backend communication and OAuth2 authentication via the Telekom Identity Management system secured the data exchange.`,
      endDate: new Date("2016-08-31"),
      id: "telekom-onenumber-2",
      industry: "Telekommunikation",
      location: t`Darmstadt, Germany`,
      logo: "deutschetelekom",
      results: "",
      role: t`Senior Application Architect`,
      startDate: new Date("2016-03-01"),
      technologies: [Tech.Angular, Tech.HTML5, Tech.PhoneGap, Tech.OAuth2, Tech.RESTAPI],
      tier: 2,
      title: t`OneNumber Mobile App (Phase 2)`,
    },
    {
      customer: "Jako-o",
      description: t`Jako-o – a leading children's retailer – needed two new features: the Gift Registry and the Gift Advisor, which I designed and implemented. The Gift Registry functions as an extended wish list for events like birthdays, where purchased gifts are automatically hidden to prevent duplicate purchases. The Gift Advisor helps find suitable gifts through filters such as gender, age, preferences, and price range. Both features increased customer satisfaction and conversion rates in the shop.

Both applications were built as single page applications in JavaScript with optimizations for mobile devices. Product data and status information were sourced via REST API from the Jako-o shop system. Integration into the main shop was seamless, with the user interface providing a responsive, modern shopping experience.`,
      endDate: new Date("2016-03-31"),
      id: "jako-o",
      industry: "Retail / E-Commerce",
      location: t`Bad Rodach, Germany`,
      logo: "jakoo",
      results: "",
      role: t`Lead Application Architect`,
      startDate: new Date("2015-05-01"),
      technologies: [Tech.PHP, Tech.JavaScript, Tech.SPA, Tech.RESTAPI, Tech.MobileOptimierung],
      tier: 2,
      title: t`Gift Registry & Gift Advisor`,
    },
    {
      customer: CUSTOMER_TELEKOM,
      description: t`Business end-users of Deutsche Telekom needed a mobile application for configuring OneNumber on various devices. The app I developed supported iOS, Android, BlackBerry, Amazon Fire Phone, and Windows Phone – broad device coverage that addressed the heterogeneous device landscape in enterprises. Seamless authentication via the Telekom Identity Management system provided secure and convenient access for corporate clients.

PhoneGap served as the cross-platform foundation for the app development. The UI was implemented as a single page application in JavaScript, while configuration was retrieved and set via REST API. Authentication was handled via OAuth/OpenID using the SIM card's phone number. The app was implemented in German and English, with translations managed via PO files.`,
      endDate: new Date("2015-07-31"),
      id: "telekom-onenumber",
      industry: "Telekommunikation",
      location: t`Bonn, Germany`,
      logo: "deutschetelekom",
      results: "",
      role: t`Lead Application Architect`,
      startDate: new Date("2015-03-01"),
      technologies: [Tech.PhoneGap, Tech.JavaScript, Tech.SPA, Tech.OAuth, Tech.i18n],
      tier: 2,
      title: t`OneNumber Mobile App`,
    },
    {
      customer: "Suzuki Deutschland",
      description: t`I developed an e-learning platform for Suzuki Germany that enables German Suzuki dealers to prepare for certifications, including the end-user interface as well as the editorial and administration interface. This tool enabled dealers to gain a much better overview of their current status, and the certification process could be significantly professionalized and made more efficient for dealers.

The REST API of the existing backend system containing the learning content and dealer status formed the data foundation. Since the legacy system was based on PHP, the e-learning platform was also developed as a PHP project. The user interface offers intuitive progress tracking and clear navigation through the learning content.`,
      endDate: new Date("2014-09-30"),
      id: "suzuki-elearning",
      industry: "Automotive",
      location: t`Bensheim, Germany`,
      logo: "suzuki",
      results: "",
      role: t`Fullstack UI Architect`,
      startDate: new Date("2014-07-01"),
      technologies: [Tech.PHP, Tech.RESTAPI, Tech.JavaScript, Tech.HTML],
      tier: 2,
      title: t`E-Learning Platform`,
    },
    {
      customer: "Deutsche Bank",
      description: t`For a supplier of Deutsche Bank, I developed a web frontend for configuring virtual data centers via drag-and-drop and obtaining quotes from various data center operators. The intuitive user interface significantly simplified the complex procurement process for IT infrastructure.

Ember.js served as the framework for the HTML5 interface, optimized for desktops and tablets. I set up the complete tooling with Grunt, Bower, and QUnit as well as the CI pipeline. The drag-and-drop functionality enabled intuitive configuration, while backend integration allowed real-time quotes from various providers.`,
      endDate: new Date("2014-06-30"),
      id: "deutsche-bank-rechenzentrum",
      industry: "Banking",
      location: LOCATION_FRANKFURT,
      logo: "deutschebank",
      results: "",
      role: t`Frontend Developer`,
      startDate: new Date("2014-02-01"),
      technologies: [Tech.Ember, Tech.HTML5, Tech.Grunt, Tech.Bower, Tech.QUnit],
      tier: 2,
      title: t`Virtual Data Centers`,
    },
  ]
}

import { t } from "@palamedes/core/macro"

import { HIDDEN_LOGO } from "~/assets/company"

import type { Project } from "./types"

import { Tech } from "./technologies"

// eslint-disable-next-line max-lines-per-function -- project data array
export function getAdditionalProjects(): Project[] {
  const LOCATION_DARMSTADT = t`Darmstadt, Germany`
  const LOCATION_MAINZ = t`Mainz, Germany`
  const CUSTOMER_TELEKOM = "Deutsche Telekom"

  return [
    {
      customer: "Deutsche Telekom / Tolino\u2011Allianz",
      description: t`PagePlace, later launched as Tolino to compete with Amazon Kindle for major German booksellers Thalia, Hugendubel, and Weltbild, needed a web frontend for Deutsche Telekom. I developed it so customers could manage their accounts and read purchased e-books directly in the browser. The platform offered a seamless alternative to proprietary e-book ecosystems and strengthened the German book trade.

UnifyJS formed the basis of the frontend, which was integrated into existing native iOS and Android applications through PhoneGap. The web frontend also served as the EPUB reader engine in the native apps, enabling code sharing between web and mobile. The reader technology parsed and rendered complex EPUB documents with images, formatting, and navigation, and displayed PDF documents correctly.`,
      endDate: new Date("2013-06-30"),
      id: "tolino",
      industry: "Media / Publishing",
      location: LOCATION_DARMSTADT,
      logo: "deutschetelekom",
      results: "",
      role: t`JavaScript Developer`,
      startDate: new Date("2010-06-01"),
      technologies: [
        Tech.JavaScript,
        Tech.UnifyJS,
        Tech.PhoneGap,
        Tech.iOS,
        Tech.Android,
        Tech.ePub,
      ],
      tier: 2,
      title: t`Tolino E-Book Platform`,
    },
    {
      customer: CUSTOMER_TELEKOM,
      description: t`I developed the UnifyJS framework in parallel with application development as a commission for Deutsche Telekom. It enabled the development of hybrid apps running on iOS, Android, and WebOS. Providing UI concepts that mirrored native mobile device interfaces ensured a familiar user experience. The framework served as the foundation for several successful Telekom applications.

PhoneGap handled the deployment and execution of web applications on mobile devices. The UI and tooling components were based on Qooxdoo but were further developed for mobile devices, as the original UI components did not perform well enough on mobile. Optimizations such as virtual lists significantly improved scroll performance.`,
      endDate: new Date("2013-06-30"),
      id: "telekom-unifyjs",
      industry: "Telekommunikation",
      location: LOCATION_DARMSTADT,
      logo: "deutschetelekom",
      results: "",
      role: t`JavaScript Developer`,
      startDate: new Date("2010-01-01"),
      technologies: [
        Tech.JavaScript,
        Tech.Qooxdoo,
        Tech.PhoneGap,
        Tech.iOS,
        Tech.Android,
        Tech.WebOS,
      ],
      tier: 3,
      title: t`UnifyJS Mobile Framework`,
    },
    {
      customer: CUSTOMER_TELEKOM,
      description: t`The 2010 FIFA World Cup in South Africa required a companion mobile app for Deutsche Telekom – I developed this as a web application. The app delivered current information, match schedules, and results directly to fans' mobile devices. Deployment as an app on various mobile platforms enabled broad reach among football fans.

The UnifyJS framework formed the basis of the web application, which was deployed as a native app to mobile devices. The hybrid app architecture enabled rapid development while allowing native distribution through the app stores. The user interface was optimized for mobile use on the go.`,
      endDate: new Date("2010-06-30"),
      id: "telekom-wm2010",
      industry: "Telekommunikation / Sport",
      location: LOCATION_DARMSTADT,
      logo: "deutschetelekom",
      results: "",
      role: t`Mobile Developer`,
      startDate: new Date("2010-01-01"),
      technologies: [Tech.JavaScript, Tech.UnifyJS, Tech.MobileApps],
      tier: 3,
      title: t`FIFA World Cup 2010 App`,
    },
    {
      customer: CUSTOMER_TELEKOM,
      description: t`I developed DINA Frontend Neu – a web application for analyzing KPIs of Deutsche Telekom's company-wide infrastructure in the T-Home division – from conception through prototype development to production deployment. The visualization of aggregated statistical data enabled management to make data-driven decisions about infrastructure performance. The application became a central tool for infrastructure monitoring.

Ext JS served as the framework for the implementation, connected to the APIs of the statistics systems that collected and aggregated the data. The challenge lay in finding the right data partitioning so that the frontend was not overloaded while ensuring no relevant data was lost. The balance between data volume and performance was achieved through intelligent paging and filtering.`,
      endDate: new Date("2009-12-31"),
      id: "telekom-dina",
      industry: "Telekommunikation",
      location: LOCATION_DARMSTADT,
      logo: "deutschetelekom",
      results: "",
      role: t`Frontend Developer`,
      startDate: new Date("2008-05-01"),
      technologies: [Tech.ExtJS, Tech.JavaScript, Tech.RESTAPI],
      tier: 3,
      title: t`Infrastructure Monitoring`,
    },
    {
      customer: "3ado AG",
      description: t`As a Java developer at 3ado AG in Mainz, I developed 'JourFixe' – a web application for meeting management and minutes tracking. The SaaS solution enabled companies to professionally manage their meetings and maintain structured documentation of meeting outcomes. The product was operated as a SaaS model and targeted business clients with regular meeting needs.

Full-stack development from database to user interface was my responsibility. The backend used MySQL as the database and Spring as the framework, while Hibernate served as the ORM layer abstracting database access. The web interface was built on HTML templates enriched with JavaScript to provide a responsive user experience.`,
      endDate: new Date("2008-06-30"),
      id: "3ado",
      industry: "Enterprise Software",
      location: LOCATION_MAINZ,
      logo: "3ado-ag",
      results: "",
      role: t`Java Fullstack Developer`,
      startDate: new Date("2007-05-01"),
      technologies: [Tech.Java, Tech.Spring, Tech.Hibernate, Tech.MySQL, Tech.JavaScript],
      tier: 3,
      title: t`JourFixe Meeting Management`,
    },
    {
      customer: "netz98",
      description: t`soSmart.de, a social shopping platform for netz98 GmbH in Mainz, was created as part of my diploma thesis on Web 2.0. The platform aggregated product data from various affiliate networks and presented it in a social shopping environment. Combining e-commerce with Web 2.0 paradigms created an innovative shopping experience.

I led the integration of the affiliate networks that supplied the product data. The end-user interface was built with JavaScript and PHP and combined an intelligent near-real-time search with a fuzzy parser and then-new UI patterns such as annotating HTML with JavaScript, preloading, and endless scrolling. These techniques anticipated the later development of single-page applications.`,
      endDate: new Date("2007-03-31"),
      id: "netz98-sosmart",
      industry: "E-Commerce",
      location: LOCATION_MAINZ,
      logo: "netz98",
      results: "",
      role: t`Frontend Developer`,
      startDate: new Date("2006-10-01"),
      technologies: [Tech.JavaScript, Tech.PHP, Tech.Web20, Tech.AffiliateIntegration],
      tier: 3,
      title: t`Social Shopping Platform`,
    },
    {
      customer: "Commerzbank",
      description: t`As part of my full-time internship during my computer science studies, I developed backend components for the credit portfolio management tool 'Value Manager' at Commerzbank. The tool used aggregated data from Commerzbank's backend for the management and analysis of credit portfolios. The data collection and aggregation formed the basis for strategic decisions in the lending business.

Java and SAS were used for data collection and processing. The backend development involved connecting to Commerzbank's complex data sources and transforming raw data into meaningful key performance indicators. The aggregated data was made available to the Value Manager for visualization and analysis.`,
      endDate: new Date("2006-10-31"),
      id: "commerzbank",
      industry: "Banking",
      location: t`Frankfurt am Main, Germany`,
      logo: "commerzbank",
      results: "",
      role: t`Java Developer`,
      startDate: new Date("2006-03-01"),
      technologies: [Tech.Java, Tech.SAS],
      tier: 3,
      title: t`Credit Portfolio Management Tool`,
    },
    {
      customer: "Creative Communications",
      description: t`For Creative Communications, I developed a web application for managing promotion assignments and promoters. The solution centralized promoter data and supported communication by SMS, enabling assignments and deployment information to be managed efficiently.

The application was built with PHP, HTML, and MySQL. Alongside data management, SMS-based communication between scheduling staff and promoters was one of its core capabilities.`,
      endDate: new Date("2006-10-31"),
      id: "creative-communications-promotion",
      industry: "Marketing / Promotion",
      location: t`Bingen am Rhein, Germany`,
      logo: HIDDEN_LOGO,
      results: "",
      role: t`PHP Developer`,
      startDate: new Date("2006-03-01"),
      technologies: [Tech.PHP, Tech.HTML, Tech.MySQL],
      tier: 3,
      title: t`Web-Based Promotion Management`,
    },
    {
      customer: "DoubleF IT",
      description: t`DoubleF IT – my first own company – provided residential customers with broadband internet access via Wireless LAN. At a time when DSL was not yet widely available, this solution offered an alternative for underserved areas. The business model combined hardware installation with software development and network operations.

Server and software development took place in parallel with the physical installation of the WLAN connections. Customers were connected via directional radio links to our main site, from which internet access was provided. This early entrepreneurial experience shaped my understanding of customer needs and technical problem-solving.`,
      endDate: new Date("2008-07-31"),
      id: "doublef-it",
      industry: "Telekommunikation",
      location: LOCATION_MAINZ,
      logo: HIDDEN_LOGO,
      results: "",
      role: t`Founder & Managing Director`,
      startDate: new Date("2004-04-01"),
      technologies: [Tech.Linux, Tech.Netzwerktechnik, Tech.WLAN, Tech.ServerAdministration],
      tier: 3,
      title: t`Wireless LAN Infrastructure`,
    },
    {
      customer: "Technische Hochschule Bingen",
      description: t`Alongside my computer science studies, I worked as an IT system administrator at Bingen University of Applied Sciences. The responsibility for the university's web and mail servers provided practical experience in server administration and the operation of critical IT infrastructure. This role connected academic learning with practical application.

Linux-based servers formed the backbone of the administered systems. Maintenance included security updates, backup strategies, and service monitoring. The experience with production systems in an academic environment laid the foundation for my later career in software development.`,
      endDate: new Date("2005-12-31"),
      id: "bingen-university",
      industry: "Bildung",
      location: t`Bingen, Germany`,
      logo: "th-bingen",
      results: "",
      role: t`IT System Administrator`,
      startDate: new Date("2002-01-01"),
      technologies: [Tech.Linux, Tech.Apache, Tech.MailServer, Tech.ServerAdministration],
      tier: 3,
      title: t`IT System Administration`,
    },
    {
      customer: "Boehringer Ingelheim",
      description: t`For the introduction of the BIX@ supply chain management software, I developed a software-based requirements management solution with automated regression tests. The automated checks and accompanying documentation supported the reliable implementation of new requirements.

The solution connected business requirements with repeatable tests, creating a traceable foundation for quality assurance across supply chain processes.`,
      endDate: new Date("2001-01-31"),
      id: "boehringer-bix-supply-chain",
      industry: "Pharma / Supply Chain",
      location: t`Ingelheim am Rhein, Germany`,
      logo: HIDDEN_LOGO,
      results: "",
      role: t`Software Developer`,
      startDate: new Date("2000-01-01"),
      technologies: [],
      tier: 3,
      title: t`Requirements Management for BIX@`,
    },
  ]
}

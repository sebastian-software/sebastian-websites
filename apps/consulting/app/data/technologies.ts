/**
 * Centralized technology definitions for consistent naming across profiles.
 * Use Tech.X instead of raw strings to ensure consistency and enable refactoring.
 */
export const Tech = {
  AdobeAIR: "Adobe AIR",

  AffiliateIntegration: "Affiliate-Integration",
  AgentAutomation: "Agent Automation",
  AIServices: "AI-Services",
  Android: "Android",
  Angular: "AngularJS",
  Apache: "Apache",
  APIFirst: "API-First",
  ApolloGraphQL: "Apollo GraphQL",
  AWS: "AWS",
  // HTTP Clients
  Axios: "Axios",
  // Cloud & Infrastructure
  Azure: "Azure",
  Babel: "Babel",
  BetterAuth: "Better Auth",
  Bootstrap: "Bootstrap",

  Bower: "Bower",
  Bunny: "Bunny.net",
  CalDAV: "CalDAV",
  Canvas: "Canvas",
  CDN: "CDN",
  CICD: "CI/CD",
  // English term on purpose: skills render untranslated on both locales,
  // and "Cloud-Infrastruktur" leaked German into the English profile.
  CloudInfrastruktur: "Cloud Infrastructure",
  CodeQuality: "Code Quality",
  CodeSplitting: "Code-Splitting",
  ComponentLibraries: "Component Libraries",

  // CMS & Content
  Contentful: "Contentful",
  // Methodologies & Processes
  ContinuousDeployment: "Continuous Deployment",
  Convex: "Convex",
  Core: "Core",
  CrowdIn: "CrowdIn",
  CSS: "CSS",

  CSS3: "CSS3",
  CSSGrid: "CSS Grid",
  Cypress: "Cypress",
  D3: "D3.js",
  DocuSign: "DocuSign",
  ECommerce: "E-Commerce",
  Ember: "Ember.js",
  EnterpriseFrontend: "Enterprise Frontend Architecture",

  EPG: "EPG",
  ePub: "ePub",
  // Linting & Quality
  ESLint: "ESLint",
  ExtJS: "Ext JS",
  Fintech: "Fintech",

  FrontendArchitektur: "Frontend-Architektur",
  GitFlow: "Git-Flow",
  Go: "Go",
  // AI & ML
  GoogleGemini: "Google Gemini",

  // Mapping & Geo
  GoogleMaps: "Google Maps",
  // State & Data Management
  GraphQL: "GraphQL",
  Grunt: "Grunt",
  // Media & Broadcasting
  HbbTV: "HbbTV",
  Hibernate: "Hibernate",
  // Misc
  HTML: "HTML",
  HTML5: "HTML5",

  // Internationalization
  i18n: "i18n",
  IaC: "Infrastructure as Code",
  iCal: "iCal",
  iOS: "iOS",
  Jasy: "Jasy",
  Java: "Java",

  JavaScript: "JavaScript",
  Jest: "Jest",
  jQuery: "jQuery",
  JWT: "JWT",
  Keycloak: "Keycloak",
  Kubernetes: "Kubernetes",

  Lingui: "Lingui",
  // Networking & Infrastructure
  Linux: "Linux",
  LLM: "KI-Anwendungen",
  Lokalisierung: "Lokalisierung",

  MailServer: "Mail-Server",

  Mapbox: "Mapbox",
  MCP: "MCP",
  MikroFrontend: "Mikro-Frontend",
  MobileApps: "Mobile Cross-Plattform Apps",
  MobileOptimierung: "Mobile-Optimierung",
  // Architecture & Patterns
  Monorepo: "Monorepo",

  MySQL: "MySQL",
  Netzwerktechnik: "Netzwerktechnik",

  NextIntl: "Next Intl",
  // Frameworks & Meta-Frameworks
  NextJS: "Next.js",
  // Backend & Middleware
  NodeJS: "Node.js",
  // Package Management
  npm: "npm",
  NX: "NX",
  // Auth & Security
  OAuth: "OAuth",
  OAuth2: "OAuth2",
  OIDC: "OIDC",
  OpenSource: "Open Source",
  OpenStreetMap: "OpenStreetMap",
  Palamedes: "Palamedes",
  // Mobile & Cross-Platform
  PhoneGap: "PhoneGap",

  PHP: "PHP",
  // Testing
  Playwright: "Playwright",
  Pustefix: "Pustefix",
  Python: "Python",
  Qooxdoo: "qooxdoo",

  QUnit: "QUnit",
  // Frontend Frameworks & Libraries
  React: "React",
  ReactNative: "React Native",

  ReactRouter: "React Router",
  ReactRouterBackend: "React Router Server",
  ReactTestingLibrary: "React Testing Library",
  Redis: "Redis",

  Redux: "Redux",
  Relanto: "Relanto",
  ResponsiveDesign: "Responsive Design",
  REST: "REST",

  RESTAPI: "REST API",
  RPC: "RPC",
  SAFe: "SAFe",
  SAS: "SAS",

  // Styling
  Sass: "Sass",
  ScaledAgile: "Scaled Agile",
  Scrum: "Scrum",
  ServerAdministration: "Server-Administration",
  SetTopBox: "Set-Top-Box",
  SPA: "SPA",

  Spring: "Spring",

  SpringBoot: "Spring Boot",

  SSR: "SSR",
  Storybook: "Storybook",
  Supabase: "Supabase",
  TBD: "TBD",
  Temporal: "Temporal",
  Theming: "Theming",
  Turborepo: "Turborepo",
  // Languages
  TypeScript: "TypeScript",
  UIUXDesign: "UI/UX Design",
  UnifyJS: "UnifyJS",
  VanillaExtract: "Vanilla Extract",
  VelocityJS: "VelocityJS",
  Vercel: "Vercel",
  // Build Tools & Bundlers
  Vite: "Vite",
  Vitest: "Vitest",

  Vue: "Vue.js",
  Web20: "Web 2.0",
  WebOS: "WebOS",
  Webpack: "Webpack",
  WhiteLabel: "White-Label",
  WLAN: "WLAN",
  XSLT: "XSLT",
} as const

export type Technology = (typeof Tech)[keyof typeof Tech]

import { index, route, type RouteConfig } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("open-source", "routes/open-source.tsx"),
  route("company", "routes/company.tsx"),
  route("contact", "routes/contact.tsx"),
  route("imprint", "routes/imprint.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("sitemap.xml", "routes/sitemap.ts"),
  route("robots.txt", "routes/robots.ts"),
  route("manifest.webmanifest", "routes/manifest.ts"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig

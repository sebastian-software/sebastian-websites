import { index, route, type RouteConfig } from "@react-router/dev/routes"

export default [
  index("routes/home.tsx"),
  route("team", "routes/team.tsx"),
  route("werner", "routes/profile.werner.tsx"),
  route("fastner", "routes/profile.fastner.tsx"),
  route("fastner/project-profile", "routes/profile.fastner.project.tsx"),
  route("imprint", "routes/imprint.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("sitemap.xml", "routes/sitemap.ts"),
  route("robots.txt", "routes/robots.ts"),
  route("manifest.webmanifest", "routes/manifest.ts"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig

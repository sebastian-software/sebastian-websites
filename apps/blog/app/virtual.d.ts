declare module "virtual:blog-data" {
  const data: {
    readonly counterparts: Readonly<Record<string, null | string>>
    readonly otherLanguage: readonly string[]
  }
  export default data
}

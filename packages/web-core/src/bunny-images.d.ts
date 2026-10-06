declare module "*?bunny" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports -- An inline import keeps the wildcard declaration ambient.
  const source: import("./image.ts").ImageSource
  export default source
}

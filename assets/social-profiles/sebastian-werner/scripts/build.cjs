const fs = require("node:fs")
const path = require("node:path")
const crypto = require("node:crypto")
const sharp = require("sharp")
const root = path.resolve(__dirname, "..")
const cfg = JSON.parse(fs.readFileSync(path.join(root, "design.json")))
const logoSource = fs.readFileSync(path.join(root, "sources/logo-software.original.svg"), "utf8")
const logo = logoSource
  .slice(logoSource.indexOf(">", logoSource.indexOf("<svg")) + 1, logoSource.lastIndexOf("</svg>"))
  .replace('<rect x="0" y="0" width="5130" height="1000" style="fill:#e7f0f3;"/>', "")
  .replace(/[ \t]+$/gm, "")
const outlines = Object.fromEntries(
  cfg.text.map((t) => [
    t.id,
    JSON.parse(fs.readFileSync(path.join(root, "sources", t.id + ".outlines.json"))),
  ])
)
for (const item of cfg.text) {
  if (outlines[item.id].text !== item.text || outlines[item.id].font !== item.font)
    throw new Error(`Rebuild outlines for ${item.id} before exporting`)
}
const originalBg = fs.readFileSync(path.join(root, "sources/workbench-background.png"))
const escape = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;")
const textPath = (id, x, y, size, color) =>
  `<g aria-label="${escape(outlines[id].text)}" transform="translate(${x} ${y}) scale(${size / 1000} ${-size / 1000})" fill="${color}"><path d="${outlines[id].path}"/></g>`
;(async () => {
  const manifest = {
    version: 6,
    status: cfg.status,
    websiteReference: "https://sebastian-software.com/",
    generation: "Built-in image_gen; see sources/imagegen-prompts.json",
    appliedDate: cfg.appliedDate,
    headline: cfg.headline,
    originalLogoSha256: crypto.createHash("sha256").update(logoSource).digest("hex"),
    files: [],
  }
  const panels = []
  for (const p of cfg.platforms) {
    const bg = await sharp(originalBg)
      .resize(p.width, p.height, { fit: "cover", position: "centre" })
      .png()
      .toBuffer()
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:serif="http://www.serif.com/" width="${p.width}" height="${p.height}" viewBox="0 0 ${p.width} ${p.height}"><title>Sebastian Software — ${p.label} banner, watercolor concept</title><image width="${p.width}" height="${p.height}" href="data:image/png;base64,${bg.toString("base64")}"/><g id="original-logo" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" transform="translate(${p.logoX} ${p.logoY}) scale(${p.logoWidth / 5130})">${logo}</g>${textPath("headline1", p.textX, p.headline1Y, p.headlineSize, cfg.palette.ink)}${textPath("headline2", p.textX, p.headline2Y, p.headlineSize, cfg.palette.ink)}${textPath("website", p.textX, p.websiteY, p.websiteSize, cfg.palette.petrol)}</svg>`
    const base = `${p.id}-banner-${p.width}x${p.height}-v6a`
    fs.writeFileSync(path.join(root, "exports", base + ".svg"), svg)
    let png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer()
    if (png.length > 990000)
      png = await sharp(png)
        .png({ palette: true, colours: 256, dither: 0.4, compressionLevel: 9 })
        .toBuffer()
    fs.writeFileSync(path.join(root, "exports", base + ".png"), png)
    if (png.length > 1000000) throw Error("Upload budget exceeded")
    manifest.files.push({
      platform: p.id,
      width: p.width,
      height: p.height,
      png: `exports/${base}.png`,
      svg: `exports/${base}.svg`,
      bytes: png.length,
      sha256: crypto.createHash("sha256").update(png).digest("hex"),
    })
    const thumb = await sharp(png).resize(1050).png().toBuffer()
    const shownHeight = (p.height / p.width) * 1050
    const panel = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="1130" height="520"><rect width="1130" height="520" fill="#ffffff"/><text x="40" y="35" font-family="Arial" font-size="21" fill="#002731">${p.label} · ${p.width} × ${p.height}</text><image x="40" y="58" width="1050" height="${shownHeight}" href="data:image/png;base64,${thumb.toString("base64")}"/><circle cx="140" cy="${shownHeight + 45}" r="78" fill="#fff" stroke="#b9ced6" stroke-width="2"/><text x="140" y="${shownHeight + 50}" text-anchor="middle" font-family="Arial" font-size="14" fill="#5f7781">Profile photo</text></svg>`
    )
    panels.push({ input: await sharp(panel).png().toBuffer(), left: 0, top: panels.length * 520 })
    const mobile = await sharp(png).resize(450).png().toBuffer()
    fs.writeFileSync(path.join(root, "previews", p.id + "-mobile.png"), mobile)
  }
  await sharp({ create: { width: 1130, height: 1560, channels: 3, background: "#ffffff" } })
    .composite(panels)
    .png()
    .toFile(path.join(root, "previews/banner-overview-v6a.png"))
  fs.writeFileSync(path.join(root, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n")
  console.log(JSON.stringify(manifest.files, null, 2))
})()

import { build } from "esbuild"
import { readFile } from "node:fs/promises"

export type ReviewPair = {
  after: Buffer
  before: Buffer
  image: string
  label: string
  title: string
  width: number
}

export function escape(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

async function viewerAssets(): Promise<{ script: string; style: string }> {
  const { outputFiles } = await build({
    bundle: true,
    format: "iife",
    minify: true,
    outdir: ".",
    stdin: {
      contents: `
        import "img-comparison-slider";
        import "img-comparison-slider/dist/styles.css";

        const controls = [...document.querySelectorAll("[data-width-control]")];
        const widths = [...document.querySelectorAll("[data-width-panel]")];
        document.querySelector("[data-widths]").hidden = controls.length < 2;
        function select(width) {
          for (const control of controls) {
            control.setAttribute("aria-pressed", String(control.dataset.widthControl === width));
          }
          for (const panel of widths) panel.hidden = panel.dataset.widthPanel !== width;
        }
        for (const control of controls) {
          control.addEventListener("click", () => select(control.dataset.widthControl));
        }
        const changed = widths.filter((panel) => panel.querySelector("img-comparison-slider"));
        const first = matchMedia("(max-width: 639px)").matches
          ? changed[0]
          : changed.at(-1);
        if (first) select(first.dataset.widthPanel);

        for (const slider of document.querySelectorAll("img-comparison-slider")) {
          function announce() {
            slider.setAttribute("aria-valuenow", String(Math.round(slider.value)));
          }
          slider.addEventListener("slide", announce);
          slider.addEventListener("keydown", (event) => {
            const steps = { ArrowDown: -5, ArrowLeft: -5, ArrowRight: 5, ArrowUp: 5 };
            const step = steps[event.key];
            if (step === undefined && event.key !== "Home" && event.key !== "End") return;
            event.preventDefault();
            const next = event.key === "Home" ? 0 : event.key === "End" ? 100 : slider.value + step;
            slider.value = Math.max(0, Math.min(100, next));
            announce();
          });
        }
      `,
      resolveDir: import.meta.dirname,
    },
    write: false,
  })
  const script = outputFiles.find(({ path }) => path.endsWith(".js"))?.text ?? ""
  const style = outputFiles.find(({ path }) => path.endsWith(".css"))?.text ?? ""
  // Keep the bundle inside its script element even if a dependency includes this literal.
  return { script: script.replaceAll(/<\/script/giv, "<\\/script"), style }
}

function image(bytes: Buffer, label: string, slot: string): string {
  return `<img slot="${slot}" alt="${label}" src="data:image/png;base64,${bytes.toString("base64")}">`
}

function comparison(pair: ReviewPair): string {
  return `<article>
    <h2>${escape(pair.title)} · ${escape(pair.label)}</h2>
    <div class="labels" aria-hidden="true"><span>Before</span><span>After</span></div>
    <img-comparison-slider keyboard="disabled" tabindex="0" role="slider" aria-label="Before and after divider"
      aria-valuemin="0" aria-valuemax="100" aria-valuenow="50">
      ${image(pair.before, "Before", "first")}
      ${image(pair.after, "After", "second")}
      <span slot="handle" class="handle" aria-hidden="true">‹ ›</span>
    </img-comparison-slider>
  </article>`
}

function viewport(width: number, pairs: ReviewPair[]): string {
  const entries = pairs.filter((pair) => pair.width === width)
  return `<section id="width-${width}" data-width-panel="${width}" aria-label="${width} px">
    ${entries.length > 0 ? entries.map((pair) => comparison(pair)).join("\n") : "<p>No visual changes at this width.</p>"}
  </section>`
}

function widthControl(width: number): string {
  return `<button type="button" data-width-control="${width}" aria-controls="width-${width}"
    aria-pressed="false">${width} px</button>`
}

export async function visualReviewHtml(pairs: ReviewPair[], widths: number[]): Promise<string> {
  const { script, style } = await viewerAssets()
  const license = await readFile(
    new URL("img-comparison-slider.LICENSE.txt", import.meta.url),
    "utf8"
  )
  return `<!doctype html>
<!-- img-comparison-slider license
${license}-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Visual review</title>
<style>
  ${style}
  * { box-sizing: border-box }
  [hidden] { display: none !important }
  body { margin: 0; background: #f3f5f7; color: #182330; font: 16px system-ui, sans-serif }
  main { max-width: 66rem; margin: auto; padding: clamp(1rem, 4vw, 2.5rem) }
  h1 { margin: 0 0 .5rem }
  h2 { font-size: 1.125rem; margin: 0 0 1rem }
  p { color: #405264; margin: .5rem 0 1rem }
  nav { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1.25rem 0 }
  button { min-height: 2.75rem; padding: .375rem .85rem; font: inherit; font-weight: 600; color: inherit; background: white; border: 1px solid #bcc9d5; border-radius: .5rem; cursor: pointer }
  button[aria-pressed="true"] { background: #283c54; color: white; border-color: #283c54 }
  article { background: white; border: 1px solid #dbe1e8; border-radius: .75rem; margin-top: 1.25rem; padding: clamp(.75rem, 3vw, 1.25rem) }
  .labels { display: flex; justify-content: space-between; gap: 1rem; margin-bottom: .5rem; color: #405264; font-weight: 600 }
  img-comparison-slider {
    --divider-width: 2px;
    --divider-shadow: 0 0 4px #182330;
    display: block;
    border-radius: .5rem;
    overflow: hidden;
    cursor: ew-resize;
  }
  img-comparison-slider:focus-visible, button:focus-visible { outline: 3px solid #395dab; outline-offset: 3px }
  img-comparison-slider:not(:defined) { visibility: visible }
  img-comparison-slider:not(:defined) [slot="handle"] { display: none }
  img { display: block; width: 100%; height: auto }
  .handle { display: grid; place-items: center; width: 2.75rem; height: 2.75rem; border-radius: 50%; background: #283c54; color: white; border: 2px solid white; box-shadow: 0 1px 5px #182330; font: 700 1.25rem system-ui, sans-serif }
</style>
</head>
<body><main>
<h1>Visual review</h1>
<p>Drag the divider to compare. Frames mark changed areas.</p>
<nav data-widths aria-label="Screenshot width" hidden>${widths.map((width) => widthControl(width)).join("\n")}</nav>
${widths.map((width) => viewport(width, pairs)).join("\n")}
</main><script>${script}</script></body>
</html>
`
}

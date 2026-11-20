import { build } from "esbuild"

export type ReviewPair = {
  after: Buffer
  before: Buffer
  image: string
  label: string
  title: string
}

export function escape(text: string): string {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

async function viewerScript(): Promise<string> {
  const { outputFiles } = await build({
    bundle: true,
    format: "iife",
    minify: true,
    stdin: {
      contents: `
        import { createSwipeEngine } from "@blazediff/ui/engine";

        for (const section of document.querySelectorAll("[data-pair]")) {
          const toggle = section.querySelector("button");
          const slider = section.querySelector("[data-slider]");
          const overlap = slider.querySelector(".overlap");
          const range = slider.querySelector("input");
          const pair = section.querySelector("[data-images]");
          const [before, after] = pair.querySelectorAll("img");
          overlap.append(before.cloneNode(true), after.cloneNode(true));

          const swipe = createSwipeEngine(range.valueAsNumber);
          swipe.subscribe(() => {
            overlap.style.setProperty("--position", swipe.getState().position + "%");
          });
          range.addEventListener("input", () => swipe.actions.setPosition(range.valueAsNumber));
          toggle.hidden = false;
          toggle.addEventListener("click", () => {
            const showSlider = slider.hidden;
            slider.hidden = !showSlider;
            pair.hidden = showSlider;
            toggle.setAttribute("aria-expanded", String(showSlider));
            toggle.textContent = showSlider ? "Show side by side" : "Use comparison slider";
            if (showSlider) range.focus();
          });
        }
      `,
      resolveDir: import.meta.dirname,
    },
    write: false,
  })
  // Keep the bundle inside its script element even if a dependency includes this literal.
  return (outputFiles[0]?.text ?? "").replaceAll(/<\/script/giv, "<\\/script")
}

function panel(bytes: Buffer, label: string): string {
  return `<figure><figcaption>${label}</figcaption>
    <img alt="${label}" src="data:image/png;base64,${bytes.toString("base64")}"></figure>`
}

function entry(pair: ReviewPair, index: number): string {
  return `<section data-pair>
    <h2>${escape(pair.title)} · ${escape(pair.label)}</h2>
    <div class="pair" data-images>${panel(pair.before, "Before")}${panel(pair.after, "After")}</div>
    <div data-slider id="comparison-${index}" hidden>
      <div class="overlap"></div>
      <label>Comparison divider <input type="range" min="0" max="100" value="50"></label>
    </div>
    <button type="button" aria-controls="comparison-${index}" aria-expanded="false" hidden>Use comparison slider</button>
  </section>`
}

export async function visualReviewHtml(pairs: ReviewPair[]): Promise<string> {
  const script = await viewerScript()
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Visual review</title>
<style>
  * { box-sizing: border-box }
  [hidden] { display: none !important }
  body { margin: 0; background: #f3f5f7; color: #182330; font: 16px system-ui, sans-serif }
  main { max-width: 75rem; margin: auto; padding: clamp(1rem, 4vw, 2.5rem) }
  h1 { margin: 0 0 .5rem }
  h2 { font-size: 1.125rem; margin: 0 0 1rem }
  p, figcaption { color: #405264 }
  section { background: white; border: 1px solid #dbe1e8; border-radius: .75rem; margin-top: 1.25rem; padding: 1rem }
  .pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem }
  figure { margin: 0 }
  figcaption { font-weight: 600; margin-bottom: .5rem }
  img { display: block; max-width: 100%; height: auto }
  [data-slider] { max-width: 40rem }
  .overlap { display: grid; position: relative; overflow: hidden }
  .overlap img { grid-area: 1 / 1; width: 100% }
  .overlap img + img { clip-path: inset(0 0 0 var(--position, 50%)) }
  .overlap::after { content: ""; position: absolute; inset: 0 auto 0 var(--position, 50%); width: 2px; background: white; box-shadow: 0 0 3px #182330 }
  label { display: grid; gap: .5rem; margin-top: .75rem }
  input { width: 100% }
  button { margin-top: 1rem; font: inherit; color: inherit; background: #f3f5f7; border: 1px solid #bcc9d5; border-radius: .375rem; padding: .4rem .7rem; cursor: pointer }
</style>
</head>
<body><main>
<h1>Visual review</h1>
<p>Frames mark the changed areas.</p>
${pairs.map((pair, index) => entry(pair, index)).join("\n")}
</main><script>${script}</script></body>
</html>
`
}

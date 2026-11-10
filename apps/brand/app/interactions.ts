/** Install the reference page's copy controls after Ardo hydrates its markup. */
export function initializeBrandInteractions(): () => void {
  const controller = new AbortController()
  const timers = new Set<ReturnType<typeof setTimeout>>()
  const base = location.origin
  for (const element of document.querySelectorAll<HTMLElement>("[data-url]")) {
    element.textContent = `${base}/${element.dataset.url}`
  }
  for (const button of document.querySelectorAll<HTMLButtonElement>(".copy-btn")) {
    button.addEventListener(
      "click",
      async () => {
        const text = button.closest(".code-block")?.querySelector("code")?.textContent ?? ""
        await navigator.clipboard.writeText(text)
        button.textContent = "Copied"
        timers.add(setTimeout(() => (button.textContent = "Copy"), 2000))
      },
      { signal: controller.signal }
    )
  }

  const toast = document.createElement("div")
  toast.className = "copy-toast"
  toast.textContent = "Copied"
  document.body.appendChild(toast)
  let toastTimer: ReturnType<typeof setTimeout> | undefined
  for (const code of document.querySelectorAll<HTMLElement>(
    ".color-table code, .token-roles code"
  )) {
    code.classList.add("copyable")
    code.addEventListener(
      "click",
      async () => {
        await navigator.clipboard.writeText(code.textContent ?? "")
        clearTimeout(toastTimer)
        const rect = code.getBoundingClientRect()
        toast.style.left = `${rect.right + 8}px`
        toast.style.top = `${rect.top + rect.height / 2 - 12}px`
        toast.classList.add("visible")
        toastTimer = setTimeout(() => toast.classList.remove("visible"), 1200)
      },
      { signal: controller.signal }
    )
  }

  return () => {
    controller.abort()
    for (const timer of timers) clearTimeout(timer)
    clearTimeout(toastTimer)
    toast.remove()
  }
}

/**
 * Chooses the illustration side for the story at a list position, so that odd
 * and growing collections keep alternating without special cases.
 *
 * @param index - The zero-based position in the list.
 * @returns `end` for even positions, `start` for odd ones.
 */
export function alternate(index: number): "end" | "start" {
  return index % 2 === 0 ? "end" : "start"
}

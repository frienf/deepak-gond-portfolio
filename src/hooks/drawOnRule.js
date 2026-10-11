/**
 * Does a shape get drawn on, or does it fade in?
 *
 * Split out from useDrawOn so the decision can be checked without a DOM.
 * The hook reads the values off getComputedStyle; this only judges them.
 *
 * @param {{tagName: string, stroke: string, strokeWidth: string,
 *          strokeDasharray: string, measurable: boolean}} shape
 */
export function isDrawable({ tagName, stroke, strokeWidth, strokeDasharray, measurable }) {
  // Letterforms have no single length to walk along
  if (tagName === 'text') return false;
  if (stroke === 'none' || parseFloat(strokeWidth) === 0) return false;
  // A pattern already set by the author is part of the design - leave it be
  if (strokeDasharray && strokeDasharray !== 'none') return false;
  return measurable;
}

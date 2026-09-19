/**
 * What-If Simulator Calculation Utilities
 */

/**
 * Calculates a scenario quantity from an original baseline string (e.g. "18 kg", "650 pieces", "120 litres")
 * without mutating the baseline.
 *
 * @param {string} originalQtyStr - e.g. "18 kg" or "650 pieces"
 * @param {number} newGuests - simulated guest count
 * @param {number} originalGuests - baseline guest count from Event Setup
 * @returns {string} The scaled scenario quantity formatted with unit
 */
export function calculateScenarioQuantity(originalQtyStr, newGuests, originalGuests) {
  if (!originalQtyStr || !originalGuests || originalGuests <= 0) return originalQtyStr || "—"

  // Match leading number and the remaining unit text
  const match = String(originalQtyStr).trim().match(/^([0-9.]+)\s*(.*)$/)
  if (!match) return originalQtyStr

  const origNum = parseFloat(match[1])
  const unit = match[2] || ""

  if (isNaN(origNum)) return originalQtyStr

  const ratio = newGuests / originalGuests
  const calculatedNum = origNum * ratio
  const lowerUnit = unit.toLowerCase()

  let formattedNum = ""

  // Integer rounding for count/piece/portion units
  if (
    lowerUnit.includes("piece") ||
    lowerUnit.includes("pcs") ||
    lowerUnit.includes("scoop") ||
    lowerUnit.includes("portion")
  ) {
    formattedNum = Math.round(calculatedNum).toString()
  } else {
    // Sensible 1-decimal rounding for kg/litres
    const rounded = Math.round(calculatedNum * 10) / 10
    formattedNum = rounded % 1 === 0 ? rounded.toString() : rounded.toFixed(1)
  }

  return `${formattedNum} ${unit}`.trim()
}

/**
 * Computes percentage change and guest delta
 */
export function calculateScenarioDelta(newGuests, originalGuests) {
  const orig = Math.max(1, originalGuests || 1)
  const diff = newGuests - orig
  const pct = Math.round((diff / orig) * 100)

  return {
    diff,
    pct,
    formattedPct: pct > 0 ? `+${pct}%` : `${pct}%`,
    formattedDiff: diff > 0 ? `+${diff}` : `${diff}`,
  }
}

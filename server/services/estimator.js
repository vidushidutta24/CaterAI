import { FOOD_RULES } from "../data/foodRules.js"

/**
 * Event type factors
 */
const EVENT_FACTORS = {
  wedding: 1.05,
  reception: 1.05,
  engagement: 1.0,
  birthday: 0.95,
  corporate: 0.9,
}

/**
 * Meal timing factors
 */
const MEAL_FACTORS = {
  lunch: 1.0,
  dinner: 1.05,
}

/**
 * Duration adjustment factor
 */
function getDurationFactor(duration) {
  if (duration <= 2) return 0.95
  if (duration <= 3) return 1.0
  if (duration <= 4) return 1.05
  return 1.1
}

/**
 * Season adjustment factor (modest effect)
 */
function getSeasonFactor(season) {
  const s = String(season || "").toLowerCase().trim()
  if (s === "winter") return 1.02
  if (s === "summer") return 0.98
  if (s === "spring") return 1.0
  if (s === "monsoon") return 1.0
  return 1.0
}

/**
 * Menu category variety distribution factor
 */
function getVarietyFactor(count) {
  if (count <= 1) return 1.0
  if (count === 2) return 0.88
  if (count === 3) return 0.8
  return 0.75
}

/**
 * Calculates the CaterAI deterministic baseline catering estimates.
 */
export function calculateBaselineEstimate(input) {
  const {
    guests,
    adults,
    children,
    vegetarianPercentage,
    nonVegetarianPercentage,
    eventType,
    meal,
    duration,
    season,
    menu,
  } = input

  const vegShare = vegetarianPercentage / 100
  const nonVegShare = nonVegetarianPercentage / 100

  // Event multipliers
  const normalizedEvent = String(eventType).toLowerCase().trim()
  const eventFactor = EVENT_FACTORS[normalizedEvent] || 1.0
  const mealFactor = MEAL_FACTORS[meal] || 1.0
  const durationFactor = getDurationFactor(duration)
  const seasonFactor = getSeasonFactor(season)

  // Count items per category to apply variety dampening
  const categoryCounts = {}
  menu.forEach((dishId) => {
    const rule = FOOD_RULES[dishId]
    if (rule) {
      categoryCounts[rule.category] = (categoryCounts[rule.category] || 0) + 1
    }
  })

  const estimates = menu.map((dishId) => {
    const rule = FOOD_RULES[dishId]
    if (!rule) {
      throw new Error(`Unrecognized dish ID: ${dishId}`)
    }

    const { displayName, category, unit, basePerPerson, foodType } = rule

    // Calculate estimated consumers
    let consumers = 0
    let reason = ""

    if (foodType === "vegetarian") {
      // Veg guests + portion of non-veg guests who consume veg options
      const vegAdults = adults * vegShare
      const vegChildren = children * 0.7 * vegShare
      const nonVegCurious = adults * nonVegShare * 0.45
      consumers = Math.round(vegAdults + vegChildren + nonVegCurious)
      reason =
        "Estimated using the vegetarian guest share, meal timing, event type and selected menu variety."
    } else if (foodType === "non_vegetarian") {
      // Non-veg cohort only
      const nonVegAdults = adults * nonVegShare
      const nonVegChildren = children * 0.7 * nonVegShare
      consumers = Math.round(nonVegAdults + nonVegChildren)
      reason =
        "Estimated using the non-vegetarian guest share, meal timing, event type and selected menu variety."
    } else {
      // Neutral (breads, rice, desserts, beverages)
      const adultConsumers = adults
      const childConsumers = children * 0.75
      consumers = Math.round(adultConsumers + childConsumers)
      reason =
        "Estimated using total attendance, meal timing, event duration and selected menu variety."
    }

    // Guard consumer bounds
    consumers = Math.max(1, Math.min(guests, consumers))

    // Variety factor for category
    const catCount = categoryCounts[category] || 1
    const varietyFactor = getVarietyFactor(catCount)

    // Total raw quantity
    const rawQuantity =
      consumers *
      basePerPerson *
      eventFactor *
      mealFactor *
      durationFactor *
      seasonFactor *
      varietyFactor

    // Convert and round according to unit
    let recommendedQuantity = 0
    if (unit === "kg") {
      // basePerPerson was in grams, convert to kg
      const inKg = rawQuantity / 1000
      recommendedQuantity = Math.round(inKg * 10) / 10
    } else if (unit === "litres") {
      recommendedQuantity = Math.round(rawQuantity * 10) / 10
    } else {
      // pieces
      recommendedQuantity = Math.round(rawQuantity)
    }

    // Ensure non-zero positive quantity
    if (recommendedQuantity <= 0) {
      recommendedQuantity = unit === "pieces" ? 1 : 0.5
    }

    return {
      dish: displayName,
      dishId,
      category,
      estimatedConsumers: consumers,
      recommendedQuantity,
      unit,
      confidence: 0.85,
      reason,
    }
  })

  return {
    eventSummary: {
      guests,
      eventType: normalizedEvent,
      meal,
    },
    estimates,
    summary: `Deterministic baseline catering plan calculated for ${guests} guests (${adults} adults, ${children} children) across ${menu.length} selected dishes.`,
    estimatedSurplusAvoided:
      "Model estimate based on comparison with a flat per-head buffer.",
  }
}

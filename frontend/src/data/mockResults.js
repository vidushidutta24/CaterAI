/**
 * CaterAI Mock Result Data & Estimation Engine
 *
 * Provides realistic demonstration values for catering quantity recommendations,
 * cost estimates, surplus reduction, and contextual AI explanations.
 * 
 * Note: These are model demonstration estimates for UI validation and presentation.
 */

import { MENU_ITEMS } from "./menu"

// Baseline reference estimates for canonical dishes
const BASELINE_DISH_DATA = {
  "paneer-tikka": {
    baseQtyPerGuest: 0.05, // 50g per veg guest
    unit: "kg",
    baseConfidence: "High",
    reason: "High vegetarian attendance drives strong starter demand",
    relativeScore: 78,
  },
  "veg-spring-roll": {
    baseQtyPerGuest: 1.2, // pieces
    unit: "pieces",
    baseConfidence: "Medium",
    reason: "Crisp finger-food popular across all age segments",
    relativeScore: 65,
  },
  "chicken-tikka": {
    baseQtyPerGuest: 0.07, // 70g per non-veg guest
    unit: "kg",
    baseConfidence: "High",
    reason: "Popular non-vegetarian starter for dinner service",
    relativeScore: 68,
  },
  "hara-bhara-kebab": {
    baseQtyPerGuest: 1.1,
    unit: "pieces",
    baseConfidence: "Medium",
    reason: "Light appetizer balancing rich tandoori starters",
    relativeScore: 55,
  },
  "shahi-paneer": {
    baseQtyPerGuest: 0.09, // 90g per veg consumer
    unit: "kg",
    baseConfidence: "High",
    reason: "Primary vegetarian curry with high expected consumption",
    relativeScore: 86,
  },
  "butter-chicken": {
    baseQtyPerGuest: 0.11, // 110g per non-veg consumer
    unit: "kg",
    baseConfidence: "Medium",
    reason: "Lower non-veg participation (30%), portioned precisely to prevent waste",
    relativeScore: 62,
  },
  "dal-makhani": {
    baseQtyPerGuest: 0.085,
    unit: "kg",
    baseConfidence: "High",
    reason: "Universal crowd favorite main course consumed by both veg & non-veg guests",
    relativeScore: 92,
  },
  "biryani": {
    baseQtyPerGuest: 0.12,
    unit: "kg",
    baseConfidence: "High",
    reason: "Primary dinner main-course item; heavy uptake expected during peak dinner window",
    relativeScore: 96,
  },
  "naan": {
    baseQtyPerGuest: 1.35, // pieces per guest
    unit: "pieces",
    baseConfidence: "High",
    reason: "Essential accompaniment for rich curries and tandoori mains",
    relativeScore: 98,
  },
  "roti": {
    baseQtyPerGuest: 1.05,
    unit: "pieces",
    baseConfidence: "High",
    reason: "Whole wheat preference among health-conscious adult guests",
    relativeScore: 74,
  },
  "gulab-jamun": {
    baseQtyPerGuest: 1.1,
    unit: "pieces",
    baseConfidence: "Medium",
    reason: "High dessert participation rate following formal dinner service",
    relativeScore: 82,
  },
  "ice-cream": {
    baseQtyPerGuest: 0.95,
    unit: "scoops",
    baseConfidence: "Medium",
    reason: "Chilled dessert popular with children and family guests",
    relativeScore: 60,
  },
  "rasmalai": {
    baseQtyPerGuest: 1.0,
    unit: "pieces",
    baseConfidence: "High",
    reason: "Premium festive dessert with consistent guest uptake",
    relativeScore: 76,
  },
  "soft-drinks": {
    baseQtyPerGuest: 0.22,
    unit: "litres",
    baseConfidence: "Medium",
    reason: "Standard beverage buffer across 4-hour event timeline",
    relativeScore: 58,
  },
  "fresh-juice": {
    baseQtyPerGuest: 0.28,
    unit: "litres",
    baseConfidence: "Medium",
    reason: "Suitable for event duration with welcome drink and dining peaks",
    relativeScore: 72,
  },
}

/**
 * Generate calculated mock catering plan based on user eventData and selectedMenu IDs
 */
export function generateCateringPlan(eventData, selectedMenuIds = []) {
  const totalGuests = Math.max(1, parseInt(eventData?.guests, 10) || 500)
  const adults = Math.max(0, parseInt(eventData?.adults, 10) || 420)
  const children = Math.max(0, parseInt(eventData?.children, 10) || 80)
  const vegPct = Math.min(100, Math.max(0, parseInt(eventData?.vegetarianPct, 10) || 70))
  const nonVegPct = 100 - vegPct
  const mealTime = eventData?.mealTime || "dinner"
  const eventType = eventData?.eventType || "wedding"
  const duration = parseInt(eventData?.duration, 10) || 4

  const isDinner = mealTime.toLowerCase() === "dinner"

  // Filter selected dish metadata
  const selectedDishes = selectedMenuIds
    .map((id) => MENU_ITEMS.find((item) => item.id === id))
    .filter(Boolean)

  const estimates = selectedDishes.map((dish) => {
    const baseline = BASELINE_DISH_DATA[dish.id] || {
      baseQtyPerGuest: 0.08,
      unit: dish.unit?.toLowerCase() || "portions",
      baseConfidence: "Medium",
      reason: "Standard catering requirement based on guest scale",
      relativeScore: 70,
    }

    // Determine expected consumers
    let expectedConsumers = 0
    if (dish.dietary === "non-veg") {
      // Non-veg consumers
      const baseNonVeg = Math.round((totalGuests * nonVegPct) / 100)
      expectedConsumers = Math.max(10, Math.round(baseNonVeg * 0.95))
    } else {
      // Veg dish: consumed by veg guests + a substantial portion of non-veg guests
      const baseVeg = Math.round((totalGuests * vegPct) / 100)
      const nonVegEaters = Math.round(((totalGuests * nonVegPct) / 100) * 0.6)
      expectedConsumers = Math.min(totalGuests, baseVeg + nonVegEaters)
    }

    // Time & duration multiplier
    const durationMultiplier = duration >= 5 ? 1.12 : duration <= 2 ? 0.9 : 1.0
    const mealMultiplier = isDinner ? 1.05 : 0.95

    let rawQty = expectedConsumers * baseline.baseQtyPerGuest * durationMultiplier * mealMultiplier

    // Round appropriately by unit
    let recommendedQuantity = ""
    let displayUnit = baseline.unit

    if (baseline.unit === "kg") {
      const roundedKg = Math.max(5, Math.round(rawQty))
      recommendedQuantity = `${roundedKg} kg`
    } else if (baseline.unit === "pieces") {
      const roundedPcs = Math.max(25, Math.round(rawQty / 25) * 25)
      recommendedQuantity = `${roundedPcs} pieces`
    } else if (baseline.unit === "litres" || baseline.unit === "liters") {
      const roundedLitres = Math.max(10, Math.round(rawQty / 5) * 5)
      recommendedQuantity = `${roundedLitres} litres`
    } else if (baseline.unit === "scoops") {
      const roundedScoops = Math.max(20, Math.round(rawQty / 10) * 10)
      recommendedQuantity = `${roundedScoops} scoops`
    } else {
      const roundedPortions = Math.max(10, Math.round(rawQty))
      recommendedQuantity = `${roundedPortions} ${baseline.unit}`
    }

    return {
      dishId: dish.id,
      dishName: dish.name,
      category: dish.category,
      dietary: dish.dietary,
      icon: dish.icon,
      expectedConsumers: `~${expectedConsumers} guests`,
      rawConsumers: expectedConsumers,
      recommendedQuantity,
      unit: displayUnit,
      confidence: baseline.baseConfidence,
      reason: baseline.reason,
      relativeScore: baseline.relativeScore,
    }
  })

  // Estimated financial and surplus metrics
  const costPerGuest = isDinner ? 95 : 80
  const estimatedCostValue = Math.round((totalGuests * costPerGuest * (selectedDishes.length / 8)) / 500) * 500
  const formattedCost = `₹${estimatedCostValue.toLocaleString("en-IN")}`

  // Contextual explanations
  const eventName = eventType.charAt(0).toUpperCase() + eventType.slice(1)
  const mealName = mealTime.charAt(0).toUpperCase() + mealTime.slice(1)

  const explanationIntro = `CaterAI calculated quantity recommendations for your ${eventName} (${mealName}) with ${totalGuests} guests (${adults} adults, ${children} children), factoring in a ${vegPct}% vegetarian and ${nonVegPct}% non-vegetarian profile over ${duration} hours.`

  const reasoningPoints = [
    `${vegPct}% vegetarian attendance significantly concentrates main-course demand toward vegetarian specialties like Shahi Paneer and Dal Makhani.`,
    `${mealName} timing combined with a ${duration}-hour celebration increases peak-window main course and flatbread consumption expectations.`,
    adults > children * 3
      ? "Predominantly adult demographic (~" + Math.round((adults / totalGuests) * 100) + "%) favors richer tandoori preparations and whole wheat flatbreads."
      : "Balanced family guest profile incorporates higher demand for child-friendly finger foods and frozen desserts.",
    selectedMenuIds.includes("biryani")
      ? "Biryani is designated as a signature main-course staple, absorbing high single-plate volume."
      : "Multi-curry composition balances volume evenly across selected gravies.",
  ]

  return {
    estimatedTotalCost: formattedCost,
    costFootnote: "based on sample market rates",
    estimatedSurplusReduction: "25–35%",
    surplusFootnote: "illustrative model estimate",
    estimatedCO2Impact: `~${Math.round(totalGuests * 0.08)} kg`,
    co2Footnote: "illustrative estimate",
    explanationIntro,
    reasoningPoints,
    estimates,
  }
}

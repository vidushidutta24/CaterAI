/**
 * CaterAI Client Service Layer & Backend Adapter
 *
 * Connects the frontend to the Express backend API (http://localhost:5000).
 * Handles request mapping, timeout control, pre-flight contract validation,
 * error extraction, and response normalization.
 */

import { MENU_ITEMS } from "@/data/menu"
import { generateCateringPlan } from "@/data/mockResults"

const API_BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  ""

/**
 * Clean mapping between frontend dish identifiers (kebab-case)
 * and backend food rules identifiers (snake_case).
 */
export const DISH_ID_TO_BACKEND_KEY = {
  "paneer-tikka": "paneer_tikka",
  "veg-spring-roll": "veg_spring_roll",
  "chicken-tikka": "chicken_tikka",
  "hara-bhara-kebab": "hara_bhara_kebab",
  "shahi-paneer": "shahi_paneer",
  "butter-chicken": "butter_chicken",
  "dal-makhani": "dal_makhani",
  "biryani": "biryani",
  "naan": "naan",
  "roti": "roti",
  "gulab-jamun": "gulab_jamun",
  "ice-cream": "ice_cream",
  "rasmalai": "rasmalai",
  "soft-drinks": "soft_drink",
  "fresh-juice": "fresh_juice",
}

/**
 * Builds and validates the exact backend request payload.
 */
export function buildBackendPayload(eventData, selectedMenu = []) {
  const guests = parseInt(eventData?.guests, 10) || 0
  const adults = parseInt(eventData?.adults, 10) || 0
  const children = parseInt(eventData?.children, 10) || 0
  const vegPct = Math.min(
    100,
    Math.max(0, parseInt(eventData?.vegetarianPct, 10) || 70)
  )
  const nonVegPct = 100 - vegPct

  // Ensure duration is parsed to a clean number
  const durationNum =
    parseFloat(String(eventData?.duration || "4").replace(/[^0-9.]/g, "")) || 4

  // Normalize meal to strictly "lunch" or "dinner"
  const meal =
    String(eventData?.mealTime || "dinner").toLowerCase() === "lunch"
      ? "lunch"
      : "dinner"

  // Normalize eventType and season
  const eventType = String(eventData?.eventType || "wedding")
    .toLowerCase()
    .trim()
  const season = String(eventData?.season || "winter")
    .toLowerCase()
    .trim()

  // Map dish IDs to backend snake_case keys
  const menu = selectedMenu
    .map((id) => DISH_ID_TO_BACKEND_KEY[id] || id.replace(/-/g, "_"))
    .filter(Boolean)

  // Pre-flight client-side validation against backend Zod contract
  if (guests <= 0) {
    throw new Error("Expected guests must be greater than 0.")
  }
  if (adults + children !== guests) {
    throw new Error(
      `Guest split mismatch: Adults (${adults}) + Children (${children}) must equal total guests (${guests}).`
    )
  }
  if (Math.round(vegPct + nonVegPct) !== 100) {
    throw new Error("Vegetarian + Non-Vegetarian percentages must total 100%.")
  }
  if (menu.length === 0) {
    throw new Error("At least one dish must be selected to generate an estimate.")
  }

  return {
    guests,
    adults,
    children,
    vegetarianPercentage: vegPct,
    nonVegetarianPercentage: nonVegPct,
    eventType,
    meal,
    duration: durationNum,
    season,
    menu,
  }
}

/**
 * Normalizes backend response into a uniform frontend model for ResultsDashboard & WhatIfSimulator.
 */
export function normalizeEstimateResponse(backendResponse, eventData, selectedMenu = []) {
  if (!backendResponse || !backendResponse.data) {
    throw new Error("Invalid response received from estimation service.")
  }

  const { source = "fallback", data } = backendResponse
  const rawEstimates = Array.isArray(data.estimates) ? data.estimates : []
  const totalGuests = data.eventSummary?.guests || eventData?.guests || 500

  // Match raw backend estimates with local dish metadata (category, icon, dietary, ID)
  const normalizedEstimates = rawEstimates.map((item) => {
    const dishName = item.dish || "Unnamed Dish"
    const matchedDish = MENU_ITEMS.find(
      (m) =>
        m.name.toLowerCase() === dishName.toLowerCase() ||
        DISH_ID_TO_BACKEND_KEY[m.id] === item.dish?.toLowerCase()?.replace(/\s+/g, "_")
    )

    const unit = item.unit || matchedDish?.unit || "portions"
    const rawQty = item.recommendedQuantity

    // Format recommended quantity cleanly with unit
    let recommendedQuantity = `${rawQty} ${unit}`
    if (unit === "pieces" || unit === "cups") {
      recommendedQuantity = `${Math.round(rawQty)} ${unit}`
    } else if (unit === "kg" || unit === "liters" || unit === "litres") {
      const rounded = Math.round(rawQty * 10) / 10
      recommendedQuantity = `${rounded % 1 === 0 ? rounded : rounded.toFixed(1)} ${unit}`
    }

    // Format confidence (e.g. 0.85 -> "85%", or preserve "high"/"medium")
    let confidenceStr = "High"
    if (typeof item.confidence === "number") {
      confidenceStr = `${Math.round(item.confidence * 100)}%`
    } else if (typeof item.confidence === "string") {
      confidenceStr =
        item.confidence.charAt(0).toUpperCase() + item.confidence.slice(1).toLowerCase()
    }

    // Compute relative demand score (0-100) for Recharts
    const consumers = item.estimatedConsumers || Math.round(totalGuests * 0.7)
    const relativeScore = Math.min(
      100,
      Math.max(35, Math.round((consumers / totalGuests) * 98))
    )

    return {
      dishId: matchedDish?.id || dishName.toLowerCase().replace(/\s+/g, "-"),
      dishName: matchedDish?.name || dishName,
      category: matchedDish?.category || "Main Course",
      dietary: matchedDish?.dietary || (dishName.toLowerCase().includes("chicken") ? "non-veg" : "veg"),
      icon: matchedDish?.icon || "UtensilsCrossed",
      expectedConsumers: `~${consumers} guests`,
      rawConsumers: consumers,
      recommendedQuantity,
      rawQuantity: rawQty,
      unit,
      confidence: confidenceStr,
      rawConfidence: item.confidence,
      reason: item.reason || "Estimated from guest turnout and menu composition.",
      relativeScore,
    }
  })

  return {
    source, // "ai" | "fallback" | "demo"
    sourceLabel:
      source === "ai"
        ? "AI enriched"
        : source === "fallback"
          ? "Deterministic estimate"
          : "Demo data",
    eventSummary: data.eventSummary || {
      guests: totalGuests,
      eventType: eventData?.eventType || "wedding",
      meal: eventData?.mealTime || "dinner",
    },
    estimates: normalizedEstimates,
    explanationIntro: data.summary,
    reasoningPoints: [
      data.summary,
      data.estimatedSurplusAvoided || "Dynamic portion allocation applied to mitigate banquet waste.",
    ],
    surplusAvoided: data.estimatedSurplusAvoided,
    // Note: The real backend does NOT provide cost or CO2 calculations
    estimatedTotalCost: "Not provided",
    costFootnote: "Not calculated by backend",
    estimatedSurplusReduction: data.estimatedSurplusAvoided || "15–20% surplus prevented",
    surplusFootnote: "Backend verified estimate",
    estimatedCO2Impact: "Not provided",
    co2Footnote: "Not calculated by backend",
  }
}

/**
 * Main CaterAI Estimation API call.
 * Calls POST /api/estimate with timeout handling and error extraction.
 */
export async function estimateCateringPlan(eventData, selectedMenu = []) {
  // If API base URL is not configured (standalone frontend), use reliable local demo estimates
  if (!API_BASE_URL) {
    return getDemoCateringPlan(eventData, selectedMenu)
  }

  const payload = buildBackendPayload(eventData, selectedMenu)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10-second timeout

  try {
    const response = await fetch(`${API_BASE_URL}/api/estimate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorMessage = `Backend responded with HTTP status ${response.status}.`
      try {
        const errorData = await response.json()
        if (errorData?.error) {
          errorMessage = errorData.error
        }
      } catch {
        // Use default message if JSON parsing fails
      }
      throw new Error(errorMessage)
    }

    const result = await response.json()
    if (!result || result.success === false) {
      throw new Error(result?.error || "Backend failed to calculate catering plan.")
    }

    return normalizeEstimateResponse(result, eventData, selectedMenu)
  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === "AbortError") {
      throw new Error("Request timed out after 10 seconds. The backend server did not respond.")
    }
    throw err
  }
}

/**
 * Fallback to local demo data if user explicitly requests demo mode.
 */
export function getDemoCateringPlan(eventData, selectedMenu = []) {
  const demoData = generateCateringPlan(eventData, selectedMenu)
  return {
    ...demoData,
    source: "demo",
    sourceLabel: "Demo data",
    surplusAvoided: "25–35% estimated surplus reduction",
  }
}

/**
 * Quick backend health check utility.
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, { method: "GET" })
    if (res.ok) {
      const data = await res.json()
      return { ok: true, data }
    }
    return { ok: false, status: res.status }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

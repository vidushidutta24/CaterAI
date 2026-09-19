import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

dotenv.config()

/**
 * Gets or initializes the Gemini client.
 */
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return null
  }
  return new GoogleGenAI({ apiKey })
}

/**
 * Tests the Gemini API connection with a minimal prompt.
 * Returns text or throws a controlled error without crashing the server.
 */
export async function testGeminiConnection() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    const err = new Error("Gemini connection failed")
    err.code = "NO_KEY"
    throw err
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"

  try {
    const ai = getGeminiClient()
    const response = await ai.models.generateContent({
      model,
      contents: "Reply with exactly: OK",
    })

    const text = response?.text?.trim() || "OK"
    return text
  } catch (err) {
    const error = new Error("Gemini connection failed")
    error.code = "API_ERROR"
    throw error
  }
}

/**
 * Validates the AI response against strict safety rules:
 * 1. Dish must exist in requested menu.
 * 2. No extra dishes.
 * 3. Every requested dish must be present.
 * 4. Quantity must be numeric.
 * 5. Quantity > 0.
 * 6. Unit must match foodRules.
 * 7. Confidence between 0 and 1.
 * 8. Quantity must remain within approximately ±20% of baseline.
 * 9. estimatedConsumers >= 0.
 */
export function validateAiOutput(aiResult, baselineResult) {
  if (!aiResult || !Array.isArray(aiResult.estimates)) {
    return null
  }

  const baselineEstimates = baselineResult.estimates
  if (aiResult.estimates.length !== baselineEstimates.length) {
    return null
  }

  const validatedEstimates = []

  for (const baseline of baselineEstimates) {
    const aiItem = aiResult.estimates.find(
      (e) =>
        e &&
        (String(e.dish).trim().toLowerCase() ===
          String(baseline.dish).trim().toLowerCase() ||
          String(e.dishId).trim().toLowerCase() ===
          String(baseline.dishId).trim().toLowerCase())
    )

    if (!aiItem) {
      return null // Missing a requested dish
    }

    const qty = Number(aiItem.recommendedQuantity)
    if (isNaN(qty) || qty <= 0) {
      return null
    }

    if (String(aiItem.unit).trim().toLowerCase() !== baseline.unit.toLowerCase()) {
      return null // Unit mismatch
    }

    const conf = Number(aiItem.confidence)
    if (isNaN(conf) || conf < 0 || conf > 1) {
      return null
    }

    const consumers = Number(aiItem.estimatedConsumers)
    if (isNaN(consumers) || consumers < 0) {
      return null
    }

    // Must remain within ±20% of baseline (with small rounding tolerance)
    const minQty = baseline.recommendedQuantity * 0.79 - 0.1
    const maxQty = baseline.recommendedQuantity * 1.21 + 0.1
    if (qty < minQty || qty > maxQty) {
      return null
    }

    validatedEstimates.push({
      dish: baseline.dish,
      dishId: baseline.dishId,
      category: baseline.category,
      estimatedConsumers: Math.round(consumers),
      recommendedQuantity:
        baseline.unit === "pieces"
          ? Math.round(qty)
          : Math.round(qty * 10) / 10,
      unit: baseline.unit,
      confidence: Math.round(conf * 100) / 100,
      reason:
        typeof aiItem.reason === "string" && aiItem.reason.trim().length > 0
          ? aiItem.reason.trim()
          : baseline.reason,
    })
  }

  return {
    eventSummary: baselineResult.eventSummary,
    estimates: validatedEstimates,
    summary:
      typeof aiResult.summary === "string" && aiResult.summary.trim().length > 0
        ? aiResult.summary.trim()
        : baselineResult.summary,
    estimatedSurplusAvoided: baselineResult.estimatedSurplusAvoided,
  }
}

/**
 * Calls Gemini to review and enrich the deterministic baseline estimates.
 * If Gemini is unavailable, times out, or output fails validation, returns null.
 */
export async function reviewBaselineWithGemini(eventData, baselineResult) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return null
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash"
  const ai = getGeminiClient()
  if (!ai) return null

  const prompt = `You are CaterAI, an AI catering quantity assistant.
Review the provided deterministic catering estimates.
Use the event context, guest distribution, dietary mix, meal timing, duration, season and menu composition.
Make an adjustment ONLY when the context supports it.

Rules:
1. Never invent dishes.
2. Never remove selected dishes.
3. Return every selected dish.
4. Never produce negative quantities.
5. Keep quantities within approximately ±20% of the baseline.
6. Preserve the original unit.
7. Confidence must be between 0 and 1.
8. Provide a concise reason for every recommendation.
9. Return structured JSON only.

EVENT CONTEXT:
Guests: ${eventData.guests} (Adults: ${eventData.adults}, Children: ${eventData.children})
Dietary: ${eventData.vegetarianPercentage}% Vegetarian, ${eventData.nonVegetarianPercentage}% Non-Vegetarian
Event Type: ${eventData.eventType}
Meal: ${eventData.meal}
Duration: ${eventData.duration} hours
Season: ${eventData.season}

BASELINE ESTIMATES:
${JSON.stringify(
    baselineResult.estimates.map((e) => ({
      dish: e.dish,
      dishId: e.dishId,
      recommendedQuantity: e.recommendedQuantity,
      unit: e.unit,
      estimatedConsumers: e.estimatedConsumers,
      confidence: e.confidence,
    })),
    null,
    2
  )}

Expected JSON Output format:
{
  "estimates": [
    {
      "dish": "Dish Name",
      "recommendedQuantity": 15.0,
      "unit": "kg",
      "estimatedConsumers": 350,
      "confidence": 0.88,
      "reason": "Concise justification"
    }
  ],
  "summary": "Overall catering plan summary"
}`

  try {
    // 7-second timeout for AI review to guarantee fast responses
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Gemini request timed out")), 7000)
    )

    const aiPromise = ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    })

    const response = await Promise.race([aiPromise, timeoutPromise])
    const rawText = response?.text?.trim()
    if (!rawText) return null

    const parsed = JSON.parse(rawText)
    return validateAiOutput(parsed, baselineResult)
  } catch (err) {
    // Never crash the server, return null for graceful fallback
    return null
  }
}


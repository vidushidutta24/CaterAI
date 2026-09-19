/**
 * AI Estimator Service (Gemini REST Integration)
 * Calls Google Gemini API using native fetch to refine catering estimates.
 * Gracefully falls back if unconfigured, times out, or encounters errors.
 */

async function estimateWithAI(eventData, fallbackEstimate) {
  const apiKey = process.env.AI_API_KEY;
  const configuredModel = process.env.AI_MODEL || "gemini-3.6-flash";
  const baseUrl = process.env.AI_API_URL || "https://generativelanguage.googleapis.com/v1beta";

  // If no API key is configured, bypass AI and allow immediate fallback
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }

  const systemInstruction = `You are an expert event and wedding catering quantity estimator.
You refine baseline catering quantity estimates based on guest demographics, event type, meal timing, season, duration, and menu composition.
RULES:
1. ONLY return estimates for the EXACT dishes provided in the baseline estimates. Do NOT invent, add, or remove dishes.
2. Keep recommended quantities close to the baseline mathematical calculations, adjusting moderately for context.
3. Return STRICTLY valid JSON with no markdown wrapping, backticks, or extra conversational prose.
Schema:
{
  "estimates": [
    {
      "dish": "string",
      "estimatedConsumers": 0,
      "recommendedQuantity": 0,
      "unit": "string",
      "confidence": "high|medium|low",
      "reason": "string (under 20 words)"
    }
  ],
  "summary": "string"
}`;

  const userContext = JSON.stringify({
    eventContext: {
      guests: eventData.guests,
      adults: eventData.adults,
      children: eventData.children,
      vegetarianPercentage: eventData.vegetarianPercentage,
      nonVegetarianPercentage: eventData.nonVegetarianPercentage,
      eventType: eventData.eventType,
      meal: eventData.meal,
      duration: eventData.duration,
      season: eventData.season,
      selectedMenu: eventData.menu
    },
    baselineEstimates: fallbackEstimate.estimates
  });

  // Helper to call Gemini endpoint with timeout
  async function callGemini(modelName) {
    const endpoint = `${baseUrl}/models/${modelName}:generateContent?key=${apiKey}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstruction}\n\nInput Event Data and Baselines:\n${userContext}` }]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  try {
    let response = await callGemini(configuredModel);

    // If configured model returns 404 (deprecated) or 503 (temporary spike), retry or try fallback models
    if (response.status === 404 && configuredModel !== "gemini-3.6-flash") {
      console.warn(`[AI Estimator] Model ${configuredModel} returned 404. Trying gemini-3.6-flash...`);
      response = await callGemini("gemini-3.6-flash");
    }

    // If temporary 503 spike, wait 600ms and retry once
    if (response.status === 503) {
      console.warn(`[AI Estimator] Model ${configuredModel} returned 503 spike. Retrying...`);
      await new Promise((r) => setTimeout(r, 600));
      response = await callGemini("gemini-3.6-flash");
    }

    if (!response.ok) {
      const errorBody = await response.text();
      console.warn(`[AI Estimator] Gemini API returned status ${response.status}: ${errorBody.slice(0, 200)}`);
      return null;
    }

    const payload = await response.json();
    const rawText = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return null;
    }

    // Clean any markdown formatting if present
    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedText);

    // Validate minimal structure
    if (!parsed || !Array.isArray(parsed.estimates) || parsed.estimates.length === 0) {
      return null;
    }

    // Validate each dish estimate against baseline
    const baselineDishNames = new Set(
      fallbackEstimate.estimates.map((e) => e.dish.toLowerCase())
    );

    const validEstimates = parsed.estimates.filter((e) => {
      return (
        typeof e.dish === "string" &&
        baselineDishNames.has(e.dish.toLowerCase()) &&
        typeof e.estimatedConsumers === "number" &&
        typeof e.recommendedQuantity === "number" &&
        typeof e.unit === "string"
      );
    });

    if (validEstimates.length !== fallbackEstimate.estimates.length) {
      console.warn("[AI Estimator] Dish validation mismatch with baseline. Using fallback.");
      return null;
    }

    // Format confidence nicely if number was returned
    const normalizedEstimates = validEstimates.map((e) => {
      let confidenceStr = "high";
      if (typeof e.confidence === "string") {
        confidenceStr = ["high", "medium", "low"].includes(e.confidence.toLowerCase())
          ? e.confidence.toLowerCase()
          : "high";
      } else if (typeof e.confidence === "number") {
        confidenceStr = e.confidence >= 0.8 ? "high" : e.confidence >= 0.5 ? "medium" : "low";
      }
      return {
        dish: e.dish,
        estimatedConsumers: Math.round(e.estimatedConsumers),
        recommendedQuantity:
          e.unit === "kg" || e.unit === "liters"
            ? Math.round(e.recommendedQuantity * 10) / 10
            : Math.round(e.recommendedQuantity),
        unit: e.unit,
        confidence: confidenceStr,
        reason: e.reason || "AI adjusted for demographic and event parameters."
      };
    });

    return {
      estimates: normalizedEstimates,
      summary: parsed.summary || fallbackEstimate.summary,
      estimatedSurplusAvoided: fallbackEstimate.estimatedSurplusAvoided
    };
  } catch (err) {
    console.warn(`[AI Estimator] Error: ${err.message}. Using fallback.`);
    return null;
  }
}

module.exports = {
  estimateWithAI
};

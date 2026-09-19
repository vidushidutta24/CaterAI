const express = require("express");
const router = express.Router();
const { validateEstimateRequest } = require("../utils/validation");
const { calculateFallbackEstimate } = require("../services/estimator");
const { estimateWithAI } = require("../services/aiEstimator");

/**
 * POST /api/estimate
 * Calculates event catering quantities using fallback logic and optional AI enhancement.
 */
router.post("/", async (req, res) => {
  try {
    // 1. Validation
    const validation = validateEstimateRequest(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    const eventData = validation.data;

    // 2. Deterministic baseline estimate
    const fallbackResult = calculateFallbackEstimate(eventData);

    // 3. Attempt AI enhancement if configured
    let aiResult = null;
    try {
      aiResult = await estimateWithAI(eventData, fallbackResult);
    } catch (aiErr) {
      console.warn("[Route /estimate] AI error caught, falling back safely:", aiErr.message);
      aiResult = null;
    }

    const isAiSource = Boolean(aiResult && aiResult.estimates && aiResult.estimates.length > 0);
    const finalData = isAiSource ? aiResult : fallbackResult;

    // 4. Send standardized response
    return res.status(200).json({
      success: true,
      source: isAiSource ? "ai" : "fallback",
      data: {
        eventSummary: {
          guests: eventData.guests,
          eventType: eventData.eventType,
          meal: eventData.meal
        },
        estimates: finalData.estimates,
        summary: finalData.summary,
        estimatedSurplusAvoided: finalData.estimatedSurplusAvoided || null
      }
    });
  } catch (error) {
    console.error("[Route /estimate] Unexpected error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error occurred while calculating estimate."
    });
  }
});

module.exports = router;

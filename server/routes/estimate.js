import { Router } from "express"
import { validateEstimateRequest } from "../utils/validation.js"
import { calculateBaselineEstimate } from "../services/estimator.js"
import { reviewBaselineWithGemini } from "../services/gemini.js"

const router = Router()

/**
 * POST /api/estimate
 * Calculates event catering quantity estimates.
 * Utilizes deterministic CaterAI baseline portions, enriched by Gemini AI review when available.
 */
router.post("/estimate", async (req, res) => {
  try {
    // 1. Zod Validation
    const validation = validateEstimateRequest(req.body)
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: validation.error,
      })
    }

    const eventData = validation.data

    // 2. Deterministic Baseline Calculation
    const baselineResult = calculateBaselineEstimate(eventData)

    // 3. Gemini Review & Enrichment
    let aiResult = null
    try {
      aiResult = await reviewBaselineWithGemini(eventData, baselineResult)
    } catch {
      aiResult = null
    }

    // 4. Return AI result if valid, otherwise fallback cleanly to deterministic baseline
    if (aiResult) {
      return res.status(200).json({
        success: true,
        source: "ai",
        data: aiResult,
      })
    }

    return res.status(200).json({
      success: true,
      source: "fallback",
      data: baselineResult,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal server error occurred while calculating estimate.",
    })
  }
})

export default router

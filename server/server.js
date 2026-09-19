import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { testGeminiConnection } from "./services/gemini.js"
import estimateRouter from "./routes/estimate.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Estimation router
app.use("/api", estimateRouter)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CaterAI backend is running",
  })
})

// AI connection test endpoint (development/verification)
app.get("/api/ai-test", async (req, res) => {
  try {
    const text = await testGeminiConnection()
    res.status(200).json({
      success: true,
      message: "Gemini connection working",
      response: text,
    })
  } catch (err) {
    res.status(503).json({
      success: false,
      error: "Gemini connection failed",
    })
  }
})

// Centralized error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    error: "Internal server error",
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`CaterAI backend running on port ${PORT}`)
})

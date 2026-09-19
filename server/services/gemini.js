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

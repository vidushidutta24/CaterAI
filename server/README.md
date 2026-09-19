# CaterAI Backend

Lightweight, high-reliability REST API for wedding and event catering quantity estimation. Built for hackathon velocity with deterministic estimation and seamless AI enrichment fallback.

## 1. What the Backend Does
- Validates event specifications (guests, adults/children, dietary split, meal type, menu).
- Computes baseline portion estimates using demographic rules and menu variety factors.
- Enhances estimates using an external LLM via native fetch when configured.
- Gracefully falls back to deterministic calculation if the AI service fails or is unconfigured.

## 2. Requirements
- Node.js v18+ (tested on Node v24)
- npm

## 3. Installation
```bash
cd server
npm install
```

## 4. Environment Variables
Copy `.env.example` to `.env`:
```env
PORT=5000
AI_API_KEY=your_openai_or_compatible_key_here
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_MODEL=gpt-4o-mini
```
*Note: If `AI_API_KEY` is left blank, the backend automatically operates in fallback mode without breaking.*

## 5. How to Run
```bash
# Start server
npm start

# Or with live reload
npm run dev
```

## 6. API Endpoints
- `GET /api/health` - Server health status
- `POST /api/estimate` - Calculate recommended catering quantities

## 7. Example Request (`POST /api/estimate`)
```json
{
  "guests": 500,
  "adults": 420,
  "children": 80,
  "vegetarianPercentage": 70,
  "nonVegetarianPercentage": 30,
  "eventType": "wedding",
  "meal": "dinner",
  "duration": 4,
  "season": "winter",
  "menu": [
    "paneer_tikka",
    "butter_chicken",
    "biryani",
    "naan",
    "gulab_jamun"
  ]
}
```

## 8. Example Response
```json
{
  "success": true,
  "source": "fallback",
  "data": {
    "eventSummary": {
      "guests": 500,
      "eventType": "wedding",
      "meal": "dinner"
    },
    "estimates": [
      {
        "dish": "Paneer Tikka",
        "estimatedConsumers": 440,
        "recommendedQuantity": 19.3,
        "unit": "kg",
        "confidence": 0.85,
        "reason": "Calculated from 440 estimated consumers (veg preference + partial non-veg), dinner timing, and 1 starter menu variety."
      },
      {
        "dish": "Butter Chicken",
        "estimatedConsumers": 150,
        "recommendedQuantity": 13.9,
        "unit": "kg",
        "confidence": 0.85,
        "reason": "Calculated from 150 estimated consumers (non-veg cohort), dinner timing, and 2 main menu variety."
      }
    ],
    "summary": "Quantities adjusted deterministically using 500 guests (420 adults, 80 children), 70% veg / 30% non-veg ratio, dinner meal, and menu distribution.",
    "estimatedSurplusAvoided": "Estimated ~15-20% surplus prevented (~23 kg across weight-based items) compared to flat per-head catering buffer."
  }
}
```

## 9. How Fallback Mode Works
1. When `POST /api/estimate` receives a request, it runs deterministic calculation first (`services/estimator.js`).
2. If `AI_API_KEY` is not present, or if the external AI API call fails/times out, the system directly returns the deterministic estimate with `"source": "fallback"`.
3. If the AI returns a valid response, it returns with `"source": "ai"`.
The backend guarantees a successful response as long as the input is valid.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const estimateRoute = require("./routes/estimate");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CaterAI backend is running"
  });
});

// Main Estimation Endpoint
app.use("/api/estimate", estimateRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error("[Server Error]:", err);
  res.status(500).json({
    success: false,
    error: "An unexpected server error occurred."
  });
});

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[CaterAI] Server is listening on http://localhost:${PORT}`);
});

module.exports = app;

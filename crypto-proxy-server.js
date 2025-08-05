const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for CoinGecko market data
app.get("/api/crypto/markets", async (req, res) => {
  try {
    console.log("🚀 Fetching market data from CoinGecko...");

    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d"
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Market data fetched successfully");
    res.json(data);
  } catch (error) {
    console.error("❌ Error fetching market data:", error.message);
    res.status(500).json({
      error: "Failed to fetch market data",
      message: error.message,
    });
  }
});

// Proxy endpoint for individual coin details
app.get("/api/crypto/coin/:coinId", async (req, res) => {
  try {
    const { coinId } = req.params;
    console.log(`🚀 Fetching details for ${coinId}...`);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Details fetched for ${coinId}`);
    res.json(data);
  } catch (error) {
    console.error(
      `❌ Error fetching ${req.params.coinId} details:`,
      error.message
    );
    res.status(500).json({
      error: "Failed to fetch coin details",
      message: error.message,
    });
  }
});

// Proxy endpoint for chart data
app.get("/api/crypto/chart/:coinId/:days", async (req, res) => {
  try {
    const { coinId, days } = req.params;
    console.log(`🚀 Fetching ${days}-day chart for ${coinId}...`);

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`✅ Chart data fetched for ${coinId} (${days} days)`);
    res.json(data);
  } catch (error) {
    console.error(`❌ Error fetching chart for ${coinId}:`, error.message);
    res.status(500).json({
      error: "Failed to fetch chart data",
      message: error.message,
    });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Crypto API Proxy Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log("🚀 Crypto API Proxy Server started!");
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log("🔧 Available endpoints:");
  console.log(`   GET /api/crypto/markets - Top 10 cryptocurrencies`);
  console.log(`   GET /api/crypto/coin/:coinId - Individual coin details`);
  console.log(`   GET /api/crypto/chart/:coinId/:days - Chart data`);
  console.log(`   GET /health - Server health check`);
  console.log("");
  console.log("💡 Usage in React app:");
  console.log(`   fetch('http://localhost:${PORT}/api/crypto/markets')`);
  console.log("");
  console.log("🛑 To stop server: Press Ctrl+C");
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down Crypto API Proxy Server...");
  process.exit(0);
});

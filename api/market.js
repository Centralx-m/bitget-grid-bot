// api/market.js
const BitgetAPI = require('bitget-api');
const express = require('express');
const app = express();

const client = new BitgetAPI({
  apiKey: process.env.BITGET_API_KEY,
  secret: process.env.BITGET_API_SECRET,
  passphrase: process.env.BITGET_PASSPHRASE
});

app.get('/', async (req, res) => {
  try {
    const ticker = await client.fetchTicker('BTC/USDT');
    res.json({
      price: ticker.last,
      high: ticker.high,
      low: ticker.low
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
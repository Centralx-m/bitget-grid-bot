const BitgetAPI = require('bitget-api');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Bitget client
const client = new BitgetAPI({
  apiKey: process.env.BITGET_API_KEY,
  secret: process.env.BITGET_API_SECRET,
  passphrase: process.env.BITGET_PASSPHRASE
});

// In-memory storage (replace with DB in production)
const bots = {};
const trades = [];

// API endpoints
app.post('/', async (req, res) => {
  try {
    const { action, ...params } = req.body;

    if (action === 'start') {
      const botId = uuidv4();
      bots[botId] = {
        ...params,
        active: true,
        createdAt: new Date().toISOString()
      };
      return res.json({ success: true, botId });
    }

    if (action === 'stop') {
      Object.keys(bots).forEach(id => { bots[id].active = false; });
      return res.json({ success: true });
    }

    return res.status(400).json({ success: false, message: 'Invalid action' });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/', async (req, res) => {
  try {
    if (req.query.action === 'history') {
      return res.json({ success: true, history: trades });
    }
    return res.status(400).json({ success: false, message: 'Invalid action' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = app;
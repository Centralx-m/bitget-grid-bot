// Configuration
const API_BASE_URL = '/api/trade';
const API_KEY = process.env.CLIENT_API_KEY; // Different from server API key
const USER_TOKEN = localStorage.getItem('userToken') || generateUserToken();

// Generate a unique user token if none exists
function generateUserToken() {
  const token = crypto.randomUUID();
  localStorage.setItem('userToken', token);
  return token;
}

// Secure API request function
async function makeSecureRequest(method, data = {}) {
  try {
    const response = await fetch(API_BASE_URL, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'X-User-ID': USER_TOKEN
      },
      body: method !== 'GET' ? JSON.stringify(data) : undefined
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// Updated bot control functions
async function startBot() {
  const config = {
    tradingPair: document.getElementById('tradingPair').value,
    investment: document.getElementById('investment').value,
    upperPrice: document.getElementById('upperPrice').value,
    lowerPrice: document.getElementById('lowerPrice').value,
    gridLevels: document.getElementById('gridLevels').value,
    action: 'start'
  };

  try {
    const result = await makeSecureRequest('POST', config);
    if (result.success) {
      updateBotStatus(true);
      startPolling();
    }
  } catch (error) {
    showError('Failed to start bot');
  }
}

// Add similar secure implementations for stopBot(), getHistory(), etc.
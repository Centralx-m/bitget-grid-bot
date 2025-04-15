document.addEventListener('DOMContentLoaded', function() {
  const API_URL = '/api/trade';
  const startBtn = document.getElementById('startBot');
  const stopBtn = document.getElementById('stopBot');
  const statusEl = document.getElementById('botStatus');
  const historyTable = document.getElementById('tradeHistory').querySelector('tbody');

  let botRunning = false;
  let pollInterval;

  // Start bot
  startBtn.addEventListener('click', async function() {
    if (botRunning) return;
    
    const config = {
      action: 'start',
      tradingPair: document.getElementById('tradingPair').value,
      investment: document.getElementById('investment').value,
      upperPrice: document.getElementById('upperPrice').value,
      lowerPrice: document.getElementById('lowerPrice').value,
      gridLevels: document.getElementById('gridLevels').value
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      
      if (data.success) {
        botRunning = true;
        updateStatus(true);
        startPolling();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start bot');
    }
  });

  // Stop bot
  stopBtn.addEventListener('click', async function() {
    if (!botRunning) return;
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' })
      });
      
      const data = await response.json();
      
      if (data.success) {
        botRunning = false;
        updateStatus(false);
        stopPolling();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to stop bot');
    }
  });

  // Update UI status
  function updateStatus(running) {
    statusEl.textContent = running ? 'Running' : 'Idle';
    statusEl.className = running ? 'running' : '';
    startBtn.disabled = running;
    stopBtn.disabled = !running;
  }

  // Poll for updates
  function startPolling() {
    updateHistory();
    pollInterval = setInterval(updateHistory, 5000);
  }

  function stopPolling() {
    clearInterval(pollInterval);
  }

  async function updateHistory() {
    try {
      const response = await fetch(`${API_URL}?action=history`);
      const data = await response.json();
      
      if (data.success) {
        renderHistory(data.history);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  }

  function renderHistory(history) {
    historyTable.innerHTML = '';
    
    history.forEach(trade => {
      const row = historyTable.insertRow();
      row.innerHTML = `
        <td>${new Date(trade.time).toLocaleString()}</td>
        <td class="${trade.type.toLowerCase()}">${trade.type}</td>
        <td>${parseFloat(trade.price).toFixed(2)}</td>
        <td>${parseFloat(trade.amount).toFixed(6)}</td>
        <td>${trade.profit ? parseFloat(trade.profit).toFixed(2) : '-'}</td>
      `;
    });
  }
});
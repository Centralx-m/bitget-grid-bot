document.addEventListener('DOMContentLoaded', function() {
  const startBotBtn = document.getElementById('startBot');
  const stopBotBtn = document.getElementById('stopBot');
  const botStatus = document.getElementById('botStatus');
  const tradeHistoryTable = document.getElementById('tradeHistory').getElementsByTagName('tbody')[0];
  
  // API configuration
  const API_BASE_URL = '/api/trade';
  
  // Current bot state
  let botRunning = false;
  
  // Start bot handler
  startBotBtn.addEventListener('click', async function() {
    if (botRunning) return;
    
    const tradingPair = document.getElementById('tradingPair').value;
    const investment = document.getElementById('investment').value;
    const upperPrice = document.getElementById('upperPrice').value;
    const lowerPrice = document.getElementById('lowerPrice').value;
    const gridLevels = document.getElementById('gridLevels').value;
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start',
          tradingPair,
          investment,
          upperPrice,
          lowerPrice,
          gridLevels
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        botRunning = true;
        botStatus.textContent = 'Running';
        botStatus.classList.add('running');
        startBotBtn.disabled = true;
        stopBotBtn.disabled = false;
        
        // Start polling for updates
        pollTradeHistory();
      } else {
        alert('Error starting bot: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start bot');
    }
  });
  
  // Stop bot handler
  stopBotBtn.addEventListener('click', async function() {
    if (!botRunning) return;
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'stop'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        botRunning = false;
        botStatus.textContent = 'Idle';
        botStatus.classList.remove('running');
        startBotBtn.disabled = false;
        stopBotBtn.disabled = true;
      } else {
        alert('Error stopping bot: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to stop bot');
    }
  });
  
  // Poll for trade history updates
  async function pollTradeHistory() {
    if (!botRunning) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}?action=history`);
      const data = await response.json();
      
      if (data.success && data.history) {
        updateTradeHistory(data.history);
      }
      
      // Continue polling every 5 seconds
      setTimeout(pollTradeHistory, 5000);
    } catch (error) {
      console.error('Error polling trade history:', error);
      // Retry after delay
      setTimeout(pollTradeHistory, 10000);
    }
  }
  
  // Update trade history table
  function updateTradeHistory(history) {
    tradeHistoryTable.innerHTML = '';
    
    history.forEach(trade => {
      const row = tradeHistoryTable.insertRow();
      
      const timeCell = row.insertCell(0);
      const typeCell = row.insertCell(1);
      const priceCell = row.insertCell(2);
      const amountCell = row.insertCell(3);
      const profitCell = row.insertCell(4);
      
      timeCell.textContent = new Date(trade.time).toLocaleString();
      typeCell.textContent = trade.type;
      typeCell.className = trade.type.toLowerCase();
      priceCell.textContent = parseFloat(trade.price).toFixed(2);
      amountCell.textContent = parseFloat(trade.amount).toFixed(6);
      profitCell.textContent = trade.profit ? parseFloat(trade.profit).toFixed(2) : '-';
    });
  }
});
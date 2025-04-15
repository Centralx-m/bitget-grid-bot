import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Bitget Grid Bot</title>
        <link rel="stylesheet" href="/style.css" />
      </Head>

      <main>
        <h1>Bitget Grid Bot</h1>
        
        <div className="bot-controls">
          <div className="form-group">
            <label>Trading Pair:</label>
            <select id="tradingPair">
              <option value="BTC/USDT">BTC/USDT</option>
              <option value="ETH/USDT">ETH/USDT</option>
              <option value="SOL/USDT">SOL/USDT</option>
              <option value="ADA/USDT">ADA/USDT</option>
              <option value="DOT/USDT">DOT/USDT</option>
            </select>
          </div>

          <div className="form-group">
            <label>Investment (USDT):</label>
            <input type="number" id="investment" defaultValue="10" />
          </div>

          <div className="form-group">
            <label>Upper Price:</label>
            <input type="number" id="upperPrice" defaultValue="50000" />
          </div>

          <div className="form-group">
            <label>Lower Price:</label>
            <input type="number" id="lowerPrice" defaultValue="40000" />
          </div>

          <div className="form-group">
            <label>Grid Levels:</label>
            <input type="number" id="gridLevels" defaultValue="100" />
          </div>

          <div className="button-group">
            <button id="startBot" className="btn-start">Start Bot</button>
            <button id="stopBot" className="btn-stop" disabled>Stop Bot</button>
          </div>
        </div>

        <div className="status">
          <h2>Bot Status: <span id="botStatus">Idle</span></h2>
        </div>

        <div className="trade-history">
          <h2>Trade History</h2>
          <table id="tradeHistory">
            <thead>
              <tr>
                <th>Time</th>
                <th>Type</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              <!-- Filled by JavaScript -->
            </tbody>
          </table>
        </div>
      </main>

      <script src="/script.js"></script>
    </div>
  );
}

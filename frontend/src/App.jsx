import { useState } from 'react';
import StockChart from './components/StockChart';
import InvestmentPanel from './components/InvestmentPanel';
import NewsSection from './components/NewsSection';
import StockStats from './components/StockStats';

const API_URL = 'http://localhost:3000/api/calculate';

function App() {
  const [ticker, setTicker] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ticker || !date || !amount) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, date, amount: parseFloat(amount) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const isProfit = result?.profit > 0;
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#0d1117] text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Chart Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stock Header */}
            <div className="bg-[#161b22] rounded-xl p-6 border border-gray-800">
              {result ? (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-400 text-sm uppercase tracking-wider">
                      {result.ticker}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold">${result.current_price}</span>
                    <span className={`text-lg font-semibold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
                      {isProfit ? '▲' : '▼'} {Math.abs(result.percent_gain)}%
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Since {result.purchase_date} (was ${result.historical_price})
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400">Enter a stock ticker and date to see your FOMO</p>
                  <p className="text-2xl font-bold text-gray-600 mt-2">---</p>
                </div>
              )}
            </div>

            {/* Price Chart */}
            <div className="bg-[#161b22] rounded-xl p-6 border border-gray-800">
              <StockChart data={result?.chart_data || []} isProfit={isProfit} />
            </div>

            {/* Stock Stats - Bottom Left */}
            <StockStats result={result} />
          </div>

          {/* Right Side - Investment Panel & News */}
          <div className="space-y-4">
            {/* Investment Calculator */}
            <InvestmentPanel
              ticker={ticker}
              setTicker={setTicker}
              date={date}
              setDate={setDate}
              amount={amount}
              setAmount={setAmount}
              onSubmit={handleSubmit}
              loading={loading}
              result={result}
              error={error}
              maxDate={today}
            />

            {/* News Section */}
            <NewsSection ticker={result?.ticker} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

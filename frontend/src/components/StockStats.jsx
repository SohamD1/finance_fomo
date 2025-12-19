export default function StockStats({ result }) {
  if (!result || !result.chart_data || result.chart_data.length === 0) {
    return (
      <div className="bg-[#161b22] rounded-xl p-6 border border-gray-800">
        <h3 className="text-sm font-medium text-gray-400 mb-4">Period Statistics</h3>
        <p className="text-gray-600 text-sm">Select a stock to view statistics</p>
      </div>
    );
  }

  const prices = result.chart_data.map(d => d.price);
  const periodHigh = Math.max(...prices);
  const periodLow = Math.min(...prices);
  const openPrice = prices[0];
  const closePrice = prices[prices.length - 1];
  const priceChange = closePrice - openPrice;
  const priceChangePercent = ((priceChange / openPrice) * 100).toFixed(2);
  const avgPrice = (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2);
  const volatility = calculateVolatility(prices);
  const tradingDays = prices.length;

  // Find dates for high and low
  const highIndex = prices.indexOf(periodHigh);
  const lowIndex = prices.indexOf(periodLow);
  const highDate = result.chart_data[highIndex]?.date || '';
  const lowDate = result.chart_data[lowIndex]?.date || '';

  // Current price position in range (0-100%)
  const rangePosition = ((closePrice - periodLow) / (periodHigh - periodLow) * 100).toFixed(0);

  return (
    <div className="bg-[#161b22] rounded-xl p-6 border border-gray-800">
      <h3 className="text-sm font-medium text-gray-400 mb-4">Period Statistics</h3>

      {/* Price Range Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Period Low</span>
          <span>Period High</span>
        </div>
        <div className="relative h-2 bg-gray-800 rounded-full">
          <div
            className="absolute h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
            style={{ width: '100%' }}
          />
          <div
            className="absolute w-3 h-3 bg-white rounded-full -top-0.5 transform -translate-x-1/2 shadow-lg border-2 border-gray-900"
            style={{ left: `${rangePosition}%` }}
          />
        </div>
        <div className="flex justify-between text-sm font-medium mt-2">
          <span className="text-red-400">${periodLow.toFixed(2)}</span>
          <span className="text-green-400">${periodHigh.toFixed(2)}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatItem
          label="Open"
          value={`$${openPrice.toFixed(2)}`}
        />
        <StatItem
          label="Close"
          value={`$${closePrice.toFixed(2)}`}
        />
        <StatItem
          label="Change"
          value={`${priceChange >= 0 ? '+' : ''}$${priceChange.toFixed(2)}`}
          subValue={`${priceChange >= 0 ? '+' : ''}${priceChangePercent}%`}
          isPositive={priceChange >= 0}
        />
        <StatItem
          label="Avg Price"
          value={`$${avgPrice}`}
        />
        <StatItem
          label="Period High"
          value={`$${periodHigh.toFixed(2)}`}
          subValue={highDate}
          isPositive={true}
        />
        <StatItem
          label="Period Low"
          value={`$${periodLow.toFixed(2)}`}
          subValue={lowDate}
          isPositive={false}
        />
        <StatItem
          label="Volatility"
          value={`${volatility}%`}
        />
        <StatItem
          label="Trading Days"
          value={tradingDays}
        />
      </div>
    </div>
  );
}

function StatItem({ label, value, subValue, isPositive }) {
  return (
    <div className="bg-[#0d1117] rounded-lg p-3">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className={`font-semibold ${isPositive === true ? 'text-green-400' : isPositive === false ? 'text-red-400' : 'text-white'}`}>
        {value}
      </p>
      {subValue && (
        <p className={`text-xs mt-0.5 ${isPositive === true ? 'text-green-400/70' : isPositive === false ? 'text-red-400/70' : 'text-gray-500'}`}>
          {subValue}
        </p>
      )}
    </div>
  );
}

// Calculate simple volatility (standard deviation as % of mean)
function calculateVolatility(prices) {
  if (prices.length < 2) return '0.00';

  const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
  const squaredDiffs = prices.map(p => Math.pow(p - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / squaredDiffs.length;
  const stdDev = Math.sqrt(avgSquaredDiff);
  const volatility = (stdDev / mean * 100).toFixed(2);

  return volatility;
}

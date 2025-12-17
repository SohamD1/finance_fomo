import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const INVESTMENT_TYPE_LABELS = {
  sp500: 'S&P 500',
  nasdaq: 'NASDAQ',
  dowjones: 'Dow Jones',
  russell2000: 'Russell 2000',
  bonds: 'Bonds',
  treasury: 'Treasury Bonds',
  corporate_bonds: 'Corporate Bonds',
  savings: 'Savings',
  money_market: 'Money Market',
  cd: 'CD',
  gold: 'Gold',
  silver: 'Silver',
  oil: 'Oil',
  reit: 'Real Estate (REIT)',
  bitcoin: 'Bitcoin',
  ethereum: 'Ethereum',
  msci_world: 'MSCI World',
  emerging_markets: 'Emerging Markets',
};

// Format investment type label, handling custom types
const formatInvestmentType = (type) => {
  if (INVESTMENT_TYPE_LABELS[type]) {
    return INVESTMENT_TYPE_LABELS[type];
  }
  // Format custom types (convert snake_case to Title Case)
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export default function InvestmentResultCard({ result, onClose }) {
  const {
    initial_amount,
    final_value,
    total_return_percentage,
    cagr,
    investment_type,
    years,
    start_date,
    explanation,
  } = result;

  const isPositive = total_return_percentage > 0;
  const profit = final_value - initial_amount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all relative"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded-full">
              {formatInvestmentType(investment_type)}
            </span>
            {isPositive && (
              <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-500">
                <span className="w-2 h-2 bg-green-600 dark:bg-green-500 rounded-full"></span>
                PROFIT
              </span>
            )}
          </div>
          <h3 className="text-gray-900 dark:text-white font-semibold text-lg leading-tight pr-8">{explanation}</h3>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">FINAL VALUE</div>
          <div className={`text-2xl font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            $<CountUp
              end={final_value}
              duration={2}
              separator=","
              decimals={2}
            />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">RETURN</div>
          <div className={`text-2xl font-bold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? '+' : ''}
            <CountUp
              end={total_return_percentage}
              duration={2}
              decimals={2}
            />
            %
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-lg p-2 border border-gray-200 dark:border-gray-700/50">
          <div className="text-xs text-gray-600 dark:text-gray-500 mb-1">CAGR</div>
          <div className={`text-lg font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? '+' : ''}
            <CountUp
              end={cagr}
              duration={2}
              decimals={2}
            />
            %
          </div>
        </div>
        <div className="bg-gray-50/50 dark:bg-gray-800/30 rounded-lg p-2 border border-gray-200 dark:border-gray-700/50">
          <div className="text-xs text-gray-600 dark:text-gray-500 mb-1">PROFIT/LOSS</div>
          <div className={`text-lg font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? '+' : ''}$
            <CountUp
              end={profit}
              duration={2}
              separator=","
              decimals={2}
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-500">
          <div className="flex items-center gap-4">
            <span>Initial: ${initial_amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            {years && <span>Period: {years} years</span>}
            {start_date && <span>From: {start_date}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


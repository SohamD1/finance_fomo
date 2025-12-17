import { motion } from 'framer-motion';
import { useState } from 'react';

export default function InvestmentCard({ investment }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    name,
    ticker,
    type,
    currentPrice,
    changePercent,
    marketCap,
    volume,
    previousClose,
    dayHigh,
    dayLow,
    yearHigh,
    yearLow,
  } = investment;

  const isPositive = changePercent >= 0;
  const changeColor = isPositive
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400';
  const bgColor = isPositive
    ? 'bg-green-50 dark:bg-green-900/20'
    : 'bg-red-50 dark:bg-red-900/20';

  const formatMarketCap = (cap) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  const formatVolume = (vol) => {
    if (!vol || vol === null) return 'N/A';
    if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`;
    if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`;
    if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K`;
    return vol.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{name}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">({ticker})</span>
          </div>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
            {type}
          </span>
        </div>
        {/* Performance Indicator */}
        <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {/* Main Stats */}
      <div className="space-y-3">
        {/* Price and Change */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              ${currentPrice.toFixed(2)}
            </div>
            <div className={`text-sm font-semibold ${changeColor} flex items-center gap-1`}>
              {isPositive ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {Math.abs(changePercent).toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Market Cap and Volume */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {marketCap ? formatMarketCap(marketCap) : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Volume</div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatVolume(volume)}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Previous Close</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                ${previousClose?.toFixed(2) || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Day Range</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                ${dayLow?.toFixed(2) || 'N/A'} - ${dayHigh?.toFixed(2) || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">52W High</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                ${yearHigh?.toFixed(2) || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">52W Low</div>
              <div className="font-semibold text-gray-900 dark:text-white">
                ${yearLow?.toFixed(2) || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}


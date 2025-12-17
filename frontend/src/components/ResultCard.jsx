import { useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';

export default function ResultCard({ result, onReset }) {
  const isProfit = result.profit > 0;

  useEffect(() => {
    if (isProfit) {
      // Fire confetti when there's a profit!
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#22c55e', '#a855f7', '#ec4899'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#22c55e', '#a855f7', '#ec4899'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isProfit]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-4xl mb-2 block">{isProfit ? '🤑' : '😢'}</span>
          <h2 className="text-xl font-semibold text-gray-300">
            If you bought <span className="text-purple-400 font-bold">${result.ticker}</span> options on{' '}
            <span className="text-pink-400">{result.purchase_date}</span>
          </h2>
        </div>

        {/* The Big Number */}
        <div className="text-center my-8">
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">You would have</p>
          <div className={`text-6xl font-black ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
            $<CountUp
              end={result.current_value}
              duration={2.5}
              separator=","
              decimals={2}
            />
          </div>
          <p className="text-gray-500 text-sm mt-2">
            from ${result.invested.toLocaleString()} invested
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Return</p>
            <p className={`text-2xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              {isProfit ? '+' : ''}{result.percent_gain}%
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Profit</p>
            <p className={`text-2xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              {isProfit ? '+' : ''}${result.profit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-400 border-t border-gray-700 pt-4">
          <div className="flex justify-between">
            <span>Stock price then:</span>
            <span className="text-white">${result.historical_price}</span>
          </div>
          <div className="flex justify-between">
            <span>Stock price now:</span>
            <span className="text-white">${result.current_price}</span>
          </div>
          <div className="flex justify-between">
            <span>Option premium:</span>
            <span className="text-white">${result.option_premium}/share</span>
          </div>
          <div className="flex justify-between">
            <span>Contracts purchased:</span>
            <span className="text-white">{result.contracts_purchased}</span>
          </div>
        </div>

        {/* Snarky Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-6 text-center"
        >
          <p className="text-gray-500 italic text-sm">
            {isProfit
              ? "Hope that doesn't keep you up at night. 😈"
              : "Well, at least you didn't lose money... oh wait."}
          </p>
        </motion.div>

        {/* Try Again Button */}
        <button
          onClick={onReset}
          className="w-full mt-6 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors"
        >
          Hurt Me Again
        </button>
      </div>
    </motion.div>
  );
}

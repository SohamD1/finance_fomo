import { useEffect } from 'react';
import CountUp from 'react-countup';
import confetti from 'canvas-confetti';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function InvestmentPanel({
  ticker,
  setTicker,
  date,
  setDate,
  amount,
  setAmount,
  onSubmit,
  loading,
  result,
  error,
  maxDate,
}) {
  const isProfit = result?.profit > 0;

  useEffect(() => {
    if (isProfit && result) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#10b981', '#34d399'],
      });
    }
  }, [result, isProfit]);

  const quickAmounts = [100, 500, 1000, 5000];

  // Convert string date to Date object for DatePicker
  const selectedDate = date ? new Date(date + 'T00:00:00') : null;
  const maxDateObj = maxDate ? new Date(maxDate + 'T00:00:00') : new Date();

  const handleDateChange = (dateObj) => {
    if (dateObj) {
      // Convert Date object back to YYYY-MM-DD string
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    } else {
      setDate('');
    }
  };

  return (
    <div className="bg-[#161b22] rounded-xl border border-gray-800 overflow-hidden">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-gray-800">
        <h3 className="font-semibold text-white">Calculate FOMO</h3>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="p-4 space-y-4">
        {/* Ticker Input */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Stock Ticker</label>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            placeholder="AAPL"
            className="w-full px-3 py-2.5 bg-[#0d1117] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
        </div>

        {/* Date Input - Custom DatePicker */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Purchase Date</label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            maxDate={maxDateObj}
            minDate={new Date('2000-01-01')}
            dateFormat="MMM d, yyyy"
            placeholderText="Select a date"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            calendarClassName="fomo-calendar"
            className="w-full px-3 py-2.5 bg-[#0d1117] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            wrapperClassName="w-full"
            required
          />
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Investment Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              min="1"
              className="w-full pl-7 pr-3 py-2.5 bg-[#0d1117] border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
          {/* Quick Amount Buttons */}
          <div className="flex gap-2 mt-2">
            {quickAmounts.map((qa) => (
              <button
                key={qa}
                type="button"
                onClick={() => setAmount(qa.toString())}
                className="flex-1 py-1.5 text-xs font-medium bg-[#0d1117] border border-gray-700 rounded-lg text-gray-400 hover:border-gray-500 hover:text-white transition-colors"
              >
                ${qa >= 1000 ? `${qa / 1000}k` : qa}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Calculating...
            </span>
          ) : (
            'Calculate'
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </form>

      {/* Results */}
      {result && (
        <div className="p-4 border-t border-gray-800 space-y-4">
          {/* Main Result */}
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm mb-1">Your ${result.invested} would be worth</p>
            <div className={`text-4xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              $<CountUp end={result.current_value} duration={1.5} separator="," decimals={2} />
            </div>
            <p className={`text-sm mt-1 ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              {isProfit ? '+' : ''}{result.profit.toLocaleString()} ({isProfit ? '+' : ''}{result.percent_gain}%)
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-[#0d1117] rounded-lg p-3">
              <p className="text-gray-500 text-xs">Shares</p>
              <p className="text-white font-medium">{result.shares_bought}</p>
            </div>
            <div className="bg-[#0d1117] rounded-lg p-3">
              <p className="text-gray-500 text-xs">Entry Price</p>
              <p className="text-white font-medium">${result.historical_price}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

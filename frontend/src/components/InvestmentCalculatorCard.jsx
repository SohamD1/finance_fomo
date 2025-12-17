import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Expanded investment types list
const INVESTMENT_TYPES = {
  'S&P 500': { value: 'sp500', description: 'Broad US stock market index', category: 'Stocks' },
  'NASDAQ': { value: 'nasdaq', description: 'Technology-focused stock index', category: 'Stocks' },
  'Dow Jones': { value: 'dowjones', description: '30 large US companies', category: 'Stocks' },
  'Russell 2000': { value: 'russell2000', description: 'Small-cap US stocks', category: 'Stocks' },
  'Bonds': { value: 'bonds', description: 'Fixed income securities', category: 'Fixed Income' },
  'Treasury Bonds': { value: 'treasury', description: 'US government bonds', category: 'Fixed Income' },
  'Corporate Bonds': { value: 'corporate_bonds', description: 'Company-issued bonds', category: 'Fixed Income' },
  'Savings': { value: 'savings', description: 'High-yield savings account', category: 'Cash' },
  'Money Market': { value: 'money_market', description: 'Money market account', category: 'Cash' },
  'CD (Certificate of Deposit)': { value: 'cd', description: 'Certificate of deposit', category: 'Cash' },
  'Gold': { value: 'gold', description: 'Gold investment', category: 'Commodities' },
  'Silver': { value: 'silver', description: 'Silver investment', category: 'Commodities' },
  'Oil': { value: 'oil', description: 'Crude oil investment', category: 'Commodities' },
  'Real Estate (REIT)': { value: 'reit', description: 'Real estate investment trust', category: 'Real Estate' },
  'Cryptocurrency (Bitcoin)': { value: 'bitcoin', description: 'Bitcoin investment', category: 'Crypto' },
  'Cryptocurrency (Ethereum)': { value: 'ethereum', description: 'Ethereum investment', category: 'Crypto' },
  'International Stocks (MSCI World)': { value: 'msci_world', description: 'Global stock index', category: 'International' },
  'Emerging Markets': { value: 'emerging_markets', description: 'Emerging market stocks', category: 'International' },
};

export default function InvestmentCalculatorCard({ onCalculate }) {
  const [formData, setFormData] = useState({
    amount: '',
    investmentType: 'sp500',
    startDate: '',
    years: '',
    useYears: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customType, setCustomType] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter investment types based on search
  const filteredTypes = Object.entries(INVESTMENT_TYPES).filter(([label, data]) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      label.toLowerCase().includes(searchLower) ||
      data.description.toLowerCase().includes(searchLower) ||
      data.category.toLowerCase().includes(searchLower)
    );
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError(null);
  };

  const handleTypeSelect = (value, label) => {
    setFormData((prev) => ({ ...prev, investmentType: value }));
    setSearchQuery(label);
    setIsDropdownOpen(false);
    setCustomType('');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsDropdownOpen(true);
    
    // If user types something not in the list, allow custom input
    if (value && !Object.values(INVESTMENT_TYPES).some(type => type.value === value.toLowerCase().replace(/\s+/g, '_'))) {
      setCustomType(value);
    } else {
      setCustomType('');
    }
  };

  const handleCustomTypeSubmit = () => {
    if (customType.trim()) {
      // Convert custom type to a format the backend might accept
      const customValue = customType.toLowerCase().replace(/\s+/g, '_');
      setFormData((prev) => ({ ...prev, investmentType: customValue }));
      setIsDropdownOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid investment amount');
      return;
    }

    if (formData.useYears) {
      if (!formData.years || parseFloat(formData.years) <= 0) {
        setError('Please enter a valid number of years');
        return;
      }
    } else {
      if (!formData.startDate) {
        setError('Please select a start date');
        return;
      }
    }

    setLoading(true);

    // Prepare data for API
    const submitData = {
      amount: parseFloat(formData.amount),
      investment_type: formData.investmentType,
    };

    if (formData.useYears) {
      submitData.years = parseFloat(formData.years);
    } else {
      submitData.start_date = formData.startDate;
    }

    try {
      await onCalculate(submitData);
      // Reset form after successful calculation
      setFormData({
        amount: '',
        investmentType: 'sp500',
        startDate: '',
        years: '',
        useYears: false,
      });
      setSearchQuery('');
      setCustomType('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);
  const minDateString = minDate.toISOString().split('T')[0];

  // Get display label for selected type
  const selectedLabel = Object.entries(INVESTMENT_TYPES).find(
    ([_, data]) => data.value === formData.investmentType
  )?.[0] || formData.investmentType;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
    >
      <h3 className="text-gray-900 dark:text-white font-semibold text-xl mb-4">Calculate Your Investment</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Investment Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Initial Investment
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              placeholder="10,000"
              min="1"
              step="0.01"
              className="w-full pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Investment Type - Searchable Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Investment Type
          </label>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery || selectedLabel}
              onChange={handleSearchChange}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search or type investment type..."
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Dropdown */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto"
              >
                {/* Search Results */}
                {filteredTypes.length > 0 ? (
                  <div className="py-2">
                    {filteredTypes.map(([label, data]) => (
                      <button
                        key={data.value}
                        type="button"
                        onClick={() => handleTypeSelect(data.value, label)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          formData.investmentType === data.value ? 'bg-gray-100 dark:bg-gray-700/50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-gray-900 dark:text-white font-medium">{label}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{data.description}</div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">{data.category}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 px-4 text-gray-600 dark:text-gray-400 text-sm text-center">
                    No matching investment types found
                  </div>
                )}

                {/* Custom Type Option */}
                {customType && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 px-2">Custom Investment Type</div>
                    <button
                      type="button"
                      onClick={handleCustomTypeSubmit}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded"
                    >
                      <div className="text-gray-900 dark:text-white font-medium">Use: "{customType}"</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Note: Backend must support this investment type
                      </div>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Date or Years Toggle */}
        <div>
          <label className="flex items-center gap-2 mb-2 cursor-pointer">
            <input
              type="checkbox"
              name="useYears"
              checked={formData.useYears}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Use number of years</span>
          </label>

          {formData.useYears ? (
            <input
              name="years"
              type="number"
              value={formData.years}
              onChange={handleChange}
              placeholder="30"
              min="1"
              max="100"
              step="1"
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={formData.useYears}
            />
          ) : (
            <input
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              min={minDateString}
              max={today}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={!formData.useYears}
            />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg text-red-800 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : 'Calculate →'}
        </button>
      </form>
    </motion.div>
  );
}

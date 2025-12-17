import { useState, useMemo } from 'react';
import Navigation from './components/Navigation';
import InvestmentCard from './components/InvestmentCard';
import { mockInvestments } from './data/mockInvestments';

function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFilter, setSelectedFilter] = useState('Trending');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Map investment types to categories for filtering
  const investmentTypeToCategory = {
    Stock: 'Stocks',
    ETF: 'Stocks',
    Crypto: 'Crypto',
    Bond: 'Fixed Income',
    'Bond ETF': 'Fixed Income',
    'Mutual Fund': 'Mutual Funds',
  };

  // Filter investments based on selected category
  const filteredInvestments = useMemo(() => {
    if (!mockInvestments || mockInvestments.length === 0) {
      return [];
    }
    let filtered = mockInvestments;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((investment) => {
        const category = investmentTypeToCategory[investment.type] || 'Other';
        return category === selectedCategory;
      });
    }

    // Filter by type (Trending, Popular, etc.)
    if (selectedFilter === 'Top Gainers') {
      filtered = filtered.filter((inv) => inv.changePercent > 0);
    } else if (selectedFilter === 'Top Losers') {
      filtered = filtered.filter((inv) => inv.changePercent < 0);
    } else if (selectedFilter === 'Popular') {
      // Sort by volume for popular
      filtered = [...filtered].sort((a, b) => (b.volume || 0) - (a.volume || 0));
    }

    // Sort investments
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.currentPrice - b.currentPrice;
          break;
        case 'change':
          comparison = a.changePercent - b.changePercent;
          break;
        case 'marketCap':
          comparison = (a.marketCap || 0) - (b.marketCap || 0);
          break;
        case 'volume':
          comparison = (a.volume || 0) - (b.volume || 0);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [selectedCategory, selectedFilter, sortBy, sortOrder]);

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navigation
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Investment Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedCategory === 'All'
                  ? 'All investments'
                  : `${selectedCategory}`} • {filteredInvestments.length} {filteredInvestments.length === 1 ? 'investment' : 'investments'}
              </p>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
              <div className="flex gap-1">
                {['name', 'price', 'change', 'marketCap', 'volume'].map((column) => (
                  <button
                    key={column}
                    onClick={() => handleSort(column)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                      sortBy === column
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                    {getSortIcon(column)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Investment Grid */}
        {filteredInvestments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredInvestments.map((investment) => (
              <InvestmentCard key={investment.id} investment={investment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-500 text-lg">
              No investments found for the selected filters. Try selecting a different category or filter.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-500">
            <div className="mb-4 md:mb-0">
              <p>© 2025 Finance FOMO</p>
            </div>
            <div className="flex flex-wrap gap-6 justify-center">
              <span className="hover:text-gray-700 dark:hover:text-gray-400 transition-colors cursor-pointer">
                Privacy Policy
              </span>
              <span className="hover:text-gray-700 dark:hover:text-gray-400 transition-colors cursor-pointer">
                Terms of Service
              </span>
              <span className="hover:text-gray-700 dark:hover:text-gray-400 transition-colors cursor-pointer">
                Help Center
              </span>
            </div>
          </div>
          <div className="mt-6 text-xs text-gray-500 dark:text-gray-600 text-center">
            <p>
              Market data is for informational purposes only. Past performance does not guarantee future results.
              This is not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

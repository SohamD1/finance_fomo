// Mock news data - in production, you'd fetch from a news API
const mockNews = {
  AAPL: [
    { id: 1, title: "Apple announces new AI features for iPhone", source: "TechCrunch", time: "2h ago", thumbnail: "https://picsum.photos/seed/apple1/80/60" },
    { id: 2, title: "Services revenue hits all-time high", source: "Bloomberg", time: "5h ago", thumbnail: "https://picsum.photos/seed/apple2/80/60" },
    { id: 3, title: "Analyst upgrades AAPL to buy rating", source: "CNBC", time: "1d ago", thumbnail: "https://picsum.photos/seed/apple3/80/60" },
  ],
  TSLA: [
    { id: 1, title: "Tesla Cybertruck deliveries accelerate", source: "Electrek", time: "3h ago", thumbnail: "https://picsum.photos/seed/tsla1/80/60" },
    { id: 2, title: "Musk announces new factory plans", source: "Reuters", time: "6h ago", thumbnail: "https://picsum.photos/seed/tsla2/80/60" },
    { id: 3, title: "EV market share continues growth", source: "Bloomberg", time: "1d ago", thumbnail: "https://picsum.photos/seed/tsla3/80/60" },
  ],
  NVDA: [
    { id: 1, title: "NVIDIA unveils next-gen AI chips", source: "The Verge", time: "1h ago", thumbnail: "https://picsum.photos/seed/nvda1/80/60" },
    { id: 2, title: "Data center demand exceeds expectations", source: "WSJ", time: "4h ago", thumbnail: "https://picsum.photos/seed/nvda2/80/60" },
    { id: 3, title: "Stock hits new all-time high", source: "MarketWatch", time: "8h ago", thumbnail: "https://picsum.photos/seed/nvda3/80/60" },
  ],
  AMZN: [
    { id: 1, title: "AWS announces new cloud services", source: "TechCrunch", time: "2h ago", thumbnail: "https://picsum.photos/seed/amzn1/80/60" },
    { id: 2, title: "Prime membership growth accelerates", source: "CNBC", time: "5h ago", thumbnail: "https://picsum.photos/seed/amzn2/80/60" },
    { id: 3, title: "Holiday shopping season forecast positive", source: "Reuters", time: "1d ago", thumbnail: "https://picsum.photos/seed/amzn3/80/60" },
  ],
  DEFAULT: [
    { id: 1, title: "Markets rally on economic data", source: "Bloomberg", time: "1h ago", thumbnail: "https://picsum.photos/seed/market1/80/60" },
    { id: 2, title: "Fed signals rate decision ahead", source: "WSJ", time: "3h ago", thumbnail: "https://picsum.photos/seed/market2/80/60" },
    { id: 3, title: "Tech sector leads market gains", source: "CNBC", time: "6h ago", thumbnail: "https://picsum.photos/seed/market3/80/60" },
  ],
};

export default function NewsSection({ ticker }) {
  const news = mockNews[ticker] || mockNews.DEFAULT;

  return (
    <div className="bg-[#161b22] rounded-xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
        <h3 className="font-semibold text-white">Market Context</h3>
        {ticker && (
          <span className="text-xs text-gray-500 uppercase">{ticker}</span>
        )}
      </div>

      {/* News Items */}
      <div className="divide-y divide-gray-800">
        {news.map((item) => (
          <div
            key={item.id}
            className="p-3 hover:bg-[#1c2128] transition-colors cursor-pointer"
          >
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-16 h-12 object-cover rounded-lg bg-gray-800"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium line-clamp-2 leading-snug">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{item.source}</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-800">
        <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
          View all news →
        </button>
      </div>
    </div>
  );
}

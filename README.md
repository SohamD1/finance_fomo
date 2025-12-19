# FOMO Calculator

A web app that shows how much money you would have made if you'd invested in a stock at a specific date.


<img width="1312" height="1035" alt="Screenshot 2025-12-19 115228" src="https://github.com/user-attachments/assets/075df85c-51ea-41d2-a530-c6bab3e812b8" />

![Stack](https://img.shields.io/badge/Rails-API-red) ![Stack](https://img.shields.io/badge/React-Vite-blue) ![Stack](https://img.shields.io/badge/Tailwind-CSS-teal)

## Stack

**Backend:** Ruby on Rails (API mode)
**Frontend:** React + Vite + Tailwind CSS
**Data:** Yahoo Finance API

## Backend Implementation

The Rails backend handles all the financial data fetching and calculations:

```
backend/
├── app/
│   ├── controllers/
│   │   └── fomo_controller.rb    # POST /api/calculate endpoint
│   └── services/
│       └── market_data_service.rb # Yahoo Finance API integration
```

**Key Features:**
- `MarketDataService` - Fetches historical & current stock prices from Yahoo Finance using HTTParty with browser-like headers to avoid 403s
- Handles weekends/holidays by looking backwards to find the last trading day
- Returns full price history for charting

**API Endpoint:**
```bash
POST /api/calculate
{
  "ticker": "AAPL",
  "date": "2024-01-15",
  "amount": 1000
}
```

## Frontend Design

Dark theme UI inspired by Polymarket, built with React and Tailwind:

```
frontend/src/
├── components/
│   ├── StockChart.jsx      # Recharts area chart (green/red based on P/L)
│   ├── InvestmentPanel.jsx # Form + results + confetti on profit
│   ├── StockStats.jsx      # Period high/low, volatility, etc.
│   └── NewsSection.jsx     # Market context sidebar
```

**Libraries:**
- `recharts` - Price chart visualization
- `react-datepicker` - Custom dark-themed calendar
- `react-countup` - Animated number transitions
- `canvas-confetti` - Celebration effect on gains
- `framer-motion` - Smooth animations

## Run Locally

```bash
# Backend (Terminal 1)
cd backend
bundle install
rails server

# Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

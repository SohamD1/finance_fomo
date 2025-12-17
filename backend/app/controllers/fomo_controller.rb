class FomoController < ApplicationController
  def calculate
    ticker = params[:ticker]&.upcase
    date_string = params[:date]
    amount = params[:amount].to_f

    # Validate inputs
    if ticker.blank? || date_string.blank? || amount <= 0
      return render json: { error: "Missing required parameters: ticker, date, and amount (positive)" }, status: :bad_request
    end

    # 1. Fetch historical price (the day you "should have" bought)
    historical_price = MarketDataService.get_price(ticker, date_string)
    if historical_price.nil?
      return render json: { error: "Could not fetch historical price for #{ticker} on #{date_string}" }, status: :unprocessable_entity
    end

    # 2. Fetch current price
    current_price = MarketDataService.current_price(ticker)
    if current_price.nil?
      return render json: { error: "Could not fetch current price for #{ticker}" }, status: :unprocessable_entity
    end

    # 3. Simulate ATM (At The Money) Call Option purchase
    # Strike price = historical price (ATM means strike ≈ stock price)
    strike_price = historical_price

    # Calculate time from purchase date to now (in years)
    purchase_date = Time.parse(date_string)
    time_to_expiry = [(Time.now - purchase_date) / (365.25 * 24 * 60 * 60), 0.01].max

    # Calculate what the option premium would have been at purchase time
    # Using Black-Scholes with the historical price
    option_premium = OptionPricer.call_price(
      s: historical_price,
      k: strike_price,
      t: time_to_expiry
    )

    # Ensure we have a valid premium
    if option_premium <= 0
      option_premium = historical_price * 0.15 # Fallback: ~15% of stock price
    end

    # 4. Calculate how many contracts you could have bought
    contracts = OptionPricer.contracts_purchasable(amount: amount, premium_per_share: option_premium)

    if contracts <= 0
      return render json: {
        error: "Investment amount too small. Option premium was $#{option_premium}/share ($#{(option_premium * 100).round(2)}/contract)"
      }, status: :unprocessable_entity
    end

    # 5. Calculate current value (intrinsic value only - option has "expired" ITM)
    intrinsic_per_share = OptionPricer.intrinsic_value(
      current_price: current_price,
      strike_price: strike_price
    )

    # Total value = intrinsic value per share × 100 shares × number of contracts
    current_value = (intrinsic_per_share * 100 * contracts).round(2)
    actual_invested = (option_premium * 100 * contracts).round(2)

    # Calculate gain
    profit = current_value - actual_invested
    percent_gain = actual_invested > 0 ? ((profit / actual_invested) * 100).round(2) : 0

    render json: {
      ticker: ticker,
      purchase_date: date_string,
      historical_price: historical_price,
      current_price: current_price,
      strike_price: strike_price,
      option_premium: option_premium,
      contracts_purchased: contracts,
      invested: actual_invested,
      current_value: current_value,
      profit: profit.round(2),
      percent_gain: percent_gain
    }
  end
end

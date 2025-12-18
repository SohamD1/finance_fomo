class FomoController < ApplicationController
  def calculate
    ticker = params[:ticker]&.upcase
    date_string = params[:date]
    amount = params[:amount].to_f

    # Validate inputs
    if ticker.blank? || date_string.blank? || amount <= 0
      return render json: { error: "Missing required parameters: ticker, date, and amount (positive)" }, status: :bad_request
    end

    # 1. Fetch historical price (handles weekends by looking back to Friday)
    historical_price = MarketDataService.get_price(ticker, date_string)
    if historical_price.nil?
      return render json: { error: "Could not fetch historical price for #{ticker} on #{date_string}" }, status: :unprocessable_entity
    end

    # 2. Fetch current price
    current_price = MarketDataService.current_price(ticker)
    if current_price.nil?
      return render json: { error: "Could not fetch current price for #{ticker}" }, status: :unprocessable_entity
    end

    # 3. Calculate investment growth
    # How many shares could you have bought?
    shares_bought = amount / historical_price

    # What would those shares be worth today?
    current_value = (shares_bought * current_price).round(2)

    # Profit/Loss
    profit = (current_value - amount).round(2)
    percent_gain = ((current_price - historical_price) / historical_price * 100).round(2)

    render json: {
      ticker: ticker,
      purchase_date: date_string,
      historical_price: historical_price,
      current_price: current_price,
      shares_bought: shares_bought.round(4),
      invested: amount.round(2),
      current_value: current_value,
      profit: profit,
      percent_gain: percent_gain
    }
  end
end

require 'prime'
require 'distribution'

class OptionPricer
  # Default parameters
  DEFAULT_VOLATILITY = 0.6
  DEFAULT_RISK_FREE_RATE = 0.04

  # Black-Scholes Call Option Price
  # S = Current stock price
  # K = Strike price
  # T = Time to expiration in years
  # sigma = Volatility (annualized)
  # r = Risk-free interest rate
  def self.call_price(s:, k:, t:, sigma: DEFAULT_VOLATILITY, r: DEFAULT_RISK_FREE_RATE)
    return 0.0 if t <= 0 || s <= 0 || k <= 0

    d1 = (Math.log(s / k) + (r + (sigma**2) / 2.0) * t) / (sigma * Math.sqrt(t))
    d2 = d1 - sigma * Math.sqrt(t)

    # N(d) = cumulative distribution function of the standard normal distribution
    n_d1 = Distribution::Normal.cdf(d1)
    n_d2 = Distribution::Normal.cdf(d2)

    call = s * n_d1 - k * Math.exp(-r * t) * n_d2
    call.round(2)
  end

  # Calculate intrinsic value of a call option (for FOMO purposes)
  # This is max(current_price - strike_price, 0)
  def self.intrinsic_value(current_price:, strike_price:)
    [current_price - strike_price, 0].max.round(2)
  end

  # Calculate how many contracts you could buy with a given amount
  # Option premium is the cost per share, contracts are 100 shares each
  def self.contracts_purchasable(amount:, premium_per_share:)
    return 0 if premium_per_share <= 0
    cost_per_contract = premium_per_share * 100
    (amount / cost_per_contract).floor
  end
end

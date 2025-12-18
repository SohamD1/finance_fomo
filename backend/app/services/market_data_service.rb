class MarketDataService
  include HTTParty
  base_uri 'https://query1.finance.yahoo.com/v8/finance/chart'

  def self.get_price(ticker, date_string)
    target_date = Time.parse(date_string)
    target_time = target_date.to_i

    # Look backwards 5 days to handle weekends/holidays (get Friday's price)
    period1 = target_time - (5 * 24 * 60 * 60)
    period2 = target_time + (1 * 24 * 60 * 60) # +1 day to include target date

    options = {
      query: {
        period1: period1,
        period2: period2,
        interval: '1d'
      },
      headers: {
        "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      }
    }

    response = get("/#{ticker}", options)

    unless response.success?
      puts "❌ API Error: #{response.code}"
      puts "❌ Message: #{response.body}"
      return nil
    end

    begin
      result = response.parsed_response['chart']['result'][0]
      prices = result['indicators']['adjclose'][0]['adjclose'].compact

      # Get the LAST price in the window (closest to or on the target date)
      price = prices.last

      puts "✅ Found price for #{ticker}: $#{price}"
      return price.round(2)
    rescue => e
      puts "⚠️ Data Parsing Error: #{e.message}"
      return nil
    end
  end

  def self.current_price(ticker)
    # For current price, look backwards from today (not forward)
    now = Time.now.to_i
    period1 = now - (5 * 24 * 60 * 60) # -5 days
    period2 = now

    options = {
      query: {
        period1: period1,
        period2: period2,
        interval: '1d'
      },
      headers: {
        "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
      }
    }

    response = get("/#{ticker}", options)

    unless response.success?
      puts "❌ API Error (current): #{response.code}"
      puts "❌ Message: #{response.body}"
      return nil
    end

    begin
      result = response.parsed_response['chart']['result'][0]
      # Get the LAST price in the array (most recent)
      prices = result['indicators']['adjclose'][0]['adjclose'].compact
      price = prices.last
      puts "✅ Found current price for #{ticker}: $#{price}"
      return price.round(2)
    rescue => e
      puts "⚠️ Data Parsing Error (current): #{e.message}"
      return nil
    end
  end
end
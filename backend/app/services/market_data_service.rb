class MarketDataService
  include HTTParty
  base_uri 'https://query1.finance.yahoo.com/v8/finance/chart'

  def self.get_price(ticker, date_string)
    target_time = Time.parse(date_string).to_i
    period1 = target_time
    period2 = target_time + (5 * 24 * 60 * 60) # +5 days

    # 1. ADD HEADERS (Fake being a browser)
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

    # 2. DEBUGGING: Print why it failed if it fails
    unless response.success?
      puts "❌ API Error: #{response.code}"
      puts "❌ Message: #{response.body}"
      return nil
    end

    begin
      result = response.parsed_response['chart']['result'][0]
      price = result['indicators']['adjclose'][0]['adjclose'][0]
      
      # 3. DEBUGGING: Print success
      puts "✅ Found price for #{ticker}: $#{price}"
      return price.round(2)
    rescue => e
      puts "⚠️ Data Parsing Error: #{e.message}"
      # Sometimes the first day in the window is nil (holiday), check the next one
      begin
        price = result['indicators']['adjclose'][0]['adjclose'].compact.first
        puts "✅ Found price (backup) for #{ticker}: $#{price}"
        return price.round(2)
      rescue
        return nil
      end
    end
  end

  def self.current_price(ticker)
    get_price(ticker, Time.now.to_s)
  end
end
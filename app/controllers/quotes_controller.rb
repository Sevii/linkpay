class QuotesController < ApplicationController
  include HTTParty

  def new
    @quote = Quote.new
    result = HTTParty.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    if result.code == 200 then
        @quote.currency_to_usd = result["bitcoin"]["usd"]
    else 
        return 500
    end

    @quote.expiration = Time.now + 15.minutes
    @quote.currency = params["currency"]
    @quote.inovice = Inovice.find(params[:inovice])
    @quote.currency_amount = currency_amount(@quote.currency, @quote.inovice.usd_price, @quote.currency_to_usd)

    print 

    if @quote.save
      render :json => @quote.to_json
    else
      render :json => {error: "Unable to save quote", status: "500"}.to_json
    end
  end

  def currency_amount(currency, usd_price, currency_to_usd)
    if currency == "bitcoin" then
      return bitcoin_amount(usd_price, currency_to_usd)
    else
       raise "Unsuportted Currency"
    end

  end

  def bitcoin_amount(usd_price, currency_to_usd)

    puts "usd_price"
    puts usd_price
    puts "currency_to_usd"
    puts currency_to_usd

    return (usd_price.to_f ) / (currency_to_usd.to_f * 100)
  end


  private
    def quote_params
      params.require(:inovice).permit(:currency)
    end
end

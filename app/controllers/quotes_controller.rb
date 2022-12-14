class QuotesController < ApplicationController
    include HTTParty

  def paid
    @quote = Quote.find(params[:id])
    puts @quote.inspect
    if @quote.paid then 
      redirect_to complete_path @quote.order_id
    else
      render error: {error: "No order found"}, status: 404
    end
  end  

  def new
    @quote = Quote.new
    result = HTTParty.get("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd")
    if result.code == 200 then
        @quote.currency_to_usd = result["bitcoin"]["usd"]
    else 
        return 500
    end
    @quote.paid = false
    @quote.expiration = Time.now + 15.minutes
    @quote.currency = params["currency"]
    @quote.inovice = Inovice.find(params[:inovice])
    @quote.currency_amount = currency_amount(@quote.currency, @quote.inovice.usd_price, @quote.currency_to_usd)
    @quote.customer_email = params[:customer_email]

    # address is used to match the payment on the blockchain
    if @quote.currency == "bitcoin" then
      @quote.address = @quote.inovice.user.bitcoin_address
    else
      @quote.address = @quote.inovice.user.ethereum_address
    end

    if @quote.save
      TrackPaymentJob.perform_later(@quote)
      render :json => @quote.to_json
    else
      render :json => {error: "Unable to save quote", status: "500"}.to_json
    end
  end

  def currency_amount(currency, usd_price, currency_to_usd)
    if currency == "bitcoin" then
      return bitcoin_amount(usd_price, currency_to_usd)
    else
       raise "Unsupported Currency"
    end

  end

  def bitcoin_amount(usd_price, currency_to_usd)

    puts "usd_price"
    puts usd_price
    puts "currency_to_usd"
    puts currency_to_usd

    return (usd_price.to_f * 100000000 ) / (currency_to_usd.to_f * 100)
  end


  private
    def quote_params
      params.require(:inovice).permit(:currency, :customer_email, :currency)
    end
end

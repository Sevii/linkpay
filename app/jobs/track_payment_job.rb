class TrackPaymentJob < ApplicationJob
    include HTTParty


  queue_as :default
  # Input Quote type
  # Output Order complete or expires the quote
  def perform(quote)

    urlBase = Rails.configuration.x.blockcypher.api
    addressUrl = urlBase + "addrs/" + quote.address 
    addressStatus = HTTParty.get(addressUrl)


    # print addressStatus["txrefs"]
    # puts quote.currency_amount
    amountCur = quote.currency_amount
    addressStatus["txrefs"].each do |ref| 
      puts ref["value"]
      puts amountCur

      if ref["value"] == amountCur then
        # found matching transaction
      end
    end
    puts "hello"
  end
end

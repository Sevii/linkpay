class TrackPaymentJob < ApplicationJob
    include HTTParty
  class TransactionNotFoundError < StandardError; end
  retry_on TransactionNotFoundError, wait: 30.seconds, attempts: 10

  queue_as :default

  def getInputAddresses(transaction)
    addresses = []
    if transaction["inputs"].present? then
      transaction["inputs"].each do |input| 
        if input["addresses"].present? then
          input["addresses"].each do |address| 
            addresses.push(address)
          end
        end
      end
    end
    return addresses
  end

  # Input Quote type
  # Output Order complete or expires the quote
  def perform(quote)
    transaction = ""
    urlBase = Rails.configuration.x.blockcypher.api
    addressUrl = urlBase + "addrs/" + quote.address 
    addressStatus = HTTParty.get(addressUrl)
    puts addressStatus

    # print addressStatus["txrefs"]
    # puts quote.currency_amount
    amountCur = quote.currency_amount
    addressStatus["txrefs"].each do |ref| 
      puts ref["value"]
      puts amountCur

      if ref["value"] == amountCur then
        # found matching transaction
        puts "found confirmed match"
        # confirmationTime = ref["confirmation"].to_datetime
        transaction = ref["tx_hash"]
        # puts confirmationTime

      end
    end

    if addressStatus["unconfirmed_txrefs"].present? then
      addressStatus["unconfirmed_txrefs"].each do |unconfirmed| 
        if unconfirmed["value"] == amountCur then
          # found matching transaction
          puts "found confirmed match"
          confirmationTime = unconfirmed["received"].to_datetime
          puts confirmationTime
          transaction = unconfirmed["tx_hash"]

        end
      end
    end

    if transaction.empty? then
      raise TransactionNotFoundError
    end

    #curl https://api.blockcypher.com/v1/btc/test3/txs/ac2da060542dc11df2ace1a8acfecf9e24b392a52e7fd6222dff28cdbe50f26e
    urlBase = Rails.configuration.x.blockcypher.api
    txnUrl = urlBase + "txs/" + transaction 
    txnStatus = HTTParty.get(txnUrl)
    puts txnStatus
    if txnStatus["outputs"].present? then
      txnStatus["outputs"].each do |output| 
        txnOutputValue = output["value"]
        if txnOutputValue == amountCur then
          puts output["addresses"][0]
          foundAddress = output["addresses"][0]
          if foundAddress.present? then
             puts "found txn output with the correct amount"
             
             fromAddress = getInputAddresses(txnStatus)[0]
             print fromAddress

             @order = Order.new(transaction_hash: transaction, inovice_id: quote.inovice_id, currency_amount: txnOutputValue, currency_to_usd: quote.currency_to_usd, customer_email: quote.customer_email, account: fromAddress, currency: quote.currency)
             @order.save
             quote.paid = true
             quote.order_id = @order.id
             quote.save
             OrderPlacedMailer.with(order: @order, inovice: quote.inovice).order_placed_email.deliver_now
             OrderPlacedMailer.with(order: @order, inovice: quote.inovice).order_confirmation_email.deliver_now
          end

        end
      end
    end


    puts "end"
  end
end

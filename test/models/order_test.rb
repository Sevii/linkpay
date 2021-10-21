require "test_helper"

class OrderTest < ActiveSupport::TestCase
  test "create and order with invalid currency" do
    order_params = { 
      :transaction_hash => "0x3c9bcb2537164d156f95e8154fad20cb36d10c7a0fa6075f122c760d2d00a22f", 
      :inovice_id => 1, 
      :currency_amount => 0.1, 
      :currency_to_usd => 1000, 
      :customer_email => "nick@sledgeworx.io", 
      :account => "0xe43e183d57BC3Ec9cE5e1509F4d91B8b36E3B5d1", 
      :currency => "butcoin" }
    @order = Order.new(order_params)
    assert_not @order.valid?
  end
end

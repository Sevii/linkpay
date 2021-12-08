class AddOrderToQuote2 < ActiveRecord::Migration[6.1]
  def change
    add_reference :quotes, :order, index: true
  end
end

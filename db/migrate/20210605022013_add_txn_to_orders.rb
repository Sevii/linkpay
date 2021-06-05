class AddTxnToOrders < ActiveRecord::Migration[6.1]
  def change
    add_column :orders, :transaction_timestamp, :date
    add_column :orders, :currency, :string
    add_column :orders, :currency_amount, :int
    add_column :orders, :customer_email, :string
    add_column :orders, :currency_to_usd, :int
  end
end

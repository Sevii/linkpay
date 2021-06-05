class ChangeCurrencyAmountInOrders < ActiveRecord::Migration[6.1]
     def change
     change_column :orders, :currency_amount, :integer, limit: 8
   end 
end

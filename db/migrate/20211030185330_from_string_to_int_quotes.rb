class FromStringToIntQuotes < ActiveRecord::Migration[6.1]
  def change
    remove_column :quotes, :currency_amount
    add_column :quotes, :currency_amount, :integer
  end
end

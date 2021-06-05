class AddUsdPriceToInovices < ActiveRecord::Migration[6.1]
  def change
    add_column :inovices, :usd_price, :int
    add_column :inovices, :owner_id, :int
    add_column :inovices, :price_in_usd, :boolean
  end
end

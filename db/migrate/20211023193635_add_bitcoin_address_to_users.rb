class AddBitcoinAddressToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :bitcoin_address, :string
  end
end

class AddEthereumAddressToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :ethereum_address, :string
  end
end

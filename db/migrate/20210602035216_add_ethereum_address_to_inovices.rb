class AddEthereumAddressToInovices < ActiveRecord::Migration[6.1]
  def change
    add_column :inovices, :ethereum_address, :string
  end
end

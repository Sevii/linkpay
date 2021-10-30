class AddAddressToQuotes < ActiveRecord::Migration[6.1]
  def change
    add_column :quotes, :address, :string
  end
end

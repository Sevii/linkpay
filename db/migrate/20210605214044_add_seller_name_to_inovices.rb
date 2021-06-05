class AddSellerNameToInovices < ActiveRecord::Migration[6.1]
  def change
    add_column :inovices, :seller_name, :string
  end
end

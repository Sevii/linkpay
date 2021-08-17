class AddAccountToOrder < ActiveRecord::Migration[6.1]
  def change
    add_column :orders, :account, :string
  end
end

class AddOwnerEmailToInovices < ActiveRecord::Migration[6.1]
  def change
    add_column :inovices, :owner_email, :string
  end
end

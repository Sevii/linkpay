class AddEmailToQuote < ActiveRecord::Migration[6.1]
  def change
    add_column :quotes, :customer_email, :string
  end
end

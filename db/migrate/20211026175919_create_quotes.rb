class CreateQuotes < ActiveRecord::Migration[6.1]
  def change
    create_table :quotes do |t|
      t.integer :inoviceId
      t.integer :currency_to_usd
      t.string :currency
      t.string :currency_amount
      t.date :expiration

      t.timestamps
    end
  end
end

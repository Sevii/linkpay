class CreateOrders < ActiveRecord::Migration[6.1]
  def change
    create_table :orders do |t|
      t.integer :inovice_id
      t.string :transaction_hash

      t.timestamps
    end
  end
end

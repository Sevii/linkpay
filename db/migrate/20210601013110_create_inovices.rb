class CreateInovices < ActiveRecord::Migration[6.1]
  def change
    create_table :inovices do |t|
      t.string :name
      t.integer :price

      t.timestamps
    end
  end
end

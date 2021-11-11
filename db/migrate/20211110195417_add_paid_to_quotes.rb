class AddPaidToQuotes < ActiveRecord::Migration[6.1]
    def change
    add_column :quotes, :paid, :boolean
  end
end

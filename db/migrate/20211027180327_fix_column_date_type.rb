class FixColumnDateType < ActiveRecord::Migration[6.1]
  def change
    change_column :quotes, :expiration, :datetime
  end
end

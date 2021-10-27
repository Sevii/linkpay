class FixColumnName < ActiveRecord::Migration[6.1]
  def change
    rename_column :quotes, :inoviceId, :inovice_id
  end
end

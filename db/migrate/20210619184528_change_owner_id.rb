class ChangeOwnerId < ActiveRecord::Migration[6.1]
  def change
    rename_column :inovices, :owner_id, :user_id
  end
end

class Order < ApplicationRecord
    belongs_to :inovice
    validates :inovice_id, presence: true
    validates :transaction_hash, presence: true
end

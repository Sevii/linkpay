class Order < ApplicationRecord
    belongs_to :inovice
    validates :inovice_id, presence: true
    validates :transaction_hash, presence: true
    

    SUPPORTED_CURRENCIES = %w(ethereum bitcoin)
    validates :currency, :inclusion => {:in => SUPPORTED_CURRENCIES}
end

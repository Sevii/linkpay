class Quote < ApplicationRecord
    belongs_to :inovice
    has_one :order
    validates :currency_to_usd, presence: true
    validates :expiration, presence: true
    validates :currency_amount, presence: true

    SUPPORTED_CURRENCIES = %w(ethereum bitcoin)
    validates :currency, :inclusion => {:in => SUPPORTED_CURRENCIES}
end

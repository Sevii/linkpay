class Inovice < ApplicationRecord
  validates :name, presence: true
  validates :ethereum_address, presence: true, length: { minimum: 42 }
  validates :usd_price, presence: true
end

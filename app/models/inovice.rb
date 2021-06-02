class Inovice < ApplicationRecord
  validates :name, presence: true
  validates :ethereum_address, presence: true, length: { minimum: 42 }
  validates :price, presence: true
end

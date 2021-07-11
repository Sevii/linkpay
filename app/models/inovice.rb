class Inovice < ApplicationRecord
  belongs_to :user
  has_many :orders
  has_one_attached :product_image

  validates :name, presence: true
  validates :ethereum_address, presence: true, length: { minimum: 42, maximum: 42 }
  validates :usd_price, presence: true
end

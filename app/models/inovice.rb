class Inovice < ApplicationRecord
  belongs_to :user
  has_many :orders
  has_many :quotes
  has_one_attached :product_image

  validates :name, presence: true
  validates :usd_price, presence: true
end

class User < ApplicationRecord
  has_many :inovices
  has_many :orders, :through => :inovices
  has_one_attached :logo
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable


  has_many :access_grants,
           class_name: 'Doorkeeper::AccessGrant',
           foreign_key: :resource_owner_id,
           dependent: :delete_all # or :destroy if you need callbacks

  has_many :access_tokens,
           class_name: 'Doorkeeper::AccessToken',
           foreign_key: :resource_owner_id,
           dependent: :delete_all # or :destroy if you need callbacks       


  validates :ethereum_address, length: { minimum: 42, maximum: 42 }, allow_blank: true
  validates :bitcoin_address, length: { minimum: 26, maximum: 42 }, allow_blank: true
end

class User < ApplicationRecord
  devise :database_authenticatable, :validatable, :rememberable

  has_many :documents, dependent: :destroy
end

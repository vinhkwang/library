class User < ApplicationRecord
  devise :database_authenticatable, :validatable, :rememberable
end

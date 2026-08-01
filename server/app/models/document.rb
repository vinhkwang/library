class Document < ApplicationRecord
  belongs_to :user
  has_one_attached :file

  validates :name, presence: true

  scope :visible_to, ->(user) { where(private: false).or(where(user_id: user.id)) }
end

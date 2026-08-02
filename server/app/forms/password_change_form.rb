class PasswordChangeForm
  include ActiveModel::Model

  attr_accessor :user, :current_password, :password, :password_confirmation

  validates :password, length: { minimum: 6 }
  validate :current_password_correct
  validate :password_confirmation_matches

  def save
    return false unless valid?

    user.update!(password: password, password_confirmation: password_confirmation)
    true
  end

  private

  def current_password_correct
    return if user&.valid_password?(current_password)

    errors.add(:current_password, "is incorrect")
  end

  def password_confirmation_matches
    return if password == password_confirmation

    errors.add(:password_confirmation, "doesn't match")
  end
end

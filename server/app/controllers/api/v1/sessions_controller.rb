class Api::V1::SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :create

  def show
    return render json: { error: "not authenticated" }, status: :unauthorized unless current_user

    render json: { user: user_json(current_user), csrf_token: form_authenticity_token }
  end

  def create
    user = User.find_by(email: params.dig(:user, :email).to_s.downcase)

    if user&.valid_password?(params.dig(:user, :password))
      sign_in(user)
      render json: { user: user_json(user), csrf_token: form_authenticity_token }
    else
      render json: { error: "invalid email or password" }, status: :unauthorized
    end
  end

  def destroy
    sign_out(:user)

    head :no_content
  end

  private

  def user_json(user)
    { id: user.id, email: user.email }
  end
end

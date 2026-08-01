class Api::V1::SessionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: :create

  def show
    return render json: { error: "not authenticated" }, status: :unauthorized unless current_user

    render json: { user: user_json(current_user), csrf_token: form_authenticity_token }
  end

  def create
    request.env["devise.allow_params_authentication"] = true
    user = warden.authenticate!(scope: :user)

    render json: { user: user_json(user), csrf_token: form_authenticity_token }
  end

  def destroy
    sign_out(:user)

    head :no_content
  end

  private

  def warden
    request.env["warden"]
  end

  def user_json(user)
    { id: user.id, email: user.email }
  end
end

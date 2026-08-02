class Api::V1::AccountsController < ApplicationController
  before_action :authenticate_user!

  def password
    form = PasswordChangeForm.new(
      user: current_user,
      current_password: params[:current_password],
      password: params[:password],
      password_confirmation: params[:password_confirmation]
    )

    if form.save
      bypass_sign_in(current_user)
      render json: { csrf_token: form_authenticity_token }
    else
      render json: { errors: form.errors.to_hash(true) }, status: :unprocessable_entity
    end
  end

  def destroy
    unless current_user.valid_password?(params[:password])
      return render json: { error: "incorrect password" }, status: :unauthorized
    end

    current_user.destroy
    sign_out(current_user)

    head :no_content
  end
end

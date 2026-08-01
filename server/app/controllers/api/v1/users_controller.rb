class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    users = User.where.not(id: current_user.id)

    render json: users.map { |user|
      {
        id: user.id,
        email: user.email,
        document_count: user.documents.visible_to(current_user).count
      }
    }
  end
end

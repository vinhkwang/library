class Api::V1::DocumentsController < ApplicationController
  before_action :authenticate_user!

  def index
    documents = current_user.documents.order(created_at: :desc)

    render json: documents.map { |document| DocumentSerializer.new(document).as_json }
  end

  def create
    result = Documents::UploadForm.new(
      user: current_user,
      uploads: Array(params[:files]),
      private: params[:private] || false
    ).call

    if result.success?
      render json: result.value.map { |document| DocumentSerializer.new(document).as_json }, status: :created
    else
      render json: { errors: result.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    document = current_user.documents.find(params[:id])
    document.destroy

    head :no_content
  end
end

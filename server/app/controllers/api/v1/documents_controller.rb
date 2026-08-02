class Api::V1::DocumentsController < ApplicationController
  before_action :authenticate_user!

  def index
    documents = if params[:user_id]
      User.find(params[:user_id]).documents.visible_to(current_user)
    else
      current_user.documents
    end.order(created_at: :desc)

    render json: documents.map { |document| DocumentSerializer.new(document).as_json }
  end

  def show
    document = Document.visible_to(current_user).find(params[:id])

    render json: DocumentSerializer.new(document).as_json
  end

  def create
    form = Documents::UploadForm.new(user: current_user, uploads: Array(params[:files]), private: params[:private] || false)

    if form.save
      render json: form.documents.map { |d| DocumentSerializer.new(d).as_json }, status: :created
    else
      render json: { errors: form.errors.to_hash(true) }, status: :unprocessable_entity
    end
  end

  def update
    document = current_user.documents.find(params[:id])
    document.update!(private: params.require(:private))

    render json: DocumentSerializer.new(document).as_json
  end

  def destroy
    document = current_user.documents.find(params[:id])
    document.destroy

    head :no_content
  end

  def copy
    result = Documents::CopyService.new(user: current_user, source_id: params[:id]).call

    if result.success?
      render json: DocumentSerializer.new(result.value).as_json, status: :created
    else
      render json: { errors: result.errors }, status: :unprocessable_entity
    end
  end
end

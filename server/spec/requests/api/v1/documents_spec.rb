require "rails_helper"

RSpec.describe "Api::V1::Documents", type: :request do
  def sign_in(user)
    post "/api/v1/session", params: { user: { email: user.email, password: "password123" } }
    @csrf_token = JSON.parse(response.body)["csrf_token"]
  end

  def auth_headers
    { "X-CSRF-Token" => @csrf_token }
  end

  let!(:user) { create(:user, password: "password123") }
  let!(:other_user) { create(:user, password: "password123") }

  describe "POST /api/v1/documents" do
    before { sign_in(user) }

    it "uploads a single file" do
      file = fixture_file_upload("sample.txt", "text/plain")

      post "/api/v1/documents", params: { files: [file], private: false }, headers: auth_headers

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body).size).to eq(1)
      expect(user.documents.count).to eq(1)
    end

    it "uploads multiple files" do
      files = [
        fixture_file_upload("sample.txt", "text/plain"),
        fixture_file_upload("sample.txt", "text/plain")
      ]

      post "/api/v1/documents", params: { files: files, private: false }, headers: auth_headers

      expect(response).to have_http_status(:created)
      expect(JSON.parse(response.body).size).to eq(2)
      expect(user.documents.count).to eq(2)
    end

    it "rejects a file over the size cap" do
      oversized = Tempfile.new("oversized")
      oversized.write("a" * (Documents::UploadForm::MAX_SIZE_BYTES + 1))
      oversized.rewind

      file = Rack::Test::UploadedFile.new(oversized.path, "text/plain")

      post "/api/v1/documents", params: { files: [file], private: false }, headers: auth_headers

      expect(response).to have_http_status(:unprocessable_entity)
      expect(user.documents.count).to eq(0)

      oversized.close
      oversized.unlink
    end
  end

  describe "private files" do
    let!(:private_document) { create(:document, :private, user: user) }

    it "lets the owner see their own private document" do
      sign_in(user)

      get "/api/v1/documents/#{private_document.id}"
      expect(response).to have_http_status(:ok)

      get "/api/v1/documents"
      ids = JSON.parse(response.body).map { |document| document["id"] }
      expect(ids).to include(private_document.id)
    end

    it "hides another user's private document" do
      sign_in(other_user)

      get "/api/v1/documents/#{private_document.id}"
      expect(response).to have_http_status(:not_found)

      get "/api/v1/documents?user_id=#{user.id}"
      ids = JSON.parse(response.body).map { |document| document["id"] }
      expect(ids).not_to include(private_document.id)
    end
  end
end

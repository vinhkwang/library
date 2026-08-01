require "rails_helper"

RSpec.describe "Api::V1::Sessions", type: :request do
  let!(:user) { create(:user, email: "jane@example.com", password: "password123") }

  it "signs in with correct credentials" do
    post "/api/v1/session", params: { user: { email: "jane@example.com", password: "password123" } }

    expect(response).to have_http_status(:ok)
    expect(JSON.parse(response.body)["user"]["email"]).to eq("jane@example.com")
  end

  it "rejects a wrong password" do
    post "/api/v1/session", params: { user: { email: "jane@example.com", password: "wrong" } }

    expect(response).to have_http_status(:unauthorized)
  end

  it "returns 401 for GET session when not signed in" do
    get "/api/v1/session"

    expect(response).to have_http_status(:unauthorized)
  end
end

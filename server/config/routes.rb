Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  devise_for :users, skip: :all

  namespace :api do
    namespace :v1 do
      get "health" => "health#show"

      resource :session, only: [:show, :create, :destroy]
    end
  end
end

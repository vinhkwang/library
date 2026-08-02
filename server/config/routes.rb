Rails.application.routes.draw do
  devise_for :users, skip: :all

  namespace :api do
    namespace :v1 do
      get "health" => "health#show"

      resource :session, only: [:show, :create, :destroy]
      resources :users, only: [:index]
      resources :documents, only: [:index, :show, :create, :update, :destroy] do
        post :copy, on: :member
      end
      resource :account, only: [:destroy] do
        patch :password, on: :member
      end
    end
  end
end

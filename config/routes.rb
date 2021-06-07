Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/pay/:id', to: "payments#show", as: 'payment'
  get '/pay/button/:id', to: "payments#button", as: 'button'
  get '/pay/complete/:id', to: "payments#complete", as: 'complete'
  post 'pay/create', to: "payments#create", as: "create"


  resources :inovices

  get'/orders', to: "orders#index"
  get'/orders/:id', to: "orders#show"

  get '/', to: "home#index"
  get '/pricing', to: "home#pricing"
end

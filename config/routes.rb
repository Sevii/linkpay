Rails.application.routes.draw do
  get '/pay/:id', to: "payments#show", as: 'payment'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  
  resources :inovices

  get'/orders', to: "orders#index"

  get '/pay/button/:id', to: "payments#button", as: 'button'


  get '/pay/complete/:id', to: "payments#complete", as: 'complete'

  post 'pay/create', to: "payments#create", as: "create"
end

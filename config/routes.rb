Rails.application.routes.draw do
  get '/pay/:id', to: "payments#show", as: 'payment'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  
  resources :inovices

  get '/inovices/button/:id', to: "inovices#button", as: 'button'
end

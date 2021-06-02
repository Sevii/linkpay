Rails.application.routes.draw do
  get '/pay', to: "payments#show", as: 'payment'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  
  resources :inovices
end

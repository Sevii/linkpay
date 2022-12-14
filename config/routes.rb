Rails.application.routes.draw do
  use_doorkeeper
  
  devise_for :users, controllers: {
        sessions: 'users/sessions',
        registrations: 'users/registrations'
      }
      
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/pay/:id', to: "payments#show", as: 'payment'
  get '/pay/button/:id', to: "payments#button", as: 'button'
  get '/pay/complete/:id', to: "payments#complete", as: 'complete'
  post 'pay/create', to: "payments#create", as: "create"

  post 'quote/new', to: "quotes#new", as: "new"
  # get 'quote/paid/:id', to: "quotes#paid", as: "paid"
  post 'quote/paid/:id', to: "quotes#paid", as: "paid"

  resources :inovices, :orders

  get '/', to: "home#index"
  # get '/pricing', to: "home#pricing"
  get '/demo', to: "home#demo"
  get '/docs', to:"home#docs"
  # get '/privacy', to:"home#privacy"
  # get '/tos', to:"home#tos"

  get '/test', to: "zapier#test"
  get '/payment_recieved', to: "zapier#payment_recieved"
      
end

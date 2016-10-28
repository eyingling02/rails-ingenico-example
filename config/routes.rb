Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  resources :shoes

  get '/' => 'shoes#index'
  post '/shoes/:id/pay' => 'shoes#pay'

end

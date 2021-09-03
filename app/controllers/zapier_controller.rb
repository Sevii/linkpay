#Zapier controller

class ZapierController < ApplicationController
    before_action :doorkeeper_authorize!
    def test
        render :json => 200.to_json
    end

    def payment_recieved
  

        render :json => [current_user.orders.last].to_json
    end
end
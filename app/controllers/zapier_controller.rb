#Zapier controller

class ZapierController < ApplicationController
    before_action :doorkeeper_authorize!
    def test
        render :json => 200.to_json
    end

    def payment_recieved
        latest = Order.last
        render :json => [latest].to_json
    end
end
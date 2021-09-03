#Zapier controller

class ZapierController < ApplicationController
    before_action :doorkeeper_authorize!
    def test
        render :json => 200.to_json
    end

    def payment_recieved
        
        order = current_user.orders.last
        unless order.nil?
            render :json => [order].to_json
        else 
            render :json [].to_json
        end
    end
end
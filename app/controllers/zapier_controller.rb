#Zapier controller

class ZapierController < ApplicationController
    before_action :doorkeeper_authorize!
    def test
        render :json => 200.to_json
    end

    def payment_recieved
        
        order = current_resource_owner.orders.last
        unless order.nil?
            render :json => [order].to_json
        else 
            render :json [].to_json
        end
    end

  # Find the user that owns the access token
  def current_resource_owner
    User.find(doorkeeper_token.resource_owner_id) if doorkeeper_token
  end
end
#Zapier controller

class ZapierController < ApplicationController
    before_action :doorkeeper_authorize!
    def test
        render :nothing => true
    end
end


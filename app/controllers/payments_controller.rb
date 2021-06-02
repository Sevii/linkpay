class PaymentsController < ApplicationController
   content_security_policy do |p|
    p.frame_ancestors :self, 'https://www.sledgeworx.io'
  end

  def index
  end

  def show
    print "parameters yo " + params[:id]
    @inovice = Inovice.find(params[:id])
  end

  def button
    @inovice = Inovice.find(params[:id])
  end
end

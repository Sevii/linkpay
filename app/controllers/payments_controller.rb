class PaymentsController < ApplicationController
  def index
  end

  def show
    print "parameters yo " + params[:inovice_id]
    @inovice = Inovice.find(params[:inovice_id])
  end
end

class OrdersController < ApplicationController
  def index
    @orders = Order.all
  end
  def show
    @order = Order.find(params[:id])
    @inovice = Inovice.find(@order.inovice_id)
  end
end
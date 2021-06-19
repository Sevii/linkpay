class OrdersController < ApplicationController
  before_action :authenticate_user!
  def index
    @user = current_user
    @inovices =  @user.inovices
  end
  def show
    @order = Order.find(params[:id])
    @inovice = Inovice.find(@order.inovice_id)
  end
end
class PaymentsController < ApplicationController
   protect_from_forgery with: :null_session
   content_security_policy do |p|
    p.frame_ancestors :self, 'https://www.sledgeworx.io', "https://eatliftprogram.com"
  end

  def index
  end

  def show
    @inovice = Inovice.find(params[:id])
  end

  def button
    @inovice = Inovice.find(params[:id])
  end

  def complete
    @order = Order.find(params[:id])
    @inovice = Inovice.find(@order.inovice_id)

  end

  def create
    @order = Order.new(order_params)
    @inovice = Inovice.find(@order.inovice_id)
    if @order.save
      OrderPlacedMailer.with(order: @order, inovice: @inovice).order_placed_email.deliver_now
      redirect_to complete_path @order.id
    else
      render error: {error: "Unable to save order"}, status: 400
    end
  end
  private
    def order_params
      params.permit(:transaction_hash, :inovice_id, :currency_amount, :currency_to_usd, :customer_email)
    end
end

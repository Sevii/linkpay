class InovicesController < ApplicationController
  before_action :authenticate_user!

  def index
    @user = current_user
    @inovices =  @user.inovices
    print @user
  end
  def show
    @inovice = Inovice.find(params[:id])
  end

  def new
    @inovice = Inovice.new
  end

  def create
    @inovice = Inovice.new(inovice_params)

    @inovice.user = current_user
    if @inovice.save
      redirect_to @inovice
    else
      render :new
    end
  end
  private
    def inovice_params
      params.require(:inovice).permit(:name, :ethereum_address, :usd_price, :owner_email, :seller_name, :product_image)
    end
end

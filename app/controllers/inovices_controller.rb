class InovicesController < ApplicationController
  def index
    @inovices = Inovice.all
  end
  def show
    @inovice = Inovice.find(params[:id])
  end

  def new
    @inovice = Inovice.new
  end

  def create
    @inovice = Inovice.new(inovice_params)

    if @inovice.save
      redirect_to @inovice
    else
      render :new
    end
  end
  private
    def inovice_params
      params.require(:inovice).permit(:name, :price, :ethereum_address)
    end
end

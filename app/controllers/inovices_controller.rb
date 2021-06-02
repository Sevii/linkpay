class InovicesController < ApplicationController
  def index
    @inovices = Inovice.all
  end
end

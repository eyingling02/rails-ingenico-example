class ShoesController < ApplicationController

  def index
    @shoes = Shoe.all
  end

  def show
    @shoe = Shoe.find(params[:id])
    #if shipping is NOT same as billing render address partial again
    # form = params[:shoe]

    if request.xhr?
      render json: @shoe
    end
  end




end

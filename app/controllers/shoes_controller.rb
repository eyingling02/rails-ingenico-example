require 'nokogiri'
require 'open-uri'
require 'json'
class ShoesController < ApplicationController

  def index
    white_space = /(?<=>)\s+(?=<)/
    doc = open('https://www.pexels.com/search/shoes', &:read).gsub(/\s+/, ' ')
    refined_doc = doc.gsub(white_space, '')
    nokogiri_doc = Nokogiri.parse(refined_doc)
    photos = nokogiri_doc.css('.photos').children()
    photo_array =[]
    photos.each do |t|
      photo_array.push(t.children.first.children.first.attr('src'))
    end
    @image = photo_array
    @shoes = Shoe.all

    if request.xhr?
      render :'_shipping', layout: false
    end
  end

  def payment
    if request.xhr?
      p request
      # render :'/shoes/show', layout: false
    end
  end

  def show
    @shoe = Shoe.find(params[:id])
    if request.xhr?
      render :'/shoes/show', layout: false
    end
  end




end

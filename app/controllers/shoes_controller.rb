require 'openssl'
require 'nokogiri'
require 'open-uri'
require 'json'
require 'base64'
require 'uri'
require 'net/http'
class ShoesController < ApplicationController
  protect_from_forgery
  skip_before_action :verify_authenticity_token
  attr_accessor :paid

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
    headers['Access-Control-Allow-Origin'] = '*'
    @shoe = Shoe.find(params[:id])
    @payments = params[:payments]
    @shipping = params[:shipping]
    if params[:shipping]
      order = {
          "order" => {
            "amountOfMoney" => {
              "currencyCode" => "EUR",
              "amount" => 1234
            },
            "customer" => {
              "merchantCustomerId" => "1234",
              "personalInformation" => {
                "name" => {
                  "firstName" => @payments[:first_name],
                  "surname" => @payments[:last_name]
                }
              },
              "companyInformation" => {
              },
              "locale" => "en_GB",
              "billingAddress" => {
                "street" => @payments[:street],
                "houseNumber" => @payments[:house_number],
                "additionalInfo" => @payments[:suite],
                "zip" => @payments[:zip],
                "city" => @payments[:city],
                "state" => @payments[:state],
                "countryCode" => "US"
              },
              "shippingAddress" => {
                "name" => {
                  "firstName" => @shipping[:first_name],
                  "surname" => @shipping[:last_name]
                },
                "street" => @shipping[:street],
                "houseNumber" => @shipping[:house_number],
                "additionalInfo" => @shipping[:suite],
                "zip" => @shipping[:zip],
                "city" => @shipping[:city],
                "state" => @shipping[:state],
                "countryCode" => "US"
              },
              "contactDetails" => {
                "emailAddress" => @payments[:email],
                "phoneNumber" => @payments[:phone],
                "emailMessageType" => "html"
              }
            },
            "references" => {
              "merchantOrderId" => 123456,
              "merchantReference" => "AcmeOrder0001",
              "invoiceData" => {
                "invoiceNumber" => "000000123",
                "invoiceDate" => "20140306191500"
              },
              "descriptor" => "name"
            },
            "items" => [
              {
                "amountOfMoney" => {
                  "currencyCode" => "EUR",
                  "amount" => 123
                },
                "invoiceData" => {
                  "nrOfItems" => "1",
                  "pricePerItem" => 1234,
                  "description" => "name"
                }
              }
            ]
          },
          "cardPaymentMethodSpecificInput" => {
            "paymentProductId" => 1,
            "skipAuthentication" => false,
            "card" => {
              "cvv" => @payments[:cvv],
              "cardNumber" => @payments[:card_number],
              "expiryDate" => @payments[:expiration],
              "cardholderName" => @payments[:card_holder]
            }
          }
        }
    else
      order = {
        "order" => {
          "amountOfMoney" => {
            "currencyCode" => "EUR",
            "amount" => 1234
          },
          "customer" => {
            "merchantCustomerId" => "1234",
            "personalInformation" => {
              "name" => {
                "firstName" => @payments[:first_name],
                "surname" => @payments[:last_name]
              }
            },
            "companyInformation" => {
            },
            "locale" => "en_GB",
            "billingAddress" => {
              "street" => @payments[:street],
              "houseNumber" => @payments[:house_number],
              "additionalInfo" => @payments[:suite],
              "zip" => @payments[:zip],
              "city" => @payments[:city],
              "state" => @payments[:state],
              "countryCode" => "US"
            },
            "shippingAddress" => {
              "name" => {
                "firstName" => @payments[:first_name],
                "surname" => @payments[:last_name]
              },
              "street" => @payments[:street],
              "houseNumber" => @payments[:house_number],
              "additionalInfo" => @payments[:suite],
              "zip" => @payments[:zip],
              "city" => @payments[:city],
              "state" => @payments[:state],
              "countryCode" => "US"
            },
            "contactDetails" => {
              "emailAddress" => @payments[:email],
              "phoneNumber" => @payments[:phone],
              "emailMessageType" => "html"
            }
          },
          "references" => {
            "merchantOrderId" => 123456,
            "merchantReference" => "AcmeOrder0001",
            "invoiceData" => {
              "invoiceNumber" => "000000123",
              "invoiceDate" => "20140306191500"
            },
            "descriptor" => "name"
          },
          "items" => [
            {
              "amountOfMoney" => {
                "currencyCode" => "EUR",
                "amount" => 123
              },
              "invoiceData" => {
                "nrOfItems" => "1",
                "pricePerItem" => 1234,
                "description" => "name"
              }
            }
          ]
        },
        "cardPaymentMethodSpecificInput" => {
          "paymentProductId" => 1,
          "skipAuthentication" => false,
          "card" => {
            "cvv" => @payments[:cvv],
            "cardNumber" => @payments[:card_number],
            "expiryDate" => @payments[:expiration],
            "cardholderName" => @payments[:card_holder]
          }
        }
      }
    end
      body = order.to_json
      payment_response = setRequest("POST", "/payments", body)
     if payment_response["payment"]
       payment_id = payment_response["payment"]["id"]
       capture_response = setRequest("POST", "/payments/"+payment_id+"/approve", '{"paymentMethodSpecificInput": 999}')
       capture_response
       status_response = setRequest('GET', '/payments/' + payment_id, "{}")
       payment_status = status_response['status']
       payment_status
       render json: [payment_response, capture_response, status_response]
     else
       render json: payment_response
     end
  end

  def show
    @shoe = Shoe.find(params[:id])
    if request.xhr?
      render :'/shoes/show', layout: false
    end
  end

  protected
  def setRequest(httpHeader, subURI, body)
      merchant_id = "2415"
      api_key = "262ef0ddf0b10656"
      secret_key = "Q4+A1qGNXMSHmxVIg3QgC+KQGjbhuh61+8b1pcXmu8s="
      url = "https://api-sandbox.globalcollect.com"
      meth = httpHeader
      type = "application/json"
      time = Time.new
      timestamp = time.strftime("%a, %d %b %Y %H:%M:%S %Z")

      uri = "/v1/"+merchant_id+subURI
      endpoint = url+uri
      header = meth+"\n"+type+"\n"+timestamp+"\n"+uri+"\n"
      digest = OpenSSL::Digest.new('sha256')
      decoded_key = Base64.strict_decode64(secret_key)
      hmac = Base64.strict_encode64(OpenSSL::HMAC.digest(digest, secret_key, header))
      new_url = URI(endpoint)
      http = Net::HTTP.new(new_url.host, new_url.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      if httpHeader == "POST"
        request = Net::HTTP::Post.new(new_url)
      elsif httpHeader == "DELETE"
        request = Net::HTTP::Delete.new(new_url)
      elsif httpHeader == "PUT"
        request = Net::HTTP::Put.new(new_url)
      else
        request = Net::HTTP::Get.new(new_url)
      end

      request["Date"] = timestamp
      request["Content-type"] = type
      request["authorization"] = "GCS v1HMAC:"+api_key+":"+hmac
      request.body = body
      response = http.request(request)
      jsonr = JSON.parse(response.read_body)
      jsonr
      return jsonr
      # return jsonr
  end

end

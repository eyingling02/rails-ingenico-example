// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .
$(document).ready(function() {
  console.log('READY for action');
  submitPayment();
})

function submitPayment() {
  $(':submit').on('click', function(event) {
    event.preventDefault();
    console.log('prevented this!')
    var shoeData = $('form').serialize();

    var json = {
      "order": {
        "amountOfMoney": {
          "currencyCode": "EUR",
          "amount": 2980
        },
        "customer": {
          "personalInformation": {
            "name": {
              "firstName": $('#payments_first_name').val(),
              "surname": $('#payments_last_name').val()
            }}
          },
          "billingAddress": {
            "street": $('#payments_street').val(),
            "houseNumber": $('#payments_house_number').val(),
            "additionalInfo": $('#payments_suite').val(),
            "zip": $('#payments_zip').val(),
            "city": $('#payments_city').val(),
            "state": $('#payments_state').val(),
            "countryCode": "US"
          },
          "shippingAddress": {
            "street": $('#shipping_street').val(),
            "houseNumber": $('#shipping_house_number').val(),
            "additionalInfo": $('#shipping_suite').val(),
            "zip": $('#shipping_zip').val(),
            "city": $('#shipping_city').val(),
            "state": $('#shipping_state').val(),
            "countryCode": "US"
          },
          "contactDetails": {
            "emailAddress": $('#payments_email').val(),
            "phoneNumber": $('#payments_phone').val(),
            "emailMessageType": "html"
          },
        },
        "references": {
          "merchantOrderId": 123456,
          "merchantReference": "AcmeOrder0001",
          "invoiceData": {
            "invoiceNumber": "000000123",
            "invoiceDate": "20140306191500"
          }
        },
        "items": [
          {
            "amountOfMoney": {
              "currencyCode": "EUR",
              "amount": 2500
            },
            "invoiceData": {
              "nrOfItems": "1",
              "pricePerItem": 2500,
              "description": "ACME Super Outfit"
            }
          },
          {
            "amountOfMoney": {
              "currencyCode": "EUR",
              "amount": 480
            },
            "invoiceData": {
              "nrOfItems": "12",
              "pricePerItem": 40,
              "description": "Aspirin"
            }
          }
        ],
      "cardPaymentMethodSpecificInput": {
        "paymentProductId": 1,
        "skipAuthentication": false,
        "card": {
          "cvv": "123",
          "cardNumber": "4567350000427977",
          "expiryDate": "1220",
          "cardholderName": "Wile E. Coyote"
        }
      }}

      console.log(json);
    $.ajax({
      url: $('form').attr('action'),
      method: $('form').attr('method'),
      data: shoeData
    })
    .done(function(serverData) {
      console.log('server data', serverData);

    })
    .fail(function(serverData) {
      console.log("I failed so hard");
    })

  })
}

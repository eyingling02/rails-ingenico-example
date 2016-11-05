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
//= require sweetalert2
//= require_tree .

$(document).ready(function() {
  console.log('READY for action');
  buyShoe();
})

function buyShoe() {
  $('body').on('click', 'a', function(event) {
    event.preventDefault();
    var append = $(this).parent();
    var button = $(this);
    console.log('shoes')

    $.ajax({
      url: $('#shoe-button').attr('href'),
      method: 'GET'
    })
    .done(function(serverData) {
      $(button).hide();
      $(append).append(serverData);
      checkbox();
      submitPaymentSameShipping();
    })
  })
}

function checkbox() {
  $('#ship').on('click', function(event) {
    event.preventDefault();
    console.log('up');
    $.ajax({
      url: '/',
      method: 'GET'
    })
    .done(function(serverData) {
      $(".buy-shoe").append(serverData);
      $('.same-shipping').hide();
      submitPaymentDiffShipping();
    })
  })
}

function submitPaymentSameShipping() {
  $('input.btn.btn-default').on('click', function(event) {
    event.preventDefault();
    var amount = $($($(this).parent().parent().parent().parent()[0]).children()[1]).text()
    var name = $($($(this).parent().parent().parent().parent()[0]).children()[0]).text()
    var money = amount.split('$')[1]

  json = {
    "order": {
      "amountOfMoney": {
        "currencyCode": "EUR",
        "amount": 123
      },
      "customer": {
        "merchantCustomerId": "1234",
        "personalInformation": {
          "name": {
            "firstName": $('#payments_first_name').val(),
            "surname": $('#payments_last_name').val()
          }
        },
        "companyInformation": {
        },
        "locale": "en_GB",
        "billingAddress": {
          "street": $('#payments_house_number').val(),
          "houseNumber": $('#payments_house_number').val(),
          "additionalInfo": $('#payments_suite').val(),
          "zip": $('#payments_zip').val(),
          "city": $('#payments_city').val(),
          "state": $('#payments_state').val(),
          "countryCode": "US"
        },
        "shippingAddress": {
          "name": {
            "firstName": $('#payments_first_name').val(),
            "surname": $('#payments_last_name').val()
          },
            "street": $('#payments_house_number').val(),
            "houseNumber": $('#payments_house_number').val(),
            "additionalInfo": $('#payments_suite').val(),
            "zip": $('#payments_zip').val(),
            "city": $('#payments_city').val(),
            "state": $('#payments_state').val(),
            "countryCode": "US"
          },
        "contactDetails": {
          "emailAddress": $('#payments_email').val(),
          "phoneNumber": $('#payments_phone').val(),
          "emailMessageType": "html"
        }
      },
      "references": {
        "merchantOrderId": 123456,
        "merchantReference": "AcmeOrder0001",
        "invoiceData": {
          "invoiceNumber": "000000123",
          "invoiceDate": "20140306191500"
        },
        "descriptor": "name"
      },
      "items": [
        {
          "amountOfMoney": {
            "currencyCode": "EUR",
            "amount": 123
          },
          "invoiceData": {
            "nrOfItems": "1",
            "pricePerItem": 1234,
            "description": "name"
          }
        }
      ]
    },
    "cardPaymentMethodSpecificInput": {
      "paymentProductId": 1,
      "skipAuthentication": false,
      "card": {
        "cvv": $('#payments_cvv').val(),
        "cardNumber": $('#payments_card_number').val(),
        "expiryDate": $('#payments_expiration').val(),
        "cardholderName": $('#payments_card_holder').val()
      }
    }}

    console.log(json);
    axios.post('https://gift-it-ingenico.herokuapp.com/payments/createPayment', json)
    .catch(function(error) {
      if (error.response) {
        console.log(error)
        swal({
        title: "Error",
        text: "Your payment was not processed. Please try again.",
        type: "warning",
        cancelButtonColor: '#DD6B55',
        cancelButtonText: 'OK',
        closeOnCancel: true
        })
        .done(function() {
          $('form').hide()
        })
      } else {
        if (response) {
          console.log(response)
          swal('Success!')
          swal("/{response.data.payment.status}")
        }
      }
    })
    .then(function(response) {
      if (response) {
        console.log(response)
        swal("Success!")
      }
    })
    .then(function() {
      $('form').hide()
    })
  })
}


function submitPaymentDiffShipping() {
  $('input.btn.btn-default').on('click', function(event) {
    event.preventDefault();
    console.log('prevented this!')
    var amount = $($($(this).parent().parent().parent().parent()[0]).children()[1]).text()
    var name = $($($(this).parent().parent().parent().parent()[0]).children()[0]).text()
    var money = amount.split('$')[1]
    json = {
      "order": {
        "amountOfMoney": {
          "currencyCode": "EUR",
          "amount": 1234
        },
        "customer": {
          "merchantCustomerId": "1234",
          "personalInformation": {
            "name": {
              "firstName": $('#payments_first_name').val(),
              "surname": $('#payments_last_name').val()
            }
          },
          "companyInformation": {
          },
          "locale": "en_GB",
          "billingAddress": {
            "street": $('#payments_house_number').val(),
            "houseNumber": $('#payments_house_number').val(),
            "additionalInfo": $('#payments_suite').val(),
            "zip": $('#payments_zip').val(),
            "city": $('#payments_city').val(),
            "state": $('#payments_state').val(),
            "countryCode": "US"
          },
          "shippingAddress": {
            "name": {
              "firstName": $('#payments_first_name').val(),
              "surname": $('#payments_last_name').val()
            },
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
          }
        },
        "references": {
          "merchantOrderId": 123456,
          "merchantReference": "AcmeOrder0001",
          "invoiceData": {
            "invoiceNumber": "000000123",
            "invoiceDate": "20140306191500"
          },
          "descriptor": "while"
        },
        "items": [
          {
            "amountOfMoney": {
              "currencyCode": "EUR",
              "amount": 1246
            },
            "invoiceData": {
              "nrOfItems": "1",
              "pricePerItem": 12345,
              "description": "While"
            }
          }
        ]
      },
      "cardPaymentMethodSpecificInput": {
        "paymentProductId": 1,
        "skipAuthentication": false,
        "card": {
          "cvv": $('#payments_cvv').val(),
          "cardNumber": $('#payments_card_number').val(),
          "expiryDate": $('#payments_expiration').val(),
          "cardholderName": $('#payments_card_holder').val()
        }
      }}

      console.log(json);

      axios.post('https://gift-it-ingenico.herokuapp.com/payments/createPayment', json)
      .catch(function(error) {
        if (error.response) {
          swal({
          title: "Error",
          text: "Your payment was not processed. Please try again.",
          type: "warning",
          cancelButtonColor: '#DD6B55',
          cancelButtonText: 'OK',
          closeOnCancel: true
          })
          .done(function() {
             $('form').hide()
          })
        } else {
          if (response) {
            console.log(response)
            swal('Success!')
            swal("/{response.data.payment.status}")
          }
        }
      })
      .then(function(response) {
        if (response) {
          console.log(response)
          sweetAlert('Success!')
        }
      })
      .then(function() {
         $('form').hide()
      })
  })
}

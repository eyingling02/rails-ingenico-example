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

$(document).ready(function () {
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
      submitPayment();
    })
  })
}

function checkbox() {
  $('#ship').on('click', function(event) {
    event.preventDefault();
    $.ajax({
      url: '/',
      method: 'GET'
    })
    .done(function(serverData) {
      $(".buy-shoe").append(serverData);
      $('.same-shipping').hide();
      submitPayment();
    })
  })
}

function submitPayment() {
  $('input.btn.btn-default').on('click', function(event) {
    event.preventDefault();
    var address = $($(this).parent().parent()[0]).attr('action')
    data = $('form').serialize()

    $.ajax({
      url: 'https://shoes-shop.herokuapp.com'+address+'/payment',
      type: "POST",
      dataType: "json",
      data: data
    })
    .done(function(response) {
      if (response.errorId) {
        console.log(response)
        var errorStatus = String((response.errors[0]).httpStatusCode)
        swal({
          title: "Error",
          text: "Your payment was not processed. Please try again. Error http status #" + errorStatus,
          type: "warning",
          cancelButtonColor: '#DD6B55',
          cancelButtonText: 'OK',
          closeOnCancel: true,
          timer: 2000
        }).then(function(dismiss) {})
      } else {
        console.log(response)
        swal({
          title: "Success!",
          text: "Your payment is being processed. You will get a message at completion.",
          type: 'success',
          cancelButtonColor: '#DD6B55',
          cancelButtonText: 'OK',
          closeOnCancel: true
        })
      }
    })
    .fail(function(response) {
      console.log(response)
        swal({
          title: "Error",
          text: "Your payment was not processed. Please try again. ",
          type: "warning",
          cancelButtonColor: '#DD6B55',
          cancelButtonText: 'OK',
          closeOnCancel: true
        })
      })
    .always(function() {
       $('form').hide()
       $('#shoe-div a').show('#shoe-button')
    })
  })
}

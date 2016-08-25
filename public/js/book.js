function fillBookInfo(book) {
    $('.bookImg img').attr('src', '/img/books/' + book.id + '.jpg');
    $('.titleBook').html(book.title);
    $('#author').html(book.author);
    $('#year').html(book.year);
    $('#pages').html(book.pages);
    $('#isbn').html(book.isbn);
    $('.bookDescriptionText').html(book.description);

    console.log(JSON.stringify(book)); // log

    console.log("Status: " + book.busy); // log
    if(book.busy=='true'){
      $('.busyBook').css('display','block');
    } else {
      $('.freeBook').css('display','block');
    }


}

doAjaxQuery('GET', '/api/v1/books/' + $(location).attr('pathname').substr(6), null, function (res) {
    if (!res.success) {
        alert(res.msg);
        return;
    }
    fillBookInfo(res.data);
});

$('.orderEmail').keyup(function(event) {
  var value = $(this).val();
  var regex = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
  if(value === ''){
    console.log('пусто'); // log
    $('.input-group').removeClass('has-error has-success');
    view.hideElement('.glyphicon-remove');
    view.hideElement('.glyphicon-ok');
    $('.btnBookID').attr('disabled','disabled');

  }else {
    if(regex.test(value)){
      console.log('email true'); // log
      $('.input-group').removeClass('has-error has-feedback');
      view.hideElement('.glyphicon-remove');

      $('.input-group').addClass('has-success has-feedback');
      view.showElement('.glyphicon-ok');
      $('.btnBookID').removeAttr('disabled');
    } else{
      console.log('email false'); // log
      $('.input-group').removeClass('has-success has-feedback');
      view.hideElement('.glyphicon-ok');
      $('.input-group').addClass('has-error has-feedback');
      view.showElement('.glyphicon-remove');
      $('.btnBookID').attr('disabled','disabled');
    }
  }
$('.btnBookID').click(function(event) {
  console.log('Click Btn ');
  var email = $('.orderEmail').val();
  doAjaxQuery('GET', '/api/v1/books/order?' + email, null, function (res) {
      if (!res.success) {
          alert(res.msg);
          return;
      }
      console.log("Письмо отправленно " +res.success);
      // fillBookInfo(res.data);
  });
});
});

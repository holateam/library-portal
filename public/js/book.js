function fillBookInfo(book) {
    $('.bookImg img').attr('src', '/img/books/' + book.id + '.jpg');
    $('.titleBook').html(book.title);
    $('#author').html(book.author);
    $('#year').html(book.year);
    $('#pages').html(book.pages);
    $('#isbn').html(book.isbn);
    $('.bookDescriptionText').html(book.description);


    console.log("Status: " + book.status);
    if(book.status=='1'){
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
  if(value == ''){
    console.log('пусто');
    $('.input-group').removeClass('has-error has-success');
    view.hideElement('.glyphicon-remove');
    view.hideElement('.glyphicon-ok');
  }else {
    if(regex.test(value)){
      console.log('email true');
      $('.input-group').removeClass('has-error has-feedback');
      view.hideElement('.glyphicon-remove');

      $('.input-group').addClass('has-success has-feedback');
      view.showElement('.glyphicon-ok');
    } else{
      console.log('email false');
      $('.input-group').removeClass('has-success has-feedback');
      view.hideElement('.glyphicon-ok');
      $('.input-group').addClass('has-error has-feedback');
      view.showElement('.glyphicon-remove');
    }
  }
  // alert(value);
});

function fillBookInfo(book) {
    $('.bookID').attr('book-id', book.id);
    $('.bookImg img').attr('src', '/img/books/' + book.id + '.jpg');
    $('.titleBook').html(book.title);
    $('#author').html(book.author);
    $('#year').html(book.year);
    $('#pages').html(book.pages);
    $('#isbn').html(book.isbn);
    $('.bookDescriptionText').html(book.description);
    $('.bookID').attr('busy', book.busy);

    console.log(JSON.stringify(book)); // log
    console.log("Status: " + book.busy); // log

    if (book.busy === true) {
        $('.busyBook').css('display', 'block');
    } else {
        $('.freeBook').css('display', 'block');
    }


}

doAjaxQuery('GET', '/api/v1/books/' + $(location).attr('pathname').substr(6), null, function(res) {
    if (!res.success) {
        alert(res.msg);
        return;
    }
    fillBookInfo(res.data);
});

/* --------------------Show the result, for sending the -----------------------
----------------------email in the queue for the book ---------------------- */
var showResultSendEmailToQueue = function(email,result){
  var busy = $('.bookID').attr('busy');
  console.log("busy:" +busy);
  view.hideElement('.form-queue', '.btnBookID', (busy=='true')?'.busyBook':'.freeBook');
  view.showElement('.response');
  $('span.youEmail').text(' '+email);
};

/*--------------- Send email. Get in Queue in for a book ---------------------*/
var sendEmailToQueue = function(id, email) {
    doAjaxQuery('GET', '/api/v1/books/' + id + '/order?email=' + email, null, function(res) {
        if (!res.success) {
            alert(res.msg);
            return;
        }else{
          showResultSendEmailToQueue(email,res.success);
          console.log(JSON.stringify(res));
          console.log("Письмо отправленно " + res.success);
        }
    }
  );
};

/* --------------- Checking validity of email when typing in input -----------*/
$('.orderEmail').keyup(function(event) {
    var email = $(this).val();
    var isEmail = controller.validateEmail(email);
    if (email === '') {
        console.log('пусто'); // log
        $('.input-group').removeClass('has-error has-success');
        view.hideElement('.glyphicon-remove', '.glyphicon-ok');
    } else {
        if (isEmail) {
            console.log('email true'); // log
            view.showSuccessEmail();
            if (event.keyCode == 13) {
              var id = $('.bookID').attr('book-id');
              sendEmailToQueue(id,email);
          }
        } else {
            console.log('email false'); // log
            view.showErrEmail();
        }
    }
}); 

/*------------------ Sending email by clicking on the button ----------------*/
$('.btnBookID').click(function(event) {
    var email = $('.orderEmail').val();
    console.log(email);
    var isEmail = controller.validateEmail(email);
    if(isEmail){
      view.showSuccessEmail();
      var id = $('.bookID').attr('book-id');
      console.log('Click Btn ');
      console.log(id);
      sendEmailToQueue(id, email);
    }else{
      view.showErrEmail();
    }
});

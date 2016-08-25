function fillBookInfo(book) {
    $('.bookID').attr('book-id', book.id);
    $('.bookImg img').attr('src', '/img/books/' + book.id + '.jpg');
    $('.titleBook').html(book.title);
    $('#author').html(book.author);
    $('#year').html(book.year);
    $('#pages').html(book.pages);
    $('#isbn').html(book.isbn);
    $('.bookDescriptionText').html(book.description);

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


var sendEmailToQueue = function(id, email) {
    doAjaxQuery('GET', '/api/v1/books/' + id + '/order?email=' + email, null, function(res) {
        if (!res.success) {
            alert(res.msg);
            return;
        }
        console.log(JSON.stringify(res));
        console.log("Письмо отправленно " + res.success);
        // fillBookInfo(res.data);
    });
};

$('.orderEmail').keyup(function(event) {
    var value = $(this).val();
    var isEmail = controller.validateEmail(value);
    if (value === '') {
        console.log('пусто'); // log
        $('.input-group').removeClass('has-error has-success');
        view.hideElement('.glyphicon-remove', '.glyphicon-ok');
        $('.btnBookID').attr('disabled', 'disabled');
    } else {
        if (isEmail) {
            console.log('email true'); // log
            view.showSuccessEmail();
            $('.btnBookID').removeAttr('disabled');
        } else {
            console.log('email false'); // log
            view.showErrEmail();
            $('.btnBookID').attr('disabled', 'disabled');
        }
    }
});

$('.btnBookID').click(function(event) {
    var email = $('.orderEmail').val(); // $('input.orderEmail').val();
    var id = $('.bookID').attr('book-id');
    console.log('Click Btn ');
    console.log(id);
    console.log(email);
    sendEmailToQueue(id, email);
});

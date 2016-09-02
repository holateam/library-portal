var pathname = $(location).attr('pathname');
var bookIdPosition = pathname.lastIndexOf('/') + 1;

doAjaxQuery('GET', '/api/v1/books/' + pathname.substr(bookIdPosition), null, function(res) {
    if (!res.success) {
        view.showPopup('Error', res.msg); // to replace the normal popup
        return;
    }
    view.fillBookInfo(res.data);
});

/* --------------------Show the result, for sending the -----------------------
----------------------email in the queue for the book ---------------------- */
var showResultSendEmailToQueue = function(email, result) {
    var busy = $('#bookID').attr('busy');
    view.hideElement('.form-queue', '.btnBookID', (busy === null) ? '.freeBook' : '.busyBook');
    view.showElement('.response');
    $('span.youEmail').text(' ' + email);
};

/*--------------- Send email. Get in Queue in for a book ---------------------*/
var sendEmailToQueue = function(id, email) {
    doAjaxQuery('GET', '/api/v1/books/' + id + '/order?email=' + email, null, function(res) {
        if (!res.success) {
            view.showError(res.msg);
            return;
        } else {
            showResultSendEmailToQueue(email, res.success);
        }
    });
};

/* --------------- Checking validity of email when typing in input -----------*/
$('.orderEmail').keyup(function(event) {
    var email = $(this).val();
    var isEmail = controller.validateEmail(email);
    if (email === '') {
        $('.input-group').removeClass('has-error has-success');
        view.hideElement('.glyphicon-remove', '.glyphicon-ok');
    } else {
        if (isEmail) {
            view.showSuccessEmail();
            if (event.keyCode == 13) {

                var id = $('#bookID').attr('book-id');
                sendEmailToQueue(id, email);
            }
        } else {
            view.showErrEmail();
        }
    }
});

/*------------------ Sending email by clicking on the button ----------------*/
$('.btnBookID').click(function(event) {
    var email = $('.orderEmail').val();
    var isEmail = controller.validateEmail(email);
    if (isEmail) {
        view.showSuccessEmail();
        var id = $('#bookID').attr('book-id');
        sendEmailToQueue(id, email);
    } else {
        view.showErrEmail();
    }
});

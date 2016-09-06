/* -------------------- Filling out the book data ------------------------- */
var fillActionBook = function(data) {
    view.fillFields(data, 'name,phone,email,term,pawn', 'val');
    $('#date').val((data.date === null) ?
        view.normalDateFormat(new Date()) :
        view.normalDateFormat(new Date(data.date)));
};

/* ------------------ Obtaining data book with id -------------------------- */
doAjaxQuery('GET', '/admin/api/v1/books/' + pathNameUrl[3], null, function(res) {
    view.fillBookInfo(res.data);
    if (res.data.event !== null) {
        fillActionBook(res.data);
    }
    settingStatusForButton(res.data.event);
});

var pathNameUrl = $(location).attr('pathname').split('/');

/* ------------------- Changing the status of a button --------------------- */
var settingStatusForButton = function(val) {
    var name, data_busy, disabled;
    if (val === null) {
        name = 'Выдать книгу';
        data_busy = false;
        disabled = true;
    } else {
        name = 'Принять книгу';
        data_busy = true;
        disabled = false;
    }
    $('.btnBookAction').text(name).attr('data', data_busy);
    $('#renewalOfBook').attr('disabled', disabled);
};

/* ----------------------- Update the field term --------------------------- */
var updateTermBook = function(data, update) {

    doAjaxQuery('POST', '/admin/api/v1/books/' + data.id + '/renewal', update, function(res) {
        $('#renewalOfBook').prop('checked', false);
        $('#name,#phone,#email,#pawn').attr('disabled', false);
    });
    msg = "Человек стремится к знаниям!\nНу разве это не прекрасно?";
    view.showSuccess(msg);
};

// ------------------- They gave a book in his hands, and recorded the event,  // ---------------------- also recorded in the data reader data base.
var takeBook = function(data, update) {
    doAjaxQuery('GET', '/admin/api/v1/books/' + data.id + '/take', update, function(res) {
        $('.orderBlock input').val('');
    });
    msg = "Общий уровень знаний на планете ощутимо повысился! ";
    view.showSuccess(msg);
};

/* ----------------------- Pressing the action button ---------------------- */
$('.btnBookAction').click(function(event) {
    var status = $('.btnBookAction').attr('data');
    var data = {
        id: $('#id').attr('book-id')
    };
    if (status == 'true') {
        var obj, update, msg, flag, isChecked = $('#renewalOfBook').prop('checked');
        update = {
            changes: view.selectFields('term,pawn', 'val')
        };
        if (isChecked) { // update term book
            updateTermBook(data, update);
            settingStatusForButton(true);
        } else { // take book user
            takeBook(data, update);
            settingStatusForButton(null);
        }
    } else {
        data.reader = view.selectFields('name,email,phone', 'val');
        doAjaxQuery('POST', '/admin/api/v1/readers/add', data, function(res) {
            data.event = view.selectFields('term,pawn', 'val');
            data.event.reader_id = res.data.reader_id;
            data.event.date = new Date();
            doAjaxQuery('POST', '/admin/api/v1/books/' + data.id + '/give', data, function(res) {
                settingStatusForButton(true);
            });
        });
        view.showSuccess('Не забудьте про залог! ))');
    }
});

/* ----------------------- Pressing button edit book ----------------------- */
$('#btnEditBook').click(function(event) {
    window.location.href = '/admin/book/update/' + pathNameUrl[3] + '';
});

/* --------------------- Pressing button remove book ----------------------- */
$('#btnRemoveBook').click(function(event) {
    var data = {
        id: $('#bookID').attr('book-id')
    };
    view.showConfirm(data.id);
});

/* ---------------------- Click checked renewal book ----------------------- */
$('#renewalOfBook').click(function(event) {
    var isChecked = $('#renewalOfBook').prop('checked');
    if (isChecked) {
        $('.btnBookAction').text('Update').attr('data-update', true);
        $('#name, #phone, #email, #pawn').attr('disabled', true);
    } else {
        $('#name,#phone,#email,#pawn').attr('disabled', false);
        var isBusy = $('.btnBookAction').attr('data');
        var val = (isBusy !== 'true') ? null : isBusy;
        settingStatusForButton(val);
    }
});

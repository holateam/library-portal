var pathNameUrl = $(location).attr('pathname').split('/');

var settingStatusForButton = function(val) {
    var obj = (val === null) ? {
        name: 'Give the book',
        data_busy: false,
        disabled: true,
    } : {
        name: 'Pick up the book',
        data_busy: true,
        disabled: false,
    };
    $('.btnBookAction').text(obj.name).attr('data', obj.data_busy);
    $('#renewalOfBook').attr('disabled', obj.disabled);
};

var fillActionBook = function(data) {
    console.log(data.date);
    $('.nameOfDebtor').val(data.name);
    $('.phoneOfDebtor').val(data.phone);
    $('.emailOfDebtor').val(data.email);
    $('.termOfDebtor').val(data.term);
    $('.pawnOfDebtor').val(data.pawn);
    $('.dateOfDebtor').val((data.date === null) ?
        view.normalDateFormat(new Date()) :
        view.normalDateFormat(new Date(data.date)));
    settingStatusForButton(data.event);

};

doAjaxQuery('GET', '/admin/api/v1/books/' + pathNameUrl[3], null, function(res) {
    if (!res.success) {
        view.showError(res.msg);
        return;
    }
    view.fillBookInfo(res.data);
    fillActionBook(res.data);
});

$('.btnBookAction').click(function(event) {
    var status = $('.btnBookAction').attr('data');
    var data = {
        id: $('#bookID').attr('book-id')
    };
    if (status == 'true') {
        var isChecked = $('#renewalOfBook').prop('checked');
        var obj = (isChecked) ? {
            method: 'POST',
            url: '/admin/api/v1/books/' + data.id + '/renewal',
            func: function() {
                $('#renewalOfBook').prop('checked', false);
                view.disabledElement(false, '.nameOfDebtor', '.phoneOfDebtor', '.emailOfDebtor', '.pawnOfDebtor');
                settingStatusForButton(true);
            }
        } : {
            method: 'GET',
            url: '/admin/api/v1/books/' + data.id + '/take',
            func: function() {
                $('.orderBlock input').val('');
                settingStatusForButton(null);
            }
        };
        var updata = {
            changes: {
                term: $('.termOfDebtor').val(),
                pawn: $('.pawnOfDebtor').val()
            }
        };
        doAjaxQuery(obj.method, obj.url, updata, function(res) {
            if (!res.success) {
                view.showError(res.msg); // to replace the normal popup
                return;
            }
            obj.func();
            // $('.orderBlock input').val('');
            // settingStatusForButton(null);
        });

    } else {
        data.reader = {
            name: $('.nameOfDebtor').val(),
            email: $('.emailOfDebtor').val(),
            phone: $('.phoneOfDebtor').val(),
        };

        doAjaxQuery('POST', '/admin/api/v1/readers/add', data, function(res) {
            if (!res.success) {
                view.showError(res.msg);
                return;
            }
            data.event = {
                reader_id: res.data.reader_id,
                date: new Date(),
                term: $('.dateOfDebtor').val(),
                pawn: $('.pawnOfDebtor').val(),
            };
            doAjaxQuery('POST', '/admin/api/v1/books/' + data.id + '/give', data, function(res) {
                if (!res.success) {
                    view.showError(res.msg);
                    return;
                }
                settingStatusForButton(true);
            });
        });

    }
});

$('#btnEditBook').click(function(event) {
    window.location.href = '/admin/book/update/' + pathNameUrl[3] + '';
});

$('#btnRemoveBook').click(function(event) {
    var data = {
        id: $('#bookID').attr('book-id')
    };
    doAjaxQuery('GET', '/admin/api/v1/books/' + data.id + '/remove', null, function(res) {
        if (!res.success) {
            view.showError(res.msg);
            return;
        }
        window.location.href = '/admin';
    });
});


$('#renewalOfBook').click(function(event) {
    var isChecked = $('#renewalOfBook').prop('checked');
    if (isChecked) {
        $('.btnBookAction').text('Update').attr('data-update', true);
        view.disabledElement(true, '.nameOfDebtor', '.phoneOfDebtor', '.emailOfDebtor', '.pawnOfDebtor');
    } else {
        view.disabledElement(false, '.nameOfDebtor', '.phoneOfDebtor', '.emailOfDebtor', '.pawnOfDebtor');
        var isBusy = $('.btnBookAction').attr('data');
        var val = (isBusy !== 'true') ? null : isBusy;
        settingStatusForButton(val);
    }
});

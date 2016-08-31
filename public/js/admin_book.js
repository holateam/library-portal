var pathNameUrl = $(location).attr('pathname').split('/');

var settingStatusForButton = function(val) {
    var obj = (val == null) ? {
            name: 'Give the book',
            data_busy: false,
            disabled: true,
        } :
        {
            name: 'Pick up the book',
            data_busy: true,
            disabled: false,
        };
    $('.btnBookAction').text(obj.name).attr('data', obj.data_busy);
    $('#renewalOfBook').attr('disabled',obj.disabled);
};

var fillActionBook = function(data) {
    $('.nameOfDebtor').val(data.name);
    $('.phoneOfDebtor').val(data.phone);
    $('.emailOfDebtor').val(data.email);
    $('.dateOfDebtor').val(data.date);
    $('.pawnOfDebtor').val(data.pawn);
    settingStatusForButton(data.event);

};

doAjaxQuery('GET', '/admin/api/v1/books/' + pathNameUrl[3], null, function(res) {
    if (!res.success) {
        view.showPopup('Error', res.msg); // to replace the normal popup
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
        doAjaxQuery('GET', '/admin/api/v1/books/take/' + data.id + '', null, function(res) {
            if (!res.success) {
                view.showPopup('Error', res.msg); // to replace the normal popup
                return;
            }
            $('.orderBlock input').val('');
            settingStatusForButton(null);
        });
    } else {
        data.reader = {
            name: $('.nameOfDebtor').val(),
            email: $('.emailOfDebtor').val(),
            phone: $('.phoneOfDebtor').val(),
        };
        doAjaxQuery('POST', '/admin/api/v1/readers/add', data, function(res) {
            if (!res.success) {
                view.showPopup('Error', res.msg); // to replace the normal popup
                return;
            }
            data.event = {
                reader_id: res.data.reader_id,
                date: new Date(),
                term: $('.dateOfDebtor').val(),
                pawn: $('.pawnOfDebtor').val(),
            };
            doAjaxQuery('POST', '/admin/api/v1/books/give/' + data.id + '', data, function(res) {
                if (!res.success) {
                    view.showPopup('Error', res.msg); // to replace the normal popup
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
    doAjaxQuery('GET', '/admin/api/v1/books/remove/' + data.id + '', null, function(res) {
        if (!res.success) {
            view.showPopup('Error', res.msg); // to replace the normal popup
            return;
        }
        window.location.href = '/admin';
    });
});

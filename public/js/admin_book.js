var pathNameUrl = $(location).attr('pathname').split('/');

var settingStatusForButton = function(val) {
    var obj = (val === null) ? {
        name: 'Выдать книгу',
        data_busy: false,
        disabled: true,
    } : {
        name: 'Принять книгу',
        data_busy: true,
        disabled: false,
    };
    $('.btnBookAction').text(obj.name).attr('data', obj.data_busy);
    $('#renewalOfBook').attr('disabled', obj.disabled);
};


var fillActionBook = function(data) {
    view.fillFields(data,'name,phone,email,term,pawn','val');
    $('#date').val((data.date === null) ?
        view.normalDateFormat(new Date()) :
        view.normalDateFormat(new Date(data.date)));
};

doAjaxQuery('GET', '/admin/api/v1/books/' + pathNameUrl[3], null, function(res) {
    view.fillBookInfo(res.data);
    if(res.data.event !== null){
      fillActionBook(res.data);
    }
    settingStatusForButton(res.data.event);
});

$('.btnBookAction').click(function(event) {
    var status = $('.btnBookAction').attr('data');
    var data = {
        id: $('#id').attr('book-id')
    };
    if (status == 'true') {
        var isChecked = $('#renewalOfBook').prop('checked');
        var obj = (isChecked) ? {
            method: 'POST',
            url: '/admin/api/v1/books/' + data.id + '/renewal',
            func: function() {
                $('#renewalOfBook').prop('checked', false);
                $('#name,#phone,#email,#pawn').css('disabled',false);
                settingStatusForButton(true);
                view.showSuccess('Человек стремится к знаниям!\nНу разве это не прекрасно? ))');
            }
        } : {
            method: 'GET',
            url: '/admin/api/v1/books/' + data.id + '/take',
            func: function() {
                $('.orderBlock input').val('');
                settingStatusForButton(null);
                view.showSuccess('Общий уровень знаний на планете ощутимо повысился! ))');
            }
        };
        var updata = {
            changes: {
                term: $('#term').val(),
                pawn: $('#pawn').val()
            }
        };
        doAjaxQuery(obj.method, obj.url, updata, function(res) {
            obj.func();
            // $('.orderBlock input').val('');
            // settingStatusForButton(null);
        });

    } else {
        data.reader = {
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
        };

        doAjaxQuery('POST', '/admin/api/v1/readers/add', data, function(res) {
          console.log(res);
            data.event = {
                reader_id: res.data.reader_id,
                date: new Date(),
                term: $('#term').val(),
                pawn: $('#pawn').val(),
            };
            doAjaxQuery('POST', '/admin/api/v1/books/' + data.id + '/give', data, function(res) {
                settingStatusForButton(true);
            });
        });
        view.showSuccess('Не забудьте про залог! ))');
    }
});

$('#btnEditBook').click(function(event) {
    window.location.href = '/admin/book/update/' + pathNameUrl[3] + '';
});

$('#btnRemoveBook').click(function(event) {
    var data = {
        id: $('#bookID').attr('book-id')
    };
    view.showConfirm(data.id);
});


$('#renewalOfBook').click(function(event) {
    var isChecked = $('#renewalOfBook').prop('checked');
    if (isChecked) {
        $('.btnBookAction').text('Update').attr('data-update', true);
        $('#name,#phone,#email,#pawn').css('disabled',true);
    } else {
        $('#name,#phone,#email,#pawn').css('disabled',false);
        var isBusy = $('.btnBookAction').attr('data');
        var val = (isBusy !== 'true') ? null : isBusy;
        settingStatusForButton(val);
    }
});

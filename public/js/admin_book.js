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



function fillFields(o,fields){
    console.log(o.name);
    fields=fields.split(',');
    fields.map(function(f){
      
      $('#'+f).val(o[f]);
    });
}

var fillActionBook = function(data) {
    console.log(data);
    fillFields(data,'name,phone,email,term,pawn');
    // $('#name').val(data.name);
    // $('#phone').val(data.phone);
    // $('#email').val(data.email);
    // $('#term').val(data.term);
    // $('#pawn').val(data.pawn);
    $('#date').val((data.date === null) ?
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
            name: $('#name').val(),
            email: $('#email').val(),
            phone: $('#phone').val(),
        };

        doAjaxQuery('POST', '/admin/api/v1/readers/add', JSON.stringify(data), function(res) {
            if (!res.success) {
                view.showError(res.msg);
                return;
            }
            data.event = {
                reader_id: res.data.reader_id,
                date: new Date(),
                term: $('#date').val(),
                pawn: $('#pawn').val(),
            };
            doAjaxQuery('POST', '/admin/api/v1/books/' + data.id + '/give', JSON.stringify(data), function(res) {
                if (!res.success) {
                    view.showError(res.msg);
                    return;
                }
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
        $('#name,#phone,#email,#pawn').css('disabled',true);
    } else {
        $('#name,#phone,#email,#pawn').css('disabled',false);
        var isBusy = $('.btnBookAction').attr('data');
        var val = (isBusy !== 'true') ? null : isBusy;
        settingStatusForButton(val);
    }
});

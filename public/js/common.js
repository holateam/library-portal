/* ----------------------------- begin view ----------------------------------*/
var view = {
    fillFields: function(obj, fields, func) {
        fields = fields.split(/, */);
        fields.map(function(f) {
            ($('#' + f)[func])(obj[f]);
        });
    },
    selectFields: function(fields, func) {
        var obj = {};
        fields = fields.split(/, */);
        fields.map(function(f) {
            var v = ($('#' + f)[func])();
            obj[f] = (v);
        });
        return obj;
    },
    showErrEmail: function() {
        var c = '.input-group';
        $(c).removeClass('has-success');
        $(c).addClass('has-error');
        view.hideElement('.glyphicon-ok');
        view.showElement('.glyphicon-remove');
    },
    showSuccessEmail: function() {
        var c = '.input-group';
        $(c).removeClass('has-error');
        $(c).addClass('has-success');
        view.hideElement('.glyphicon-remove');
        view.showElement('.glyphicon-ok');
    },
    addBookItem: function(book) {
        return $('#pattern').html()
            .replace(/{id}/g, book.id)
            .replace(/{title}/g, book.title)
            .replace(/{author}/g, book.author);
    },
    addBooksItems: function(books, doClean) {
        var content = $('#content');
        var contentHTML = ((doClean) ? '' : content.html());

        for (var i in books) {
            contentHTML += view.addBookItem(books[i]);
        }

        content.html(contentHTML);
        $('.blockI').matchHeight(); // Aligns all the height of the book
    },
    showNot_found: function(searchText, pathUrl) {
        var contentNotFound = $('#not_found').html()
            .replace(/{searchText}/g, searchText);
        $('#content').html(contentNotFound);
    },
    nullToDash: function(string) {
        return (((string == null) || (string == 0)) ? '-' : string);
    },
    addBooksListRow: function(book) {
        var date;
        if (book.date) {
            date = new Date(book.date);
            date.setDate(date.getDate() + book.term);
            date = date.toDateString();
        }

        return $('#pattern').html()
            .replace(/{id}/g, book.id)
            .replace(/{title}/g, book.title)
            .replace(/{author}/g, book.author)
            .replace(/{name}/g, view.nullToDash(book.name))
            .replace(/{email}/g, view.nullToDash(book.email))
            .replace(/{phone}/g, view.nullToDash(book.phone))
            .replace(/{date}/g, view.nullToDash(date))
            .replace(/{pawn}/g, view.nullToDash(book.pawn));
    },
    addBooksList: function(res) {
        var content = $('#table_content');
        var contentHTML = '';
        // console.log("Количество книг: " + res.data.books.length);
        for (var i in res.data.books) {
            contentHTML += view.addBooksListRow(res.data.books[i]);
        }

        content.html(contentHTML);

        $('.book_list_row').click(function() {
            $(location).attr('href', 'admin/book/' + $(this).attr('data-book-id'));
        });
    },
    fillBookInfo: function(book) {
        // console.log(book);
        view.fillFields(book, 'title,author,year,pages,isbn,description', "html");
        $('#id').attr({
            'book-id': book.id,
            'busy': book.event
        });
        $('#bookImg img').attr('src', '/img/books/' + book.id + '.jpg');
        $('.description').html(book.description);
    },
    normalDateFormat: function(date) {
        return date.toISOString().substring(0, 10);
    },
    addPopUpBlock: function(title, text) {
        $('#main').after('<div id="test-modal" class="mfp-hide white-popup-block"><h1>' + title + '</h1><p>' + text + '</p><p><a class="popup-modal-dismiss" href="#">X</a></p></div>');
    },
    showError: function(text) {
        swal('Ооопс!', text, 'error');
    },
    showSuccess: function(text) {
        // console.log(text);
        swal('Отлично!', text, 'success');
    },
    showSubscribe: function(text, bookId) {
        swal({
                title: 'Хотите почитать?',
                text: text,
                type: 'input',
                showCancelButton: true,
                closeOnConfirm: false,
                animation: 'slide-from-top',
                inputPlaceholder: 'Введите свой e-mail',
                confirmButtonColor: '#27AE60',
                showLoaderOnConfirm: true
            },
            function(inputValue) {
                if (inputValue === false) {
                    return false;
                }
                if (!controller.validateEmail(inputValue)) {
                    swal.showInputError('Вы где-то ошиблись. Проверьте введенные данные.');
                    return false;
                }
                doAjaxQuery('GET', '/api/v1/books/' + bookId + '/order', {
                    'email': inputValue
                }, function(res) {
                    view.showSuccess('Ваш e-mail ' + inputValue + '\nдобавлен в список ожидания.');
                });
            });
    },
    showConfirm: function(bookId) {
        swal({
                title: 'Вы уверены?',
                text: 'Согласие приведет к невозвратимому удалению книги',
                type: 'warning',
                showCancelButton: true,
                cancelButtonText: 'Льолик, не надо!',
                confirmButtonColor: '#27AE60',
                confirmButtonText: 'Да, уверен!',
                closeOnConfirm: false
            },
            function() {
                doAjaxQuery('GET', '/admin/api/v1/books/' + bookId + '/remove', null, function(res) {
                    swal({
                            title: 'Удалено!',
                            text: 'Надеюсь, вы осознаете что сейчас произошло ))',
                            type: 'success'
                        },
                        function() {
                            window.location.href = '/admin';
                        });
                });
            });
    },
    addMiniItemSearch: function(pathUrl, book) {
        var id = (book.id == 'no-cover') ? '#not_found' : '#miniItem';
        return $(id).html()
            .replace(/{id}/g, book.id)
            .replace(/{path}/g, pathUrl)
            .replace(/{title}/g, book.title)
            .replace(/{author}/g, book.author);
    },
    addMiniItemsSearch: function(pathUrl, books, text) {
        var content = $('#list');
        content.html('');
        var contentHTML = content.html();
        var limitImetsInSearch = 3;
        var n = 0;
        for (var i in books) {
            n++;
            if (i <= limitImetsInSearch) {
                contentHTML += view.addMiniItemSearch(pathUrl, books[i]);
                content.attr('size', n);
            }
        }
        if (n > limitImetsInSearch) {
            contentHTML += $('#more').html()
                .replace(/{text}/g, text)
                .replace(/{pathUrl}/g, pathUrl);
        }
        content.html(contentHTML);
        content.show('fast');
    }

};
/* ------------------------------- end view ----------------------------------*/

/* --------------------------- begin controller ------------------------------*/
var controller = {
    validateEmail: function(value) {
        var regex = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,10}$/;
        return regex.test(value);
    }
};
/* --------------------------- end controller --------------------------------*/


/* ------------------------ Jquery Ajax function ---------------------------- */

function doAjaxQuery(method, url, data, callback) {
    $.ajax({
        type: method,
        url: url,
        contentType: 'application/json',
        dataType: 'json',
        data: ((method == 'POST') ? JSON.stringify(data) : data),
        success: function(res) {
            if (!res.success) {
                view.showError(res.msg);
                return;
            }
            callback(res);
        },
        error: function(jqXHR, textStatus) {
            view.showError('Ошибка ' + textStatus);
        }
    });
}

$(function() {
    $('.popup-modal').magnificPopup({
        type: 'inline',
        preloader: false,
        focus: '#username',
        modal: true
    });
    $(document).on('click', '.popup-modal-dismiss', function(e) {
        e.preventDefault();
        $.magnificPopup.close();
    });
});

var global = {
    items_limit_on_page_load: 24,
    number_of_items_onscroll: 6,
    filter: 'new'
};

function htmlspecialchars(html) {
    html = html.replace(/&/g, "&amp;");
    html = html.replace(/</g, "&lt;");
    html = html.replace(/>/g, "&gt;");
    html = html.replace(/"/g, "&quot;");
    return html;

}

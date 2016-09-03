/* ----------------------------- begin view ----------------------------------*/
var view = {
    showElement: function(element) {
        for (var i = 0; i < arguments.length; i++)
            $(arguments[i]).css('display', 'block');
    },
    hideElement: function(element) {
        for (var i = 0; i < arguments.length; i++)
            $(arguments[i]).css('display', 'none');
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
    },
    showZeroSearch: function(searchText, pathUrl) {
        if (pathUrl === '') {
            $('#content .row> :not(#pattern)').remove();
        } else {
            $('#bookID').remove();
            $('#content .row .book_list_row:not(#pattern)').remove();
        }
        $('#zero_search').remove();
        var textZeroSearch = '<div id="zero_search"><div class="col-md-2 col-sm-2 col-lg-2"><img src="/img/books/no-cover.jpg"></div><div class="col-md-10 col-sm-10 col-lg-10"><h3>Find "' + searchText + '" was harder than we thought</h3> <p>Please ensure that the request is correct or reframe it.</p></div></div></div>';
        $('#content .row').append(textZeroSearch);
    },
    nullToDash: function(string) {
        return (((string == null) || (string == 0)) ? '-' : string);
    },
    addBookListRow: function(book) {
        var date;
        if (book.date) {
            date = new Date(book.date);
            date.setDate(date.getDate() + book.term);
            date = date.toDateString();
        }
        $('#pattern').clone().removeAttr('id').attr('book-id', book.id)
            .html('<td>' + book.title + '</td><td>' + book.author + '</td><td>' + view.nullToDash(book.name) + '</td><td>' +
                view.nullToDash(book.email) + '</td><td>' + view.nullToDash(book.phone) + '</td><td>' +
                view.nullToDash(date) + '</td><td>' + view.nullToDash(book.pawn) + '</td>')
            .click(function() {
                $(location).attr('href', 'admin/book/' + book.id);
            })
            .css('display', 'table-row').css('cursor', 'pointer').appendTo('.table tbody');
    },
    addBooksList: function(books) {
        console.log('addBooksList');
        $('.table-hover').css('display', 'block');
        $('#bookID').remove();
        $('.book_list_row:not(#pattern)').remove();
        $('#zero_search').remove();

        for (var i in books) {
            view.addBookListRow(books[i]);
        }
    },
    fillBookInfo: function(book) {
        $('#bookID').attr('book-id', book.id);
        $('#bookImg img').attr('src', '/img/books/' + book.id + '.jpg');
        $('#titleBook').html(book.title);
        $('#author').html(book.author);
        $('#year').html(book.year);
        $('#pages').html(book.pages);
        $('#isbn').html(book.isbn);
        $('#bookDescriptionText').html(book.description);
        $('#bookID').attr('busy', book.event);

        var nameClassIsBook = (book.event === null) ? '.freeBook' : '.busyBook';
        $(nameClassIsBook).css('display', 'block');
    },
    normalDateFormat: function(date) {
        return date.toISOString().substring(0, 10);
    },
    disabledElement: function(boolean, element) {
        for (var i = 1; i < arguments.length; i++)
            $(arguments[i]).attr('disabled', boolean);
    },
    addPopUpBlock: function(title, text) {
        $('#main').after('<div id="test-modal" class="mfp-hide white-popup-block"><h1>' + title + '</h1><p>' + text + '</p><p><a class="popup-modal-dismiss" href="#">X</a></p></div>');
    },
    showError: function(text) {
        swal("Ооопс!", text, "error");
    },
    showSuccess: function(text) {
        swal("Отлично!", text, "success");
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
        data: data,
        success: callback,
        error: function(jqXHR,textStatus) {
            view.showError('Ошибка '+textStatus);
        }
    });
}

/* ------------ Hide the element when I toscroll to the desired item -------- */
// var pathNameUrl = $(location).attr('pathname').split('/');
// if (pathNameUrl[1] !== 'admin') {
//     function come(elem, val) {
//         var docViewTop = $(window).scrollTop(),
//             docViewBottom = docViewTop + $(window).height(),
//             elemTop = $(elem).offset().top,
//             elemBottom = elemTop - val + $(elem).height();
//         console.log("docViewTop:" + docViewTop + ', docViewBottom: ' + docViewBottom + 'elemTop:' + elemTop + ', elemBottom:' + elemBottom);
//         return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
//     }
//
//     $(document).scroll(function() {
//         sidebarBottom = 240; // 240px = 160px margin + 80px height sidebar
//         if (!come('.contacts', sidebarBottom)) {
//             $('#sidebar').css({
//                 'visibility': 'visible'
//             });
//         }
//         if (come('.contacts', sidebarBottom)) {
//             $('#sidebar').css({
//                 'visibility': 'hidden'
//             });
//         }
//     });
// }



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
    view_limit_on_page_load : 12,
    total_items_exist : Number.POSITIVE_INFINITY,
    number_of_items_onscroll : 6
};
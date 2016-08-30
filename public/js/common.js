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
        $('#pattern').clone().removeAttr('id').attr('book-id', book.id)
            .find('img').attr('src', '/img/books/' + book.id + '.jpg').end()
            .find('.title').attr('data-book-title', book.title).html(book.title).end()
            .find('.author').attr('data-book-author', book.author).html(book.author).end()
            .find('a').attr('href', '/book/' + book.id).end()
            .css('display', 'block').appendTo('#content .row');
    },
    addBooksItems: function(books) {
        // $('.book_item:not(#pattern)').remove();
        $('#content .row> :not(#pattern)').remove();

        for (var i in books) {
            view.addBookItem(books[i]);
        }
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
        $('#bookID').attr('busy', book.busy);

        var nameClassIsBook = (book.busy) ? '.busyBook' : '.freeBook';
        $(nameClassIsBook).css('display', 'block');
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
        data: JSON.stringify(data),
        success: callback
    });
}

/* ------------ Hide the element when I toscroll to the desired item -------- */
function come(elem,val) {
        var docViewTop = $(window).scrollTop(),
            docViewBottom = docViewTop + $(window).height(),
            elemTop = $(elem).offset().top,
            elemBottom = elemTop - val + $(elem).height();
        console.log("docViewTop:" +docViewTop+', docViewBottom: '+docViewBottom+ 'elemTop:'+elemTop+', elemBottom:' +elemBottom);
        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }
    var isVisible = true;

    $(document).scroll(function() {
        sidebarBottom = 240; // 240px = 160px margin + 80px height sidebar
        if (!come(".contacts",sidebarBottom)) {
            isVisible = true;
            $('#sidebar').css({'visibility':'visible'});
        }
        if (come(".contacts",sidebarBottom) && isVisible) {
          $('#sidebar').css({'visibility':'hidden'});
        }
    });

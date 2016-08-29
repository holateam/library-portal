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
    showZeroSearch: function(searchText,pathUrl){
      if(pathUrl ===''){
        $('#content .row> :not(#pattern)').remove();
      }else {
        $('#content .row .book_list_row:not(#pattern)').remove();
      }
      var textZeroSearch = '<div id="zero_search"><div class="col-md-2 col-sm-2 col-lg-2"><img src="../img/zero_search.jpg"></div><div class="col-md-10 col-sm-10 col-lg-10"><h3>Find "'+searchText+'" was harder than we thought</h3> <p>Please ensure that the request is correct or reframe it.</p></div></div></div>';
      $('#content .row').append(textZeroSearch);
    },
    nullToString: function(string) {
        return (((string == null) || (string == 0)) ? '-' : string);
    },
    addBookListRow: function(book) {
        $('#pattern').clone().removeAttr('id').attr('book-id', book.id)
            .html('<td>' + book.title + '</td><td>' + book.author + '</td><td>' + view.nullToString(book.name) + '</td><td>' +
                view.nullToString(book.email) + '</td><td>' + view.nullToString(book.phone) + '</td><td>' + view.nullToString(book.term) +
                '</td><td>' + view.nullToString(book.pawn) + '</td><td>' + view.nullToString(book.status) + '</td>')
            .click(function () {
                $(location).attr('href', 'admin/book/' + book.id);
            })
            .css('display', 'table-row').css('cursor', 'pointer').appendTo('.table tbody');
    },
    addBooksList: function(books) {
        $('#content .row .book_list_row:not(#pattern)').remove();
        $('#zero_search').remove();

        for (var i in books) {
            view.addBookListRow(books[i]);
        }
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

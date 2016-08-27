function addBookListRow(book) {
    $('#pattern').clone().removeAttr('id').attr('book-id', book.id)
        .html('<td>' + book.title + '</td><td>' + book.author + '</td><td>' + nullToString(book.name) + '</td><td>' +
            nullToString(book.email) + '</td><td>' + nullToString(book.phone) + '</td><td>' + nullToString(book.term) +
            '</td><td>' + nullToString(book.pawn) + '</td><td>' + nullToString(book.status) + '</td>')
        .css('display', 'table-row').appendTo('.table tbody');
}

function nullToString(string) {
    return (((string == null) || (string == 0)) ? '-' : string);
}

function addBooksList(books) {
    $('.book_list_row:not(#pattern)').remove();

    for (var i in books) {
        addBookListRow(books[i]);
    }
}

doAjaxQuery('GET', '/admin/api/v1/books?filter=all', null, function (res) {
    if (!res.success) {
        alert(res.msg);
        return;
    }
    addBooksList(res.data.books);
});
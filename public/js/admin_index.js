function addBookListRow(book) {
    // if (book.event_id) {
    //     doAjaxQuery('GET', '/admin/api/v1/books/give/' + book.id, null, function (res) {
    //         if (!res.success) {
    //             alert(res.msg);
    //             return;
    //         }
    //         addBooksListRows(res.data.books);
    //     })
    // }
    $('#pattern').clone().removeAttr('id').attr('book-id', book.id)
        .html('<td>' + book.title + '</td><td>' + book.author + '</td><td>reader</td><td>readers_phone</td><td>readers mail</td><td>return date</td><td>deposit</td><td>on hand</td>')
        .css('display', 'block').appendTo('.table tbody');
}

function addBooksListRows(books) {
    $('.book_list_row:not(#pattern)').remove();

    for (var i in books) {
        addBookListRow(books[i]);
    }
}

doAjaxQuery('GET', '/admin/api/v1/books?filter=new', null, function (res) {
    if (!res.success) {
        alert(res.msg);
        return;
    }
    console.log(res);
    addBooksListRows(res.data.books);
});
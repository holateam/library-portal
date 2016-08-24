function fillBookInfo(book) {
    $('.bookImg img').attr('src', '/img/books/' + book.id + '.jpg');
    $('.titleBook').html(book.title);
    $('#author').html('author: ' + book.author);
    $('#year').html('year: ' + book.year);
    $('#pages').html('pages: ' + book.pages);
    $('#isbn').html('ISBN: ' + book.isbn);
    $('.bookDescription p').html(book.description);
}

doAjaxQuery('GET', '/api/v1/books/' + $(location).attr('pathname').substr(6), null, function (res) {
    if (!res.success) {
        alert(res.msg);
        return;
    }
    fillBookInfo(res.data);
});

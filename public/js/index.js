function addBookItem(book) {
    $('#pattern').clone().removeAttr('id').attr('book-id', book.id)
        .find('img').attr('src', '/img/books/' + book.id + '.jpg').end()
        .find('.title').attr('data-book-title', book.title).html(book.title).end()
        .find('.author').attr('data-book-author', book.author).html(book.author).end()
        .find('a').attr('href', '/book/' + book.id).end()
        .css('display', 'block').appendTo('#content .row');
}

function addBooksItems(books){
    $('.book_item:not(#pattern)').remove();

    for (var i in books) {
        addBookItem(books[i]);
    }
}

if ($(location).attr('search')) {
    $('.sidebar_item[data-filter=' + $(location).attr('search').substr(8) + ']').click();
} else {
    $('.sidebar_item[data-filter=new]').click();
}

window.history.replaceState({}, '', $(location).attr('origin'));

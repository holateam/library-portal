function addBookItem(book) {
    $('#pattern').clone().removeAttr('id').attr('book-id', book.id)
        .find('img').attr('src', '/img/books/' + book.id + '.jpg').end()
        .find('.title').html(book.title).end()
        .find('.author').html(book.author).end()
        .css('display', 'block').appendTo('#content .row');
}

function addBooksItems(books){
    $('.book_item:not(#pattern)').remove();

    for (var i in books) {
        addBookItem(books[i]);
    }

    $('.details, .book_item a').click(function () {
        $(location).attr('href', '/book/' + $(this).closest('.book_item').attr('book-id'));
    });
}

var filter = $(location).attr('search');

if (filter.indexOf('?filter') == -1) {
    $('.sidebar_item[data-filter=new]').click();
} else {
    $('.sidebar_item[data-filter=' + filter.substr(8) + ']').click();
}

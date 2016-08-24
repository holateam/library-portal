function addBookItem(book) {
    //console.log(book);
    $('#pattern').clone().removeAttr('id').attr('book-id', book.id)
        .find($('a')).attr('img', book.id + '.jpg').end()
        .find($('.title')).html(book.title).end()
        .find($('.author')).html(book.author).end()
        .css('display', 'block').appendTo('#content .row');
}

function addBooksItems(books){
    $('.book_item:not(#pattern)').remove();

    for (var i in books) {
        addBookItem(books[i]);
    }

    $('.details, .book_item a').click(function () {
        console.log($(location));
        $(location).attr('href', 'books/' + $(this).closest('.book_item').attr('book-id'));
    });
}

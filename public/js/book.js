console.log($(location).attr('pathname'));


// doAjaxQuery('GET', '/api/v1/books/' + context.attr('data-filter'), null, function (res) {
//     if (!res.success) {
//         alert(res.msg);
//         return;
//     }
//     addBooksItems(res.data.books);
// });
//
// $('#pattern').clone().removeAttr('id').attr('book-id', book.id)
//     .find('img').attr('src', '/img/books/' + book.id + '.jpg').end()
//     .find('.title').attr('data-book-title', book.title).html(book.title).end()
//     .find('.author').attr('data-book-author', book.author).html(book.author).end()
//     .find('a').attr('href', '/book/' + book.id).end()
//     .css('display', 'block').appendTo('#content .row');
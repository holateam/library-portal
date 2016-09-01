function addBookItemOnScroll(book) {
    $('#pattern').clone().removeAttr('id').attr('book-id', book.id)
        .find('img').attr('src', '/img/books/' + book.id + '.jpg').end()
        .find('.title').attr('data-book-title', book.title).html(book.title).end()
        .find('.author').attr('data-book-author', book.author).html(book.author).end()
        .find('a').attr('href', '/book/' + book.id).end()
        .css('display', 'block').appendTo('#content .row');
}

function addBooksItemsOnScroll(books) {
    for (var i in books) {
        addBookItemOnScroll(books[i]);
    }

    $('.details, .book_item a').click(function() {
        $(location).attr('href', '/book/' + $(this).closest('.book_item').attr('book-id'));
    });
}

var search = $(location).attr('search');
var stringToFind = '?filter=';
var stringPosition = search.indexOf(stringToFind);

if (stringPosition == 0) {
    $('.sidebar_item[data-filter=' + search.substr(stringToFind.length) + ']').click();
} else {
    $('.sidebar_item[data-filter=new]').click();
}

window.history.replaceState({}, '', $(location).attr('origin'));

// get the next one potion of book_items while scrolling
var viewPortion = 8;
var offsetCoef = 0;
var isScrollQuerySended = false;

$(document).scroll(function() {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        offsetCoef++;
        var offset = offsetCoef * viewPortion;
        var filter = sessionStorage.filter ? sessionStorage.filter : 'all';
        if (!isScrollQuerySended) {
            doAjaxQuery('GET', '/api/v1/books?filter=' + filter + '&limit=' + viewPortion + '&offset=' + offset, null, function(res) {
                isScrollQuerySended = true;

                if (res.success) {
                    isScrollQuerySended = false;
                }
                addBooksItemsOnScroll(res.data.books);
                
            });
        }
    }
});

$('#filter_new').click(function () {
    doAjaxQuery('GET', '/api/v1/books?fiter=new', null, view.addBooksItems);
});

$('#filter_popular').click(function () {
    doAjaxQuery('GET', '/api/v1/books?fiter=popular', null, view.addBooksItems);
});

$('#filter_all').click(function () {
    doAjaxQuery('GET', '/api/v1/books?fiter=all', null, view.addBooksItems);
});

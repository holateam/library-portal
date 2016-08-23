$('.sidebar li').click(function () {
    var _this = $(this);
    doAjaxQuery('GET', '/api/v1/books?filter=' + _this.attr('data-filter'), null, function (err, data) {
        if (err) {
            throw err;
        }
        addBooksItems(data.books);
    });
});
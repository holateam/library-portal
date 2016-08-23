$('#sidebar li').click(function () {
    var _this = $(this);
    controller.doAjaxQuery('GET', '/api/v1/books?filter=' + _this.attr('data-filter'), null, function (err, data) {
        if (err) {
            throw err;
        }
        view.addBooksItems(data.books);
    });
});
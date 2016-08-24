var sidebarItems = $('#sidebar li');
sidebarItems.click(function () {
    var _this = $(this);
    sidebarItems.removeClass('active');
    _this.closest('li').addClass('active');
    // controller.doAjaxQuery('GET', '/api/v1/books?filter=' + _this.attr('data-filter'), null, function (err, data) {
    //     if (err) {
    //         throw err;
    //     }
    //     view.addBooksItems(data.books);
    // });
    view.addBookItem();
});

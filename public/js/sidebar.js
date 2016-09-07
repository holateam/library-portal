var sidebarItems = $('.sidebar_item');

sidebarItems.click(function (event) {
    var context = $(this);
    global.filter = context.attr('data-filter');
    $('#search').val('');
    sidebarItems.removeClass('active');
    context.closest('.filterBlock a').addClass('active');

    $(location).attr('pathname');

    if ($(location).attr('pathname') == '/') {
        event.preventDefault();

        doAjaxQuery('GET', '/api/v1/books', {
            'filter': global.filter,
            'limit': global.view_limit_on_page_load
        }, function (res) {
            view.addBooksItems(res.data.books, true);
            global.total_items_exist = res.data.total.amount;
        });
    }
});

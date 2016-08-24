var sidebarItems = $('.sidebar_item');

sidebarItems.click(function (event) {
    var context = $(this);

    sidebarItems.removeClass('active');
    context.closest('li').addClass('active');

    if ($(location).attr('pathname') == '/') {
        event.preventDefault();
        doAjaxQuery('GET', '/api/v1/books?filter=' + context.attr('data-filter'), null, function (res) {
            if (!res.success) {
                alert(res.msg);
                return;
            }
            addBooksItems(res.data.books);
        });
    }
});

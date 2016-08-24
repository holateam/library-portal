var sidebarItems = $('.sidebar_item');
sidebarItems.click(function () {
    var context = $(this);

    sidebarItems.removeClass('active');
    context.closest('li').addClass('active');

    var filter = context.attr('data-filter');

    if ($(location).attr('pathname') != '/') {
        $(location).attr('href', '/?filter=' + filter);
    } else {
        doAjaxQuery('GET', '/api/v1/books?filter=' + filter, null, function (res) {
            if (!res.success) {
                alert(res.msg);
                return;
            }
            addBooksItems(res.data.books);
        });
    }
});

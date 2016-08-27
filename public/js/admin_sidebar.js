var sidebarItems = $('.sidebar_item');

sidebarItems.click(function(event) {
    var context = $(this);

    sidebarItems.removeClass('active');
    context.closest('li').addClass('active');

    var pathname = $(location).attr('pathname');

    if (pathname == '/admin') {
        event.preventDefault();
        doAjaxQuery('GET', '/admin/api/v1/books?filter=' + context.attr('data-filter'), null, function(res) {
            if (!res.success) {
                alert(res.msg);
                return;
            }
            addBooksList(res.data.books);
        });
    }
});

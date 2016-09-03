var sidebarItems = $('.sidebar_item');

sidebarItems.click(function(event) {
    var context = $(this);
    var filter = context.attr('data-filter');
    sessionStorage.setItem('admin_filter', filter);

    sidebarItems.removeClass('active');
    context.closest('li').addClass('active');

    var pathname = $(location).attr('pathname');

    if (pathname == '/admin') {
        event.preventDefault();
        doAjaxQuery('GET', '/admin/api/v1/books', {'filter': filter}, function(res) {
            view.addBooksList(res.data.books);
        });
    }
});

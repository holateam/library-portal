var sidebarItems = $('.sidebar_item');
var loadLimit = 12;

sidebarItems.click(function(event) {
    var context = $(this);
    var filter = context.attr('data-filter');
    sessionStorage.setItem('filter', filter);

    sidebarItems.removeClass('active');
    context.closest('.filterBlock a').addClass('active');

    $(location).attr('pathname');

    if ($(location).attr('pathname') == '/') {
        event.preventDefault();

        doAjaxQuery('GET', '/api/v1/books', {'filter': filter, 'limit': loadLimit}, function(res) {
            view.addBooksItems(res.data.books, true);
        });
    }
});

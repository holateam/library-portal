var sidebarItems = $('.sidebar_item');
var startLoadLimit = 12;
sidebarItems.click(function(event) {
    var context = $(this);
    var filter = context.attr('data-filter');
    sessionStorage.setItem('filter', filter);

    sidebarItems.removeClass('active');
    context.closest('.filterBlock a').addClass('active');

    if ($(location).attr('pathname') == '/') {
        event.preventDefault();

        doAjaxQuery('GET', '/api/v1/books', {'filter': filter, 'limit': startLoadLimit}, function(res) {
            if (!res.success) {
                view.showError(res.msg);
                return;
            }
            global.total_items_exist = res.data.total.amount;
            view.addBooksItems(res.data.books,true);
        });
    }
});

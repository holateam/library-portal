var sidebarItems = $('.sidebar_item');
var loadLimit = 12;
sidebarItems.click(function(event) {
    var context = $(this);
    // var fp = (context.attr('data-filter').substring('').toLowerCase());
    // fp = (fp) ? fp : "new";
    var filter = context.attr('data-filter')
    sessionStorage.setItem('filter', filter);
    // offsetCoef = 0;
    // $('body').scrollTop(0);

    sidebarItems.removeClass('active');
    context.closest('.filterBlock a').addClass('active');

    if ($(location).attr('pathname') == '/') {
        event.preventDefault();

        doAjaxQuery('GET', '/api/v1/books?filter=' + filter + '&limit=' + loadLimit, null, function(res) {
            if (!res.success) {
                view.showError(res.msg);
                return;
            }
            view.addBooksItems(res.data.books,true);
        });
    }
});

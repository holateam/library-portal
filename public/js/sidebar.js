var sidebarItems = $('.sidebar_item');
var loadLimit = 12;
sidebarItems.click(function(event) {
    var context = $(this);
    var fp = (context.attr('data-filter').substring('').toLowerCase());
    fp = (fp) ? fp : "new";
    sessionStorage.setItem('filter', fp);
    offsetCoef = 0;
    $('body').scrollTop(0);

    sidebarItems.removeClass('active');
    context.closest('.filterBlock a').addClass('active');

    if ($(location).attr('pathname') == '/') {
        event.preventDefault();

        doAjaxQuery('GET', '/api/v1/books?limit=' + loadLimit + '&filter=' + context.attr('data-filter'), null, function (res) {
            if (!res.success) {
                view.showPopup('Error', res.msg);
                return;
            }
            view.addBooksItems(res.data.books);
        });
    }
});

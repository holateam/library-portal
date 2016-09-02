var sidebarItems = $('.sidebar_item');

sidebarItems.click(function(event) {
    var context = $(this);
    sessionStorage.setItem('filter', context.text().toLowerCase());
    offsetCoef = 0;
    $('body').scrollTop(0);

    sidebarItems.removeClass('active');
    context.closest('.filterBlock a').addClass('active');

    if ($(location).attr('pathname') == '/') {
        event.preventDefault();
        doAjaxQuery('GET', '/api/v1/books?filter=' + context.attr('data-filter'), null, function(res) {
            if (!res.success) {
                view.showError(res.msg);
                return;
            }
            view.addBooksItems(res.data.books);
        });
    }
});

$('.sidebar_item').click(function (event) {
    event.preventDefault();
    var filter = $(this).attr('data-filter');
    $('#search').val('');
    setSidebarActiveButton($(this), filter);
    (function () {
            var data = {
                filter: filter || 'new',
                offset: getParameterByName('offset'),
                limit: global.items_limit_on_page_load
            };
        loadIndexPage(data);
        isScrollRunning = false;
    }());
});

function changeHistoryStateWithParams(action, filter, offset) {
    if (action = ''){
        return;
    }

    offset = parseInt(offset);
    var count = offset ? global.number_of_items_onscroll : global.items_limit_on_page_load;
    var queryString = '?filter=' + filter + '&count=' + (offset + count);
    if (action === 'push') {
        window.history.pushState('','',queryString);
    } else {
        window.history.replaceState('','',queryString);
    }
}

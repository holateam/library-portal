$('.sidebar_item[data-filter=' + global.filter + ']').click();

$(document).ready(function () {
    window.history.replaceState({}, '', $(location).attr('origin'));

    $(document).scroll(function () {
        if ($(document).height() - $(window).scrollTop() <= 2 * $(window).height()) {
            drawItemsOnScroll();
        }
    });

    var drawItemsOnScroll = (function () {
        var offset = global.view_limit_on_page_load;
        var numOfItems = global.number_of_items_onscroll;
        var filter = global.filter;
        var exist = global.total_items_exist;
        return function () {
            if (offset < exist)
                doAjaxQuery('GET', '/api/v1/books', {
                    'filter': global.filter,
                    'limit': numOfItems,
                    'offset': offset
                }, function (res) {
                    view.addBooksItems(res.data.books, false);
                });
            offset += numOfItems;
        }
    }());

});

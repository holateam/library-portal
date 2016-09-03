var filter = sessionStorage.getItem('filter') || 'new';
var offsetScrollCoef = (global.view_limit_on_page_load / global.number_of_items_onscroll) - 1;
offsetScrollCoef = (offsetScrollCoef >= 0) ? offsetScrollCoef : 0;
$('.sidebar_item[data-filter=' + filter + ']').click();

window.history.replaceState({}, '', $(location).attr('origin'));

$(document).scroll(function () {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
        offsetScrollCoef++;
        var offset = offsetScrollCoef * global.number_of_items_onscroll;

        if (offset < global.total_items_exist) {
            doAjaxQuery('GET', '/api/v1/books', {
                'filter': filter,
                'limit': global.number_of_items_onscroll,
                'offset': offset
            }, function (res) {
                view.addBooksItems(res.data.books, false);
            });
        }
    }
});

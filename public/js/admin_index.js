var search = $(location).attr('search');

if (search) {
    var filterPosition = search.indexOf('=') + 1;
    $('.sidebar_item[data-filter=' + search.substr(filterPosition) + ']').click();
} else {
    $('.sidebar_item[data-filter=all]').click();
}

window.history.replaceState({}, '', $(location).attr('origin') + $(location).attr('pathname'));

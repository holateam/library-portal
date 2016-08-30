var search = $(location).attr('search');
var stringToFind = '?filter=';
var stringPosition = search.indexOf(stringToFind);

if (stringPosition == 0) {
    $('.sidebar_item[data-filter=' + search.substr(stringToFind.length) + ']').click();
} else {
    $('.sidebar_item[data-filter=all]').click();
}

window.history.replaceState({}, '', $(location).attr('origin') + $(location).attr('pathname'));
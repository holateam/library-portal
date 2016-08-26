
if ($(location).attr('search')) {
    $('.sidebar_item[data-filter=' + $(location).attr('search').substr(8) + ']').click();
} else {
    $('.sidebar_item[data-filter=new]').click();
}

window.history.replaceState({}, '', $(location).attr('origin'));

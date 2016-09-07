var filter = sessionStorage.getItem('admin_filter') || 'all';
$('.sidebar_item[data-filter=' + filter + ']').click();

window.history.replaceState({}, '', $(location).attr('origin') + $(location).attr('pathname'));

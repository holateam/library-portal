var filter = sessionStorage.getItem('filter') || 'new';
$('.sidebar_item[data-filter=' + filter + ']').click();

window.history.replaceState({}, '', $(location).attr('origin'));

var viewPortion = 12;
var offsetCoef = 0;

$(document).scroll(function () {
  if ($(window).scrollTop() + $(window).height() == $(document).height()) {
    offsetCoef++;
    var offset = offsetCoef * viewPortion;
    doAjaxQuery('GET', '/api/v1/books', {'filter': filter, 'limit': viewPortion, 'offset': offset}, function (res) {
      view.addBooksItems(res.data.books, false);
    });
  }
});

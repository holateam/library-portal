var pathNameUrl = $(location).attr('pathname').split('/');
var pathUrl = (pathNameUrl[1] == 'admin') ? '/admin' : '';

/* ------------------- Get the query in database searching -------------------*/
var requestBooksSearch = function() {
    var text = $('#search').val();
    text = text.replace(/(^\s+|\s+$)/g, '');
    var textEncode = encodeURIComponent(text); // shielding request
    doAjaxQuery('GET', '' + pathUrl + '/api/v1/books?search=' + textEncode + '', null,
        function(res) {
            if (res.data.total.amount > 0) {
                (pathUrl === '') ? view.addBooksItems(res.data.books): view.addBooksList(res.data.books);
            } else {
                console.log("zero");
                view.showNot_found(text, pathUrl);
            }
        });
};

/* ---------- Live search if the search did not introduced n time ----------- */
$('#search').keydown(function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        requestBooksSearch();
    }
    var text = $(this).val();
    if (text.length > 0) {
        if (!(event.keyCode >= 33 && event.keyCode <= 40) &&
            !(event.keyCode >= 16 && event.keyCode <= 20) &&
            (event.keyCode !== 27) &&
            (event.keyCode !== 13)) {
            var task = setTimeout(requestBooksSearch, 1000);
        }

        $('#search').keydown(function(event) {
            if (!(event.keyCode >= 33 && event.keyCode <= 40) &&
                !(event.keyCode >= 16 && event.keyCode <= 20)) {
                clearTimeout(task);
            }
        });
    }
});

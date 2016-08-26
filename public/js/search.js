var requestBooksSearch = function() {
    var text = $('#search').val();
    var textEncode = encodeURIComponent(text);
    console.log(text);
    doAjaxQuery('GET', '/api/v1/books?search=' + textEncode + '', null,
        function(res) {
            if (!res.success) {
                alert(res.msg); // to replace the normal popup
            } else {
                view.addBooksItems(res.data.books);
            }
        });
};

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

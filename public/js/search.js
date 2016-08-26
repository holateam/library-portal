var requestBooksSearch = function() {
    var text = $('#search').val();
    doAjaxQuery('GET', '/api/v1/books?search=' + text + '', null,
        function(res) {
            if (!res.success) {
                alert(res.msg);
                return;
            } else {
                addBooksItems(res.data.books);
                console.log(JSON.stringify(res));
                console.log("Запрос по поиску выполнен: " + res.success);
            }
        });
};

$('#search').keydown(function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        requestBooksSearch();
    }
    var text = $(this).val();
    if (text.length > 1) {
        if (!(event.keyCode >= 33 && event.keyCode <= 40) && !(event.keyCode >= 13 && event.keyCode <= 20) && !(event.keyCode >= 16 && event.keyCode <= 20) && (event.keyCode !== 27) && (event.keyCode !== 13)) {
            var task = setTimeout(requestBooksSearch, 2000);
        }

        $('#search').keydown(function(event) {
            if (!(event.keyCode >= 33 && event.keyCode <= 40) && !(event.keyCode >= 16 && event.keyCode <= 20) && !(event.keyCode >= 16 && event.keyCode <= 20)) {
                clearTimeout(task);
            }
        });
    }
});

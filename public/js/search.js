var pathNameUrl = $(location).attr('pathname').split('/');
var pathUrl = (pathNameUrl[1] == 'admin') ? '/admin' : '';

/* ------------------- Get the query in database searching -------------------*/
var requestBooksSearch = function() {
    var text = $('#search').val();
    if (text.length > 0) {
        text = text.replace(/(^\s+|\s+$)/g, '');
        var textEncode = encodeURIComponent(text); // shielding request
        doAjaxQuery('GET', '' + pathUrl + '/api/v1/books?search=' + textEncode + '', null,
            function(res) {
                if (res.data.total.amount > 0) {
                    var books = res.data.books;
                    view.addMiniItemsSearch(pathUrl,books);
                } else {
                    view.addMiniItemsSearch(pathUrl,[{
                        id: 'no-cover',
                        title: 'По запросу "' + text + '" ничего не найдено :(',
                        author: 'Миллионы натренированных обезъян облазили весю библиотеку и не нашли ничего подходящего, что могло бы соответствовать Вашему запросу.'
                    }]);
                }
            });
    } else {
        $('#list').html('').hide();
    }
};
$('body').click(function(event) {
    // console.log($(event.target).attr('id'));
    if ($(event.target).attr('id') !== 'search' && $(event.target).attr('id') !== 'list') {
        $('#list').hide(200);
    }
});

/* ---------- Live search if the search did not introduced n time ----------- */
$('#search').keydown(function(event) {
    var text = $(this).val();
    if (event.keyCode === 13) {
        event.preventDefault();
        // if(text.length > 0){
        requestBooksSearch();
        // }else{
        //   $('#list').html('').hide();
        // }
    }
    if (text.length > 0) {
        if (!(event.keyCode >= 33 && event.keyCode <= 40) &&
            !(event.keyCode >= 16 && event.keyCode <= 20) &&
            (event.keyCode !== 27) &&
            (event.keyCode !== 13)) {
            var task = setTimeout(requestBooksSearch, 500);
        }

        $('#search').keydown(function(event) {
            if (!(event.keyCode >= 33 && event.keyCode <= 40) &&
                !(event.keyCode >= 16 && event.keyCode <= 20)) {
                clearTimeout(task);
            }
        });
    }
});

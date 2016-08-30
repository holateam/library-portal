function fillBookEditor(book) {
    console.log(book);
    $('#book_title').val(book.title);
    $('#book_author').val(book.author);
    $('#book_year').val(book.year);
    $('#book_pages').val(book.pages);
    $('#book_isbn').val(book.isbn);
    $('#book_description').val(book.description);
    $('#book_img').attr('src', '/img/books/' + book.id + '.jpg');
}

$('#book_img_upload').change(function() {
    var file = $(this)[0].files[0];
    var fileReader = new FileReader();

    fileReader.onload = function() {
        $('#book_img').attr('src', fileReader.result);
    };

    fileReader.readAsDataURL(file);
});

var pathname = $(location).attr('pathname');
var stringToFind = '/admin/book/update/';
var stringPosition = pathname.indexOf(stringToFind);

if (stringPosition == 0) {
    doAjaxQuery('GET', '/admin/api/v1/books/' + pathname.substr(stringToFind.length), null, function(res) {
        if (!res.success) {
            alert(res.msg); // to replace the normal popup
        }
        fillBookEditor(res.data);
    });
}
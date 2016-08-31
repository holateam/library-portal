var fileInBase64;

function fillBookEditor(book) {
    $('#book_title').val(book.title);
    $('#book_author').val(book.author);
    $('#book_year').val(book.year);
    $('#book_pages').val(book.pages);
    $('#book_isbn').val(book.isbn);
    $('#book_description').val(book.description);
    $("#book_img_upload").fileinput({
        initialPreview: [
               '/img/books/' + book.id + '.jpg',
           ],
           initialPreviewAsData: true,
           initialPreviewConfig: [
                {caption: ""+book.id+".jpg", width: "120px", key: 1, showDelete: false}
            ],
           overwriteInitial: true,
           initialCaption: ""+book.id+".jpg",
        allowedFileExtensions: ["jpg", "png", "gif"],
        minImageWidth: 50,
        minImageHeight: 50
    });

    // $('.kv-file-content img').attr('src', '/img/books/' + book.id + '.jpg');
}

$('#book_img_upload').change(function() {
    var file = $(this)[0].files[0];
    var fileReader = new FileReader();

    fileReader.onload = function() {
        fileInBase64 = fileReader.result;
        $('#book_img').attr('src', fileInBase64);
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
}else {
  $("#book_img_upload").fileinput({
     allowedFileExtensions: ["jpg", "png", "gif"],
     minImageWidth: 50,
     minImageHeight: 50
 });
}

$('#book_save').click(function () {
    var data = {
        changes: {
            title: $('#book_title').val(),
            author: $('#book_author').val(),
            year: $('#book_year').val(),
            pages: $('#book_pages').val(),
            isbn: $('#book_isbn').val(),
            description: $('#book_description').val(),
            img: fileInBase64
        }
    };
    doAjaxQuery('POST', '/admin/api/v1/books/' + ((stringPosition == 0) ? 'update/' : 'add/') + pathname.substr(stringToFind.length), data, function(res) {
        if (!res.success) {
            alert(res.msg); // to replace the normal popup
            return;
        }
        alert('Success');
    });
});


// $("#book_img_upload").fileinput({
//     uploadUrl: "/file-upload-batch/2",
//     initialPreview: [
//            'http://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/631px-FullMoon2010.jpg',
//        ],
//        initialPreviewAsData: true,
//        initialPreviewConfig: [
//             {caption: "Moon.jpg", size: 930321, width: "120px", key: 1, showDelete: false}
//         ],
//        deleteUrl: "/img/books",
//        overwriteInitial: true,
//        initialCaption: "The Moon and the Earth",
//     allowedFileExtensions: ["jpg", "png", "gif"],
//     minImageWidth: 50,
//     minImageHeight: 50
// });

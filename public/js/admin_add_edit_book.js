var fileInBase64;

function fillBookEditor(book) {
    $('#book_title').val(book.title);
    $('#book_author').val(book.author);
    $('#book_year').val(book.year);
    $('#book_pages').val(book.pages);
    $('#book_isbn').val(book.isbn);
    $('#book_description').val(book.description);

    // $("#book_img_upload").fileinput({
    //     initialPreview: [
    //            '/img/books/' + book.id + '.jpg',
    //        ],
    //        initialPreviewAsData: true,
    //        initialPreviewConfig: [
    //             {caption: ""+book.id+".jpg", width: "120px", key: 1, showDelete: false}
    //         ],
    //        overwriteInitial: true,
    //        initialCaption: ""+book.id+".jpg",
    //     allowedFileExtensions: ["jpg", "png", "gif"],
    //     minImageWidth: 50,
    //     minImageHeight: 50
    // });

    // $('.kv-file-content img').attr('src', '/img/books/' + book.id + '.jpg');
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

$('#book_img_upload').change(function () {
    context.clearRect(0, 0, canvas.width, canvas.height);

    var file = $(this)[0].files[0];
    var fileReader = new FileReader();

    fileReader.onload = function () {
        fileInBase64 = fileReader.result;
        $('#book_img').attr('src', fileInBase64);
    };

    fileReader.readAsDataURL(file);
});

var pathname = $(location).attr('pathname');
var stringToFind = '/admin/book/update/';
var stringPosition = pathname.indexOf(stringToFind);

if (stringPosition == 0) {
    doAjaxQuery('GET', '/admin/api/v1/books/' + pathname.substr(stringToFind.length), null, function (res) {
        if (!res.success) {
            alert(res.msg); // to replace the normal popup
        }
        fillBookEditor(res.data);
    });
} else {

    var imageObj = new Image();
    $('#book_img_upload').change(function (e) {

        function readURL(input) {
            if (input.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    // console.log(e.target.result);
                    // $('#imgInp').attr('src', e.target.result);
                    imageObj.src = e.target.result;
                };
                reader.readAsDataURL(input.files[0]);
            }
        }

        readURL(e.target);

        imageObj.onload = function () {

            $('#imgInp').hide();
            var sourceX = 0,
                sourceY = 0,
                sourceWidth = imageObj.width,
                sourceHeight = imageObj.height,
                destWidth,
                destHeight,
                destX,
                destY = null;


            if (imageObj.width > imageObj.height) {

                destWidth = canvas.width;
                destHeight = (sourceHeight * canvas.width) / sourceWidth;
                destX = 0;
                destY = (canvas.height - destHeight) / 2;

            } else {

                destWidth = (sourceWidth * canvas.height) / sourceHeight;
                destHeight = canvas.height;
                destX = (canvas.width - destWidth) / 2;
                destY = 0;
            }

            context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
        };
    });



    //         //  $("#book_img_upload").fileinput({
    //         //     allowedFileExtensions: ["jpg", "png", "gif"],
    //         //     minImageWidth: 50,
    //         //     minImageHeight: 50
    //         // });
    //     // });
    // });
}

$('#book_save').click(function () {
    var dataURL = canvas.toDataURL("image/png"),
        s = dataURL.replace(/^data:image\/png;base64,/, "");
    console.log(s);
    var data = {
        changes: {
            title: $('#book_title').val(),
            author: $('#book_author').val(),
            year: $('#book_year').val(),
            pages: $('#book_pages').val(),
            isbn: $('#book_isbn').val(),
            description: $('#book_description').val(),
            img: s
        }
    };
    // doAjaxQuery('POST', '/admin/api/v1/books/' + ((stringPosition == 0) ? 'update/' : 'add/') + pathname.substr(stringToFind.length), data, function (res) {
    //     if (!res.success) {
    //         alert(res.msg); // to replace the normal popup
    //         return;
    //     }
    //     alert('Success');
    // });

    $.ajax({
        url: '/admin/api/v1/books/add',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({file: s}),
        type: 'POST',
        success: function (data, err) {
            if (err) {
                console.log(err);
            }
        }
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

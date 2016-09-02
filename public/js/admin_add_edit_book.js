var canvas = document.getElementById('canvas');
var isImgChanged = false;
var img = new Image();

function fillBookEditor(book) {
    $('#book_title').val(book.title);
    $('#book_author').val(book.author);
    $('#book_year').val(book.year);
    $('#book_pages').val(book.pages);
    $('#book_isbn').val(book.isbn);
    $('#book_description').val(book.description);
    $('#bookImg img').attr('src', getBookImgSrcFromServ(book.id));
    img.src = getBookImgSrcFromServ(book.id);
    img.onload = function () {
        canvas.getContext('2d').drawImage(img, 0, 0);
    };
}

$('#book_img_upload').change(function () {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    isImgChanged = true;

    var file = $(this)[0].files[0];
    var fileReader = new FileReader();

    fileReader.onload = function () {
        var fileInBase64 = fileReader.result;
        $('#book_img').attr('src', fileInBase64);
    };
    fileReader.readAsDataURL(file);
});

var pathname = $(location).attr('pathname');
var stringToFind = '/admin/book/update/';
var stringPosition = pathname.indexOf(stringToFind);

doAjaxQuery('GET', '/admin/api/v1/books/' + pathname.substr(stringToFind.length), null, function (res) {
    if (!res.success) {
        view.showPopup('Error', res.msg); // to replace the normal popup
        return;
    }
    fillBookEditor(res.data);
});

$('#book_img_upload').change(function (e) {

    function readURL(input) {
        if (input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    readURL(e.target);

    img.onload = function () {
        drawCenteredImageOnCanvas(img, canvas);
    };
});

$('#book_save').click(function () {
    var s = null;
    if (isImgChanged) {
        var dataURL = canvas.toDataURL("image/png");
        s = dataURL.replace(/^data:image\/png;base64,/, "");
        isImgChanged = false;
    }
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

    doAjaxQuery('POST', '/admin/api/v1/books/' + pathname.substr(stringToFind.length) + ((stringPosition == 0) ? '/update/' : 'add/'), data, function (res) {
        if (!res.success) {
            view.showPopup('Error', res.msg); // to replace the normal popup
            return;
        }
        view.showPopup('Success', 'Data is saved');
    });
});

function getBookImgSrcFromServ(book_id) {
    var imgType = ".jpg";
    var path = '../../../img/books/';
    return path + book_id + imgType;
}

function drawCenteredImageOnCanvas(imageObj, canvasObj) {
    $('#imgInp').hide();
    var sourceX = 0,
        sourceY = 0,
        sourceWidth = imageObj.width,
        sourceHeight = imageObj.height,
        destWidth,
        destHeight,
        destX,
        destY = null;

    if ((imageObj.width / imageObj.height) > (canvasObj.width / canvasObj.height)) {

        destWidth = canvasObj.width;
        destHeight = (sourceHeight * canvasObj.width) / sourceWidth;
        destX = 0;
        destY = (canvasObj.height - destHeight) / 2;

    } else {

        destWidth = (sourceWidth * canvasObj.height) / sourceHeight;
        destHeight = canvasObj.height;
        destX = (canvasObj.width - destWidth) / 2;
        destY = 0;
    }

    canvasObj.getContext('2d').drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
}

$('#book_img_upload').change(function() {
    var file = $(this)[0].files[0];

    var fileReader = new FileReader();

    fileReader.onload = function() {
        $('#book_img').attr('src', fileReader.result);
    };

    fileReader.readAsDataURL(file);
});

$('#fileupload').change(function(event) {
    var fileName = $('#fileupload').val().replace(/C:\\fakepath\\/i, '');
    $('#img_admin_add').attr('src', '/img/books/' + fileName);
    console.log(fileName);
});


$('#save_new_book').click(function() {
    var ii = '#admin_add_book_input_';
    var newBook = {
        title: $(ii + 'title').val(),
        author: $(ii + 'author').val(),
        description:$(ii + 'description').val(),
        year:$(ii + 'year').val(),
        cover:$('#img_admin_add').src,
        pages:$(ii + 'title').val(),
        date: $.now()
    };

    $.post('//ff', newBook, function() {
        console.log('the book was successfully added');
    });
});
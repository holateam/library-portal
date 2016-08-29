$('#admin_add_book_img_upload').change(function(event) {
    var fileName = $('#admin_add_book_img_upload').val().replace(/C:\\fakepath\\/i, '');
    $('#admin_add_book_img').attr('src', '/img/books/' + fileName);
    console.log(fileName);
});


$('#save_new_book').click(function() {
    var ii = '#admin_add_book_input_';
    var newBook = {
        title: $(ii + 'title').val(),
        author: $(ii + 'author').val(),
        description:$(ii + 'description').val(),
        year:$(ii + 'year').val(),
        cover:$('#admin_add_book_img').src,
        pages:$(ii + 'title').val(),
        date: $.now()
    };

    $.post('//ff', newBook, function() {
        console.log('the book was successfully added');
    });
});
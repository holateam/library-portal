$('.details, .book_item a').click(function(event) {
    var book_id = $(this).closest('.book_item').attr('data-itemid');
    console.log('id_books = ' + book_id);
    var url = 'book'; // add book_id
    $(location).attr('href', url);
    // controller.doAjaxQuery('GET','api/v1/books/:136364831',null,null);
});

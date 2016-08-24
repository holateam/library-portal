function fillBookInfo(book) {
    $('.bookImg img').attr('src', '/img/books/' + book.id + '.jpg');
    $('.titleBook').html(book.title);
    $('#author').html(book.author);
    $('#year').html(book.year);
    $('#pages').html(book.pages);
    $('#isbn').html(book.isbn);
    $('.bookDescriptionText').html(book.description);


    console.log("Status: " + book.status);
    if(book.status=='1'){
      $('.busyBook').css('display','block');
    } else {
      $('.busyBook').css('display','block');
    }

    
}

doAjaxQuery('GET', '/api/v1/books/' + $(location).attr('pathname').substr(6), null, function (res) {
    if (!res.success) {
        alert(res.msg);
        return;
    }
    fillBookInfo(res.data);
});

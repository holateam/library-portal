/* ----------------------------- begin view ----------------------------------*/
var view = {
    showElement: function(element) {
        for (var i = 0; i < arguments.length; i++) {
            $(arguments[i]).css('display', 'block');
        }
        // $(element).css('visibility','visible');
    },
    hideElement: function(element) {
            for (var i = 0; i < arguments.length; i++) {
                $(arguments[i]).css('display', 'none');
            }
            // $(element).css('visibility','hidden');
    },
    showErrEmail: function(){
      $('.input-group').removeClass('has-success has-feedback');
      view.hideElement('.glyphicon-ok');
      $('.input-group').addClass('has-error has-feedback');
      view.showElement('.glyphicon-remove');
    },
    showSuccessEmail: function(){
      $('.input-group').removeClass('has-error has-feedback');
      view.hideElement('.glyphicon-remove');
      $('.input-group').addClass('has-success has-feedback');
      view.showElement('.glyphicon-ok');
    },
    addBookItem: function(book) {
        $('#pattern').clone().removeAttr('id').attr('book-id', book.id)
            .find('img').attr('src', '/img/books/' + book.id + '.jpg').end()
            .find('.title').attr('data-book-title', book.title).html(book.title).end()
            .find('.author').attr('data-book-author', book.author).html(book.author).end()
            .find('a').attr('href', '/book/' + book.id).end()
            .css('display', 'block').appendTo('#content .row');
    },
    addBooksItems: function(books){
        // $('.book_item:not(#pattern)').remove();
        $('#content .row *:not(#pattern)').remove();

        for (var i in books) {
            view.addBookItem(books[i]);
        }
    }


};
/* ------------------------------- end view ----------------------------------*/

/* --------------------------- begin controller ------------------------------*/
var controller = {
  validateEmail: function(value){
    var regex = /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/;
    return regex.test(value);
  }
    //
};
/* --------------------------- end controller --------------------------------*/


/* ------------------- anonymous initialize function ------------------------ */

function doAjaxQuery(method, url, data, callback) {
    $.ajax({
        type: method,
        url: url,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: callback
    });
}

(function() {

    var app = {

        init: function() {
            this.main();
            this.event();
        },
        main: function() {
            // тут функции при загрузке главной страницы
        },
        event: function() {
            // тут навешиваем слушателей на события
        }
    };
    app.init();

}());

/* ----------------- end anonymous initialize function ---------------------- */

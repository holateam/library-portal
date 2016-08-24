/* ----------------------------- begin view ----------------------------------*/
var view = {
    addBookItem: function() {
        $('#pattern').clone().removeAttr('id').attr('data-id', '1').css('display', 'block').appendTo('#showcase_books .row');
    },
    addBooksItems: function(books){
        $('.book_item:not(#pattern)').remove();
        for (var book in books) {
            this.addBookItem(book);
        }
    }
};
/* ------------------------------- end view ----------------------------------*/

/* --------------------------- begin controller ------------------------------*/
var controller = {
    doAjaxQuery: function(method,url,data,callback){
      $.ajax({
            type: method,
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data),
            success: callback
        });
    }
};
/* --------------------------- end controller --------------------------------*/


/* ------------------- anonymous initialize function ------------------------ */

(function() {

    var app = {

        init: function() {
            this.main();
            this.event();
        },
        main: function() {
            // тут функции при загрузке главной страницы
        },
        event: function() { // тут навешиваем слушателей на события
            $(document).ready(function() {
                // $('.menu_nav li ').click(controller.clickSideBarItem);
                $('.want_to_read').click(controller.clickWantToReadBtn);

            });
        }
    };
    app.init();

}());

/* ----------------- end anonymous initialize function ---------------------- */

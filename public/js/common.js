/* ----------------------------- begin view ----------------------------------*/
var view = {
    addBookItem: function(book) {
        console.log(book.title);

    },
    addBooksItems: function(books){
        console.log($('.book_item:not(#pattern)'));
        for (var book in books) {
            addBookItem(book);
        }
    }
};
/* ------------------------------- end view ----------------------------------*/

/* --------------------------- begin controller ------------------------------*/
var controller = {
    clickWantToReadBtn: function(event) {
        // something to do here event
    },
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

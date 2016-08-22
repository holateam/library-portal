/* ----------------------------- begin view ----------------------------------*/
var view = {
    addBookItem: function(data) {
        // something to do here
    }
};
/* ------------------------------- end view ----------------------------------*/

/* --------------------------- begin controller ------------------------------*/
var controller = {
    clickWantToReadBtn: function(event) {
        // something to do here event
    },
    clickSideBarItem: function(event){
      console.log('Work');
      var _this = $(this);
      $('.menu_nav li').removeClass("active");
        _this.closest('li').addClass("active");
        doAjaxQuery('get','/api/v1/books/:'+filter+'',data)

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
                $('.menu_nav li ').click(controller.clickSideBarItem);
                $('.want_to_read').click(controller.clickWantToReadBtn);

            });
        }
    };
    app.init();

}());

/* ----------------- end anonymous initialize function ---------------------- */

/* ----------------------------- begin view ----------------------------------*/
var view = {
    //
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
        event: function() {
            // тут навешиваем слушателей на события
        }
    };
    app.init();

}());

/* ----------------- end anonymous initialize function ---------------------- */

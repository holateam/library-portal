/* ----------------------------- begin view ----------------------------------*/
var view = {
  showElement: function(element){
    $(element).css('visibility','visible');
  },
  hideElement: function(element){
    $(element).css('visibility','hidden');
  }
    //
};
/* ------------------------------- end view ----------------------------------*/

/* --------------------------- begin controller ------------------------------*/
var controller = {
    //
};
/* --------------------------- end controller --------------------------------*/


/* ------------------- anonymous initialize function ------------------------ */

function doAjaxQuery(method,url,data,callback){
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

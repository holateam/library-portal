/* ----------------------------- begin view ----------------------------------*/
var view = {
    addBook: function(data) {
        // something to do here
    }
};
/* ------------------------------- end view ----------------------------------*/

/* ------------------------------ begin model --------------------------------*/
var model = {
    giveMeBookIDWithID: function(data) {
        // something to do here
    }
};
/* ------------------------------- end model ---------------------------------*/

/* --------------------------- begin controller ------------------------------*/
var controller = {
    pressClickBtnBook: function(event) {
        // something to do here event
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
                $('.want_to_read').click(controller.pressClickBtnBook);


            });
        }
    };
    app.init();

}());

/* ----------------- end anonymous initialize function ---------------------- */

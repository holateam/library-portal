$('#search').keyup(function(event) {
    var text = $(this).val();
    console.log(text);
    if (text.length > 1) {
        function func() {
          alert('Отправлен запрос на поиск текста: ' + text);
          doAjaxQuery('GET', '/api/v1/books?search=' + text + '', null,
          function(res) {
            if (!res.success) {
              alert(res.msg);
              return;
            } else {
              addBooksItems(res.data.books);
              console.log(JSON.stringify(res));
              console.log("Запрос по поиску выполнен: " + res.success);
            }
          }
        );
      }
      if (!(event.keyCode >= 33 && event.keyCode <= 40) && !(event.keyCode >= 13 && event.keyCode <= 20) && !(event.keyCode >= 16 && event.keyCode <= 20) && (event.keyCode !== 27)) {
        var timer = setTimeout(func, 3000);
      }

      $('#search').keyup(function(event) {
        if (!(event.keyCode >= 33 && event.keyCode <= 40) && !(event.keyCode >= 13 && event.keyCode <= 20) && !(event.keyCode >= 16 && event.keyCode <= 20))
        {
          clearTimeout(timer);
        }
      });
    }
});

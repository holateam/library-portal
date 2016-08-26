$('#search').keyup(function(event) {
    var text = $(this).val();
    console.log(text);
    function func() {
        alert('Отправлен запрос на поиск текста: '+text);
        doAjaxQuery('GET','/api/v1/books?search='+text+'',null,
        function(res) {
            if (!res.success) {
                alert(res.msg);
                return;
            }else{
              console.log(JSON.stringify(res));
              console.log("Запрос по поиску выполнен: " + res.success);
            }
        }
      );
    }
    var timer = setTimeout(func, 3000);
    $('#search').keyup(function(event) {
      clearTimeout(timer);
    });
});

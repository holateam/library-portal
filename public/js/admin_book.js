var pathNameUrl = $(location).attr('pathname').split('/');
console.log(pathNameUrl);
// var pathUrl = (pathNameUrl[3] == 'admin')? '/admin' : '';

var fillActionBook = function(data){
  $('.nameOfDebtor').val(data.name);
  $('.phoneOfDebtor').val(data.phone);
  $('.emailOfDebtor').val(data.email);
  $('.dateOfDebtor').val(data.date);
  $('.pawnOfDebtor').val(data.pawn);
  var obj = (data.event==null)?{name:'Give the book',data: 'give'}: {name:'Pick up the book',data: 'pick'};

  $('.btnBookAction').text(obj.name).attr('data',obj.data);

};

doAjaxQuery('GET', '/admin/api/v1/books/' +pathNameUrl[3] , null, function(res) {
    if (!res.success) {
        alert(res.msg); // to replace the normal popup
    }
    console.log(JSON.stringify(res.data));
    view.fillBookInfo(res.data);
    fillActionBook(res.data);

});


$('.btnBookAction').click(function(event) {
  var status = $('.btnBookAction').attr('data');
  console.log(status);
  // if()
});

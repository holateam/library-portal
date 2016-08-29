var pathNameUrl = $(location).attr('pathname').split('/');
console.log(pathNameUrl);
// var pathUrl = (pathNameUrl[3] == 'admin')? '/admin' : '';



doAjaxQuery('GET', '/admin/api/v1/books/' +pathNameUrl[3] , null, function(res) {
    if (!res.success) {
        alert(res.msg); // to replace the normal popup
    }
    console.log(JSON.stringify(res.data));
    view.fillBookInfo(res.data);
});

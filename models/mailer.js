var db = require('../models/DB_MYSQL');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport();

module.exports.sendMail = function (book_id) {
    db.getBook(book_id,function (err, bookInfo) {
        if (err){
            return console.log(err);
        }
        db.getQueueByBookId(bookInfo.id, function (err, result) {
            if (err){
                return console.log(err);
            }

            var mailOptions={
                from: 'noreply@programming.kr.ua',
                subject: 'Library SH++',
                html: '<b>Книга '+ bookInfo.title +' автор: ' + bookInfo.author + ', на которую вы подписались, теперь свободна.</b>',
                text: 'Книга '+ bookInfo.title +' автор: ' + bookInfo.author + ', на которую вы подписались, теперь свободна.'
            };
            for(var i = 0; i < result.length; i++){
                mailOptions.to = result[i].email;
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }
                    db.deleteFromQueue(book_id,mailOptions.to,function (err, result) {
                        if(err){
                            console.log(err);
                        }
                        console.log(result);
                    })
                });
            }
        });
    });
};
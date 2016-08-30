var db = require('../models/DB_MYSQL');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport();

module.exports.sendMail = function (book_id) {
  db.getQueueByBookId(book_id, function (err, result) {
    if(err) throw err;
      var mailOptions={
              from: 'noreply@programming.kr.ua',
              subject: 'Library SH++',
              html: '<b>The book with id= '+ book_id +' is free!</b>',
              text: 'The book with id='+ book_id +' is free!'
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
};
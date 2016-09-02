var express = require('express');
var adminRouter = express.Router();
var basicAuth = require('basic-auth');

var verify = require('../verify.js');
var dbLayer = require('../models/DB_MYSQL.js');
var multer  =   require('multer');

var path = require('path');
var fs = require('fs');
//var mime = require('mime-types');

//var upload = multer({ dest: './public/img/books' });

var mailer = require('../models/mailer');

/* GET adminka. */
adminRouter.get('/', verify.auth, function(req, res, next) {
    res.render('admin_index', { title: 'Admin Panel' });
});

adminRouter.get('/addbook', verify.auth, function(req, res, next) {
    res.render('admin_add_edit_book', { title: 'Add book' });
});

adminRouter.get('/editbook/:id', verify.auth, function(req, res, next) {
    res.render('admin_add_edit_book', { title: 'Add book' });
});

adminRouter.get('/add_book', verify.auth, function(req, res, next) {
    res.render('admin_addbook', { title: 'Add book' });
});

adminRouter.get('/book/:id', verify.auth, function(req, res, next) {
    res.render('admin_book', { title: 'book' });
});

adminRouter.get('/book/update/:id', verify.auth, function(req, res, next) {
    res.render('admin_add_edit_book', { title: 'Update book' });
});

adminRouter.get('/cover', function(req, res, next) {
    res.render('upload_cover',  { title: 'Upload form' });
});

adminRouter.route('/api/v1/books')
.get(function(req, res, next) {
    var data = {};
    data.filter = req.query.filter;
    data.limit = req.query.limit;
    data.offset = req.query.offset;
    data.search = req.query.search;

    dbLayer.getBooksForAdmin(data, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/books/:book_id')
.get(function(req, res, next) {

    dbLayer.getBookForAdmin(req.params.book_id, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

///admin/api/v1/books/add
adminRouter.route('/api/v1/books/add')
.post(verify.auth, function(req, res, next) {
    console.log(req.body.changes);
    var changes = req.body.changes;
    changes.cover = "cover";
    changes.status = true;
    changes.year = parseInt(changes.year);
    changes.pages = parseInt(changes.pages);

    dbLayer.addBook(changes, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            if(changes.img){
                var base64Data = changes.img.replace(/^data:image\/jpeg;base64,/, "");
                fs.writeFile("./public/img/books/"+ resp.id +".jpg", base64Data, 'base64', function(err) {
                    console.log(err);
                });
            }else{
                fs.createReadStream('./public/img/books/no-cover.jpg').pipe(fs.createWriteStream("./public/img/books/" + resp.id + ".jpg"));
            }
            res.json({ success: true, data: resp});
         }
     });
});

adminRouter.route('/api/v1/books/:book_id/remove')
.get(verify.auth, function(req, res, next) {

    dbLayer.deleteBookById(req.params.book_id, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

// /admin/api/v1/books/remove
adminRouter.route('/api/v1/books/remove')
.post(verify.auth, function(req, res, next) {

    dbLayer.deleteBookWithIdInList(req.body.ids, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/queue/:book_id')
.get(verify.auth, function(req, res, next) {

    dbLayer.getQueueByBookId(req.params.book_id, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/readers/add')
.post(verify.auth, function(req, res, next) {
    dbLayer.createReader(req.body.reader, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/books/:book_id/give')
.post(verify.auth, function(req, res, next) {

    dbLayer.giveBookById(req.params.book_id, req.body.event, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/books/:book_id/renewal')
.post(verify.auth, function(req, res, next) {

    dbLayer.updateEventByBookId(req.params.book_id, req.body.changes, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/books/:book_id/update')
.post(verify.auth, function(req, res, next) {
    dbLayer.updateBookById(req.params.book_id, req.body.changes, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            var img = req.body.changes.img;
            if(img) {
                console.log("tyt");
                var base64Data = img.replace(/^data:image\/jpeg;base64,/, "");
                fs.writeFile("./public/img/books/" + req.params.book_id + ".jpg", base64Data, 'base64', function (err) {
                    console.log(err);
                });
            }
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/books/:book_id/take')
.get(verify.auth, function(req, res, next) {

    dbLayer.takeBookById(req.params.book_id, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            mailer.sendMail(req.params.book_id);
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/events/:event_id')
.get(verify.auth, function(req, res, next) {

    dbLayer.getEventById(req.params.event_id, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/events/:event_id/update')
.post(verify.auth, function(req, res, next) {
    dbLayer.updateEventById(req.params.event_id, req.body.changes, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/verify/islogin')
.get(verify.isLogin);

adminRouter.route('/api/v1/cover/upload')
.post(verify.auth, function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

module.exports = adminRouter;

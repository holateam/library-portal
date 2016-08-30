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

    dbLayer.getBook(req.params.book_id, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

///admin/api/v1/books/add
adminRouter.route('/api/v1/books/add')
.post(verify.auth, multer({ dest: './public/uploads/' }).single('img'), function(req, res, next) {
    req.body.cover = "cover";
    req.body.status = true;
    req.body.year = parseInt(req.body.year);
    req.body.pages = parseInt(req.body.pages);

    dbLayer.addBook(req.body, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            fs.rename('./public/uploads/' + req.file.filename,'./public/img/books/'+ resp.id + path.extname(req.file.originalname) , function (err) {
                if (err) throw err;
            });
            res.json({ success: true, data: resp});
         }
     });
});

adminRouter.route('/api/v1/books/addAlt')
.post(verify.auth, function(req, res, next) {
    console.log('req.body', req.body);
    var book = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        year: parseInt(req.body.year),
        pages: parseInt(req.body.pages),
        isbn : req.body.isbn
    };
    console.log(book);
    dbLayer.addBook(book, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            var storage =   multer.diskStorage({
              destination: function (req, file, callback) {
                callback(null, './public/img/books');
              },
              filename: function (req, file, callback) {
                callback(null, resp.data.id + '.' + mime.extension(file.mimetype));
              }
            });
            res.json({ success: true, data: resp});
        }
    });
});
///admin/api/v1/books/remove:book_id
adminRouter.route('/api/v1/books/remove/:book_id')
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

adminRouter.route('/api/v1/books/give/:book_id')
.post(verify.auth, function(req, res, next) {

    dbLayer.giveBookById(req.params.book_id, req.body.event, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/books/update/:book_id')
.post(verify.auth, function(req, res, next) {
    dbLayer.updateBookById(req.params.book_id, req.body.changes, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/books/take/:book_id')
.get(verify.auth, function(req, res, next) {

    dbLayer.takeBookById(req.params.book_id, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
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

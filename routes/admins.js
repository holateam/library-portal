var express = require('express');
var adminRouter = express.Router();
var basicAuth = require('basic-auth');

var verify = require('../verify.js');
var dbLayer = require('../models/DB_MYSQL.js');
var multer  =   require('multer');

var path = require('path');
var fs = require('fs');

var mailer = require('../models/mailer');

var defaultCoverPath = "./public/img/books/";
var defaultBookCover = "no-cover.jpg";
var defaultCoverExtension = ".jpg";

var Render = function(router, path, middleware, view, title) {
    router.get(path, middleware, function(req, res, next) {
        res.render(view, { title: title });
    });
};

var standardRes = function(err, resp) {
    return err ? { success: !err, msg: err } : { success: !err, data: resp };
};

Render(adminRouter, '/', verify.auth, 'admin_index', 'Admin Panel');
Render(adminRouter, '/addbook', verify.auth, 'admin_add_edit_book', 'Add book');
Render(adminRouter, '/editbook/:id', verify.auth, 'admin_add_edit_book', 'Add book');
Render(adminRouter, '/book/:id', verify.auth, 'admin_book', 'book');
Render(adminRouter, '/book/update/:id', verify.auth, 'admin_add_edit_book', 'Update book');

adminRouter.route('/api/v1/books')
.get(function(req, res, next) {
    var data = {};
    data.filter = req.query.filter;
    data.limit = req.query.limit;
    data.offset = req.query.offset;
    data.search = req.query.search;

    dbLayer.getBooksForAdmin(data, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/books/:book_id')
.get(function(req, res, next) {
    dbLayer.getBookForAdmin(req.params.book_id, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/books/add')
.post(verify.auth, function(req, res, next) {
    var changes = req.body.changes;
    changes.cover = "cover";
    changes.status = true;
    changes.year = parseInt(changes.year);
    changes.pages = parseInt(changes.pages);

    dbLayer.addBook(changes, function(err, resp) {
        if (!err) {
            if(changes.img){
                var base64Data = changes.img.replace(/^data:image\/jpeg;base64,/, "");
                fs.writeFile(defaultCoverPath+ resp.id + defaultCoverExtension, base64Data, 'base64', function(err) {
                });
            }else{
                fs.createReadStream(defaultCoverPath + defaultBookCover).pipe(fs.createWriteStream(defaultCoverPath + resp.id + defaultCoverExtension));
            }
        }
        res.json(standardRes(err, resp));
     });
});

adminRouter.route('/api/v1/books/:book_id/update')
.post(verify.auth, function(req, res, next) {
    dbLayer.updateBookById(req.params.book_id, req.body.changes, function(err, resp) {
        if (!err) {
            var img = req.body.changes.img;
            if(img) {
                var base64Data = img.replace(/^data:image\/jpeg;base64,/, "");
                fs.writeFile(defaultCoverPath + req.params.book_id + defaultCoverExtension, base64Data, 'base64', function (err) {
                    console.log(err);
                });
            }
        }
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/books/:book_id/remove')
.get(verify.auth, function(req, res, next) {
    dbLayer.deleteBookById(req.params.book_id, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/books/remove')
.post(verify.auth, function(req, res, next) {
    dbLayer.deleteBookWithIdInList(req.body.ids, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/queue/:book_id')
.get(verify.auth, function(req, res, next) {
    dbLayer.getQueueByBookId(req.params.book_id, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/readers/add')
.post(verify.auth, function(req, res, next) {
    dbLayer.createReader(req.body.reader, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/books/:book_id/give')
.post(verify.auth, function(req, res, next) {
    dbLayer.giveBookById(req.params.book_id, req.body.event, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/books/:book_id/renewal')
.post(verify.auth, function(req, res, next) {
    dbLayer.updateEventByBookId(req.params.book_id, req.body.changes, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/books/:book_id/take')
.get(verify.auth, function(req, res, next) {
    dbLayer.takeBookById(req.params.book_id, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/events/:event_id')
.get(verify.auth, function(req, res, next) {
    dbLayer.getEventById(req.params.event_id, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/events/:event_id/update')
.post(verify.auth, function(req, res, next) {
    dbLayer.updateEventById(req.params.event_id, req.body.changes, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

adminRouter.route('/api/v1/verify/islogin')
.get(verify.isLogin);

module.exports = adminRouter;

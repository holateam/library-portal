var express = require('express');
var adminRouter = express.Router();
var basicAuth = require('basic-auth');

var auth = require('../authenticate.js');

var dbLayer = require('../models/DB_MYSQL.js');

/* GET adminka. */
adminRouter.get('/', auth, function(req, res, next) {
    res.render('admin_index', { title: 'Admin Panel' });
});

adminRouter.get('/addbook', auth, function(req, res, next) {
    res.render('admin_add_book', { title: 'Add book' });
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
.post(auth, function(req, res, next) {

    dbLayer.addBook(req.body.book, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

///admin/api/v1/books/remove:book_id
adminRouter.route('/api/v1/books/remove/:book_id')
.get(auth, function(req, res, next) {

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
.post(auth, function(req, res, next) {

    dbLayer.deleteBookWithIdInList(req.body.ids, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/queue/:book_id')
.get(auth, function(req, res, next) {

    dbLayer.getQueueByBookId(req.params.book_id, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/readers/add')
.post(auth, function(req, res, next) {
    dbLayer.createReader(req.body.reader, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/books/give/:book_id')
.post(auth, function(req, res, next) {

    dbLayer.giveBookById(req.params.book_id, req.body.event, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/books/update/:book_id')
.post(auth, function(req, res, next) {
    dbLayer.updateBookById(req.params.book_id, req.body.changes, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/books/take/:book_id')
.get(auth, function(req, res, next) {

    dbLayer.takeBookById(req.params.book_id, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

adminRouter.route('/api/v1/events/:event_id')
.get(auth, function(req, res, next) {

    dbLayer.getEventById(req.params.event_id, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

module.exports = adminRouter;

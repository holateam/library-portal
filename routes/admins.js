var express = require('express');
var adminRouter = express.Router();
var basicAuth = require('basic-auth');

var auth = require('../authenticate.js');

var dbLayer = require('../models/DB_MYSQL.js');

/* GET adminka. */
adminRouter.get('/', auth, function(req, res, next) {
    res.render('admin_index', { title: 'Adminka' });
});

adminRouter.route('/api/v1/books')
.get(function(req, res, next) {
    dbLayer.getBooks(req.query.filter, function(err, resp) {
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
module.exports = adminRouter;

var express = require('express');
var booksRouter = express.Router();

var dbLayer = require('../models/DB_MYSQL.js');

booksRouter.route('/')
.get(function(req, res, next) {
    var data = {};
    data.filter = req.query.filter;
    data.limit = req.query.limit;
    data.offset = req.query.offset;
    data.search = req.query.search;

<<<<<<< a1727392eb0907e2976a16cbbbeba5ea3921e80e
    dbLayer.getBooksAlt(data, function(err, resp) {
=======
    console.log('data limit',data.limit);

    dbLayer.getBooks(data, function(err, resp) {
>>>>>>> add elements on scrolling
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            console.log(resp);
            res.json({ success: true, data: resp});
        }
    });
});

booksRouter.route('/:book_id')
.get(function(req, res, next) {

    dbLayer.getBook(req.params.book_id, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true, data: resp});
        }
    });
});

booksRouter.route('/:book_id/order')
.get(function(req, res, next) {
    var data = {};
    data.book_id = req.params.book_id;
    data.email = req.query.email;
    dbLayer.addToQueue(data, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
            res.json({ success: true});
        }
    });
});

module.exports = booksRouter;

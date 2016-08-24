var express = require('express');
var booksRouter = express.Router();

var dbLayer = require('../models/DB_MYSQL.js');

booksRouter.route('/')
.get(function(req, res, next) {

    dbLayer.getBooks(req.query.filter, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: err });
        } else {
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

module.exports = booksRouter;

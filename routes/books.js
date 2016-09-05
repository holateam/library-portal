var express = require('express');
var booksRouter = express.Router();

var verify = require('../verify.js');
var dbLayer = require('../models/DB_MYSQL.js');

var standardRes = function(err, resp) {
    return err ? { success: !err, msg: err } : { success: !err, data: resp };
};

booksRouter.route('/')
.get(function(req, res, next) {
    dbLayer.getBooks(req.query, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

booksRouter.route('/:book_id')
.get(function(req, res, next) {
    dbLayer.getBook(req.params.book_id, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

booksRouter.route('/:book_id/order')
.get(function(req, res, next) {
    dbLayer.addToQueue(req.params.book_id, req.query, function(err, resp) {
        res.json(standardRes(err, resp));
    });
});

module.exports = booksRouter;

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/book/:book_id', function(req, res, next) {
    res.render('book',  { book_id: req.params.book_id });
});

router.get('/find', function(req, res, next) {
    res.render('search',  { title: 'Find' });
});

router.get('/search', function(req, res, next) {
    res.render('search',  { title: 'Find' });
});

module.exports = router;

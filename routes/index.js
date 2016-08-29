var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/book/:book_id', function(req, res, next) {
    res.render('book',  { book_id: req.params.book_id });
});

module.exports = router;

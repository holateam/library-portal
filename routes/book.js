var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('book',
  { success:'true',
    data: {
      id:'136364831',
      title: 'Вэб-разработка с применением Node и Express. Полноценное использование стека JavaScript',
      authors: 'Браун И.',
      description: 'описание книги',
      busy: 'false',
      year: '2015',
      new: 'true',
      pages: '444'
     }
   });
   console.log(res);
});

module.exports = router;

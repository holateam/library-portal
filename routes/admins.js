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
.get(auth, function(req, res, next) {

    dbLayer.getBooksTest(req.query.filter, function(err, resp) {
        if (err) {
            res.json({ success: false, msg: 'we have a problem' });
        } else {
            res.json(resp);
        }
    });
});

module.exports = adminRouter;

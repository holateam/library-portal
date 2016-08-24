var express = require('express');
var adminRouter = express.Router();
var basicAuth = require('basic-auth');

var dbLayer = require('../models/DB_MYSQL.js');

// middleware
var auth = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };

    if (user.name === 'admin' && user.pass === 'admin') {
        return next();
    } else {
        return unauthorized(res);
    };
};

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

var express = require('express');
var adminRouter = express.Router();
var basicAuth = require('basic-auth');

//middleware
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
    res.send(200, 'Authenticated');
});

adminRouter.route('/books')
.get(auth, function(req, res, next) {

    var test = {
        "success": true,
        "data": {
            "total" : 100,
            "offset" : 111,
            "limit" : 22,
            "filter" : "",
            "books" : [
                {
                    "id": 33,
                    "title": "...",
                    "authors": "...",
                    "busy": false,
                    "year" : 2015,
                    "new" : true
                },
            ]
        }
    };

    res.json(test);
});

module.exports = adminRouter;

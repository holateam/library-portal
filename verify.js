var configAP = require('./configAP');

var basicAuth = require('basic-auth');

// middleware
module.exports.auth = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };

    if (user.name === configAP.username && user.pass === configAP.password) {
        return next();
    } else {
        return unauthorized(res);
    };
};

module.exports.isLogin = function (req, res, next) {
    function unauthorized(res) {
        res.json({ isLogin: false });
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };

    if (user.name === configAP.username && user.pass === configAP.password) {
        res.json({ isLogin: true, username: user.name });
    } else {
        return unauthorized(res);
    };
};

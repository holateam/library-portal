var express = require('express');
var verifyRouter = express.Router();

var verify = require('../verify.js');

verifyRouter.route('/islogin')
.get(verify.isLogin);

module.exports = verifyRouter;

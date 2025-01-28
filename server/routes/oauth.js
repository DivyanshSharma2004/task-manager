var express = require('express');
var router = express.Router();

//route for oauth
const { handleOAuthRedirect } = require('../services/oauthService');

router.get('/', handleOAuthRedirect);


module.exports = router;

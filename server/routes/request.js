var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const{OAuth2Client}= require('google-auth-library');

router.post('/', async function(req, res, next){
   res.header('Access-Control-Allow-origin','http://localhost:3000');
   red.header('Referrer-Policy','no-referrer-when-downgrade');//using http thus the no reffer when downgrade

    const redirectUrl = 'http://localhost:3000/oauth';

    const oAuth2Client = new OAuth2Client(
        process.env.Client_ID,
        process.env.Client_SECRET,
        redirectUrl
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type:'offline',
    scope:'https://www.googleapis.com/auth/userinfo.profile openid',
    prompt:'consent',
    });

    red.json({url:authorizeUrl})
});

module.exports = router;

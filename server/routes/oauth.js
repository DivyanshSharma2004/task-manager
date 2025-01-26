var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const{OAuth2Client}= require('google-auth-library');

async function getUserData(access_token){
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`);
    const data = await response.json();
    console.log('data',data);
}
//get home page
router.get('/',async function(req, res, next){
    const code = req.query.code;
    try{
    const redirectUrl = 'http://localhost:3000/oauth'
    const oAuth2Client = new OAuth2Client(
            process.env.Client_ID,
            process.env.Client_SECRET,
            redirectUrl
        );
        const res = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(res.tokens);
        console.log('Tokens acquired');
        const user = oAuth2Client.credentials;
        console.log('credentials',user);
        await getUserData(user.access_token);
    }cathc(err){
        console.log('ERROR with signing in with Google')
    }
    }
});

module.exports = router;

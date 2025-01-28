var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');

const redirectUrl = 'http://localhost:3000/oauth'; //gc regestered url

router.post('/', async function(req, res, next) {
    // Set the headers for CORS and referrer policy
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade'); // Corrected header name

    const redirectUrl = 'http://localhost:3000/oauth';

    const oAuth2Client = new OAuth2Client(
        process.env.Client_ID,
        process.env.Client_SECRET,
        redirectUrl
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt: 'consent',
        redirect_uri: redirectUrl  // Add the redirect URI here

    });

    // Send the generated authorization URL back to the client
    res.json({ url: authorizeUrl });
});

module.exports = router;


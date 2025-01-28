var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');

async function handleOAuthRedirect(req, res, next) {
    try {
        const code = req.query.code;
        const redirectUrl = 'http://localhost:3000/oauth';
        const oAuth2Client = new OAuth2Client(process.env.Client_ID, process.env.Client_SECRET, redirectUrl);

        // Token exchange
        const tokenResponse = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokenResponse.tokens);

        // User data retrieval
        const user = oAuth2Client.credentials;
        const userData = await getUserData(user.access_token);

        res.json({ message: 'User data fetched successfully', userData });
    } catch (err) {
        next(err);
    }
}

async function getUserData(access_token) {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: 'GET',
        headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!response.ok) throw new Error(`Failed to fetch user data: ${response.statusText}`);
    return await response.json();
}

module.exports = { handleOAuthRedirect };
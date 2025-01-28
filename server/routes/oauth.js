var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');

// Function to get user data from Google API
async function getUserData(access_token) {
    try {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('User data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Re-throw the error if needed for further handling
    }
}

// Route for handling OAuth redirect
router.get('/', async function(req, res, next) {
    const code = req.query.code;

    try {
        const redirectUrl = 'http://127.0.0.1:3000/oauth';
        const oAuth2Client = new OAuth2Client(
            process.env.Client_ID,
            process.env.Client_SECRET,
            redirectUrl
        );

        // Exchange the authorization code for tokens
        const tokenResponse = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(tokenResponse.tokens);
        console.log('Tokens acquired');

        // Get the user info using the access token
        const user = oAuth2Client.credentials;
        console.log('User credentials:', user);
        await getUserData(user.access_token);

        // Send the user data or some success message (optional)
        res.json({ message: 'User data fetched successfully' });
    } catch (err) {
        console.log('Error with signing in with Google:', err);
        res.status(500).json({ error: 'An error occurred during authentication' });
    }
});

module.exports = router;

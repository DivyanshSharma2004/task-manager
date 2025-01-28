const express = require('express');
const multer = require('multer'); // Multer is used to handle file uploads
const fs = require('fs');
const Joi = require('joi');
const path = require('path'); // Import the path module
const app = express();
const oauthRouter = require('./routes/oauth'); // Adjust the path accordingly
const requestRouter = require('./routes/request'); // Add if not already included

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

// Use the routes
app.use('/oauth', oauthRouter);
app.use('/request', requestRouter);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));


// Catch-all handler for React routing
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});


// Testing route
app.get('/testing', (req, res) => {
  res.send('Hello, World! testing');
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
const express = require('express');
const multer = require('multer'); // Multer is used to handle file uploads
const fs = require('fs');
const Joi = require('joi');
const path = require('path'); // Import the path module
const app = express();

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));


// Catch-all handler for React routing
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

//schema
const schema = Joi.object({
  participants: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
      })
    )
    .required(),

  messages: Joi.array()
    .items(
      Joi.object({
        sender_name: Joi.string().required(),
        timestamp_ms: Joi.number().required(),
        content: Joi.string().allow(null, ''), // Content can be null or empty
        share: Joi.object({
          link: Joi.string().uri().required(),
          share_text: Joi.string().allow(null, ''), // Can be empty or missing
          original_content_owner: Joi.string().required(),
        }).optional(), // The share object is optional
        is_geoblocked_for_viewer: Joi.boolean().required(),
        reactions: Joi.array()
          .items(
            Joi.object({
              reaction: Joi.string().required(),
              actor: Joi.string().required(),
            })
          )
          .optional(), // Reactions are optional
        audio_files: Joi.array()
          .items(
            Joi.object({
              uri: Joi.string().required(),
              creation_timestamp: Joi.number().required(),
            })
          )
          .optional(), // Audio files are optional
        photos: Joi.array()
          .items(
            Joi.object({
              uri: Joi.string().required(),
              creation_timestamp: Joi.number().required(),
            })
          )
          .optional(), // Photos are optional
      })
    )
    .required(),

  // Optional fields you want to check for
  title: Joi.string().optional(),
  is_still_participant: Joi.boolean().optional(),
  thread_path: Joi.string().optional(),
  magic_words: Joi.array().items(Joi.string()).optional(),
});

// Testing route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// POST route to upload and validate JSON file
app.post('/upload', upload.single('jsonFile'), (req, res) => {
  // Check if a file was uploaded
  if (!req.file) {
    console.error('No file uploaded.');
    return res.status(400).send('No file uploaded.');
  }
  console.log('Uploaded file:', req.file); // Log file details for debugging

  // Read the uploaded file
  fs.readFile(req.file.path, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err.message);
      return res.status(500).send('Error reading the file.');
    }
    try {
      // Parse the file data as JSON
      console.log('Raw JSON data:', data); // Log the raw JSON data
      const jsonData = JSON.parse(data);
      console.log('Parsed JSON data:', jsonData); // Log parsed JSON

      // Validate the JSON data using the Joi schema
      const { error, value } = schema.validate(jsonData, { abortEarly: false }); // Use `abortEarly: false` to get all validation errors

      if (error) {
        console.error('Validation errors:', error.details); // Log validation errors
        return res.status(400).send({
          message: 'Validation failed',
          details: error.details,
        });
      }

      console.log('Validation succeeded:', value); // Log validated data

      // If valid, return the validated data
      res.status(200).send({
        message: 'Validation successful',
        data: value,
      });
    } catch (parseError) {
      console.error('JSON parsing error:', parseError.message); // Log JSON parsing errors
      res.status(400).send('Invalid JSON format.');
    }
  });
});
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})
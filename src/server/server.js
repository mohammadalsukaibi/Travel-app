// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const bodyParser = require('body-parser');

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('dist'));

// Setup Server
const port = 8000;
const server = app.listen(port, listening);
function listening() {
  console.log(`running on localhost: ${port}`);
};

// GET route to return projectData
app.get('/all', sendData);

function sendData(req, res) {
  res.send(projectData);
}

// POST route
app.post('/addData', addData);

function addData(req, res) {

    projectData['date'] = req.body.date;
    projectData['temperature'] = req.body.temperature;
    projectData['content'] = req.body.user_response;
    res.send(projectData);
}

module.exports = app;
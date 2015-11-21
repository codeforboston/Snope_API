//Setup Mongodb connection:
var mongoose   = require('mongoose');

//TODO: Move this connection to a property file
mongoose.connect('mongodb://localhost:27017/snope');

// call the packages we need
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//TODO: Make port configurable
//Set the port that our node app runs on
var port = 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();


//Set up the Users API
var userAPI = require('./app/api/userAPI');
userAPI.setupUsersAPI(router);

//Set up the Jobs API
var jobAPI = require('./app/api/jobAPI');
jobAPI.setupJobsAPI(router);

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging / anything else that happens in middeware
    console.log('Something is happening.');
    next();
});

// REGISTER ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Application is running on port ' + port);

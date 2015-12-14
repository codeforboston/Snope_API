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

// If adding any more arguments, consider yargs
// Set the port that our node app runs on
var port = 8080;
if (process.argv.length > 1) {
    var port2 = parseInt(process.argv[2])
    if (port2 > 0) {
        port = port2
    } else {
        console.log('Not running on port:',process.argv[2])
    }
}

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();
var imageHostingRouter = express.Router();

// app.all('/', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   next();
//  });


// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging / anything else that happens in middeware
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(req.method + ' request received to ' + fullUrl);
    console.log(req.body);
    next();
});

// Add headers
router.use(function (req, res, next) {

    //***********************************
    //TODO: REMOVE THIS BEFORE PRODUCTION
    //***********************************
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// REGISTER ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

//We are hosting images locally on this server for MVP
//TODO: Swap out this implementation for a cloud based cdn. (S3?)
app.use('/img', imageHostingRouter);
var imageHosting = require('./app/api/imageHosting');
imageHosting.enableImageHosting(imageHostingRouter);

//Set up the Users API
var userAPI = require('./app/api/userAPI');
userAPI.setupUsersAPI(router);

//Set up the Jobs API
var jobAPI = require('./app/api/jobAPI');
jobAPI.setupJobsAPI(router);

// Start the server
app.listen(port);
console.log('Application is running on port ' + port);

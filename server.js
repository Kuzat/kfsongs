// BASE SETUP
// ==============================

// CALL THE PACKAGES ------------
var express      = require("express"); // call express
var app          = express(); //define our app using express
var bodyParser   = require("body-parser"); // get the body-parser
var morgan       = require("morgan"); // used to see requests
var config       = require("./config");
var path         = require("path");


// APP CONFIGURATION ------------
// use body parse so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function( req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

//log all request to the console
app.use(morgan('dev'));

// set static files location
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API
// ============================
// ADD API ROUTES HERE
var apiRoutes = require("./app/routes/api")(app, express);
app.use('/api', apiRoutes);

// ROUTE TO SERVE SONG FILE
app.get('/s/:songid', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/s/' + req.params.songid + '/song.mp3'));
});


// MAIN CATCHALL ROUTE ------------
// SEND USERS TO FRONTEND ---------
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START SERVER
// ================================
app.listen(config.port);
console.log('This process is your pid ' + process.pid);
console.log("Server is listending on http://"+config.ipadress+":"+config.port);
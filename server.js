// BASE SETUP
// ==============================

// CALL THE PACKAGES ------------
var express      	  = require("express"); // call express
var app          	  = express(); //define our app using express
var bodyParser   	  = require("body-parser"); // get the body-parser
var morgan       	  = require("morgan"); // used to see requests
var config       	  = require("./config");
var path         	  = require("path");
var fs 			 	  = require('fs');
var FileStreamRotator = require('file-stream-rotator');

// APP CONFIGURATION ------------
// use body parse so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function( req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

// Function to check if file exits
function existsSync(filePath){
  try{
    fs.statSync(filePath);
  }catch(err){
    if(err.code == 'ENOENT') return false;
  }
  return true;
};

var logDirectory = __dirname + '/log'

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  filename: logDirectory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false
});

//log all request to log file
app.use(morgan('combined', {stream: accessLogStream}));

// set static files location
app.use(express.static(__dirname + '/public'));

// ROUTES FOR OUR API
// ============================
// ADD API ROUTES HERE
var apiRoutes = require("./app/routes/api")(app, express);
app.use('/api', apiRoutes);

// ROUTE TO SERVE SONG FILE
app.get('/s/:songid', function(req, res) {
	if (existsSync(__dirname + '/public/s/' + req.params.songid + '/song.mp3')) {
		res.sendFile(path.join(__dirname + '/public/s/' + req.params.songid + '/song.mp3'));
	} else {
		res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
	}
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
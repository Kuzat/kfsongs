var multer = require('multer');
var path   = require('path');
var fs     = require('fs');
var shortid = require('shortid');

songid = shortid.generate(); // Generate short unique id to separete the songs

// Creating a storage object for multer 
var storage = multer.diskStorage({
	// Creates a new directory and set it as destination
	destination: function(req, file, cb) {
		fs.mkdir('public/s/'+songid, function() {
			cb(null, 'public/s/'+songid);
		});
	},
	// Save all songs with the same name to easier serve them to the user later
	filename: function(req, file, cb) {
		cb(null, 'song.mp3');
	}
});

// A simple filter that only accepts files with mp3 mimetype
function fileFilter(req, file, cb) {
	if (file.mimetype == 'audio/mp3') {
		cb(null, true)
	} else {
		cb(null, false);
	}
}

var upload = multer({ storage: storage , fileFilter: fileFilter});

module.exports = function(app, express) {
	var apiRoutes = express.Router();

	//Test route
	apiRoutes.get('/', function(req, res) {
		res.json({ message: 'Welcome to kfsongs! Explore the application at https://kfsongs.com/'})
	});

	//Route to upload. Accepts 1 file through post with name song. Return with a sucess message and link on success
	apiRoutes.post('/upload', upload.single('song'), function(req, res, next) {
		if (req.file) {
			return res.json({ message: "Upload complete!", link: "https://127.0.0.1:8080/s/"+songid});
		} else {
			return res.status(415).send({ error: "Wrong file type! Please use mp3"});
		}
		next();
	});

	// Route to upload song from youtube videos. Expects a youtube url
	apiRoutes.post('/upload/youtube', function(req, res) {
		res.json({ message: "Hello bois!" });
	});

	return apiRoutes
};
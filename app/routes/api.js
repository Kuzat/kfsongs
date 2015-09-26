var multer = require('multer');
var path   = require('path');
var fs     = require('fs');
var shortid = require('shortid');

songid = shortid.generate();

var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		fs.mkdir('public/s/'+songid, function() {
			cb(null, 'public/s/'+songid);
		});
	}, 
	filename: function(req, file, cb) {
		cb(null, 'song.mp3');
	}
});

var upload = multer({ storage: storage });

module.exports = function(app, express) {
	var apiRoutes = express.Router();
	apiRoutes.get('/', function(req, res) {
		res.json({ message: 'Welcome to kfsongs api! Explore the api at https://kfsongs.com/api/'})
	});

	apiRoutes.post('/upload', upload.single('song'), function(req, res, next) {
		return res.json({ message: "Upload complete!", link: "https://127.0.0.1:8080/s/"+songid});
		next();
	});

	return apiRoutes
};
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
	apiRoutes.get('/', function(req, res) {
		res.json({ message: 'Welcome to kfsongs! Explore the application at https://kfsongs.com/'})
	});

	apiRoutes.post('/upload', upload.single('song'), function(req, res, next) {
		if (req.file) {
			return res.json({ message: "Upload complete!", link: "https://127.0.0.1:8080/s/"+songid});
		} else {
			return res.status(415).send({ error: "Wrong file type! Please use mp3"});
		}
		next();
	});

	return apiRoutes
};
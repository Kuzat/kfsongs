var multer = require('multer');
var path   = require('path');
var fs     = require('fs');
var shortid = require('shortid');
var fileType = require('file-type');
var config = require('../../config');

// A simple filter that only accepts files with mp3 mimetype
function fileFilter(req, file, cb) {
	if (file.mimetype == 'audio/mp3' || file.mimetype == 'audio/mpeg') {
		cb(null, true)
	} else {
		cb(null, false);
	}
}

//set file limit to 15MB
var limits = { fileSize: 1024*1024*15 }

var upload = multer({ storage: multer.memoryStorage() , fileFilter: fileFilter, limits: limits});

module.exports = function(app, express) {
	var apiRoutes = express.Router();

	//Test route
	apiRoutes.get('/', function(req, res) {
		res.json({ message: 'Welcome to kfsongs! Explore the application at https://kfsongs.com/'})
	});

	//Route to upload. Accepts 1 file through post with name song. Return with a sucess message and link on success
	apiRoutes.post('/upload', upload.single('song'), function(req, res, next) {
		buffer = req.file.buffer;
		if (fileType(buffer).ext == 'mp3') {
			var songid = shortid.generate();
			fs.mkdir('public/s/'+songid, function(err) {
				if(err) return console.log(err);

				fs.writeFile('public/s/'+songid+'/song.mp3', buffer,function(err) {
					if(err) return console.log(err);

					req.file = null;
					buffer = null
					return res.json({ message: "Upload complete!", link: "http://"+config.ipadress+":"+config.port+"/s/"+songid});
				});
			});
		} else {
			return res.status(415).send({ error: "Wrong file type! Please use mp3"});
		}
	});

	return apiRoutes
};
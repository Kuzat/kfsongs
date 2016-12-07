var multer = require('multer');
var fs     = require('fs');
var shortid = require('shortid');
var fileType = require('file-type');
var crypto = require('crypto');
var config = require('../../config');
var ytdl = require('../services/ytdl');

// A simple filter that only accepts files with mp3 mimetype
function fileFilter(req, file, cb) {
	if (file.mimetype == 'audio/mp3' || file.mimetype == 'audio/mpeg') {
		cb(null, true)
	} else {
		cb(null, false);
	}
}

function fileHash(fileBuffer) {
	var hash = crypto.createHash('md5');
	hash.setEncoding('hex');
	hash.write(fileBuffer);

	hash.end();
	return hash.read();
}

function songExist(songid, value, callback) {
	var data = require('../../data/data.json');

	if (value in data) return callback(true, data[value]);

	data[value] = songid;

	fs.writeFile(__dirname + '/../../data/data.json', JSON.stringify(data, null, 2), function(err) {
		if(err) return console.log(err);

		return callback(false, songid);
	});
}

function stripLink(youtube_url) {
        var youtube_id = '';

        var n1 = youtube_url.indexOf('&v=');
        var n2 = youtube_url.indexOf('?v=');
        var n3 = youtube_url.indexOf('be/');
        var n4 = youtube_url.indexOf('v/');
        var n5 = youtube_url.indexOf('ed/');

        if (n5 != -1) {
        	youtube_id = youtube_url.substring(n5+3,n5+14);
        } else if (n3 != -1) {
        	youtube_id = youtube_url.substring(n3+3, n3+14);
        } else if (n4 != -1) {
            youtube_id = youtube_url.substring(n4+2, n4+13);
        } else if (n1 != -1) {
            youtube_id = youtube_url.substring(n1+3, n1+14);
        } else {
        	youtube_id = youtube_url.substring(n2+3, n2+14);
        }

        return youtube_id;
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

			// Generate unique id for each upload
			var songid = shortid.generate();

			// Check if file exist to stop multiple files from beeing stored
			songExist(songid, fileHash(buffer), function(exist, songid) {

				if (exist) return res.json({ message: "Upload complete!", link: "http://"+config.ipadress+":"+config.port+"/s/"+songid});

				// Create a new directory with the unique id
				fs.mkdir('public/s/'+songid, function(err) {
					if(err) return console.log(err);


					fs.writeFile('public/s/'+songid+'/song.mp3', buffer,function(err) {
						if(err) return console.log(err);

						// free up both variables
						req.file = null;
						buffer = null;

						return res.json({ message: "Upload complete!", link: "http://"+config.ipadress+":"+config.port+"/s/"+songid});
					});
				});

			});
		} else {
			return res.status(415).send({ error: "Wrong file type! Please use mp3"});
		}
	});

	// Route to upload with Youtube link.
	apiRoutes.post('/upload/youtube', function(req, res) {
		console.log(req.body);
		if (req.body.url) {

			// Generate unique id for each upload
			var songid = shortid.generate();

			ytdl.checkVideo(req.body.url, function(err, response) {
				if (err) return console.log(err);
				// youtube id used for identification purposes
				var youtube_id = stripLink(req.body.url)
				// Check if file exist to stop multiple files from beeing stored
				songExist(songid, fileHash(youtube_id), function(exist, songid) {

					if (exist) return res.json({ message: "Upload complete!", link: "http://"+config.ipadress+":"+config.port+"/s/"+songid});

					// Create a new directory with the unique id
					fs.mkdir('public/s/'+songid, function(err) {
						ytdl.save(response, songid, function(err, success) {
							if (err) return console.log(err);

							return res.json({ message: "Upload complete!", link: "http://"+config.ipadress+":"+config.port+"/s/"+songid});
						});
					});
				});
			});
		} else {
			return res.status(400).send({ error: "Please send url as a post param"});
		}
	});

	return apiRoutes
};

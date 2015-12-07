var ytdl = require('ytdl-core');
var fs = require('fs');
var http = require('https');
var ffmpeg = require('fluent-ffmpeg');

Object.prototype.maxKey = function() {
	var max = 0, key;
	for (key in this) {
		if (this.hasOwnProperty(key) && parseInt(key) > max) max = parseInt(key);
	}
	return this[max];
};

bitrates = {};

module.exports = function(url, songid, callback) {
	ytdl.getInfo(url, function(err, info) {
		if (err) return callback(err);
		info.formats.forEach(function(element, index, array) {
			if (element.type != undefined) {
				if (element.type.substring(0, 9) == 'audio/mp4') {
					bitrates[element.audioBitrate] = index;
				}
			}
		});
		maxBitrate = bitrates.maxKey();
		var request = http.get(info.formats[maxBitrate].url, function(response) {
			var songSize = response.headers['content-length'];
			var maxSize = 1024*1024*15;
			if (songSize < maxSize) {
				var command = new ffmpeg({source: response})
				.toFormat('mp3')
				.on('end', function() {
					callback(null, true);
				})
				.saveToFile('public/s/'+songid+'/song.mp3');	
			}
		});
	});
};
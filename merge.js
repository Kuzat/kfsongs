var crypto = require('crypto');
var fs = require('fs');

function fileHash(fileBuffer) {
	var hash = crypto.createHash('md5');
	hash.setEncoding('hex');
	hash.write(fileBuffer);

	hash.end();
	return hash.read();
}

function removeFiles(files) {
	try {
		for (i in files) {
			fs.unlinkSync('./'+files[i]+'/song.mp3');
			fs.rmdirSync('./'+files[i]);
		}
	} catch (e) {
		if(e.code == 'ENOENT') {
			console.log('\nERROR: \nYou need permission to delete these files\n');
		}
	}
}

var dirs = fs.readdirSync('./public/s/').filter(function(file) {
	return fs.statSync('./public/s/'+file).isDirectory();
});

songHashes = {};
duplicates = []

for (i in dirs) {
	songHash = fileHash(fs.readFileSync('./public/s/'+dirs[i]+'/'+fs.readdirSync('./public/s/'+dirs[i])[0]));
	if (songHash in songHashes) {
		console.log(dirs[i] + ' is a duplicate');
		duplicates.push(dirs[i]);
	} else {
		songHashes[songHash] = dirs[i];
	}
}

if (duplicates.length != 0) {
	console.log('Do you want to delete thos files? y/n')
	process.stdin.resume();
	process.stdin.setEncoding('utf8');

	process.stdin.on('data', function (text) {
		if (text === 'Y\n' || text == 'y\n') {
			removeFiles(duplicates);
			process.exit();
		} else if(text === 'N\n' || text == 'n\n') {
			process.exit();
		}
	});
} else {
	console.log('No duplicate files.')
}
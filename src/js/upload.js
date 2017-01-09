var ipadress = "127.0.0.1";
var port = 8080;
function uploadFile(file, callback) {
	var xhr = new XMLHttpRequest();
	var maxSize = 1024*1024*15;
	if (xhr.upload && (file.type == 'audio/mp3' || file.type == 'audio/mpeg')) {

		xhr.onreadystatechange = function(event) {
			if (xhr.readyState == 4) {
				progress.parentElement.removeChild(progress);
				if (xhr.status == 200) {
					response = JSON.parse(xhr.response);
					callback(false, response);
				} else if (xhr.status == 500) {
					callback(true, {"error": "File to large. Needs to be less than 15MB"});
				} else {
					response = JSON.parse(xhr.response);
					callback(true, response);
				}
			}
		};

		// Create progress element
		var progress = document.createElement('progress');
		progress.max = 100; progress.value = 0;
		document.getElementsByClassName('content')[0].appendChild(progress);
		
		xhr.upload.addEventListener('progress', function(e) {
			var val = parseInt(e.loaded / e.total * 100);
			progress.value = val;
		}, false);



		var formdata = new FormData();
		formdata.append('song', file);


		xhr.open('POST', 'https://'+ipadress+':'+port+'/api/upload', true);
		xhr.send(formdata);
	} else {
		callback(true, {"error": "Wrong file type! Please use mp3"});
	}
}

function uploadFile(file, callback) {
	var xhr = new XMLHttpRequest();
	if (xhr.upload && file.type == 'audio/mp3') {

		xhr.onreadystatechange = function(event) {
			if (xhr.readyState == 4) {
				progress.parentElement.removeChild(progress);
				if (xhr.status == 200) {
					callback(false, xhr.response);
				} else {
					callback(true, xhr.repsonse);
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

		xhr.open('POST', 'http://127.0.0.1:8080/api/upload', true);
		xhr.send(formdata);
	} else {
		callback(true, null);
	}
}

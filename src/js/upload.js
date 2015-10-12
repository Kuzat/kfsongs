function uploadFile(file) {
	var xhr = new XMLHttpRequest();
	if (xhr.upload && file.type == 'audio/mp3') {
		
		xhr.onreadystatechange = function(event) {
			if (xhr.status == 200) {
				console.log(xhr.response);
			}
		};

		var formdata = new FormData();
		formdata.append('song', file)

		xhr.open('POST', 'http://127.0.0.1:8080/api/upload', true);
		xhr.send(formdata)
	}
}

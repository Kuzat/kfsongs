function getFile() {
	document.getElementById('upload-input').click();
}

document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById('upload-button').onclick = getFile;

	document.getElementById('upload-input').onchange = function(event) {
		removeError();

		uploadFile(event.srcElement.files[0], function(error, response) {
			event.srcElement.value = '';

			if (response == null) {
				console.log(error);
				animation.shake();
				createErrorBox("Wrong file type! Please use mp3");
			} else if (error) {
				console.log(error);
				animation.shake();
				createErrorBox(repsonse.error);
			}

			console.log(response);
		});
	};
});
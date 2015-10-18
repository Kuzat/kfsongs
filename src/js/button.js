function getFile() {
	document.getElementById('upload-input').click();
}

function createErrorBox(errorMsg) {
	box = document.createElement('div');
	box.className = "error-box";
	box.innerText = errorMsg;

	// Instert the box after the upload button
	uploadButton = document.getElementsByClassName('content')[0];
	uploadButton.appendChild(box);
}

function removeError() {
	box = document.getElementsByClassName('error-box')[0];
	if (box) {
		box.parentElement.removeChild(box);
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById('upload-button').onclick = getFile;

	document.getElementById('upload-input').onchange = function(event) {
		removeError();

		uploadFile(event.srcElement.files[0], function(error, response) {
			event.srcElement.value = '';

			if (error) {
				animation.shake();
				createErrorBox(response.error);
			}

			console.log(response);
		});
	};
});
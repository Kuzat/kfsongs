function getFile() {
	document.getElementById('upload-input').click();
}


function removeElmentByClass(classname) {
	box = document.getElementsByClassName(classname)[0];
	if (box) {
		box.parentElement.removeChild(box);
	}
}

function createBox(classname, message) {
	box = document.createElement('div');
	box.className = classname;
	box.innerText = message;

	// Instert the box after the upload button
	uploadButton = document.getElementsByClassName('content')[0];
	uploadButton.appendChild(box);
}

function createInput(classname, value) {
	input = document.createElement('input');
	input.className = classname;
	input.value = value;
	input.onclick = function() { this.select(); };

	// Instert the box after the upload button
	uploadButton = document.getElementsByClassName('content')[0];
	uploadButton.appendChild(input);
}

document.addEventListener("DOMContentLoaded", function(e) {
	document.getElementById('upload-button').onclick = getFile;

	document.getElementById('upload-input').onchange = function(event) {
		removeElmentByClass("error-box");
		removeElmentByClass("success-box");
		removeElmentByClass("link-box");

		uploadFile(event.target.files[0], function(error, response) {
			event.target.value = '';

			if (error) {
				animation.shake();
				createBox('error-box', response.error);
			} else {
				createInput('link-box', response.link);
				createBox('success-box', response.message);
			}
		});
	};


});
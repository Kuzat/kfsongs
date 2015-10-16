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
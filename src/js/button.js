function getFile() {
	document.getElementById('upload-input').click();
}

document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById('upload-button').onclick = getFile;

	document.getElementById('upload-input').onchange = function(event) {
		uploadFile(event.srcElement.files[0]);
	};
});
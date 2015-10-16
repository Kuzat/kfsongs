animation = {};

animation.shake = function() {
	var button = document.getElementById('upload-button');
	button.className = "shake";
	button.addEventListener('animationend', function() {
		button.className = "";
	});
};

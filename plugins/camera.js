var raspiCam = require('raspicam'); // https://github.com/troyth/node-raspicam
var camera;

exports.start = function(opts) {
	console.log('starting camera...');
	console.log(opts);
	camera = new raspiCam(opts);
	camera.start();

	camera.on('start', function() {
		console.log('starting camera...');
	});

	camera.on('read', function() {});
	camera.on("stop", function() {});
	camera.on("exit", function() {});
};

exports.stop = function() {
	camera.stop();
};

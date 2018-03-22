var raspiCam = require('raspicam');  // https://github.com/troyth/node-raspicam
var camera;

exports.start = function(opts) {
	console.log('starting camera...');
	console.log(opts);
	camera = new raspiCam(opts);
	camera.start();

	camera.on('start', function() {
		console.log('starting camera...');
	});		
};

exports.stop = function() {
	camera.stop();
};

/*

camera.on("read", function(err, timestamp, filename) {

});

camera.on("stop", function() {

});

//listen for the process to exit when the timeout has been reached
camera.on("exit", function() {});

*/
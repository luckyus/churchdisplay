var raspiCam = require('raspicam');
var camera = new raspiCam({ 'mode': 'photo', 'output': 'image.jpg' });

exports.start = function(opts) {
	camera.start();
};

exports.stop = function() {
	camera.stop();
};

camera.on('start', function() {
	console.log('starting camera...');
});

camera.on("read", function(err, timestamp, filename) {

});

camera.on("stop", function() {

});

//listen for the process to exit when the timeout has been reached
camera.on("exit", function() {});
var raspiCam = require('raspicam'); // https://github.com/troyth/node-raspicam
var camera;

var spawn = require('child_process').spawn;
var isStop = false;

exports.start = function(opts) {
	isStop = false;
	startStreaming(opts);

	/*
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
	*/
};

exports.stop = function() {
	isStop = true;
	// camera.stop();
};

function startStreaming(opts) {
	var args = opts;
	console.log('spawn...');
	console.log(args);
	spawn('raspistill', args);
	console.log('spawn done!');

	if (isStop == false) {
		setTimeout((args) => {
			startStreaming(args);
		}, 1000);
	}
}
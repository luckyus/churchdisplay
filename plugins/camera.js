var raspiCam = require('raspicam'); // https://github.com/troyth/node-raspicam
var camera;

var child_process = require('child_process');
var args;
var isStop = false;

exports.start = function(opts) {
	isStop = false;
	args = opts;
	startStreaming();

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

function startStreaming() {
	console.log('spawn...');
	console.log(args);
	child_process.spawnSync('raspistill', args);
	console.log('spawn done!');

	if (isStop == false) {
		setTimeout(() => {
			startStreaming();
		}, 1000);
	}
}
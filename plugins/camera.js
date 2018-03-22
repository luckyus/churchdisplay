var raspiCam = require('raspicam'); // https://github.com/troyth/node-raspicam
var camera;

var child_process = require('child_process');
var proc;

exports.start = function(opts) {
	console.log('starting carema...');
	console.log(opts);
	proc = spawn('raspistill', opts);	

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
	// camera.stop();
};

/*
function startStreaming() {
	console.log('spawn...');
	console.log(args);
	var proc = child_process.spawn('raspistill', args);

	for (;;) {
		if(proc)
	}

	console.log('spawn done!');

	if (isStop == false) {
		setTimeout(() => {
			startStreaming();
		}, 1000);
	}
}
*/
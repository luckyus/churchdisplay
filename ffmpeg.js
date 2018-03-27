var child_process = require('child_process'),
	http = require('http'),
	url = require('url'),
	ffmpeg = null;

var livestream = function(req, resp) {
	// For live streaming, create a fragmented MP4 file with empty moov (no seeking possible).

	var input = 'udp://225.1.1.1:8208';
	input = '/dev/video0';

	console.log("Input: " + input, ffmpeg);

	resp.writeHead(200, {
		//'Transfer-Encoding': 'binary'
		"Connection": "keep-alive",
		"Content-Type": "video/mp4",
		//, 'Content-Length': chunksize            // ends after all bytes delivered
		"Accept-Ranges": "bytes" // Helps Chrome
	});

	if (!ffmpeg) {
		ffmpeg = child_process.spawn("ffmpeg", [
			"-i", input, "-vcodec", "copy", "-f", "mp4", "-movflags", "frag_keyframe+empty_moov",
			"-reset_timestamps", "1", "-vsync", "1", "-flags", "global_header", "-bsf:v", "dump_extra", "-y", "-" // output to stdout
		], { detached: false });

		ffmpeg.stdout.pipe(resp);

		ffmpeg.stdout.on("data", function(data) {
			console.log("Data");
		});

		ffmpeg.stderr.on("data", function(data) {
			console.log("Error -> " + data);
		});

		ffmpeg.on("exit", function(code) {
			console.log("ffmpeg terminated with code " + code);
		});

		ffmpeg.on("error", function(e) {
			console.log("ffmpeg system error: " + e);
		});
	}

	req.on("close", function() {
		shut("closed");
	})

	req.on("end", function() {
		shut("ended");
	});

	function shut(event) {
		//TODO: Stream is only shut when the browser has exited, so switching screens in the client app does not kill the session
		console.log("Live streaming connection to client has " + event);
		if (ffmpeg) {
			ffmpeg.kill();
			ffmpeg = null;
		}
	}
	return true;
};

var http_server = http.createServer(livestream).listen(9090, function() {
	console.log("Server listening on port 9090");
});
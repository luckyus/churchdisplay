var express = require('express'); // using express
var app = express();

const fs = require('fs'); // using file system module
var path = require('path');
var sse = require('server-sent-events');
var sleep = require('system-sleep');
var watch = require('node-watch');
var reload = require('reload');
var model = require('./model/model.js');

var wsServer = require('./servers/websockets');
wsServer.start(model);

// DHT22
var handler = {
	set(target, key, value) {
		target[key] = value;
		wsServer.onModelChange();
	}
};

/*
var dhtPlugin = require('./plugins/DHT22SensorPlugin');
dhtPlugin.start(model, { 'simulate': false, 'frequency': 2000 }, handler);

var coapPlugin = require('./plugins/coapPlugin');
coapPlugin.start(model, { 'simulate': false, 'frequency': 10000 });
*/

var folderUpperLeft = path.resolve(__dirname, 'public/upperLeft');
var folderLowerLeft = path.resolve(__dirname, 'public/lowerLeft');
var folderRight = path.resolve(__dirname, 'public/right');

var folderCamera = path.resolve(__dirname, 'public/camera');
var fileCamera = 'image.jpg';
var fullpathCamera = folderCamera + '/' + fileCamera;

var camera = require('./plugins/camera');
// camera.start({ mode: 'timelapse', output: fullpath, t: 60000, tl: 10 });
// camera.start(['-o', fullpathCamera, '-t', Number.MAX_SAFE_INTEGER.toString(), '-tl', '100']);
camera.start(['-o', fullpathCamera, '-t', '999999999', '-tl', '100']);

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/coapDevice/sensors/co2', (req, res, next) => {
	req.result = model.things.coapDevice.sensors.co2;
	next();
});

app.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'index.html'));
});

// app.get('/upperLeft', function (req, res) {
// 	res.sendFile(path.join(__dirname));
// });

app.get('/dir', (req, res) => {
	fs.readdir(folderUpperLeft, (err, files) => {
		// files.forEach(file => { console.log('upperLeft: ' + file); });
		// handle synology's self-created thumbnail directory (120122)
		var index = files.indexOf('@eaDir');
		if (index > -1) files.splice(index, 1);
		res.send(files);
	});
});

app.get('/dir2', (req, res) => {
	fs.readdir(folderLowerLeft, (err, files) => {
		var index = files.indexOf('@eaDir');
		if (index > -1) files.splice(index, 1);
		res.send(files);
	});
});

app.get('/dir3', (req, res) => {
	fs.readdir(folderRight, (err, files) => {
		var index = files.indexOf('@eaDir');
		if (index > -1) files.splice(index, 1);
		res.send(files);
	});
});

// app.get('/p/:tagId', function (req, res) {
// 	res.send("tagId is set to " + req.params.tagId);
// });

app.get('/event1', sse, function(req, res) {
	watch(folderUpperLeft, { recursive: true }, (evt, name) => {
		fs.readdir(folderUpperLeft, (err, files) => {
			// handle synology's self-created thumbnail directory (120122)
			var index = files.indexOf('@eaDir');
			if (index > -1) files.splice(index, 1);
			res.sse(`data: ${JSON.stringify(files)}\n\n`);
		});
	});
});

app.get('/event2', sse, function(req, res) {
	watch(folderLowerLeft, { recursive: true }, (evt, name) => {
		fs.readdir(folderLowerLeft, (err, files) => {
			var index = files.indexOf('@eaDir');
			if (index > -1) files.splice(index, 1);
			res.sse(`data: ${JSON.stringify(files)}\n\n`);
		});
	});
});

app.get('/event3', sse, function(req, res) {
	watch(folderRight, { recursive: true }, (evt, name) => {
		fs.readdir(folderRight, (err, files) => {
			var index = files.indexOf('@eaDir');
			if (index > -1) files.splice(index, 1);
			res.sse(`data: ${JSON.stringify(files)}\n\n`);
		});
	});
});

app.get('/eventPhoto', sse, function(req, res) {
	watch(fullpathCamera, { recursive: true }, (evt, name) => {
		console.log('folderCamera changed!!!');
		fs.readdir(folderCamera, (err, files) => {
			res.sse(`data: ${fileCamera}\n\n`);
		});
	});
});

// reload page when restart node (180125)
app.use('/reload', express.static(path.resolve(__dirname, 'node_modules')));
reload(app);

app.use(function(req, res) {
	if (req.result) {
		res.send(req.result);
	} else {
		res.statusCode = 404;
		res.end("404!");
	}
});

var server = app.listen(model.port, function() {
	fs.readdir(folderUpperLeft, (err, files) => {
		fileListUpperLeft = files;
		fileCountUpperLeft = files.length;
		// res.send(files);
	});
	fs.readdir(folderLowerLeft, (err, files) => {
		fileListLowerLeft = files;
		fileCountLowerLeft = files.length;
	});
	fs.readdir(folderRight, (err, files) => {
		fileListRight = files;
		fileCountRight = files.length;
	});

	wsServer.listen(server);
	console.log(`Church Display - listening on port ${model.port}!`);
});
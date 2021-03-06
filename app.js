var express = require('express');
var cors = require('cors');

const fs = require('fs'); // using file system module

var app = express();

var path = require('path');
var sse = require('server-sent-events');
var sleep = require('system-sleep');
var watch = require('node-watch');
var reload = require('reload');
//
var folderUpperLeft = path.resolve(__dirname, 'public/upperLeft');
var folderLowerLeft = path.resolve(__dirname, 'public/lowerLeft');
var folderRight = path.resolve(__dirname, 'public/right');

// app.use('/public', express.static(path.join(__dirname + '/public')));
app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendFile(path.resolve(__dirname, 'index.html'));
});

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

// reload page when restart node (180125)
app.use('/reload', express.static(path.resolve(__dirname, 'node_modules')));
reload(app);

app.use(function(req, res) {
	res.statusCode = 404;
	res.end("404!");
});

app.listen(3000, function() {
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
	console.log('Church Display - listening on port 3000!');
});
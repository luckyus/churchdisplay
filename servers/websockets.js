var WebSocketServer = require('ws').Server;
var app = require('express')();
// var model = require('./../model/model.js');

exports.listen = function(server) {
	var wss = new WebSocketServer({ server: server });
	console.info('WebSocket server started...');

	wss.onWebSocketOpen = function onWebSocketOpen(ws, req) {
		console.log(req.url);
	};

	wss.on('connection', function(ws, req) {
		var url = req.url;
		console.info(url);

		var interval;
		var currentValue = 12345;

		try {
			interval = setInterval(function() {
				if (currentValue != app.locals.model.temperature.value) {
					currentValue = app.locals.model.temperature.value;
					console.log('websocket: temperature changed (' + currentValue + ')!');
					ws.send(JSON.stringify(app.locals.model.temperature), function() {});
				}
			}, 2000);
		} catch (e) {
			console.log('Unable to observe %s resource!', url);
		}
	});
};

var WebSocketServer = require('ws').Server;
var model = require('./../model/model.js');

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
		var currentValue = 0;

		try {
			interval = setInterval(function() {
				if (currentValue != model.temperature.value) {
					console.log('websocket: temperature changed!');
					
					currentValue = model.temperature.value;
					ws.send(JSON.stringify(model.temperature), function() {});
				}
			}, 2000);
		} catch (e) {
			console.log('Unable to observe %s resource!', url);
		}
	});
};

var WebSocketServer = require('ws').Server;
var model;
// var model = require('./../model/model.js');

exports.start = function(m) {
	model = m;
};

exports.onModelChange = () => {
	console.log(`websocket.js onModelChange: temperature: ${model.temperature.value}!`);
};

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
				if (currentValue != model.temperature.value) {
					currentValue = model.temperature.value;
					console.log('websocket: temperature changed (' + currentValue + ')!');
					ws.send(JSON.stringify(model.temperature), function() {});
				}
			}, 2000);
		} catch (e) {
			console.log('Unable to observe %s resource!', url);
		}
	});
};
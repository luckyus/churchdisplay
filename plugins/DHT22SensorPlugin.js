var model = {
	"name": "Church Outdoor Display",
	"description": "Hop Yat Church's Outdoor Display with Sensors",
	"port": 3080,
	"temperature": {
		"name": "temperature",
		"gpio": 12,
		"value": 0,
		"unit": "celsius"
	},
	"humidity": {
		"name": "humidity",
		"gpio": 12,
		"value": 0,
		"unit": "%"
	},
	"fan": {
		"name": "fan",
		"gpio": 0,
		"value": true
	},
	"led": {
		"name": "led",
		"gpio": 4,
		"value": true
	},
	"lcd": {
		"name": "lcd",
		"gpio": 0,
		"value": "iGuardPayroll.com"
	}
};

var interval, sensor;
var pluginName = 'Temperature & Humidity';
var localParams = {
	'simulate': false,
	'frequency': 5000
};

exports.start = function(params) {
	localParams = params;

	// debug
	console.log('simulate: %s...', localParams.simulate);

	if (params.simulate) {
		simulate();
	} else {
		connectHardware();
	}
};

exports.stop = function() {
	if (params.simulate) {
		clearInterval(interval);
	} else {
		sensor.unexport();
	}
	console.info('%s plugin stopped!', pluginName);
};

function connectHardware() {
	var sensorDriver = require('node-dht-sensor');
	var sensor = {
		initialize: function() {
			return sensorDriver.initialize(22, model.temperature.gpio);
		},
		read: function() {
			var readout = sensorDriver.read();
			model.temperature.value = parseFloat(readout.temperature.toFixed(2));
			model.humidity.value = parseFloat(readout.humidity.toFixed(2));
			// showValue();

			setTimeout(function() {
				sensor.read();
			}, localParams.frequency);
		}
	};
	if (sensor.initialize()) {
		console.info('Hardware %s sensor started!', pluginName);
		sensor.read();
	} else {
		console.warn('Failed to initialize sensor!');
	}
}

function simulate() {
	interval = setInterval(function() {
		model.temperature.value = randomInt(0, 40);
		model.humidity.value = randomInt(0, 100);
		showValue();
	}, localParams.frequency);
	console.info('Simulated %s sensor started!', pluginName);
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

function showValue() {
	console.info('Temperature: %s C, humidity %s \%', model.temperature.value, model.humidity.value);
}
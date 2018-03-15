var app = require('express')();
var path = require('path');

var model;
var proxy;
// var model = require('./../model/model.js');

var interval, sensor;
var pluginName = 'Temperature & Humidity';
var localParams = {
	'simulate': false,
	'frequency': 5000
};

var handler = {
	set(target, key, value) {
		console.log(`Proxy: Setting ${key} as ${value}!`);
		target[key] = value;
	}
};

exports.start = function(m, params) {
	localParams = params;
	model = m;

	proxy = new Proxy(model.temperature, handler);

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
			proxy.value = parseFloat(readout.temperature.toFixed(2));
			model.humidity.value = parseFloat(readout.humidity.toFixed(2));

			console.info('Temperature: %s C, humidity %s \%', model.temperature.value.toFixed(2), model.humidity.value.toFixed(2));

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
		proxy.temperature.value = randomInt(0, 40);
		proxy.humidity.value = randomInt(0, 100);
	}, localParams.frequency);
	console.info('Simulated %s sensor started!', pluginName);
}

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low);
}

function showValue() {
	console.info('Temperature: %s C, humidity %s \%', model.temperature.value, model.humidity.value);
}
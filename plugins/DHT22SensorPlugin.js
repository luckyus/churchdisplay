var app = require('express');
var path = require('path');
// var model = require('./../model/model.js');

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
			return sensorDriver.initialize(22, app.locals.model.temperature.gpio);
		},
		read: function() {
			var readout = sensorDriver.read();
			app.locals.model.temperature.value = parseFloat(readout.temperature.toFixed(2));
			app.locals.model.humidity.value = parseFloat(readout.humidity.toFixed(2));

			console.info('Temperature: %s C, humidity %s \%', app.locals.model.temperature.value.toFixed(2), app.locals.model.humidity.value.toFixed(2));

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
		app.locals.model.temperature.value = randomInt(0, 40);
		app.locals.model.humidity.value = randomInt(0, 100);
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
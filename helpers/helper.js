exports.randomInt = (low, high) => {
	return Math.floor(Math.random() * (high - low + 1) + low);
};

exports.addDevice = function(model, id, name, description, sensors, actuators) {
	if (!model.things) {
		model.things = {};
	}
	model.things[id] = {
		'name': name,
		'description': description,
		'sensors': sensors,
		'actuators': actuators
	}
};
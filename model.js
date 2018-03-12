module.exports = {
	"name": "Church Outdoor Display",
	"description": "Hop Yat Church's Outdoor Display with Sensors",
	"port": 3000,
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
}
'use strict';

// let os = require('os');

const cl = require('../..');


if (global.MAIN_DEVICE) {
	return;
}

let devices = [];
let deviceTypes = [];
let devicesDisplayName = [];
let platforms = [];

cl.getPlatformIDs().reverse().forEach(function (p) {
	let pDevices = cl.getDeviceIDs(p).reverse();
	let info = cl.getPlatformInfo(p, cl.PLATFORM_VERSION);
	devicesDisplayName = devicesDisplayName.concat(pDevices.map(function (d) {
		return info + ' : ' + cl.getDeviceInfo(d, cl.DEVICE_NAME);
	}));
	devices = devices.concat(pDevices);
	deviceTypes = deviceTypes.concat(pDevices.map(function (device) {
		return cl.getDeviceInfo(device, cl.DEVICE_TYPE);
	}));
	platforms = platforms.concat(pDevices.map(function () {
		return p;
	}));

});

let deviceIdx = 0;

for (let index in process.argv) {
	let str = process.argv[index];
	if (str.indexOf('--device') == 0) {
		deviceIdx = str.substr(9);
	}
}

global.MAIN_DEVICE_IDX = deviceIdx;
global.MAIN_DEVICE = devices[deviceIdx];
global.MAIN_PLATFORM = platforms[deviceIdx];
global.MAIN_DEVICE_TYPE = deviceTypes[deviceIdx];

// console.log('\n-----------------------------');
// console.log('AVAILABLE DEVICES :');

// devices.forEach(function (d, idx) {
// 	let vendor = devicesDisplayName[idx];
// 	console.log(idx + '. ' + vendor);
// });


// console.log('\nENABLED DEVICE :');

// console.log('Currently using device ' + deviceIdx + ':');
// console.log(devicesDisplayName[deviceIdx]);
// console.log('\nTo use another device, add --device=<idx> to your mocha call');

// console.log('\n');
// console.log('OS : ' + os.platform());

// console.log('-----------------------------\n');

'use strict';

let os = require('os');

const cl = require('../');


let vendors = {
	'Advanced Micro Devices, Inc.' : 'AMD',
	'AMD' : 'AMD',
	'Apple' : 'Apple',
	'Intel' : 'Intel',
	'Intel Inc.' : 'Intel',
	'Intel(R) Corporation': 'Intel',
	'nVidia': 'nVidia',
	'NVIDIA Corporation': 'nVidia'
};

module.exports = function () {
	let checks = undefined;
	let _vendors = [];
	let _oss = [];
	let _devices = [];
	let platformVendor = vendors[cl.getPlatformInfo(global.MAIN_PLATFORM_ID, cl.PLATFORM_VENDOR)];
	let deviceVendor = vendors[cl.getDeviceInfo(global.MAIN_DEVICE_ID,cl.DEVICE_VENDOR)];
	let osName = os.platform();

	let match = function () {
		let vmatch = _vendors.length == 0 || _vendors.some(function (v) {
			return platformVendor == v;
		});

		let omatch = _oss.length == 0 || _oss.some(function (o) {
			return osName == o;
		});

		let dmatch = _devices.length == 0 || _devices.some(function (o) {
			return deviceVendor == o;
		});

		return vmatch && omatch && dmatch;
	};

	let obj = {
		vendor: function (...xs) {
			_vendors.push(...xs);
			checks |= xs.length;
			return obj;
		},

		device: function (...xs) {
			_devices.push(...xs);
			checks |= xs.length;
			return obj;
		},

		os : function (...xs) {
			_oss.push(...xs);
			checks |= xs.length;
			return obj;
		},

		it : function (desc) {
			if (checks === undefined || (checks > 0 && match())) {
				console.warn('Cancelling ' + desc + ' because of known driver issue');
				it.skip.apply(it, arguments);
			} else {
				it.apply(it, arguments);
			}
		}
	};

	return obj;
};

module.exports.vendors = vendors;

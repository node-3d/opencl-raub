'use strict';

const cl = require('../..');

(() => {
	if (global.MAIN_DEVICE) {
		return;
	}
	
	// Grab ALL possible devices into a flat array
	const devicesAll = cl.getPlatformIDs().flatMap((platform) => {
		const version = cl.getPlatformInfo(platform, cl.PLATFORM_VERSION);
		const platformDevices = cl.getDeviceIDs(platform);
		
		return platformDevices.map((device) => ({
			platform,
			device,
			version,
			name: cl.getDeviceInfo(device, cl.DEVICE_NAME),
			type: cl.getDeviceInfo(device, cl.DEVICE_TYPE),
		}));
	});
	
	// Remove "D3D" devices. The bugs are strong with those ones!
	const devicesNoDx = devicesAll.filter((d) => !d.version.includes('D3D'));
	
	const devices = devicesNoDx.length ? devicesNoDx : devicesAll;
	
	const deviceIdx = 0;
	
	global.DEVICES = devices;
	global.MAIN_DEVICE = devices[deviceIdx].device;
	global.MAIN_PLATFORM = devices[deviceIdx].platform;
	global.MAIN_DEVICE_TYPE = devices[deviceIdx].type;
	
	console.log('\n-----------------------------');
	console.log(
		'AVAILABLE DEVICES:',
		global.DEVICES.map(({ name, version }) => `${version} ${name}`),
	);
	console.log('ACTIVE DEVICE:', devices[deviceIdx].version, devices[deviceIdx].name);
	console.log('-----------------------------\n');
})();

'use strict';

const { inspect } = require('util');

const cl = require('./core');


cl.Wrapper.prototype[inspect.custom] = cl.Wrapper.prototype.toString;

let cached = null;

const showDevices = (devices, mainDevice) => {
	console.info(
		'AVAILABLE DEVICES:',
		devices.map(({ name, version }) => `${version} ${name}`),
	);
	console.info('ACTIVE DEVICE:', `${mainDevice.version} ${mainDevice.name}`);
};

cl.quickStart = (isLoggingDevices = false) => {
	if (cached) {
		if (isLoggingDevices) {
			showDevices(cached.devices, cached.result);
		}
		return cached.result;
	}
	
	// Grab ALL possible devices into a flat array
	const devicesAll = cl.getPlatformIDs().flatMap((platform) => {
		const version = cl.getPlatformInfo(platform, cl.PLATFORM_VERSION);
		const platformDevices = cl.getDeviceIDs(platform);
		return platformDevices.map((device) => {
			const name = cl.getDeviceInfo(device, cl.DEVICE_NAME);
			const type = cl.getDeviceInfo(device, cl.DEVICE_TYPE);
			return {
				platform,
				device,
				version,
				name,
				type,
				label: `${type === cl.DEVICE_TYPE_GPU ? 'GPU ' : ''}${version} ${name}`,
			};
		});
	});
	
	// Try to remove "D3D" devices. The bugs are strong with those ones!
	const devicesNoDx = devicesAll.filter((d) => !d.version.includes('D3D'));
	
	const devices = devicesNoDx.length ? devicesNoDx : devicesAll;
	
	// Prefer GPU devices if any
	const devicesGpu = devices.filter((d) => (d.type === cl.DEVICE_TYPE_GPU));
	
	// Best device might be the one declaring the highest version
	const mainDevice = (devicesGpu.length ? devicesGpu : devices).sort(
		(a, b) => (b.version > a.version ? 1 : -1),
	)[0];
	
	if (isLoggingDevices) {
		showDevices(devices, mainDevice);
	}
	
	const context = cl.createContext(
		[cl.CONTEXT_PLATFORM, mainDevice.platform],
		[mainDevice.device],
	);
	
	cached = { devices, result: { ...mainDevice, context } };
	return cached.result;
};

module.exports = cl;

'use strict';

const { inspect } = require('util');

const cl = require('./core');


cl.Wrapper.prototype[inspect.custom] = cl.Wrapper.prototype.toString;

// global.WebCLPlatform = cl.WebCLPlatform = function (_) { this._ = _; };
// global.WebCLDevice = cl.WebCLDevice = function (_) { this._ = _; };
// global.WebCLContext = cl.WebCLContext = function (_) { this._ = _; };
// global.WebCLCommandQueue = cl.WebCLCommandQueue = function (_) { this._ = _; };
// global.WebCLMemObject = cl.WebCLMemObject = function (_) { this._ = _; };
// global.WebCLEvent = cl.WebCLEvent = function (_) { this._ = _; };
// global.WebCLProgram = cl.WebCLProgram = function (_) { this._ = _; };
// global.WebCLKernel = cl.WebCLKernel = function (_) { this._ = _; };
// global.WebCLSampler = cl.WebCLSampler = function (_) { this._ = _; };

let cached = null;

const showDevices = (devices, mainDevice) => {
	console.log(
		'AVAILABLE DEVICES:',
		devices.map(({ name, version }) => `${version} ${name}`),
	);
	console.log('ACTIVE DEVICE:', `${mainDevice.version} ${mainDevice.name}`);
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
	
	// Remove "D3D" devices. The bugs are strong with those ones!
	const devicesNoDx = devicesAll.filter((d) => !d.version.includes('D3D'));
	
	const devices = devicesNoDx.length ? devicesNoDx : devicesAll;
	
	const devicesGpu = devices.filter((d) => (
		d.type === cl.DEVICE_TYPE_GPU
	));
	
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

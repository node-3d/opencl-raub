'use strict';

const cl = require('../../');

let { vendors } = require('./diagnostic');

require('./device_selection');


let defaultDeviceVendor = vendors[cl.getDeviceInfo(global.MAIN_DEVICE, cl.DEVICE_VENDOR)];
let defaultPlatformVendor = vendors[cl.getPlatformInfo(global.MAIN_PLATFORM, cl.PLATFORM_VENDOR)];
let defaultOptions = { device: global.MAIN_DEVICE, platform: global.MAIN_PLATFORM };

let deviceIdToType = id => cl.getDeviceInfo(id, cl.DEVICE_TYPE);
let deviceTypesAsBitmask = xs => xs.reduce((x, y) => x | y, 0);


let Utils = {
	newContext(opts = defaultOptions) {
		let platformId = ('platform' in opts) ? opts.platform : global.MAIN_PLATFORM;
		let types = ('type' in opts) ? [opts.type] : ('types' in opts) ? opts.types : null;
		let devices = ('device' in opts) ? [opts.device] : ('devices' in opts) ? opts.devices : null;
		let properties = ('properties' in opts) ? opts.properties : [cl.CONTEXT_PLATFORM, platformId];
		
		if (types && types.length) {
			devices = cl
				.getDeviceIDs(platformId, cl.DEVICE_TYPE_ALL)
				.filter(id => ~types.indexOf(deviceIdToType(id)));
		}
		
		devices = devices && devices.length ? devices : [global.MAIN_DEVICE];
		types = deviceTypesAsBitmask(types || devices.map(deviceIdToType));
		
		return cl.createContext ?
			cl.createContext(properties, devices, null, null) :
			cl.createContextFromType(properties, types, null, null);
	},
	withContext: function (exec) {
		let ctx = Utils.newContext(defaultOptions);
		try { exec(ctx, global.MAIN_DEVICE, global.MAIN_PLATFORM); }
		finally { cl.releaseContext(ctx); }
	},
	
	withAsyncContext: function (exec) {
		let ctx = Utils.newContext(defaultOptions);
		try {
			exec(ctx, global.MAIN_DEVICE, global.MAIN_PLATFORM, function () {
				cl.releaseContext(ctx);
			});
		} catch (e) {
			cl.releaseContext(ctx);
		}
	},
	
	withProgram: function (ctx, source, exec) {
		let prg = cl.createProgramWithSource(ctx, source);
		cl.buildProgram(prg, null, '-cl-kernel-arg-info');
		try {
			exec(prg);
		}
		finally {
			cl.releaseProgram(prg);
		}
	},
	
	withProgramAsync: function (ctx, source, exec) {
		let prg = cl.createProgramWithSource(ctx, source);
		cl.buildProgram(prg, null, '-cl-kernel-arg-info');
	
		try {
			exec(prg, function () {
				cl.releaseProgram(prg);
			});
		} catch (e) { cl.releaseProgram(prg); }
	},
	
	withCQ: function (ctx, device, exec) {
		let cq = (
			cl.createCommandQueueWithProperties ||
			cl.createCommandQueue
		)(ctx, device, Utils.checkVersion('1.x') ? null : []);
		try { exec(cq); }
		finally { cl.releaseCommandQueue(cq); }
	},
	
	withAsyncCQ: function (ctx, device, exec) {
		let cq = (
			cl.createCommandQueueWithProperties ||
			cl.createCommandQueue
		)(ctx, device, Utils.checkVersion('1.x') ? null : []);
		try {
			exec(cq, function () {
				cl.releaseCommandQueue(cq);
			});
		} catch (e) { cl.releaseCommandQueue(cq); }
	},
	
	bind : function (/*...*/) {
		let args = Array.prototype.slice.call(arguments);
		let fct = args.shift();
		return function () {
			return fct.apply(fct, args);
		};
	},
	
	checkImplementation : function () {
		// We certainly need a better implementation of this method
		if (! cl.PLATFORM_ICD_SUFFIX_KHR) {
			return 'osx';
		} else {
			return 'other';
		}
	},
	
	checkVendor(vendor) {
		return vendor === defaultDeviceVendor || vendor === defaultPlatformVendor;
	},
	
	checkVersion : function (v) {
		return v == '1.2' || v == '1.x';
	},
};

module.exports = Utils;

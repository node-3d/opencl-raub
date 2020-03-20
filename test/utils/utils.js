'use strict';

const cl = require('../../');

let { vendors } = require('./diagnostic');

require('./device_selection');


let defaultDeviceId = global.MAIN_DEVICE_ID;
let defaultPlatformId = global.MAIN_PLATFORM_ID;
let defaultDeviceVendor = vendors[cl.getDeviceInfo(global.MAIN_DEVICE_ID, cl.DEVICE_VENDOR)];
let defaultPlatformVendor = vendors[cl.getPlatformInfo(global.MAIN_PLATFORM_ID, cl.PLATFORM_VENDOR)];
let defaultOptions = { device: defaultDeviceId, platform: defaultPlatformId };

let deviceIdToType = id => cl.getDeviceInfo(id, cl.DEVICE_TYPE);
let deviceTypesAsBitmask = xs => xs.reduce((x, y) => x | y, 0);

afterEach(function () {
	cl.releaseAll();
});


let Utils = {
	newContext(opts = defaultOptions) {
		let platformId = ('platform' in opts) ? opts.platform : defaultPlatformId;
		let types = ('type' in opts) ? [opts.type] : ('types' in opts) ? opts.types : null;
		let devices = ('device' in opts) ? [opts.device] : ('devices' in opts) ? opts.devices : null;
		let properties = ('properties' in opts) ? opts.properties : [cl.CONTEXT_PLATFORM, platformId];

		if (types && types.length) {
			devices = cl
				.getDeviceIDs(platformId, cl.DEVICE_TYPE_ALL)
				.filter(id => ~types.indexOf(deviceIdToType(id)));
		}

		devices = devices && devices.length ? devices : [defaultDeviceId];
		types = deviceTypesAsBitmask(types || devices.map(deviceIdToType));

		return cl.createContext ?
			cl.createContext(properties, devices, null, null) :
			cl.createContextFromType(properties, types, null, null);
	},
	withContext: function (exec) {
		let ctx = Utils.newContext(defaultOptions);
		try { exec(ctx, defaultDeviceId, defaultPlatformId); }
		finally { cl.releaseContext(ctx); }
	},

	withAsyncContext: function (exec) {
		let ctx = Utils.newContext(defaultOptions);
		try {
			exec(ctx, defaultDeviceId, defaultPlatformId, function () {
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
		if (v == '1.1') {
			return cl.VERSION_1_1 && ! cl.VERSION_1_2 && ! cl.VERSION_2_0;
		} else if (v == '1.2') {
			return cl.VERSION_1_1 && cl.VERSION_1_2 && ! cl.VERSION_2_0;
		} else if (v == '1.x') {
			return (cl.VERSION_1_1 || cl.VERSION_1_2) && ! cl.VERSION_2_0;
		} else if (v == '2.0') {
			return cl.VERSION_1_1 && cl.VERSION_1_2 && cl.VERSION_2_0;
		} else if (v == '2.x') {
			return cl.VERSION_1_1 && cl.VERSION_1_2 && cl.VERSION_2_0;
		} else {
			console.error('Unknown version : \'' + v + '\'');
			return false;
		}
	}
};

module.exports = Utils;

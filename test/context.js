'use strict';

const { expect, assert } = require('chai');

const cl = require('../');
let U = require('./utils');
let skip = require('./utils/diagnostic');


describe('Context', function () {

	let properties = [cl.CONTEXT_PLATFORM, global.MAIN_PLATFORM];
	let devices = [global.MAIN_DEVICE];

	describe('#createContext', function () {

		it('should throw if devices = null', function () {
			const ex = 'Argument 1 must be of type `Array`';
			const createBound = cl.createContext.bind(
				cl.createContext,
				null,
				null,
				null,
				null
			);
			expect(createBound).to.throw(ex);
		});

		it('should create a context with default properties for a platform', function () {
			let ctx = cl.createContext(properties, devices, null, null);
			assert.isNotNull(ctx);
			assert.isDefined(ctx);
			cl.releaseContext(ctx);
		});

		skip().vendor('Apple').it('should return a device even if properties are null', function () {
			let ctx = cl.createContext(null, devices, null, null);
			assert.isNotNull(ctx);
			assert.isDefined(ctx);
			cl.releaseContext(ctx);
		});
	});

	describe('#getContextInfo', function () {

		let testForType = function (clKey, _assert) {
			it('should return the good type for ' + clKey, function () {
				U.withContext(function (ctx) {
					let val = cl.getContextInfo(ctx, cl[clKey]);
					// console.log(`${clKey} = ${typeof val} ${val}`);
					_assert(val);
				});
			});
		};

		testForType('CONTEXT_REFERENCE_COUNT', assert.isNumber.bind(assert));
		testForType('CONTEXT_DEVICES', assert.isArray.bind(assert));
		testForType('CONTEXT_PROPERTIES', assert.isArray.bind(assert));
		testForType('CONTEXT_NUM_DEVICES', assert.isNumber.bind(assert));

		it('should return at least one device', function () {
			let ctx = U.newContext({ type: cl.DEVICE_TYPE_ALL });
			let devices = cl.getContextInfo(ctx, cl.CONTEXT_DEVICES);
			assert(devices.length >= 1);
			assert.isObject(devices[0]);
			cl.releaseContext(ctx);
		});

		it('should throw cl.INVALID_VALUE if an unknown param is given', function () {
			let ctx = U.newContext({ type: cl.DEVICE_TYPE_ALL });
			const getInfoBound = cl.getContextInfo.bind(cl.getContextInfo, ctx, -1);
			expect(getInfoBound).to.throw(cl.INVALID_VALUE.message);
			cl.releaseContext(ctx);
		});

		it('should have a reference count of 1', function () {
			let ctx = U.newContext({ type: cl.DEVICE_TYPE_ALL });
			assert(cl.getContextInfo(ctx, cl.CONTEXT_REFERENCE_COUNT) == 1);
			cl.releaseContext(ctx);
		});

	});

	describe('#retainContext', function () {
		it('should have incremented ref count after call', function () {
			let ctx = U.newContext({ type: cl.DEVICE_TYPE_ALL });
			let before = cl.getContextInfo(ctx, cl.CONTEXT_REFERENCE_COUNT);
			cl.retainContext(ctx);
			let after = cl.getContextInfo(ctx, cl.CONTEXT_REFERENCE_COUNT);
			assert(before + 1 == after);
			cl.releaseContext(ctx);
			cl.releaseContext(ctx);
		});
	});

	describe('#releaseContext', function () {
		it('should have decremented ref count after call', function () {
			let ctx = U.newContext({ type: cl.DEVICE_TYPE_ALL });
			let before = cl.getContextInfo(ctx, cl.CONTEXT_REFERENCE_COUNT);
			cl.retainContext(ctx);
			cl.releaseContext(ctx);
			let after = cl.getContextInfo(ctx, cl.CONTEXT_REFERENCE_COUNT);
			assert(before == after);
			cl.releaseContext(ctx);
		});
	});
});

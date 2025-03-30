'use strict';

const assert = require('node:assert').strict;
const { describe, it, after } = require('node:test');

const cl = require('../');
const U = require('./utils');


describe('Context', () => {
	const properties = [cl.CONTEXT_PLATFORM, global.MAIN_PLATFORM];
	const devices = [global.MAIN_DEVICE];
	
	describe('#createContext', () => {
		it('throws if devices = null', () => {
			assert.throws(
				() => cl.createContext(null, null),
				new Error('Argument 1 must be of type `Array`'),
			);
		});
		
		it('creates a context with default properties for a platform', () => {
			const ctx = cl.createContext(properties, devices);
			assert.ok(ctx);
			cl.releaseContext(ctx);
		});
		
		it('returns a device even if properties are null', () => {
			const ctx = cl.createContext(null, devices);
			assert.ok(ctx);
			cl.releaseContext(ctx);
		});
	});
	
	describe('#getContextInfo', () => {
		const context = U.newContext();
		after(() => {
			cl.releaseContext(context);
		});
		
		it('returns valid info for CONTEXT_REFERENCE_COUNT', () => {
			const info = cl.getContextInfo(context, cl.CONTEXT_REFERENCE_COUNT);
			U.assertType(info, 'number');
		});
		it('returns valid info for CONTEXT_DEVICES', () => {
			const info = cl.getContextInfo(context, cl.CONTEXT_DEVICES);
			U.assertType(info, 'array');
		});
		it('returns valid info for CONTEXT_PROPERTIES', () => {
			const info = cl.getContextInfo(context, cl.CONTEXT_PROPERTIES);
			U.assertType(info, 'array');
		});
		it('returns valid info for CONTEXT_NUM_DEVICES', () => {
			const info = cl.getContextInfo(context, cl.CONTEXT_NUM_DEVICES);
			U.assertType(info, 'number');
		});
		
		it('returns at least one device', () => {
			const info = cl.getContextInfo(context, cl.CONTEXT_DEVICES);
			U.assertType(info[0], 'object');
		});
		
		it('throws cl.INVALID_VALUE if an unknown param is given', () => {
			assert.throws(
				() => cl.getContextInfo(context, -1),
				cl.INVALID_VALUE,
			);
		});
		
		it('has a reference count of 1', () => {
			const info = cl.getContextInfo(context, cl.CONTEXT_REFERENCE_COUNT);
			assert.strictEqual(info, 1);
		});
	});
	
	describe('#retainContext', () => {
		it('increments ref count', () => {
			const ctx = U.newContext();
			const before = cl.getContextInfo(ctx, cl.CONTEXT_REFERENCE_COUNT);
			cl.retainContext(ctx);
			const after = cl.getContextInfo(ctx, cl.CONTEXT_REFERENCE_COUNT);
			assert(before + 1 == after);
			cl.releaseContext(ctx);
			cl.releaseContext(ctx);
		});
	});
	
	describe('#releaseContext', () => {
		it('decrements ref count after call', () => {
			const ctx = U.newContext();
			const before = cl.getContextInfo(ctx, cl.CONTEXT_REFERENCE_COUNT);
			cl.retainContext(ctx);
			cl.releaseContext(ctx);
			const after = cl.getContextInfo(ctx, cl.CONTEXT_REFERENCE_COUNT);
			assert(before == after);
			cl.releaseContext(ctx);
		});
	});
});

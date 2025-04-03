import { strict as assert } from 'node:assert';
import { describe, it, after } from 'node:test';
import cl from '../index.js';
import * as U from './utils.ts';


describe('Context', () => {
	const { platform, device, context } = cl.quickStart();
	const properties = [cl.CONTEXT_PLATFORM, platform];
	const devices = [device];
	
	describe('#createContext', () => {
		it('throws if bad devices list', () => {
			assert.throws(
				() => cl.createContext(null, []),
				cl.INVALID_VALUE,
			);
		});
		
		it('creates a context with defined platform', () => {
			const ctx = cl.createContext(properties, devices);
			assert.ok(ctx);
			cl.releaseContext(ctx);
		});
		
		it('creates a context if properties are `null`', () => {
			const ctx = cl.createContext(null, devices);
			assert.ok(ctx);
			cl.releaseContext(ctx);
		});
	});
	
	describe('#getContextInfo', () => {
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
			const info = cl.getContextInfo(context, cl.CONTEXT_DEVICES) as cl.TClDevice[];
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
			const ctx = cl.createContext(properties, devices);
			cl.retainContext(ctx);
			const after = cl.getContextInfo(ctx, cl.CONTEXT_REFERENCE_COUNT);
			assert.strictEqual(after, 2);
			cl.releaseContext(ctx);
			cl.releaseContext(ctx);
		});
	});
	
	describe('#releaseContext', () => {
		it('decrements ref count after call', () => {
			const ctx = cl.createContext(properties, devices);
			cl.retainContext(ctx);
			cl.releaseContext(ctx);
			const after = cl.getContextInfo(ctx, cl.CONTEXT_REFERENCE_COUNT);
			assert.strictEqual(after, 1);
			cl.releaseContext(ctx);
		});
	});
});

'use strict';

const assert = require('node:assert').strict;

const cl = require('../../');
require('./device-selection');


const Utils = {
	newContext() {
		return cl.createContext(
			[cl.CONTEXT_PLATFORM, global.MAIN_PLATFORM],
			[global.MAIN_DEVICE],
		);
	},
	newQueue(context) {
		return cl.createCommandQueue(context, global.MAIN_DEVICE, null);;
	},
	withContext: (exec) => {
		const ctx = cl.createContext(
			[cl.CONTEXT_PLATFORM, global.MAIN_PLATFORM],
			[global.MAIN_DEVICE],
		);
		try { exec(ctx, global.MAIN_DEVICE, global.MAIN_PLATFORM); }
		finally { cl.releaseContext(ctx); }
	},
	
	withAsyncContext: (exec) => {
		const ctx = Utils.newContext();
		try {
			exec(ctx, global.MAIN_DEVICE, global.MAIN_PLATFORM, () => {
				cl.releaseContext(ctx);
			});
		} catch (_e) {
			cl.releaseContext(ctx);
		}
	},
	
	withProgram: (ctx, source, exec) => {
		const prg = cl.createProgramWithSource(ctx, source);
		cl.buildProgram(prg, null, '-cl-kernel-arg-info');
		try {
			exec(prg);
		} finally {
			cl.releaseProgram(prg);
		}
	},
	
	withProgramAsync: (ctx, source, exec) => {
		const prg = cl.createProgramWithSource(ctx, source);
		cl.buildProgram(prg, null, '-cl-kernel-arg-info');
	
		try {
			exec(prg, () => cl.releaseProgram(prg));
		} catch (_e) {
			cl.releaseProgram(prg);
		}
	},
	
	withCQ: (ctx, device, exec) => {
		const cq = (
			cl.createCommandQueueWithProperties ||
			cl.createCommandQueue
		)(ctx, device, null);
		try { exec(cq); }
		finally { cl.releaseCommandQueue(cq); }
	},
	
	withAsyncCQ: (ctx, device, exec) => {
		const cq = (
			cl.createCommandQueueWithProperties ||
			cl.createCommandQueue
		)(ctx, device, null);
		try {
			exec(cq, () => cl.releaseCommandQueue(cq));
		} catch (_e) { cl.releaseCommandQueue(cq); }
	},
	
	assertType: (v, name) => {
		if (name === 'object') {
			assert.ok(v);
		}
		
		if (name === 'array') {
			assert.ok(v);
			assert.strictEqual(
				typeof v, 'object',
				'assertType(v, \'array\'): "v" must be an object',
			);
			assert.strictEqual(
				typeof v.length, 'number',
				'assertType(v, \'array\'): "v.length" must be a number',
			);
			return;
		}
		
		assert.strictEqual(
			typeof v, name,
			`assertType(v, '${name}'): the type is "${typeof v}"`,
		);
	},
};

module.exports = Utils;

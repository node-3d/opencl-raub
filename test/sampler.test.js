'use strict';

const assert = require('node:assert').strict;
const { describe, it, after } = require('node:test');

const cl = require('../');
const U = require('./utils');


describe('Sampler', () => {
	const context = U.newContext();
	const sampler = cl.createSampler(context, cl.TRUE, cl.ADDRESS_NONE, cl.FILTER_LINEAR);
	
	after(() => {
		cl.releaseSampler(sampler);
		cl.releaseContext(context);
	});
	
	describe('#createSampler', () => {
		it('throws cl.INVALID_CONTEXT when passed an invalid context', () => {
			assert.throws(
				() => cl.createSampler(null, cl.TRUE, cl.ADDRESS_NONE, cl.FILTER_LINEAR),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
	});
	
	describe('#retainSampler', () => {
		it('increases the reference count', () => {
			cl.retainSampler(sampler);
			const count = cl.getSamplerInfo(sampler, cl.SAMPLER_REFERENCE_COUNT);
			assert.strictEqual(count, 2);
			cl.releaseSampler(sampler);
			const after = cl.getSamplerInfo(sampler, cl.SAMPLER_REFERENCE_COUNT);
			assert.strictEqual(after, 1);
		});
	});
	
	describe('#releaseSampler', () => {
		it('decreases reference count', () => {
			cl.retainSampler(sampler);
			cl.releaseSampler(sampler);
			const after = cl.getSamplerInfo(sampler, cl.SAMPLER_REFERENCE_COUNT);
			assert.strictEqual(after, 1);
		});
	});
	
	describe('#getSamplerInfo', () => {
		it('returns CL_SAMPLER_REFERENCE_COUNT', () => {
			const ret = cl.getSamplerInfo(sampler, cl.SAMPLER_REFERENCE_COUNT);
			assert.strictEqual(1, ret);
		});
		
		it('returns CL_SAMPLER_NORMALIZED_COORDS', () => {
			const ret = cl.getSamplerInfo(sampler, cl.SAMPLER_NORMALIZED_COORDS);
			assert.strictEqual(ret, true);
		});
		
		it('returns CL_SAMPLER_ADDRESSING_MODE', () => {
			const ret = cl.getSamplerInfo(sampler, cl.SAMPLER_ADDRESSING_MODE);
			assert.strictEqual(ret, cl.ADDRESS_NONE);
		});
		
		it('returns CL_SAMPLER_FILTER_MODE', () => {
			const ret = cl.getSamplerInfo(sampler, cl.SAMPLER_FILTER_MODE);
			assert.strictEqual(ret, cl.FILTER_LINEAR);
		});
	});
});

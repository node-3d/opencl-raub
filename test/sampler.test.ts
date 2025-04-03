import { strict as assert } from 'node:assert';
import { describe, it, after } from 'node:test';
import cl from '../index.js';


describe('Sampler', () => {
	const { context } = cl.quickStart();
	const sampler = cl.createSampler(context, cl.TRUE, cl.ADDRESS_NONE, cl.FILTER_LINEAR);
	
	after(() => {
		cl.releaseSampler(sampler);
	});
	
	describe('#createSampler', () => {
		it('throws when passed an invalid context', () => {
			assert.throws(
				() => cl.createSampler(
					null as unknown as cl.TClContext, cl.TRUE, cl.ADDRESS_NONE, cl.FILTER_LINEAR,
				),
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

'use strict';

const { assert, expect } = require('chai');

const cl = require('../');
let U = require('./utils');


let makeSampler = function (context) {
	return cl.createSampler(context, cl.TRUE, cl.ADDRESS_NONE, cl.FILTER_LINEAR);
};

describe('Sampler', function () {
	describe('#createSampler', function () {

		let f = cl.createSampler;

		it('should create a sampler when passed valid arguments', function () {
			U.withContext(function (context) {
				let sampler = f(context, cl.TRUE, cl.ADDRESS_NONE, cl.FILTER_LINEAR);
				assert.isObject(sampler);
				assert.isNotNull(sampler);
				cl.releaseSampler(sampler);
			});
		});

		it('should throw cl.INVALID_CONTEXT when passed an invalid context', function () {
			const fBound = U.bind(f, null, cl.TRUE, cl.ADDRESS_NONE, cl.FILTER_LINEAR);
			expect(fBound).to.throw('Argument 0 must be of type `Object`');
		});

	});

	describe('#retainSampler', function () {

		let f = cl.retainSampler;

		it('should increase the reference count when passed a valid argument', function () {

			U.withContext(function (context) {
				let sampler = makeSampler(context);
				let count = cl.getSamplerInfo(sampler, cl.SAMPLER_REFERENCE_COUNT);
				assert.isNumber(count);
				assert.strictEqual(count, 1);
				f(sampler);

				count = cl.getSamplerInfo(sampler, cl.SAMPLER_REFERENCE_COUNT);
				assert.isNumber(count);
				assert.strictEqual(count, 2);

				cl.releaseSampler(sampler);
				cl.releaseSampler(sampler);
			});
		});

	});

	describe('#releaseSampler', function () {

		let f = cl.releaseSampler;

		it('should decrease reference count when passed a valid argument', function () {
			U.withContext(function (context) {
				let sm = makeSampler(context);
				let before = cl.getSamplerInfo(sm, cl.SAMPLER_REFERENCE_COUNT);
				cl.retainSampler(sm);
				f(sm);
				let after = cl.getSamplerInfo(sm, cl.SAMPLER_REFERENCE_COUNT);
				assert(before == after);
			});
		});
	});

	describe('#getSamplerInfo', function () {

		let f = cl.getSamplerInfo;

		it('should return CL_SAMPLER_REFERENCE_COUNT', function () {
			U.withContext(function (context) {
				let sampler = makeSampler(context);
				let ret = f(sampler, cl.SAMPLER_REFERENCE_COUNT);

				assert.isNumber(ret);
				assert.strictEqual(1, ret);

				cl.releaseSampler(sampler);
			});
		});

		it('should return CL_SAMPLER_NORMALIZED_COORDS', function () {
			U.withContext(function (context) {
				let sampler = makeSampler(context);
				let ret = f(sampler, cl.SAMPLER_NORMALIZED_COORDS);

				assert.isBoolean(ret);
				assert.isTrue(ret);

				cl.releaseSampler(sampler);
			});
		});

		it('should return CL_SAMPLER_ADDRESSING_MODE', function () {
			U.withContext(function (context) {
				let sampler = makeSampler(context);
				let ret = f(sampler, cl.SAMPLER_ADDRESSING_MODE);

				assert.isNumber(ret);
				assert.strictEqual(ret, cl.ADDRESS_NONE);

				cl.releaseSampler(sampler);
			});
		});

		it('should return CL_SAMPLER_FILTER_MODE', function () {
			U.withContext(function (context) {
				let sampler = makeSampler(context);
				let ret = f(sampler, cl.SAMPLER_FILTER_MODE);

				assert.isNumber(ret);
				assert.strictEqual(ret, cl.FILTER_LINEAR);

				cl.releaseSampler(sampler);
			});
		});

	});
});

'use strict';

let assert = require('chai').assert;

const cl = require('../');
let U = require('./utils/utils');
let versions = require('./utils/versions');


var makeSampler = function (context) {
	if (U.checkVersion('1.x')) {
		return cl.createSampler(context, cl.TRUE, cl.ADDRESS_NONE, cl.FILTER_LINEAR);
	} else {
		return cl.createSamplerWithProperties(context,
			[cl.SAMPLER_NORMALIZED_COORDS, true,
				cl.SAMPLER_ADDRESSING_MODE, cl.ADDRESS_NONE,
				cl.SAMPLER_FILTER_MODE, cl.FILTER_LINEAR]);
	}
};

describe('Sampler', function () {
	describe('#createSampler', function () {

		var f = cl.createSampler;

		versions(['1.x']).it('should create a sampler when passed valid arguments', function () {
			U.withContext(function (context) {
				var sampler = f(context, cl.TRUE, cl.ADDRESS_NONE, cl.FILTER_LINEAR);
				assert.isObject(sampler);
				assert.isNotNull(sampler);
				cl.releaseSampler(sampler);
			});
		});

		versions(['1.x']).it('should throw cl.INVALID_CONTEXT when passed an invalid context', function () {
			const fBound = U.bind(f, null, cl.TRUE, cl.ADDRESS_NONE, cl.FILTER_LINEAR);
			fBound.should.throw(cl.INVALID_CONTEXT.message);
		});

	});

	describe('#retainSampler', function () {

		var f = cl.retainSampler;

		it('should increase the reference count when passed a valid argument', function () {

			U.withContext(function (context) {
				var sampler = makeSampler(context);
				var count = cl.getSamplerInfo(sampler, cl.SAMPLER_REFERENCE_COUNT);
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

		var f = cl.releaseSampler;

		it('should decrease reference count when passed a valid argument', function () {
			U.withContext(function (context) {
				var sm = makeSampler(context);
				var before = cl.getSamplerInfo(sm, cl.SAMPLER_REFERENCE_COUNT);
				cl.retainSampler(sm);
				f(sm);
				var after = cl.getSamplerInfo(sm, cl.SAMPLER_REFERENCE_COUNT);
				assert(before == after);
			});
		});
	});

	describe('#getSamplerInfo', function () {

		var f = cl.getSamplerInfo;

		it('should return CL_SAMPLER_REFERENCE_COUNT', function () {
			U.withContext(function (context) {
				var sampler = makeSampler(context);
				var ret = f(sampler, cl.SAMPLER_REFERENCE_COUNT);

				assert.isNumber(ret);
				assert.strictEqual(1, ret);

				cl.releaseSampler(sampler);
			});
		});

		it('should return CL_SAMPLER_NORMALIZED_COORDS', function () {
			U.withContext(function (context) {
				var sampler = makeSampler(context);
				var ret = f(sampler, cl.SAMPLER_NORMALIZED_COORDS);

				assert.isBoolean(ret);
				assert.isTrue(ret);

				cl.releaseSampler(sampler);
			});
		});

		it('should return CL_SAMPLER_ADDRESSING_MODE', function () {
			U.withContext(function (context) {
				var sampler = makeSampler(context);
				var ret = f(sampler, cl.SAMPLER_ADDRESSING_MODE);

				assert.isNumber(ret);
				assert.strictEqual(ret, cl.ADDRESS_NONE);

				cl.releaseSampler(sampler);
			});
		});

		it('should return CL_SAMPLER_FILTER_MODE', function () {
			U.withContext(function (context) {
				var sampler = makeSampler(context);
				var ret = f(sampler, cl.SAMPLER_FILTER_MODE);

				assert.isNumber(ret);
				assert.strictEqual(ret, cl.FILTER_LINEAR);

				cl.releaseSampler(sampler);
			});
		});

	});
});

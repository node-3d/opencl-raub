'use strict';

const assert = require('node:assert').strict;
const { describe, it, after } = require('node:test');

const cl = require('../');
const U = require('./utils');

const imageFormat = {
	'channel_order': cl.RGBA,
	'channel_data_type': cl.UNSIGNED_INT8,
};

const imageDesc = {
	type: cl.MEM_OBJECT_IMAGE2D,
	width: 8,
	height: 8,
};

const zeroArray = [0, 0, 0];
const invalidOrigin = [0, 0, 1];
const validRegion = [8, 8, 1];
const invalidRegion = [8, 8, 0];
const grayColor = [0.5, 0.5, 0.5, 0.5];
const color = Buffer.from(grayColor);


describe('CommandQueue - Image', () => {
	const context = U.newContext();
	const cq = U.newQueue(context);
	const buffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY, 8, null);
	const image = cl.createImage(context, 0, imageFormat, imageDesc);
	
	after(() => {
		cl.releaseMemObject(image);
		cl.releaseMemObject(buffer);
		cl.releaseCommandQueue(cq);
		cl.releaseContext(context);
	});
	
	describe('#enqueueReadImage', () => {
		it('works with valid image', () => {
			const ret = cl.enqueueReadImage(
				cq,
				image,
				true,
				zeroArray,
				validRegion,
				0,
				0,
				Buffer.alloc(64 * 4),
			);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('fails with bad parameters', () => {
			assert.throws(
				() => cl.enqueueReadImage(
					cq,
					buffer,
					true,
					zeroArray,
					validRegion,
					0,
					0,
					Buffer.alloc(64 * 4)
				),
			);
		});
		
		it('throws cl.INVALID_OPERATION if image was created with cl.MEM_HOST_WRITE_ONLY', () => {
			const image = cl.createImage(context, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc);
			assert.throws(
				() => cl.enqueueReadImage(
					cq,
					image,
					true,
					zeroArray,
					validRegion,
					12,
					1000,
					Buffer.alloc(64 * 4)
				),
				cl.INVALID_OPERATION,
			);
			cl.releaseMemObject(image);
		});
		
		it('throws cl.INVALID_VALUE if origin has an invalid value', () => {
			assert.throws(
				() => cl.enqueueReadImage(
					cq,
					image,
					true,
					invalidOrigin,
					validRegion,
					0,
					0,
					Buffer.alloc(64 * 4)
				),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_VALUE if region is invalid', () => {
			assert.throws(
				() => cl.enqueueReadImage(
					cq,
					image,
					true,
					zeroArray,
					invalidRegion,
					0,
					0,
					Buffer.alloc(64 * 4)
				),
				cl.INVALID_VALUE,
			);
		});
	});
	
	describe('#enqueueWriteImage', () => {
		it('works with cl.MEM_READ_WRITE images', () => {
			const ret = cl.enqueueWriteImage(
				cq,
				image,
				true,
				zeroArray,
				validRegion,
				0,
				0,
				Buffer.alloc(32)
			);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('works with cl.MEM_HOST_WRITE_ONLY images', () => {
			const image = cl.createImage(
				context,
				cl.MEM_HOST_WRITE_ONLY,
				imageFormat,
				imageDesc,
				null
			);
			const ret = cl.enqueueWriteImage(
				cq,
				image,
				true,
				zeroArray,
				validRegion,
				0,
				0,
				Buffer.alloc(32)
			);
			cl.releaseMemObject(image);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('throws cl.INVALID_OPERATION with cl.MEM_HOST_READ_ONLY images', () => {
			const image = cl.createImage(
				context,
				cl.MEM_HOST_READ_ONLY,
				imageFormat,
				imageDesc,
				null
			);
			
			assert.throws(
				() => cl.enqueueWriteImage(
					cq,
					image,
					true,
					zeroArray,
					validRegion,
					0,
					0,
					Buffer.alloc(32)
				),
				cl.INVALID_OPERATION,
			);
			cl.releaseMemObject(image);
		});
		
		it('throws cl.INVALID_VALUE with an invalid origin', () => {
			assert.throws(
				() => cl.enqueueWriteImage(
					cq,
					image,
					true,
					invalidOrigin,
					validRegion,
					0,
					0,
					Buffer.alloc(32)
				),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_VALUE with an invalid region', () => {
			assert.throws(
				() => cl.enqueueWriteImage(
					cq,
					image,
					true,
					zeroArray,
					invalidRegion,
					0,
					0,
					Buffer.alloc(32)
				),
				cl.INVALID_VALUE,
			);
		});
	});
	
	describe('#enqueueFillImage', () => {
		it('fills image with color', () => {
			const ret = cl.enqueueFillImage(cq, image, color, zeroArray, validRegion);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('throws cl.INVALID_VALUE if color is null', () => {
			const color = null;
			assert.throws(
				() => cl.enqueueFillImage(cq, image, color, zeroArray, validRegion),
				new Error('Argument 2 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_VALUE if origin is invalid', () => {
			assert.throws(
				() => cl.enqueueFillImage(cq, image, color, invalidOrigin, validRegion),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_VALUE if region is invalid', () => {
			assert.throws(
				() => cl.enqueueFillImage(cq, image, color, zeroArray, invalidRegion),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_MEM_OBJECT if image is not a valid image object', () => {
			assert.throws(
				() => cl.enqueueFillImage(cq, buffer, color, zeroArray, validRegion),
			);
		});
	});
});

'use strict';

const { assert, expect } = require('chai');

const cl = require('../');
let U = require('./utils');


let imageFormat = {
	'channel_order': cl.RGBA,
	'channel_data_type': cl.UNSIGNED_INT8,
};

let imageDesc = {
	'type': cl.MEM_OBJECT_IMAGE2D,
	'width': 8,
	'height': 8,
	'depth': 2,
	'image_array_size': 1,
	'image_row_pitch': 8,
	'image_slice_pitch': 64
};

let zeroArray = [0, 0, 0];
let validRegion = [8, 8, 1];


describe('CommandQueue - Image Copy', function () {

	describe('#enqueueCopyImage', function () {

		it('should work with cl.MEM_READ_WRITE images', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image1 = cl.createImage(
						ctx,
						cl.MEM_READ_WRITE,
						imageFormat,
						imageDesc,
						null
					);
					let image2 = cl.createImage(
						ctx,
						cl.MEM_READ_WRITE,
						imageFormat,
						imageDesc,
						null
					);
					// command queue, cl_image_src, cl_image_dst, origin_src, origin_dst, region
					let ret = cl.enqueueCopyImage(
						cq,
						image1,
						image2,
						zeroArray,
						zeroArray,
						validRegion
					);

					cl.releaseMemObject(image1);
					cl.releaseMemObject(image2);
					assert(ret == cl.SUCCESS);
				});
			});
		});

		it('should work with write images', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image1 = cl.createImage(
						ctx,
						cl.MEM_HOST_WRITE_ONLY,
						imageFormat,
						imageDesc,
						null
					);
					let image2 = cl.createImage(
						ctx,
						cl.MEM_HOST_WRITE_ONLY,
						imageFormat,
						imageDesc,
						null
					);
					// command queue, cl_image_src, cl_image_dst, origin_src, origin_dst, region
					let ret = cl.enqueueCopyImage(
						cq,
						image1,
						image2,
						zeroArray,
						zeroArray,
						validRegion
					);

					cl.releaseMemObject(image1);
					cl.releaseMemObject(image2);
					assert(ret == cl.SUCCESS);
				});
			});
		});

		it('should work with read images', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image1 = cl.createImage(
						ctx,
						cl.MEM_HOST_READ_ONLY,
						imageFormat,
						imageDesc,
						null
					);
					let image2 = cl.createImage(
						ctx,
						cl.MEM_HOST_READ_ONLY,
						imageFormat,
						imageDesc,
						null
					);
					// command queue, cl_image_src, cl_image_dst, origin_src, origin_dst, region
					let ret = cl.enqueueCopyImage(
						cq,
						image1,
						image2,
						zeroArray,
						zeroArray,
						validRegion
					);

					cl.releaseMemObject(image1);
					cl.releaseMemObject(image2);
					assert(ret == cl.SUCCESS);
				});
			});
		});
	});


	describe('#enqueueCopyImageToBuffer', function () {

		it('should work with read only buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(
						ctx,
						cl.MEM_COPY_HOST_PTR,
						imageFormat,
						imageDesc,
						new Buffer(64)
					);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_READ_ONLY, 64, null);

					let ret = cl.enqueueCopyImageToBuffer(
						cq,
						image,
						buffer,
						zeroArray,
						[1, 1, 1],
						0
					);

					cl.releaseMemObject(image);
					cl.releaseMemObject(buffer);
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should work with write buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(
						ctx,
						cl.MEM_COPY_HOST_PTR,
						imageFormat,
						imageDesc,
						new Buffer(64)
					);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_WRITE_ONLY, 64, null);

					let ret = cl.enqueueCopyImageToBuffer(
						cq,
						image,
						buffer,
						zeroArray,
						[1, 1, 1],
						0
					);

					cl.releaseMemObject(image);
					cl.releaseMemObject(buffer);
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should work with different values of source and destination offsets', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(
						ctx,
						cl.MEM_COPY_HOST_PTR,
						imageFormat,
						imageDesc,
						new Buffer(64)
					);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_READ_ONLY, 64, null);

					let ret = cl.enqueueCopyImageToBuffer(
						cq,
						image,
						buffer,
						[1, 1, 0],
						[1, 1, 1],
						2
					);

					cl.releaseMemObject(image);
					cl.releaseMemObject(buffer);
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should throw cl.INVALID_VALUE if origin is invalid', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(
						ctx,
						cl.MEM_COPY_HOST_PTR,
						imageFormat,
						imageDesc,
						new Buffer(64)
					);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_READ_ONLY, 64, null);

					// origin[2] must be 0
					let invalidOrigin = [1, 1, 1];
					expect(
						() => cl.enqueueCopyImageToBuffer(
							cq,
							image,
							buffer,
							invalidOrigin,
							[1, 1, 1],
							2
						)
					).to.throw(cl.INVALID_VALUE.message);

					cl.releaseMemObject(image);
					cl.releaseMemObject(buffer);
				});
			});
		});

		it('should throw cl.INVALID_VALUE if region is invalid', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(
						ctx,
						cl.MEM_COPY_HOST_PTR,
						imageFormat,
						imageDesc,
						new Buffer(64)
					);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_READ_ONLY, 64, null);

					// region[2] must be 1
					let invalidRegion = [1, 1, 2];
					expect(
						() => cl.enqueueCopyImageToBuffer(
							cq,
							image,
							buffer,
							[1, 1, 0],
							invalidRegion,
							2
						)
					).to.throw(cl.INVALID_VALUE.message);

					cl.releaseMemObject(image);
					cl.releaseMemObject(buffer);
				});
			});
		});
	});

	describe('#enqueueCopyBufferToImage', function () {

		it('should work with read only buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(
						ctx,
						cl.MEM_HOST_READ_ONLY,
						imageFormat,
						imageDesc,
						null
					);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_READ_ONLY, 8, null);

					let ret = cl.enqueueCopyBufferToImage(
						cq,
						buffer,
						image,
						0,
						zeroArray,
						[1, 1, 1]
					);

					cl.releaseMemObject(image);
					cl.releaseMemObject(buffer);
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should work with write buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(
						ctx,
						cl.MEM_HOST_WRITE_ONLY,
						imageFormat,
						imageDesc,
						null
					);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_WRITE_ONLY, 8, null);

					let ret = cl.enqueueCopyBufferToImage(
						cq,
						buffer,
						image,
						0,
						zeroArray,
						[1, 1, 1]
					);

					cl.releaseMemObject(image);
					cl.releaseMemObject(buffer);
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should throw cl.INVALID_VALUE if origin is invalid', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(ctx, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc, null);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_WRITE_ONLY, 8, null);

					// origin[2] must be 0
					let invalidOrigin = [1, 1, 1];
					expect(
						() => cl.enqueueCopyBufferToImage(
							cq,
							buffer,
							image,
							0,
							invalidOrigin,
							[1, 1, 1]
						)
					).to.throw(cl.INVALID_VALUE.message);

					cl.releaseMemObject(image);
					cl.releaseMemObject(buffer);
				});
			});
		});

		it('should throw cl.INVALID_VALUE if region is invalid', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(ctx, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc, null);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_WRITE_ONLY, 8, null);

					// region[2] must be 1
					let invalidRegion = [1, 1, 2];
					expect(
						() => cl.enqueueCopyBufferToImage(
							cq,
							buffer,
							image,
							0,
							[1, 1, 0],
							invalidRegion
						)
					).to.throw(cl.INVALID_VALUE.message);

					cl.releaseMemObject(image);
					cl.releaseMemObject(buffer);
				});
			});
		});
	});

	describe('# enqueueMapImage', function () {

		it('should return a valid buffer', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc, null);
					let ret = cl.enqueueMapImage(cq, image, true, cl.MAP_READ, zeroArray, [2, 2, 1]);
					let u8s = new Uint8Array(ret);
					assert.instanceOf(u8s.buffer, ArrayBuffer);
					assert.isNumber(u8s[0]);
					cl.releaseMemObject(image);
				});
			});
		});

		it('should return a valid buffer', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc, null);
					let ret = cl.enqueueMapImage(cq, image, true, cl.MAP_WRITE, zeroArray, [2, 2, 1]);
					let u8s = new Uint8Array(ret);
					assert.instanceOf(u8s.buffer, ArrayBuffer);
					assert.isNumber(u8s[0]);
					cl.releaseMemObject(image);
				});
			});
		});

		it('should return a valid buffer', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc, null);
					let ret = cl.enqueueMapImage(
						cq,
						image,
						true,
						cl.MAP_WRITE_INVALIDATE_REGION,
						zeroArray,
						[2, 2, 1]
					);
					let u8s = new Uint8Array(ret);
					assert.instanceOf(u8s.buffer, ArrayBuffer);
					assert.isNumber(u8s[0]);
					cl.releaseMemObject(image);
				});
			});
		});


		it('should not be able to read from a not already allocated pointer', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc, null);
					let ret = cl.enqueueMapImage(
						cq,
						image,
						false,
						cl.MAP_READ,
						zeroArray,
						[2, 2, 1],
						[],
						true
					);
					let u8s = new Uint8Array(ret);
					assert.instanceOf(u8s.buffer, ArrayBuffer);
					assert.isNumber(u8s[0]);
					cl.releaseMemObject(image);
				});
			});
		});

		it('should not be able to read from a not already allocated pointer', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc, null);
					let ret = cl.enqueueMapImage(
						cq,
						image,
						false,
						cl.MAP_WRITE,
						zeroArray,
						[2, 2, 1],
						[],
						true
					);
					let u8s = new Uint8Array(ret);
					assert.instanceOf(u8s.buffer, ArrayBuffer);
					assert.isNumber(u8s[0]);
					cl.releaseMemObject(image);
				});
			});
		});

		it('should not throw as we are using the pointer from an event', function (done) {
			U.withAsyncContext(function (ctx, device, _, ctxDone) {
				U.withAsyncCQ(ctx, device, function (cq, cqDone) {
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc, null);
					let ret = cl.enqueueMapImage(
						cq,
						image,
						false,
						cl.MAP_READ,
						zeroArray,
						[2, 2, 1],
						[],
						true
					);

					cl.setEventCallback(ret.event, cl.COMPLETE, function () {
						let u8s = new Uint8Array(ret);
						assert.instanceOf(u8s.buffer, ArrayBuffer);
						assert.isNumber(u8s[0]);
						cl.releaseMemObject(image);
						cl.releaseEvent(ret.event);
						cqDone();
						ctxDone();
						done();
					});
				});
			});
		});

		it('should not throw as we are using the pointer from an event', function (done) {
			U.withAsyncContext(function (ctx, device, _, ctxDone) {
				U.withAsyncCQ(ctx, device, function (cq, cqDone) {
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc, null);
					let ret = cl.enqueueMapImage(
						cq,
						image,
						false,
						cl.MAP_WRITE,
						zeroArray,
						[2, 2, 1],
						[],
						true
					);
					
					cl.setEventCallback(ret.event, cl.COMPLETE, function () {
						let u8s = new Uint8Array(ret);
						assert.instanceOf(u8s.buffer, ArrayBuffer);
						assert.isNumber(u8s[0]);
						cl.releaseMemObject(image);
						cl.releaseEvent(ret.event);
						ctxDone();
						cqDone();
						done();
					});
				});
			});

		});

	});

	describe('#enqueueMigrateMemObjects', function () {

		it('should migrate mem objects with flag cl.MIGRATE_MEM_OBJECT_HOST', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(
						ctx,
						cl.MEM_COPY_HOST_PTR,
						imageFormat,
						imageDesc,
						new Buffer(64)
					);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_READ_ONLY, 64, null);

					// cq, mem objects, flags
					let ret = cl.enqueueMigrateMemObjects(
						cq,
						[image, buffer],
						cl.MIGRATE_MEM_OBJECT_HOST
					);

					assert.strictEqual(ret, cl.SUCCESS);
					cl.releaseMemObject(image);
					cl.releaseMemObject(buffer);
				});
			});
		});

		it('should migrate mem objects with flag cl.MIGRATE_MEM_OBJECT_CONTENT_UNDEFINED', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(
						ctx,
						cl.MEM_COPY_HOST_PTR,
						imageFormat,
						imageDesc,
						new Buffer(64)
					);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_READ_ONLY, 64, null);

					// cq, mem objects, flags
					let ret = cl.enqueueMigrateMemObjects(
						cq,
						[image, buffer],
						cl.MIGRATE_MEM_OBJECT_CONTENT_UNDEFINED
					);

					assert.strictEqual(ret, cl.SUCCESS);
					cl.releaseMemObject(image);
					cl.releaseMemObject(buffer);
				});
			});
		});

		it('should throw cl.INVALID_VALUE if memObjects is null', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					// cq, mem objects, flags
					expect(
						() => cl.enqueueMigrateMemObjects(
							cq,
							null,
							cl.MIGRATE_MEM_OBJECT_CONTENT_UNDEFINED
						)
					).to.throw('Argument 1 must be of type `Array`');
				});
			});
		});

		it('should throw cl.INVALID_MEM_OBJECT if any memory object is null', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(
						ctx,
						cl.MEM_COPY_HOST_PTR,
						imageFormat,
						imageDesc,
						new Buffer(64)
					);
					let buffer = null;

					expect(
						() => cl.enqueueMigrateMemObjects(
							cq,
							[image, buffer],
							cl.MIGRATE_MEM_OBJECT_CONTENT_UNDEFINED
						)
					).to.throw(cl.INVALID_MEM_OBJECT.message);
					cl.releaseMemObject(image);
				});
			});
		});
	});

});

'use strict';

let fs = require('fs');
const { assert, expect } = require('chai');

const cl = require('../');
let U = require('./utils');
let skip = require('./utils/diagnostic');


let isValidCQ = function (cq) {
	assert.isNotNull(cq);
	assert.isDefined(cq);
};

let makeCommandQueue = function (ctx, device) {
	return cl.createCommandQueue(ctx, device, null);
};


describe('CommandQueue', function () {


	describe('#createCommandQueue', function () {

		let f = cl.createCommandQueue;

		it('should create a valid command queue', function () {

			U.withContext(function (ctx, device) {
				let cq = cl.createCommandQueue(ctx, device, null);
				isValidCQ(cq);
				cl.releaseCommandQueue(cq);
			});
		});

		it('should fail given an invalid property', function () {
			U.withContext(function (ctx, device) {
				// could be INVALID_VALUE or CL_INVALID_QUEUE_PROPERTIES etc...
				expect(
					() => f(ctx, device, -1)
				).to.throw();
			});
		});

		it('should fail given an invalid device', function () {
			U.withContext(function (ctx) {
				expect(
					() => f(ctx, 'test', [])
				).to.throw('Argument 1 must be of type `Object`');
			});
		});

	});


	describe('#retainCommandQueue', function () {

		it('should have incremented ref count after call', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let before = cl.getCommandQueueInfo(cq, cl.QUEUE_REFERENCE_COUNT);
					cl.retainCommandQueue(cq);
					let after = cl.getCommandQueueInfo(cq, cl.QUEUE_REFERENCE_COUNT);
					assert(before + 1 == after);
					cl.releaseCommandQueue(cq);
				});
			});
		});
	});

	describe('#releaseCommandQueue', function () {

		it('should have decremented ref count after call', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let before = cl.getCommandQueueInfo(cq, cl.QUEUE_REFERENCE_COUNT);
					cl.retainCommandQueue(cq);
					cl.releaseCommandQueue(cq);
					let after = cl.getCommandQueueInfo(cq, cl.QUEUE_REFERENCE_COUNT);
					assert(before == after);
				});
			});
		});

	});

	describe('#getCommandQueueInfo', function () {
		let testForType = function (clKey, _assert) {
			it('should return the good type for ' + clKey, function () {
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function (cq) {
						let val = cl.getCommandQueueInfo(cq, cl[clKey]);
						_assert(val);
					});
				});
			});
		};

		testForType('QUEUE_REFERENCE_COUNT', assert.isNumber.bind(assert));
		testForType('QUEUE_CONTEXT', assert.isObject.bind(assert));
		testForType('QUEUE_DEVICE', assert.isObject.bind(assert));
		testForType('QUEUE_PROPERTIES', assert.isNumber.bind(assert));
	});

	describe('#flush', function () {

		it('should return success', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					assert(cl.flush(cq) == cl.SUCCESS);
				});
			});
		});

	});


	describe('#finish', function () {

		it('should return success', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					assert(cl.finish(cq) == cl.SUCCESS);
				});
			});
		});

	});


	describe('#enqueueReadBuffer', function () {

		it('should work with valid buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 8, null);
					let nbuffer = new Buffer(8);
					let ret = cl.enqueueReadBuffer(cq, buffer, true, 0, 8, nbuffer);
					cl.releaseMemObject(buffer);
					assert(ret == cl.SUCCESS);
				});
			});
		});

		it('should fail if buffer is null', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let nbuffer = new Buffer(8);
					expect(
						() => cl.enqueueReadBuffer( cq, null, true, 0, 8, nbuffer)
					).to.throw('Argument 1 must be of type `Object`');
				});
			});
		});


		it('should fail if output buffer is null', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_WRITE_ONLY, 8, null);
					expect(
						() => cl.enqueueReadBuffer( cq, buffer, true, 0, 8, null)
					).to.throw('Argument 5 must be of type `Object`');
					cl.releaseMemObject(buffer);
				});
			});
		});


		it('should fail if we try to read out of bound', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 8, null);
					let nbuffer = new Buffer(8);

					expect(
						() => cl.enqueueReadBuffer(cq, buffer, true, 16, 1, nbuffer)
					).to.throw(cl.INVALID_VALUE.message);
					cl.releaseMemObject(buffer);
				});
			});
		});

		it('should return an event', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 8, null);
					let nbuffer = new Buffer(8);
					let ret = cl.enqueueReadBuffer(cq, buffer, true, 0, 8, nbuffer, null, true);
					assert.isObject(ret);
					cl.releaseEvent(ret);
					cl.releaseMemObject(buffer);
				});
			});
		});

		it('should fire the event', function (done) {
			U.withAsyncContext(function (ctx, device, platform, ctxDone) {
				let cq = makeCommandQueue(ctx, device);

				let buffer = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 8, null);
				let nbuffer = new Buffer(8);
				let ret = cl.enqueueReadBuffer(cq, buffer, true, 0, 8, nbuffer, null, true);

				cl.setEventCallback(ret, cl.COMPLETE, function () {
					cl.releaseEvent(ret);
					cl.releaseMemObject(buffer);
					ctxDone();
					done();
				}, {});

			});
		});

	});


	describe('#enqueueReadBufferRect', function () {

		it('should work with valid buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 200, null);
					let nbuffer = new Buffer(200);
					let ret = cl.enqueueReadBufferRect(cq, buffer, true,
						[0, 0, 0], [0, 0, 0], [1, 1, 1],
						2 * 4, 0, 8 * 4, 0, nbuffer);

					cl.releaseMemObject(buffer);
  
					assert(ret == cl.SUCCESS);
				});
			});
		});

		it('should fail if buffer is null', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let nbuffer = new Buffer(8);
					expect(
						() => cl.enqueueReadBuffer(
							cq,
							null,
							true,
							[0, 0, 0],
							[0, 0, 0],
							[4, 4, 1],
							2 * 4,
							0,
							8 * 4,
							0,
							nbuffer
						)
					).to.throw('Argument 1 must be of type `Object`');
				});
			});
		});


		it('should fail if output buffer is null', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_WRITE_ONLY, 8, null);
					expect(
						() => cl.enqueueReadBufferRect(
							cq,
							buffer,
							true,
							[0, 0, 0],
							[0, 0, 0],
							[4, 4, 1],
							2 * 4,
							0,
							8 * 4,
							0,
							null
						)
					).to.throw('Argument 10 must be of type `Object`');

					cl.releaseMemObject(buffer);
				});
			});
		});

	});


	describe('#enqueueWriteBuffer', function () {

		it('should work with valid buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 8, null);
					let nbuffer = new Buffer(8);
					let ret = cl.enqueueWriteBuffer(cq, buffer, true, 0, 8, nbuffer);

					cl.releaseMemObject(buffer);

					assert(ret == cl.SUCCESS);
				});
			});
		});

		it('should fail if buffer is null', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let nbuffer = new Buffer(8);
					expect(
						() => cl.enqueueWriteBuffer(cq, null, true, 0, 8, nbuffer)
					).to.throw('Argument 1 must be of type `Object`');
				});
			});
		});


		it('should fail if output buffer is null', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_WRITE_ONLY, 8, null);
					expect(
						() => cl.enqueueWriteBuffer(cq, buffer, true, 0, 8, null)
					).to.throw('Argument 5 must be of type `Object`');

					cl.releaseMemObject(buffer);
				});
			});
		});

	});


	describe('#enqueueWriteBufferRect', function () {

		it('should work with valid buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 200, null);
					let nbuffer = new Buffer(200);
					let ret = cl.enqueueWriteBufferRect(cq, buffer, true,
						[0, 0, 0], [0, 0, 0], [1, 1, 1],
						2 * 4, 0, 8 * 4, 0, nbuffer);

					cl.releaseMemObject(buffer);

					assert(ret == cl.SUCCESS);
				});
			});
		});

		it('should fail if buffer is null', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let nbuffer = new Buffer(8);
					expect(
						() => cl.enqueueWriteBufferRect(
							cq,
							null,
							true,
							[0, 0, 0],
							[0, 0, 0],
							[4, 4, 1],
							2 * 4,
							0,
							8 * 4,
							0,
							nbuffer
						)
					).to.throw('Argument 1 must be of type `Object`');
				});
			});
		});


		it('should fail if output buffer is null', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_WRITE_ONLY, 8, null);
					expect(
						() => cl.enqueueWriteBufferRect(
							cq,
							buffer,
							true,
							[0, 0, 0],
							[0, 0, 0],
							[4, 4, 1],
							2 * 4,
							0,
							8 * 4,
							0,
							null
						)
					).to.throw('Argument 10 must be of type `Object`');

					cl.releaseMemObject(buffer);
				});
			});
		});

	});

	describe('#enqueueFillBuffer', function () {
		it('should fill a buffer with a scallar integer pattern', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let array = new Buffer([0, 0, 0, 0, 0, 0, 0, 0]);

					let buffer = cl.createBuffer(ctx, cl.MEM_USE_HOST_PTR, 32, array);
					let ret = cl.enqueueFillBuffer(cq, buffer, 2, 0, 16);

					cl.releaseMemObject(buffer);
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should fill a buffer with a scallar float pattern', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let array = new Buffer([0,0,0,0,0,0,0,0]);

					let buffer = cl.createBuffer(ctx, cl.MEM_USE_HOST_PTR, 32, array);
					let ret = cl.enqueueFillBuffer(cq, buffer, 2.5, 0, 16);
					cl.releaseMemObject(buffer);
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should fill a buffer with a vector pattern', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let array = new Buffer([0,0,0,0,0,0,0,0]);

					// INTEGER VECTOR
					let pattern = new Buffer([1,2]);

					let buffer = cl.createBuffer(ctx, cl.MEM_USE_HOST_PTR, 32, array);
					let ret = cl.enqueueFillBuffer(cq, buffer, pattern, 0, 16);
					cl.releaseMemObject(buffer);
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should fill a buffer with a vector pattern', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let array = new Buffer([0,0,0,0,0,0,0,0]);

					// FLOAT VECTOR
					let pattern = new Buffer([1.5,2.5]);

					let buffer = cl.createBuffer(ctx, cl.MEM_USE_HOST_PTR, 32, array);
					let ret = cl.enqueueFillBuffer(cq, buffer, pattern, 0, 16);
					cl.releaseMemObject(buffer);
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});
	});

	describe('#enqueueCopyBuffer', function () {
		it('should work with read only buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 32, new Buffer(32));
					let dst = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 8, null);
					let ret = cl.enqueueCopyBuffer(cq, buffer, dst, 0, 0, 8);

					cl.releaseMemObject(buffer);

					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should work with write buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 32, new Buffer(32));
					let dst = cl.createBuffer(ctx, cl.MEM_WRITE_ONLY, 8, null);
					let ret = cl.enqueueCopyBuffer(cq, buffer, dst, 0, 0, 8);

					cl.releaseMemObject(buffer);

					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

	});


	describe('#enqueueCopyBufferRect', function () {
		it('should work with read only buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 32, new Buffer(32));
					let dst = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 32, null);
					let ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [0, 0, 0], [4, 4, 1],
						0, 0,
						0, 0);

					cl.releaseMemObject(buffer);
  
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should work with write only buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 32, new Buffer(32));
					let dst = cl.createBuffer(ctx, cl.MEM_WRITE_ONLY, 32, null);
					let ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [0, 0, 0], [4, 4, 1],
						0, 0,
						0, 0);


					cl.releaseMemObject(buffer);
  
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		skip().vendor('nVidia').it('should throw cl.MEM_COPY_OVERLAP on overlapping copies', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 64, new Buffer(64));
					expect(
						() => cl.enqueueCopyBufferRect(
							cq,
							buffer,
							buffer,
							[1, 1, 0],
							[2, 2, 0],
							[4, 4, 1],
							0,
							0,
							0,
							0
						)
					).to.throw(cl.MEM_COPY_OVERLAP.message);

					cl.releaseMemObject(buffer);
				});
			});
		});

		it('should work with different buffer origin values', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 64, new Buffer(64));
					let dst = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 64, null);
					let ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[1, 1, 1], [2, 2, 2], [4, 4, 1],
						0, 0,
						0, 0);

					assert.strictEqual(ret, cl.SUCCESS);

					ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[1, 2, 0], [2, 2, 2], [4, 4, 1],
						0, 0,
						0, 0);

					cl.releaseMemObject(buffer);
  
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should work with different host origin values', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 64, new Buffer(64));
					let dst = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 64, null);
					let ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [1, 1, 0], [4, 4, 1],
						0, 0,
						0, 0);

					assert.strictEqual(ret, cl.SUCCESS);

					ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [2, 2, 0], [4, 4, 1],
						0, 0,
						0, 0);

					assert.strictEqual(ret, cl.SUCCESS);

					ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [1, 2, 1], [4, 4, 1],
						0, 0,
						0, 0);

					cl.releaseMemObject(buffer);
  
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should work with different region values', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 64, new Buffer(64));
					let dst = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 64, null);
					let ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [0, 0, 0], [1, 1, 1],
						0, 0,
						0, 0);

					assert.strictEqual(ret, cl.SUCCESS);

					ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [0, 0, 0], [1, 4, 1],
						0, 0,
						0, 0);

					assert.strictEqual(ret, cl.SUCCESS);

					ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [0, 0, 0], [5, 1, 1],
						0, 0,
						0, 0);

					cl.releaseMemObject(buffer);
  
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});

		});

		it('should work with different row pitch values', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 64, new Buffer(64));
					let dst = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 64, null);
					let ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [0, 0, 0], [1, 1, 1],
						1, 0,
						0, 0);

					assert.strictEqual(ret, cl.SUCCESS);

					ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [0, 0, 0], [2, 4, 1],
						2, 0,
						0, 0);

					cl.releaseMemObject(buffer);
  
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should work with different splice pitch values', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 64, new Buffer(64));
					let dst = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 64, null);
					let ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [0, 0, 0], [1, 1, 1],
						1, 2,
						0, 0);

					assert.strictEqual(ret, cl.SUCCESS);

					ret = cl.enqueueCopyBufferRect(cq, buffer, dst,
						[0, 0, 0], [0, 0, 0], [2, 4, 1],
						2, 2 * 4,
						0, 0);

					cl.releaseMemObject(buffer);
  
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should work with different host pointer values', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buffer1 = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, 64, new Buffer(64));
					let dst = cl.createBuffer(ctx, cl.MEM_READ_ONLY, 64, null);
					let ret = cl.enqueueCopyBufferRect(cq, buffer1, dst,
						[0, 0, 0], [0, 0, 0], [2, 4, 1],
						0, 0,
						0, 0);

					assert.strictEqual(ret, cl.SUCCESS);


					let buffer2 = cl.createBuffer(ctx, cl.MEM_USE_HOST_PTR, 64, new Buffer(64));
					ret = cl.enqueueCopyBufferRect(cq, buffer2, dst,
						[0, 0, 0], [0, 0, 0], [2, 4, 1],
						0, 0,
						0, 0);

					cl.releaseMemObject(buffer1);
					cl.releaseMemObject(dst);
  
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});
	});

	let createImageWrapper = function (ctx,flags, imageFormat, imageDesc, hostmem) {
		return cl.createImage(ctx, flags, imageFormat, imageDesc, hostmem);
	};

	describe.skip('#enqueueReadImage', function () {

		let imageFormat = {'channel_order': cl.RGBA, 'channel_data_type': cl.UNSIGNED_INT8};
		let imageDesc = {
			'type': cl.MEM_OBJECT_IMAGE2D,
			'width': 8,
			'height': 8,
			'depth': 2,
			'image_array_size': 1,
			'image_row_pitch': 8,
			'image_slice_pitch': 64
		};

		it('should work with valid image', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);
					// command queue, cl_image, blocking, origin, region, row, slice, ptr
					let ret = cl.enqueueReadImage(
						cq,
						image,
						true,
						[0,0,0],
						[8,8,1],
						0,
						0,
						new Buffer(32)
					);
					cl.releaseMemObject(image);
					assert(ret == cl.SUCCESS);
				});
			});
		});

		skip().device('AMD').os('darwin').it('should fail with bad parameters', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					expect(
						() => cl.enqueueReadImage(
							cq,
							null,
							true,
							[0,0,0],
							[8,8,1],
							0,
							0,
							new Buffer(64)
						)
					).to.throw(cl.INVALID_MEM_OBJECT.message);
				});
			});
		});

		skip().device('AMD').os('darwin').it(
			'should throw cl.INVALID_OPERATION if image was created with cl.MEM_HOST_WRITE_ONLY',
			function () {
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function (cq) {
						let image = createImageWrapper(ctx, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc);
						// this will cause an INVALID_VALUE exception
						const readBound = () => cl.enqueueReadImage(
							cq,
							image,
							true,
							[0,0,0],
							[8,8,1],
							12,
							1000,
							new Buffer(64)
						);
						expect(readBound).to.throw(cl.INVALID_OPERATION.message);
						cl.releaseMemObject(image);
					});
				});
			}
		);

		skip().device('AMD').os('darwin').it(
			'should work if image was created with cl.MEM_HOST_READ_ONLY',
			function () {
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function (cq) {
						let image = createImageWrapper(ctx, cl.MEM_HOST_READ_ONLY, imageFormat, imageDesc);
						// this will cause an INVALID_VALUE exception
						let ret = cl.enqueueReadImage(
							cq,
							image,
							true,
							[0,0,0],
							[8,8,1],
							12,
							1000,
							new Buffer(64)
						);
						cl.releaseMemObject(image);

						assert.strictEqual(ret, cl.SUCCESS);
					});
				});
			}
		);

		skip().device('AMD').device('Intel').os('darwin').it(
			'should throw cl.INVALID_VALUE if origin has an invalid value',
			function () {
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function (cq) {
						let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);
						// this will cause an INVALID_VALUE exception
						let invalidOrigin = [1, 1, 1];
						expect(
							() => cl.enqueueReadImage(
								cq,
								image,
								true,
								invalidOrigin,
								[8,8,1],
								0,
								0,
								new Buffer(64)
							)
						).to.throw(cl.INVALID_VALUE.message);
						cl.releaseMemObject(image);
					});
				});
			}
		);

		skip().device('AMD').device('Intel').os('darwin').it(
			'should throw cl.INVALID_VALUE if region is out of bound',
			function () {
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function (cq) {
						let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);
						// this will cause an INVALID_VALUE exception
						let outOfBoundRegion = [9,9,1];
						expect(
							() => cl.enqueueReadImage(
								cq,
								image,
								true,
								[0,0,0],
								outOfBoundRegion,
								0,
								0,
								new Buffer(64)
							)
						).to.throw(cl.INVALID_VALUE.message);
						cl.releaseMemObject(image);
					});
				});
			}
		);

		skip().device('AMD').os('darwin').it(
			'should throw cl.INVALID_VALUE if region is invalid',
			function () {
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function (cq) {
						let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);
						// This will cause an INVALID_VALUE exception
						// (region[2] must be 1 for 2D images)
						let invalidRegion = [8,8,2];
						expect(
							() => cl.enqueueReadImage(
								cq,
								image,
								true,
								[0,0,0],
								invalidRegion,
								0,
								0,
								new Buffer(64)
							)
						).to.throw(cl.INVALID_VALUE.message);
						cl.releaseMemObject(image);
					});
				});
			}
		);

	});

	describe('#enqueueWriteImage', function () {

		let imageFormat = {'channel_order': cl.RGBA, 'channel_data_type': cl.UNSIGNED_INT8};
		let imageDesc = {
			'type': cl.MEM_OBJECT_IMAGE2D,
			'width': 8,
			'height': 8,
			'depth': 2,
			'image_array_size': 1,
			'image_row_pitch': 8,
			'image_slice_pitch': 64
		};

		it('should work with cl.MEM_READ_WRITE images', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);
					// command queue, cl_image, blocking, origin, region, row, slice, ptr
					let ret = cl.enqueueWriteImage(
						cq,
						image,
						true,
						[0,0,0],
						[8,8,1],
						0,
						0,
						new Buffer(32)
					);
					cl.releaseMemObject(image);
					assert(ret == cl.SUCCESS);
				});
			});
		});

		skip().device('AMD').os('darwin').it(
			'should work with cl.MEM_HOST_WRITE_ONLY images',
			function () {
				this.skip();
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function (cq) {
						let image = createImageWrapper(
							ctx,
							cl.MEM_HOST_WRITE_ONLY,
							imageFormat,
							imageDesc,
							null
						);
						let ret = cl.enqueueWriteImage(
							cq,
							image,
							true,
							[0,0,0],
							[8,8,1],
							0,
							0,
							new Buffer(32)
						);
						cl.releaseMemObject(image);
						assert(ret == cl.SUCCESS);
					});
				});
			}
		);

		skip().device('AMD').os('darwin').it(
			'should throw cl.INVALID_OPERATION with cl.MEM_HOST_READ_ONLY images',
			function () {
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function (cq) {
						let image = createImageWrapper(
							ctx,
							cl.MEM_HOST_READ_ONLY,
							imageFormat,
							imageDesc,
							null
						);

						expect(
							() => cl.enqueueWriteImage(
								cq,
								image,
								true,
								[0,0,0],
								[8,8,1],
								0,
								0,
								new Buffer(32)
							)
						).to.throw(cl.INVALID_OPERATION.message);
						cl.releaseMemObject(image);
					});
				});
			}
		);

		skip().device('AMD').os('darwin').it(
			'should throw cl.INVALID_VALUE with an invalid origin',
			function () {
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function (cq) {
						let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);

						// This will trigger a cl.INVALID_VALUE exception
						// (origin must be [0,0,0]
						let invalidOrigin = [1,1,1];
						expect(
							() => cl.enqueueWriteImage(
								cq,
								image,
								true,
								invalidOrigin,
								[8,8,1],
								0,
								0,
								new Buffer(32)
							)
						).to.throw(cl.INVALID_VALUE.message);
						cl.releaseMemObject(image);
					});
				});
			}
		);

		skip().device('AMD').os('darwin').it(
			'should throw cl.INVALID_VALUE with an invalid region',
			function () {
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function (cq) {
						let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);

						// This will trigger a cl.INVALID_VALUE exception
						// (region[2] must be 1 for 2D images)
						let invalidRegion = [8,8,2];
						expect(
							() => cl.enqueueWriteImage(
								cq,
								image,
								true,
								[0, 0, 0],
								invalidRegion,
								0,
								0,
								new Buffer(32)
							)
						).to.throw(cl.INVALID_VALUE.message);
						cl.releaseMemObject(image);
					});
				});
			}
		);

		skip().device('AMD').os('darwin').it(
			'should throw cl.INVALID_VALUE if region is out of bound',
			function () {
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function (cq) {
						let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);

						// This will trigger a cl.INVALID_VALUE exception
						// (region[2] must be 1 for 2D images)
						let outOfBoundRegion = [9,9,1];
						expect(
							() => cl.enqueueWriteImage(
								cq,
								image,
								true,
								[0, 0, 0],
								outOfBoundRegion,
								0,
								0,
								new Buffer(32)
							)
						).to.throw(cl.INVALID_VALUE.message);
						cl.releaseMemObject(image);
					});
				});
			}
		);
	});


	describe('#enqueueFillImage', function () {

		let imageFormat = {'channel_order': cl.RGBA, 'channel_data_type': cl.UNSIGNED_INT8};
		let imageDesc = {
			'type': cl.MEM_OBJECT_IMAGE2D,
			'width': 8,
			'height': 8,
			'depth': 2,
			'image_array_size': 1,
			'image_row_pitch': 8,
			'image_slice_pitch': 64
		};

		it('should fill image with color', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);
					let color = new Buffer([0.5,0.5,0.5,0.5]);

					let ret = cl.enqueueFillImage(cq, image, color, [0,0,0], [8,8,1]);

					cl.releaseMemObject(image);
					assert.strictEqual(ret, cl.SUCCESS);
				});
			});
		});

		it('should throw cl.INVALID_VALUE if color is null', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);
					let color = null;

					expect(
						() => cl.enqueueFillImage(cq, image, color, [0,0,0], [8,8,1])
					).to.throw('Argument 2 must be of type `Object`');
					cl.releaseMemObject(image);
				});
			});
		});

		it('should throw cl.INVALID_VALUE if region is out of bounds', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);
					let color = new Buffer([0.5, 0.5, 0.5, 0.5]);
					let outOfBoundsRegion = [9,9,1];

					expect(
						() => cl.enqueueFillImage(cq, image, color, [0,0,0], outOfBoundsRegion)
					).to.throw(cl.INVALID_VALUE.message);
					cl.releaseMemObject(image);
				});
			});
		});

		it('should throw cl.INVALID_VALUE if origin is invalid', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);
					let color = new Buffer([0.5, 0.5, 0.5, 0.5]);

					// origin[2] must be 0
					let invalidOrigin = [0,0,1];

					expect(
						() => cl.enqueueFillImage(cq, image, color, invalidOrigin, [8,8,1])
					).to.throw(cl.INVALID_VALUE.message);
					cl.releaseMemObject(image);
				});
			});
		});

		it('should throw cl.INVALID_VALUE if region is invalid', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = createImageWrapper(ctx, 0, imageFormat, imageDesc);
					let color = new Buffer([0.5, 0.5, 0.5, 0.5]);

					// origin[2] must be 1
					let invalidRegion = [8,8,0];

					expect(
						() => cl.enqueueFillImage(cq, image, color, [0,0,0], invalidRegion)
					).to.throw(cl.INVALID_VALUE.message);
					cl.releaseMemObject(image);
				});
			});
		});

		it('should throw cl.INVALID_MEM_OBJECT if image is not a valid image object', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = null;
					let color = new Buffer([0.5, 0.5, 0.5, 0.5]);

					// origin[2] must be 1
					let invalidRegion = [8,8,0];

					expect(
						() => cl.enqueueFillImage(cq, image, color, [0,0,0], invalidRegion)
					).to.throw('Argument 1 must be of type `Object`');
				});
			});
		});
	});

	describe('#enqueueCopyImage', function () {

		let imageFormat = {'channel_order': cl.RGBA, 'channel_data_type': cl.UNSIGNED_INT8};
		let imageDesc = {
			'type': cl.MEM_OBJECT_IMAGE2D,
			'width': 8,
			'height': 8,
			'depth': 2,
			'image_array_size': 1,
			'image_row_pitch': 8,
			'image_slice_pitch': 64
		};

		it('should work with cl.MEM_READ_WRITE images', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image1 = createImageWrapper(
						ctx,
						cl.MEM_READ_WRITE,
						imageFormat,
						imageDesc,
						null
					);
					let image2 = createImageWrapper(
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
						[0, 0, 0],
						[0, 0, 0],
						[8, 8, 1]
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
					let image1 = createImageWrapper(
						ctx,
						cl.MEM_HOST_WRITE_ONLY,
						imageFormat,
						imageDesc,
						null
					);
					let image2 = createImageWrapper(
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
						[0, 0, 0],
						[0, 0, 0],
						[8, 8, 1]
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
					let image1 = createImageWrapper(
						ctx,
						cl.MEM_HOST_READ_ONLY,
						imageFormat,
						imageDesc,
						null
					);
					let image2 = createImageWrapper(
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
						[0, 0, 0],
						[0, 0, 0],
						[8, 8, 1]
					);

					cl.releaseMemObject(image1);
					cl.releaseMemObject(image2);
					assert(ret == cl.SUCCESS);
				});
			});
		});
	});


	describe('#enqueueCopyImageToBuffer', function () {

		let imageFormat = {'channel_order': cl.RGBA, 'channel_data_type': cl.UNSIGNED_INT8};
		let imageDesc = {
			'type': cl.MEM_OBJECT_IMAGE2D,
			'width': 8,
			'height': 8,
			'depth': 2,
			'image_array_size': 1,
			'image_row_pitch': 8,
			'image_slice_pitch': 64
		};

		it('should work with read only buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = createImageWrapper(
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
						[0, 0, 0],
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
					let image = createImageWrapper(
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
						[0, 0, 0],
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
					let image = createImageWrapper(
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
					let image = createImageWrapper(
						ctx,
						cl.MEM_COPY_HOST_PTR,
						imageFormat,
						imageDesc,
						new Buffer(64)
					);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_READ_ONLY, 64, null);

					// origin[2] must be 0
					let invalidOrigin = [1,1,1];
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
					let image = createImageWrapper(
						ctx,
						cl.MEM_COPY_HOST_PTR,
						imageFormat,
						imageDesc,
						new Buffer(64)
					);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_READ_ONLY, 64, null);

					// region[2] must be 1
					let invalidRegion = [1,1,2];
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

		let imageFormat = {'channel_order': cl.RGBA, 'channel_data_type': cl.UNSIGNED_INT8};
		let imageDesc = {
			'type': cl.MEM_OBJECT_IMAGE2D,
			'width': 8,
			'height': 8,
			'depth': 2,
			'image_array_size': 1,
			'image_row_pitch': 8,
			'image_slice_pitch': 64
		};

		it('should work with read only buffers', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = createImageWrapper(
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
						[0, 0, 0],
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
					let image = createImageWrapper(
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
						[0, 0, 0],
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
					let image = createImageWrapper(ctx, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc, null);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_WRITE_ONLY, 8, null);

					// origin[2] must be 0
					let invalidOrigin = [1,1,1];
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
					let image = createImageWrapper(ctx, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc, null);
					let buffer = cl.createBuffer(ctx, cl.MEM_HOST_WRITE_ONLY, 8, null);

					// region[2] must be 1
					let invalidRegion = [1,1,2];
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

	describe('# enqueueMapBuffer', function () {
		it('should return a valid buffer', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buf = cl.createBuffer(ctx, cl.MEM_READ_WRITE, 8, null);
					let ret = cl.enqueueMapBuffer(cq, buf, true, cl.MAP_READ, 0, 8,[],false);
					let u8s = new Uint8Array(ret);
					assert.instanceOf(u8s.buffer, ArrayBuffer);
					assert.equal(u8s.buffer.byteLength, 8);
					assert.isNumber(u8s[0]);
				});
			});
		});


		it('should not be able to read from a not already allocated pointer', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buf = cl.createBuffer(ctx, 0, 8, null);
					let ret = cl.enqueueMapBuffer(cq, buf, false, cl.MAP_READ, 0, 8, [], true);
					let u8s = new Uint8Array(ret);
					assert.isNumber(u8s[0]);
					assert.equal(u8s.buffer.byteLength, 8);
				});
			});
		});

		it('should not throw as we are using the pointer from an event', function (done) {
			U.withAsyncContext(function (ctx, device, _, ctxDone) {
				U.withAsyncCQ(ctx, device, function (cq, cqDone) {
					let buf = cl.createBuffer(ctx, 0, 8, null);
					let ret = cl.enqueueMapBuffer(cq, buf, false, 0, 0, 8, [], true);

					cl.setEventCallback(ret.event, cl.COMPLETE, function () {
						let u8s = new Uint8Array(ret);
						assert.instanceOf(u8s.buffer, ArrayBuffer);
						assert.equal(u8s.buffer.byteLength, 8);
						assert.isNumber(u8s[0]);
						cl.releaseMemObject(buf);
						cl.releaseEvent(ret.event);
						cqDone();
						ctxDone();
						done();
					});
				});
			});
		});
	});

	describe('# enqueueMapImage', function () {

		let imageFormat = {'channel_order': cl.RGBA, 'channel_data_type': cl.UNSIGNED_INT8};
		let imageDesc = {
			'type': cl.MEM_OBJECT_IMAGE2D,
			'width': 10,
			'height': 10,
			'depth': 1,
			'image_array_size': 1
		};

		it('should return a valid buffer', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc, null);
					let ret = cl.enqueueMapImage(cq, image, true, cl.MAP_READ, [0,0,0], [2,2,1]);
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
					let ret = cl.enqueueMapImage(cq, image, true, cl.MAP_WRITE, [0,0,0], [2,2,1]);
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
						[0,0,0],
						[2,2,1]
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
					let ret = cl.enqueueMapImage(cq, image, false, cl.MAP_READ, [0,0,0], [2,2,1], [], true);
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
					let ret = cl.enqueueMapImage(cq, image, false, cl.MAP_WRITE, [0,0,0], [2,2,1], [], true);
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
					let ret = cl.enqueueMapImage(cq, image, false, cl.MAP_READ, [0,0,0], [2,2,1], [], true);

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
					let ret = cl.enqueueMapImage(cq, image, false, cl.MAP_WRITE, [0,0,0], [2,2,1], [], true);

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

	describe('# enqueueUnmapMemObject', function () {
		it('should throw as we are unmapping a non mapped memobject', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buf = cl.createBuffer(ctx, 0, 8, null);
					expect(
						() => cl.enqueueUnmapMemObject(cq, buf, new Buffer(8))
					).to.throw(/*...*/);
					cl.releaseMemObject(buf);
				});
			});
		});

		it('should return success', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buf = cl.createBuffer(ctx, 0, 8, null);
					let ret = cl.enqueueMapBuffer(cq, buf, true, cl.MAP_READ, 0, 8,[],false);
					let u8s = new Uint8Array(ret);
					assert.instanceOf(u8s.buffer, ArrayBuffer);
					let res = cl.enqueueUnmapMemObject(cq, buf, u8s.buffer);
					assert.equal(res, cl.SUCCESS);
					cl.releaseMemObject(buf);
				});
			});
		});
	});

	describe('#enqueueMigrateMemObjects', function () {
		let imageFormat = {'channel_order': cl.RGBA, 'channel_data_type': cl.UNSIGNED_INT8};
		let imageDesc = {
			'type': cl.MEM_OBJECT_IMAGE2D,
			'width': 8,
			'height': 8,
			'depth': 2,
			'image_array_size': 1,
			'image_row_pitch': 8,
			'image_slice_pitch': 64
		};

		it('should migrate mem objects with flag cl.MIGRATE_MEM_OBJECT_HOST', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let image = createImageWrapper(
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
					let image = createImageWrapper(
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
					let image = createImageWrapper(
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

	describe('#enqueueNDRangeKernel', function () {

		let inputs = new Buffer(10000 * 4);
		let outputs = new Buffer(10000 * 4);

		for (let i = 0; i < 10000; ++i) {
			inputs.writeUInt32LE(i, i * 4);
		}

		it('should throw with a valid call but with no bound args', function () {
			U.withContext(function (ctx, device) {
				U.withProgram(ctx, fs.readFileSync(__dirname + '/kernels/square.cl').toString(),
					function (prg) {
						cl.buildProgram(prg);
						let kern = cl.createKernel(prg, 'square');

						let inputsMem = cl.createBuffer(
							ctx, cl.MEM_COPY_HOST_PTR, 10000 * 4, inputs);
						let outputsMem = cl.createBuffer(
							ctx, cl.MEM_COPY_HOST_PTR, 10000 * 4, outputs);

						cl.setKernelArg(kern, 0, 'uint*', inputsMem);
						cl.setKernelArg(kern, 1, 'uint*', outputsMem);
						cl.setKernelArg(kern, 2, 'uint', 10000);

						U.withCQ(ctx, device, function (cq) {

							cl.enqueueNDRangeKernel(
								cq, kern, 1, null, [100], null);

							cl.releaseMemObject(inputsMem);
							cl.releaseMemObject(outputsMem);
							cl.releaseKernel(kern);
						});
					});
			});
		});

		// // AMD : It returns invalid value ...
		// skip().vendor("AMD").it("should fail with null global size", function () {
		// 	U.withContext(function (ctx, device) {
		// 		U.withProgram(ctx, fs.readFileSync(__dirname  + "/kernels/square.cl").toString(),
		// 		function (prg) {
		// 			cl.buildProgram(prg);
		// 			let kern = cl.createKernel(prg, "square");

		// 			let inputsMem = cl.createBuffer(
		// 			ctx, cl.MEM_COPY_HOST_PTR, 10000 * 4, inputs);
		// 			let outputsMem = cl.createBuffer(
		// 			ctx, cl.MEM_COPY_HOST_PTR, 10000 * 4, outputs);

		// 			cl.setKernelArg(kern, 0, "uint*", inputsMem);
		// 			cl.setKernelArg(kern, 1, "uint*", outputsMem);
		// 			cl.setKernelArg(kern, 2, "uint", 10000);

		// 			U.withCQ(ctx, device, function (cq) {

		// 			expect(
		// 				() => cl.enqueueNDRangeKernel(
		// 					cq,
		// 					kern,
		// 					1,
		// 					null,
		// 					null,
		// 					null
		// 				)
		// 			).to.throw(cl.INVALID_GLOBAL_WORK_SIZE.message);

		// 			});
		// 		})
		// 	})
		// });

		it('should fail if kern is invalid', function () {
			U.withContext(function (ctx, device) {
				U.withProgram(ctx, fs.readFileSync(__dirname + '/kernels/square.cl').toString(),
					function (prg) {
						cl.buildProgram(prg);
						let kern = cl.createKernel(prg, 'square');

						let inputsMem = cl.createBuffer(
							ctx, cl.MEM_COPY_HOST_PTR, 10000 * 4, inputs);
						let outputsMem = cl.createBuffer(
							ctx, cl.MEM_COPY_HOST_PTR, 10000 * 4, outputs);

						cl.setKernelArg(kern, 0, 'uint*', inputsMem);
						cl.setKernelArg(kern, 1, 'uint*', outputsMem);
						cl.setKernelArg(kern, 2, 'uint', 10000);

						U.withCQ(ctx, device, function (cq) {

							expect(
								() => cl.enqueueNDRangeKernel(
									cq,
									null,
									1,
									null,
									[100],
									null
								)
							).to.throw('Argument 1 must be of type `Object`');

							cl.releaseMemObject(inputsMem);
							cl.releaseMemObject(outputsMem);
							cl.releaseKernel(kern);
						});
					});
			});
		});


		it('should fail if given dimensions does not match arrays', function () {
			U.withContext(function (ctx, device) {
				U.withProgram(ctx, fs.readFileSync(__dirname + '/kernels/square.cl').toString(),
					function (prg) {
						cl.buildProgram(prg);
						let kern = cl.createKernel(prg, 'square');

						let inputsMem = cl.createBuffer(
							ctx, cl.MEM_COPY_HOST_PTR, 10000 * 4, inputs);
						let outputsMem = cl.createBuffer(
							ctx, cl.MEM_COPY_HOST_PTR, 10000 * 4, outputs);

						cl.setKernelArg(kern, 0, 'uint*', inputsMem);
						cl.setKernelArg(kern, 1, 'uint*', outputsMem);
						cl.setKernelArg(kern, 2, 'uint', 10000);
						U.withCQ(ctx, device, function (cq) {

							expect(
								() => cl.enqueueNDRangeKernel(
									cq,
									kern,
									1,
									null,
									[100, 200],
									null
								)
							).to.throw(cl.INVALID_GLOBAL_WORK_SIZE.message);

							cl.releaseMemObject(inputsMem);
							cl.releaseMemObject(outputsMem);
							cl.releaseKernel(kern);
						});
					});
			});
		});

	});

	describe('#enqueueTask', function () {

		let inputs = new Buffer(10000 * 4);

		for (let i = 0; i < 10000; ++i) {
			inputs.writeUInt32LE(i, i * 4);
		}

		it('should work with a valid call', function () {
			U.withContext(function (ctx, device) {
				U.withProgram(ctx, fs.readFileSync(__dirname + '/kernels/square_one.cl').toString(),
					function (prg) {
						cl.buildProgram(prg);

						let kern = cl.createKernel(prg, 'square_one');

						cl.setKernelArg(kern, 0, 'uint', 1);
						cl.setKernelArg(kern, 1, 'uint', 2);

						U.withCQ(ctx, device, function (cq) {
							cl.enqueueTask(cq, kern);
							cl.releaseKernel(kern);
						});
					});
			});
		});

		it('should fail if kern is invalid', function () {
			U.withContext(function (ctx, device) {
				U.withProgram(ctx, fs.readFileSync(__dirname + '/kernels/square_one.cl').toString(),
					function () {

						U.withCQ(ctx, device, function (cq) {

							expect(
								() => cl.enqueueTask(cq, null)
							).to.throw('Argument 1 must be of type `Object`');

						});
					});
			});
		});

	});

	describe('#enqueueNativeKernel', function () {

		it('should always throw since it is not supported', function () {
			expect(cl.enqueueNativeKernel).to.throw();
		});

	});

	describe('#enqueueMarkerWithWaitList', function () {

		it('should enqueue marker with event wait list', function () {

			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {

					let array = new Buffer([0, 0, 0, 0, 0, 0, 0, 0]);

					let buffer = cl.createBuffer(ctx, cl.MEM_USE_HOST_PTR, 32, array);
					let event = cl.enqueueFillBuffer(cq, buffer, new Buffer([1, 2]), 0, 16, null, true);

					let ret = cl.enqueueMarkerWithWaitList(cq, [event], true);

					assert.isObject(ret);

					cl.setEventCallback(ret, cl.COMPLETE, function () {
						cl.releaseMemObject(buffer);
						cl.releaseEvent(ret);
						cl.releaseEvent(event);
					});
				});
			});
		});
	});

	describe('#enqueueBarrierWithWaitList', function () {
		
		it('should enqueue barrier with event wait list', function () {

			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {

					let array = new Buffer([0, 0, 0, 0, 0, 0, 0, 0]);

					let buffer = cl.createBuffer(ctx, cl.MEM_USE_HOST_PTR, 32, array);
					let event = cl.enqueueFillBuffer(cq, buffer, new Buffer([1, 2]), 0, 16, null, true);

					let ret = cl.enqueueBarrierWithWaitList(cq, [event], true);

					assert.isObject(ret);

					cl.setEventCallback(ret, cl.COMPLETE, function () {
						cl.releaseMemObject(buffer);
						cl.releaseEvent(ret);
						cl.releaseEvent(event);
					});
				});
			});
		});

	});

});

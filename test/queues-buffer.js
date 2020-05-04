'use strict';

const { assert, expect } = require('chai');

const cl = require('../');
let U = require('./utils');
let skip = require('./utils/diagnostic');


let makeCommandQueue = function (ctx, device) {
	return cl.createCommandQueue(ctx, device, null);
};


describe('CommandQueue - Buffer', function () {

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
					let array = new Buffer([0, 0, 0, 0, 0, 0, 0, 0]);

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
					let array = new Buffer([0, 0, 0, 0, 0, 0, 0, 0]);

					// INTEGER VECTOR
					let pattern = new Buffer([1, 2]);

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
					let array = new Buffer([0, 0, 0, 0, 0, 0, 0, 0]);

					// FLOAT VECTOR
					let pattern = new Buffer([1.5, 2.5]);

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

	describe('# enqueueMapBuffer', function () {
		it('should return a valid buffer', function () {
			U.withContext(function (ctx, device) {
				U.withCQ(ctx, device, function (cq) {
					let buf = cl.createBuffer(ctx, cl.MEM_READ_WRITE, 8, null);
					let ret = cl.enqueueMapBuffer(cq, buf, true, cl.MAP_READ, 0, 8,[], false);
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

});

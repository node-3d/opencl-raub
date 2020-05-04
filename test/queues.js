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


describe('CommandQueue - Common', function () {


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


	describe('# enqueueUnmapMemObject', function () {
		skip().vendor('Apple').it('should throw as we are unmapping a non mapped memobject', function () {
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
					let ret = cl.enqueueMapBuffer(cq, buf, true, cl.MAP_READ, 0, 8,[], false);
					let u8s = new Uint8Array(ret);
					assert.instanceOf(u8s.buffer, ArrayBuffer);
					let res = cl.enqueueUnmapMemObject(cq, buf, u8s.buffer);
					assert.equal(res, cl.SUCCESS);
					cl.releaseMemObject(buf);
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

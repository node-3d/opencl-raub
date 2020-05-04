'use strict';

const { assert, expect } = require('chai');

const cl = require('../');
let U = require('./utils');
let skip = require('./utils/diagnostic');


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
let invalidRegion = [8, 8, 2];
let grayColor = [0.5, 0.5, 0.5, 0.5];


const enqueueReadImage = () => describe.skip('#enqueueReadImage', function () {

	it('should work with valid image', function () {
		U.withContext(function (ctx, device) {
			U.withCQ(ctx, device, function (cq) {
				let image = cl.createImage(ctx, 0, imageFormat, imageDesc);
				// command queue, cl_image, blocking, origin, region, row, slice, ptr
				let ret = cl.enqueueReadImage(
					cq,
					image,
					true,
					zeroArray,
					validRegion,
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
						zeroArray,
						validRegion,
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
					let image = cl.createImage(ctx, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc);
					// this will cause an INVALID_VALUE exception
					const readBound = () => cl.enqueueReadImage(
						cq,
						image,
						true,
						zeroArray,
						validRegion,
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
					let image = cl.createImage(ctx, cl.MEM_HOST_READ_ONLY, imageFormat, imageDesc);
					// this will cause an INVALID_VALUE exception
					let ret = cl.enqueueReadImage(
						cq,
						image,
						true,
						zeroArray,
						validRegion,
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
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc);
					// this will cause an INVALID_VALUE exception
					let invalidOrigin = [1, 1, 1];
					expect(
						() => cl.enqueueReadImage(
							cq,
							image,
							true,
							invalidOrigin,
							validRegion,
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
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc);
					// this will cause an INVALID_VALUE exception
					let outOfBoundRegion = [9, 9, 1];
					expect(
						() => cl.enqueueReadImage(
							cq,
							image,
							true,
							zeroArray,
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
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc);
					// This will cause an INVALID_VALUE exception
					// (region[2] must be 1 for 2D images)
					expect(
						() => cl.enqueueReadImage(
							cq,
							image,
							true,
							zeroArray,
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

const enqueueWriteImage = () => describe('#enqueueWriteImage', function () {

	it('should work with cl.MEM_READ_WRITE images', function () {
		U.withContext(function (ctx, device) {
			U.withCQ(ctx, device, function (cq) {
				let image = cl.createImage(ctx, 0, imageFormat, imageDesc);
				// command queue, cl_image, blocking, origin, region, row, slice, ptr
				let ret = cl.enqueueWriteImage(
					cq,
					image,
					true,
					zeroArray,
					validRegion,
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
					let image = cl.createImage(
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
						zeroArray,
						validRegion,
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
					let image = cl.createImage(
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
							zeroArray,
							validRegion,
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
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc);

					// This will trigger a cl.INVALID_VALUE exception
					// (origin must be zeroArray
					let invalidOrigin = [1, 1, 1];
					expect(
						() => cl.enqueueWriteImage(
							cq,
							image,
							true,
							invalidOrigin,
							validRegion,
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
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc);

					// This will trigger a cl.INVALID_VALUE exception
					// (region[2] must be 1 for 2D images)
					expect(
						() => cl.enqueueWriteImage(
							cq,
							image,
							true,
							zeroArray,
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
					let image = cl.createImage(ctx, 0, imageFormat, imageDesc);

					// This will trigger a cl.INVALID_VALUE exception
					// (region[2] must be 1 for 2D images)
					let outOfBoundRegion = [9, 9, 1];
					expect(
						() => cl.enqueueWriteImage(
							cq,
							image,
							true,
							zeroArray,
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


const enqueueFillImage = () => describe('#enqueueFillImage', function () {

	it('should fill image with color', function () {
		U.withContext(function (ctx, device) {
			U.withCQ(ctx, device, function (cq) {
				let image = cl.createImage(ctx, 0, imageFormat, imageDesc);
				let color = new Buffer(grayColor);

				let ret = cl.enqueueFillImage(cq, image, color, zeroArray, validRegion);

				cl.releaseMemObject(image);
				assert.strictEqual(ret, cl.SUCCESS);
			});
		});
	});

	it('should throw cl.INVALID_VALUE if color is null', function () {
		U.withContext(function (ctx, device) {
			U.withCQ(ctx, device, function (cq) {
				let image = cl.createImage(ctx, 0, imageFormat, imageDesc);
				let color = null;

				expect(
					() => cl.enqueueFillImage(cq, image, color, zeroArray, validRegion)
				).to.throw('Argument 2 must be of type `Object`');
				cl.releaseMemObject(image);
			});
		});
	});

	it('should throw cl.INVALID_VALUE if region is out of bounds', function () {
		U.withContext(function (ctx, device) {
			U.withCQ(ctx, device, function (cq) {
				let image = cl.createImage(ctx, 0, imageFormat, imageDesc);
				let color = new Buffer(grayColor);
				let outOfBoundsRegion = [9, 9, 1];

				expect(
					() => cl.enqueueFillImage(cq, image, color, zeroArray, outOfBoundsRegion)
				).to.throw(cl.INVALID_VALUE.message);
				cl.releaseMemObject(image);
			});
		});
	});

	it('should throw cl.INVALID_VALUE if origin is invalid', function () {
		U.withContext(function (ctx, device) {
			U.withCQ(ctx, device, function (cq) {
				let image = cl.createImage(ctx, 0, imageFormat, imageDesc);
				let color = new Buffer(grayColor);

				// origin[2] must be 0
				let invalidOrigin = [0, 0, 1];

				expect(
					() => cl.enqueueFillImage(cq, image, color, invalidOrigin, validRegion)
				).to.throw(cl.INVALID_VALUE.message);
				cl.releaseMemObject(image);
			});
		});
	});

	it('should throw cl.INVALID_VALUE if region is invalid', function () {
		U.withContext(function (ctx, device) {
			U.withCQ(ctx, device, function (cq) {
				let image = cl.createImage(ctx, 0, imageFormat, imageDesc);
				let color = new Buffer(grayColor);

				// origin[2] must be 1
				let invalidRegion = [8, 8, 0];

				expect(
					() => cl.enqueueFillImage(cq, image, color, zeroArray, invalidRegion)
				).to.throw(cl.INVALID_VALUE.message);
				cl.releaseMemObject(image);
			});
		});
	});

	it('should throw cl.INVALID_MEM_OBJECT if image is not a valid image object', function () {
		U.withContext(function (ctx, device) {
			U.withCQ(ctx, device, function (cq) {
				let image = null;
				let color = new Buffer(grayColor);

				// origin[2] must be 1
				let invalidRegion = [8, 8, 0];

				expect(
					() => cl.enqueueFillImage(cq, image, color, zeroArray, invalidRegion)
				).to.throw('Argument 1 must be of type `Object`');
			});
		});
	});
});

const enqueueCopyImage = () => describe('#enqueueCopyImage', function () {

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


const enqueueCopyImageToBuffer = () => describe('#enqueueCopyImageToBuffer', function () {

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

const enqueueCopyBufferToImage = () => describe('#enqueueCopyBufferToImage', function () {

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

const enqueueMapImage = () => describe('# enqueueMapImage', function () {

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

const enqueueMigrateMemObjects = () => describe('#enqueueMigrateMemObjects', function () {

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

describe('CommandQueue - Image', function () {
	enqueueReadImage();
	enqueueWriteImage();
	enqueueFillImage();
	enqueueCopyImage();
	enqueueCopyImageToBuffer();
	enqueueCopyBufferToImage();
	enqueueMapImage();
	enqueueMigrateMemObjects();
});

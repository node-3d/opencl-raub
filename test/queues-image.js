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


describe('CommandQueue - Image', function () {

	describe.skip('#enqueueReadImage', function () {

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

	describe('#enqueueWriteImage', function () {

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


	describe('#enqueueFillImage', function () {

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

});

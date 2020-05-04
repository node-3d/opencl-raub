'use strict';

const { assert, expect } = require('chai');

const cl = require('..');
let U = require('./utils');
let skip = require('./utils/diagnostic');


describe('MemObj', function () {

	describe('#getSupportedImageFormats', function () {

		var f = cl.getSupportedImageFormats;

		it('should get supported image formats', function () {
			U.withContext(context => {
				var formats = f(context, cl.MEM_READ_WRITE, cl.MEM_OBJECT_IMAGE2D);
				assert.isArray(formats);
				assert.isAbove(formats.length, 0);
			});
		});

		it('should get supported image formats', function () {
			U.withContext(context => {
				var formats = f(context, cl.MEM_WRITE_ONLY, cl.MEM_OBJECT_IMAGE2D);
				assert.isArray(formats);
				assert.isAbove(formats.length, 0);
			});
		});

		it('should get supported image formats', function () {
			U.withContext(context => {
				var formats = f(context, cl.MEM_READ_ONLY, cl.MEM_OBJECT_IMAGE2D);
				assert.isArray(formats);
				assert.isAbove(formats.length, 0);
			});
		});

		skip().vendor('nVidia').it('should get supported image formats', function () {
			U.withContext(context => {
				var formats = f(context, cl.MEM_USE_HOST_PTR, cl.MEM_OBJECT_IMAGE2D);
				assert.isArray(formats);
				assert.isAbove(formats.length, 0);
			});
		});

		skip().vendor('nVidia').it('should get supported image formats', function () {
			U.withContext(context => {
				var formats = f(context, cl.MEM_ALLOC_HOST_PTR, cl.MEM_OBJECT_IMAGE2D);
				assert.isArray(formats);
				assert.isAbove(formats.length, 0);
			});
		});

		skip().vendor('nVidia').it('should get supported image formats', function () {
			U.withContext(context => {
				var formats = f(context, cl.MEM_COPY_HOST_PTR, cl.MEM_OBJECT_IMAGE2D);
				assert.isArray(formats);
				assert.isAbove(formats.length, 0);
			});
		});

		it.skip('should get supported image formats', function () {
			U.withContext(context => {
				var formats = f(context, cl.MEM_HOST_WRITE_ONLY, cl.MEM_OBJECT_IMAGE2D);
				assert.isArray(formats);
				assert.isAbove(formats.length, 0);
			});
		});

		it.skip('should get supported image formats', function () {
			U.withContext(context => {
				var formats = f(context, cl.MEM_HOST_READ_ONLY, cl.MEM_OBJECT_IMAGE2D);
				assert.isArray(formats);
				assert.isAbove(formats.length, 0);
			});
		});

		it.skip('should get supported image formats', function () {
			U.withContext(context => {
				var formats = f(context, cl.MEM_HOST_NO_ACCESS, cl.MEM_OBJECT_IMAGE2D);
				assert.isArray(formats);
				assert.isAbove(formats.length, 0);
			});
		});

		it('should throw cl.INVALID_CONTEXT if context is invalid', function () {
			U.withContext(function () {
				expect(
					f.bind(f, null, 0, cl.MEM_OBJECT_IMAGE2D)
				).to.throw('Argument 0 must be of type `Object`');
			});
		});

	});
	describe('#getMemObjectInfo', function () {

		var f = cl.getMemObjectInfo;

		it('should return CL_MEM_TYPE', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var ret = f(buffer, cl.MEM_TYPE);
				assert.isNumber(ret);
				cl.releaseMemObject(buffer);
			});
		});

		skip().vendor('Intel').vendor('nVidia').it('should return CL_MEM_FLAGS', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var ret = f(buffer, cl.MEM_FLAGS);
				assert.isNumber(ret);
				assert.strictEqual(ret, 0);
				cl.releaseMemObject(buffer);
			});
		});

		it('should return CL_MEM_SIZE', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var ret = f(buffer, cl.MEM_SIZE);
				assert.isNumber(ret);
				assert.strictEqual(ret, 8);
				cl.releaseMemObject(buffer);
			});
		});

		it('should return CL_MEM_OFFSET', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var ret = f(buffer, cl.MEM_OFFSET);
				assert.isNumber(ret);
				assert.strictEqual(ret, 0);
				cl.releaseMemObject(buffer);
			});
		});

		it('should return CL_MEM_MAP_COUNT', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var ret = f(buffer, cl.MEM_MAP_COUNT);
				assert.isNumber(ret);
				assert.strictEqual(ret, 0);
				cl.releaseMemObject(buffer);
			});
		});

		it('should return CL_MEM_REFERENCE_COUNT', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var ret = f(buffer, cl.MEM_REFERENCE_COUNT);
				assert.isNumber(ret);
				assert.strictEqual(ret, 1);
				cl.releaseMemObject(buffer);
			});
		});

		it('should return CL_MEM_CONTEXT', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var ret = f(buffer, cl.MEM_CONTEXT);
				assert.isObject(ret);
				cl.releaseMemObject(buffer);
			});
		});

		it.skip('should return CL_MEM_HOST_PTR', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, cl.MEM_ALLOC_HOST_PTR, 8, null);
				var ret = f(buffer, cl.MEM_HOST_PTR);
				assert.isObject(ret);
				cl.releaseMemObject(buffer);
			});
		});

		it('should return CL_MEM_CONTEXT', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var ret = f(buffer, cl.MEM_CONTEXT);
				assert.isObject(ret);
				cl.releaseMemObject(buffer);
			});
		});

		it('should throw cl.INVALID_MEM_OBJECT if memory object is invalid', function () {
			U.withContext(function () {
				expect(
					f.bind(f, null, cl.MEM_ASSOCIATED_MEMOBJECT)
				).to.throw('Argument 0 must be of type `Object`');
			});
		});

	});

	describe('#getImageInfo', function () {

		var f = cl.getImageInfo;
		var imageFormat = {'channel_order': cl.RGBA, 'channel_data_type': cl.UNSIGNED_INT8};
		var imageDesc = {
			'type': cl.MEM_OBJECT_IMAGE2D,
			'width': 10,
			'height': 10,
			'depth': 8,
			'image_array_size': 1
		};

		var createImageWrapper = function (ctx) {
			if (cl.VERSION_1_1 && ! cl.VERSION_1_2) {
				return cl.createImage2D(ctx, 0, imageFormat, imageDesc.width, imageDesc.height, 0, null);
			}
			else {
				return cl.createImage(ctx, 0, imageFormat, imageDesc, null);
			}
		};

		it('should return CL_IMAGE_FORMAT', function () {
			U.withContext(context => {
				var image = createImageWrapper(context);
				var imageInfo = f(image, cl.IMAGE_FORMAT);
				assert.isArray(imageInfo);
			});
		});

		it('should return CL_IMAGE_ELEMENT_SIZE', function () {
			U.withContext(context => {
				var image = createImageWrapper(context);
				var imageInfo = f(image, cl.IMAGE_ELEMENT_SIZE);
				assert.isNumber(imageInfo);
			});

		});

		it('should return CL_IMAGE_ROW_PITCH', function () {
			U.withContext(context => {
				var image = createImageWrapper(context);
				var imageInfo = f(image, cl.IMAGE_ROW_PITCH);
				assert.isNumber(imageInfo);
			});

		});

		it('should return CL_IMAGE_SLICE_PITCH', function () {
			U.withContext(context => {
				var image = createImageWrapper(context);
				var imageInfo = f(image, cl.IMAGE_ROW_PITCH);
				assert.isNumber(imageInfo);
			});

		});

		it('should return CL_IMAGE_WIDTH', function () {
			U.withContext(context => {
				var image = createImageWrapper(context);
				var imageInfo = f(image, cl.IMAGE_WIDTH);
				assert.isNumber(imageInfo);
				assert.strictEqual(imageInfo, 10);
			});

		});

		it('should return CL_IMAGE_HEIGHT', function () {
			U.withContext(context => {
				var image = createImageWrapper(context);
				var imageInfo = f(image, cl.IMAGE_HEIGHT);
				assert.isNumber(imageInfo);
				assert.strictEqual(imageInfo, 10);
			});

		});

		it('should return CL_IMAGE_DEPTH', function () {
			U.withContext(context => {
				var image = createImageWrapper(context);
				var imageInfo = f(image, cl.IMAGE_DEPTH);
				assert.isNumber(imageInfo);
			});

		});

		it('should return CL_IMAGE_ARRAY_SIZE', function () {
			U.withContext(context => {
				var image = createImageWrapper(context);
				var imageInfo = f(image, cl.IMAGE_ARRAY_SIZE);
				assert.isNumber(imageInfo);
			});

		});

		it('should return CL_IMAGE_NUM_MIP_LEVELS', function () {
			U.withContext(context => {
				var image = cl.createImage(context, 0, imageFormat, imageDesc, null);
				var imageInfo = f(image, cl.IMAGE_NUM_MIP_LEVELS);
				assert.isNumber(imageInfo);
			});

		});

		it('should return CL_IMAGE_NUM_SAMPLES', function () {
			U.withContext(context => {
				var image = cl.createImage(context, 0, imageFormat, imageDesc, null);
				var imageInfo = f(image, cl.IMAGE_NUM_SAMPLES);
				assert.isNumber(imageInfo);
			});

		});

		// it("should return CL_IMAGE_BUFFER", function () {
		//   U.withContext(context => {
		//     var image = cl.createImage(context, 0, imageFormat, imageDesc, null);
		//     var imageInfo = f(image, cl.IMAGE_BUFFER);
		//     assert.isObject(imageInfo);
		//   });

		// });

		it('should throw cl.INVALID_MEM_OBJECT if memory object is invalid', function () {
			U.withContext(function () {
				expect(
					f.bind(f, null, cl.IMAGE_BUFFER)
				).to.throw('Argument 0 must be of type `Object`');
			});
		});

		it('should throw cl.INVALID_VALUE if param name is not valid ', function () {
			U.withContext(context => {
				var image = cl.createImage(context, 0, imageFormat, imageDesc, null);
				expect(
					f.bind(f, image, 0)
				).to.throw(cl.INVALID_VALUE.message);
			});
		});
	});
});

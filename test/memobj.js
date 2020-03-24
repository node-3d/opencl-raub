'use strict';

const { assert, expect } = require('chai');

const cl = require('..');
let U = require('./utils');
let skip = require('./utils/diagnostic');


describe('MemObj', function () {

	describe('#createBuffer', function () {

		it('should throw cl.INVALID_CONTEXT if context is invalid', function () {
			U.withContext(function () {
				expect(
					() => cl.createBuffer(null, null, null, null)
				).to.throw('Argument 0 must be of type `Object`');
			});
		});

		it('should throw cl.INVALID_VALUE if flags are not valid', function () {
			U.withContext(context => {
				expect(
					() => cl.createBuffer(context, -1, 8, null)
				).to.throw(cl.INVALID_VALUE.message);
			});
		});

		it('should throw cl.INVALID_BUFFER_SIZE if size is 0', function () {
			U.withContext(context => {
				expect(
					() => cl.createBuffer(context, 0, 0, null)
				).to.throw(cl.INVALID_BUFFER_SIZE.message);
			});
		});

		it('should use cl.MEM_READ_WRITE as default value when flags is 0', function () {
			U.withContext(context => {

				var buffer = cl.createBuffer(context, 0, 8, null);
				//var flags = cl.getMemObjectInfo(buffer, cl.MEM_FLAGS);
				cl.releaseMemObject(buffer);
				// FIXME: Can't test this like that,
				// getMemObjectInfo will return the value passed to createBuffer
				// instead of the actual default value used
				// assert.equal(flags, cl.MEM_READ_WRITE);
			});
		});

		it('should copy memory when passed a Buffer', function () {
			U.withContext(context => {

				var array = new Buffer.alloc(32);
				var buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 8, array);
				cl.releaseMemObject(buffer);
			});
		});

		it('should copy memory when passed a TypedArray', function () {
			U.withContext(context => {

				var array = new ArrayBuffer(32);
				var i32Array = new Int32Array(array);
				var buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 8, i32Array);
				cl.releaseMemObject(buffer);
			});
		});


		it('should alloc host memory when passed a TypedArray', function () {
			U.withContext(context => {

				var array = new ArrayBuffer(32);
				var i32Array = new Int32Array(array);
				var buffer = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 8, i32Array);
				cl.releaseMemObject(buffer);
			});
		});

		it('should throw when passed neither a Buffer nor a TypedArray', function () {
			U.withContext(context => {
				const fBound = cl.createBuffer.bind(
					cl.createBuffer,
					context,
					cl.MEM_COPY_HOST_PTR,
					8,
					String('this won\'t do !')
				);
				expect(fBound).to.throw('Argument 3 must be of type `Object`');
			});
		});

		it('should throw cl.INVALID_MEM_OBJECT when passed an Array', function () {
			U.withContext(context => {
				const fBound = cl.createBuffer.bind(
					cl.createBuffer,
					context,
					cl.MEM_COPY_HOST_PTR,
					8,
					[1, 2, 3, 4, 5, 6, 7, 8]
				);
				expect(fBound).to.throw('Could not read buffer data.');
			});
		});

	});
	describe('#createSubBuffer', function () {

		var f = cl.createSubBuffer;

		it('should throw cl.INVALID_MEM_OBJECT if buffer is not valid', function () {
			U.withContext(function () {
				expect(
					() => cl.createSubBuffer(
						null,
						cl.MEM_READ_WRITE,
						cl.BUFFER_CREATE_TYPE_REGION,
						{'origin': 0, 'size': 2}
					)
				).to.throw('Argument 0 must be of type `Object`');
			});
		});


		it(
			'throws cl.INVALID_VALUE if bufferCreateType is not BUFFER_CREATE_TYPE_CREGION',
			function () {
				U.withContext(context => {

					var buffer = cl.createBuffer(context, 0, 8, null);

					expect(
						() => cl.createSubBuffer(buffer, 0, -1, {'origin': 0, 'size': 2})
					).to.throw(cl.INVALID_VALUE.message);

					cl.releaseMemObject(buffer);
				});
			}
		);

		it('should create a subBuffer', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var subBuffer = f(buffer, 0, cl.BUFFER_CREATE_TYPE_REGION, {'origin': 0, 'size': 2});

				cl.releaseMemObject(subBuffer);
				cl.releaseMemObject(buffer);
			});
		});

		it('should create a subBuffer', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var subBuffer = f(
					buffer,
					cl.MEM_WRITE_ONLY,
					cl.BUFFER_CREATE_TYPE_REGION,
					{'origin': 0, 'size': 2}
				);

				cl.releaseMemObject(subBuffer);
				cl.releaseMemObject(buffer);
			});
		});

		it('should create a subBuffer', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var subBuffer = f(
					buffer,
					cl.MEM_READ_ONLY,
					cl.BUFFER_CREATE_TYPE_REGION,
					{'origin': 0, 'size': 2}
				);

				cl.releaseMemObject(subBuffer);
				cl.releaseMemObject(buffer);
			});
		});

		it('should create a subBuffer', function () {
			U.withContext(context => {
				var i32Array = new Int32Array(8);
				var buffer = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 8, i32Array);
				var subBuffer = f(
					buffer,
					0,
					cl.BUFFER_CREATE_TYPE_REGION,
					{'origin': 0, 'size': 2}
				);

				cl.releaseMemObject(subBuffer);
				cl.releaseMemObject(buffer);
			});
		});

		it('should create a subBuffer', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, cl.MEM_ALLOC_HOST_PTR, 8, null);
				var subBuffer = f(
					buffer,
					0,
					cl.BUFFER_CREATE_TYPE_REGION,
					{'origin': 0, 'size': 2}
				);

				cl.releaseMemObject(subBuffer);
				cl.releaseMemObject(buffer);
			});
		});

		it('should create a subBuffer', function () {
			U.withContext(context => {
				var i32Array = new Int32Array(8);
				var buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 8, i32Array);
				var subBuffer = f(buffer, 0, cl.BUFFER_CREATE_TYPE_REGION, {'origin': 0, 'size': 2});

				cl.releaseMemObject(subBuffer);
				cl.releaseMemObject(buffer);
			});
		});

		it('should create a subBuffer', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var subBuffer = f(
					buffer,
					cl.MEM_HOST_WRITE_ONLY,
					cl.BUFFER_CREATE_TYPE_REGION,
					{'origin': 0, 'size': 2}
				);

				cl.releaseMemObject(subBuffer);
				cl.releaseMemObject(buffer);
			});
		});

		it('should create a subBuffer', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var subBuffer = f(
					buffer,
					cl.MEM_HOST_READ_ONLY,
					cl.BUFFER_CREATE_TYPE_REGION,
					{'origin': 0, 'size': 2}
				);

				cl.releaseMemObject(subBuffer);
				cl.releaseMemObject(buffer);
			});
		});

		it('should create a subBuffer', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				var subBuffer = f(
					buffer,
					cl.MEM_HOST_NO_ACCESS,
					cl.BUFFER_CREATE_TYPE_REGION,
					{'origin': 0, 'size': 2}
				);

				cl.releaseMemObject(subBuffer);
				cl.releaseMemObject(buffer);
			});
		});

	});
	
	describe('#createImage', function () {

		var f = cl.createImage;
		var imageFormat = {'channel_order': cl.RGBA, 'channel_data_type': cl.UNSIGNED_INT8};
		var imageDesc = {
			'type': cl.MEM_OBJECT_IMAGE2D,
			'width': 10,
			'height': 10,
			'depth': 8,
			'array_size': 1
		};

		it('should create an image', function () {
			U.withContext(context => {
				var image = cl.createImage(context, 0, imageFormat, imageDesc, null);
				cl.releaseMemObject(image);
			});
		});

		it('should create an image', function () {

			U.withContext(context => {
				var image = cl.createImage(
					context,
					cl.MEM_WRITE_ONLY,
					imageFormat,
					imageDesc,
					null
				);
				cl.releaseMemObject(image);
			});
		});

		it('should create an image', function () {

			U.withContext(context => {

				var image = cl.createImage(context, cl.MEM_READ_ONLY, imageFormat, imageDesc, null);
				cl.releaseMemObject(image);
			});
		});

		it('should create an image', function () {

			U.withContext(context => {
				var i32Array = new Int32Array(imageDesc.width * imageDesc.height);
				var image = cl.createImage(context, cl.MEM_USE_HOST_PTR, imageFormat, imageDesc, i32Array);
				cl.releaseMemObject(image);
			});
		});

		it('should create an image', function () {

			U.withContext(context => {

				var image = cl.createImage(context, cl.MEM_ALLOC_HOST_PTR, imageFormat, imageDesc, null);
				cl.releaseMemObject(image);
			});
		});

		it('should create an image', function () {

			U.withContext(context => {
				var i32Array = new Int32Array(imageDesc.width * imageDesc.height);
				var image = cl.createImage(context, cl.MEM_COPY_HOST_PTR, imageFormat, imageDesc, i32Array);
				cl.releaseMemObject(image);
			});
		});

		it('should create an image', function () {

			U.withContext(context => {

				var image = cl.createImage(context, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc, null);
				cl.releaseMemObject(image);
			});
		});

		it('should create an image', function () {

			U.withContext(context => {

				var image = cl.createImage(context, cl.MEM_HOST_READ_ONLY, imageFormat, imageDesc, null);
				cl.releaseMemObject(image);
			});
		});

		it('should create an image', function () {

			U.withContext(context => {

				var image = cl.createImage(context, cl.MEM_HOST_NO_ACCESS, imageFormat, imageDesc, null);
				cl.releaseMemObject(image);
			});
		});

		it('should throw cl.INVALID_CONTEXT if context is invalid', function () {
			U.withContext(function () {

				const fBound = f.bind(f, null, 0, imageFormat, imageDesc, null);
				expect(fBound).to.throw('Argument 0 must be of type `Object`');
			});
		});

		it('should throw cl.INVALID_VALUE if flags is invalid', function () {
			U.withContext(context => {
				const fBound = f.bind(f, context, -1, imageFormat, imageDesc, null);
				expect(fBound).to.throw(cl.INVALID_VALUE.message);
			});
		});

		it('should throw cl.INVALID_IMAGE_DESCRIPTOR if image_desc is not valid or null', function () {
			U.withContext(context => {
				const fBound = f.bind(f, context, 0, imageFormat, -1, null);
				expect(fBound).to.throw('Argument 3 must be of type `Object`');
			});
		});

		skip().vendor('nVidia').it(
			'should throw cl.INVALID_IMAGE_FORMAT_DESCRIPTOR if image_format is not valid or null',
			function () {
				U.withContext(context => {
					const fBound = f.bind(f, context, 0, -1, imageDesc, null);
					expect(fBound).to.throw('Argument 2 must be of type `Object`');
				});
			}
		);



	});
	describe('#retainMemObject', function () {

		it('should retain mem object', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				cl.retainMemObject(buffer);
				cl.releaseMemObject(buffer);
				cl.releaseMemObject(buffer);
			});
		});

		it('should throw cl.INVALID_MEM_OBJECT if mem object is invalid', function () {
			U.withContext(function () {
				expect(
					() => cl.retainMemObject(null)
				).to.throw('Argument 0 must be of type `Object`');
			});
		});

	});
	describe('#releaseMemObject', function () {

		it('should release mem object', function () {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				cl.releaseMemObject(buffer);
			});
		});

		skip().it('should not fail if a release is asked twice', function (done) {
			U.withContext(context => {
				var buffer = cl.createBuffer(context, 0, 8, null);
				cl.releaseMemObject(buffer);

				setTimeout(function () {
					cl.releaseMemObject(buffer);
					done();
				}, 1500);
			});
		});

		it('should throw cl.INVALID_MEM_OBJECT if mem object is invalid', function () {
			U.withContext(function () {
				expect(
					() => cl.releaseMemObject(null)
				).to.throw('Argument 0 must be of type `Object`');
			});
		});

	});
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
				return cl.createImage2D(ctx,0,imageFormat,imageDesc.width,imageDesc.height,0,null);
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

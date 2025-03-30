'use strict';

const assert = require('node:assert').strict;
const { describe, it, after } = require('node:test');

const cl = require('..');
const U = require('./utils');


describe('MemObj', () => {
	const context = U.newContext();
	const buffer = cl.createBuffer(context, 0, 8, null);
	
	after(() => {
		cl.releaseMemObject(buffer);
		cl.releaseContext(context);
	});
	
	describe('#createBuffer', () => {
		it('throws cl.INVALID_CONTEXT if context is invalid', () => {
			assert.throws(
				() => cl.createBuffer(null, null, null, null),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_VALUE if flags are not valid', () => {
			assert.throws(
				() => cl.createBuffer(
					context,
					cl.MEM_ALLOC_HOST_PTR | cl.MEM_USE_HOST_PTR, // mutually exclusive flags
					8,
					new Int32Array(8), // throws INVALID_HOST_PTR if `null`
				),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_BUFFER_SIZE if size is 0', () => {
			assert.throws(
				() => cl.createBuffer(context, 0, 0, null),
				cl.INVALID_BUFFER_SIZE,
			);
		});
		
		it('uses cl.MEM_READ_WRITE as default value when flags is 0', () => {
			const buffer = cl.createBuffer(context, 0, 8, null);
			const flags = cl.getMemObjectInfo(buffer, cl.MEM_FLAGS);
			assert.equal(flags, cl.MEM_READ_WRITE);
			cl.releaseMemObject(buffer);
		});
		
		it('copies memory when passed a Buffer', () => {
			const array = Buffer.alloc(32);
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 8, array);
			cl.releaseMemObject(buffer);
		});
		
		it('copies memory when passed a TypedArray', () => {
			const array = new ArrayBuffer(32);
			const i32Array = new Int32Array(array);
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 8, i32Array);
			cl.releaseMemObject(buffer);
		});
		
		it('uses host memory when passed a TypedArray', () => {
			const array = new ArrayBuffer(32);
			const i32Array = new Int32Array(array);
			const buffer = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 8, i32Array);
			cl.releaseMemObject(buffer);
		});
		
		it('throws when passed neither a Buffer nor a TypedArray', () => {
			assert.throws(
				() => cl.createBuffer(
					context,
					cl.MEM_COPY_HOST_PTR,
					8,
					'testtest',
				),
				new Error('Argument 3 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_MEM_OBJECT when passed an Array', () => {
			assert.throws(
				() => cl.createBuffer(
					context,
					cl.MEM_COPY_HOST_PTR,
					8,
					[1, 2, 3, 4, 5, 6, 7, 8]
				),
				new Error('Could not read buffer data.'),
			);
		});
	});
	
	describe('#createSubBuffer', () => {
		it('throws cl.INVALID_MEM_OBJECT if buffer is not valid', () => {
			assert.throws(
				() => cl.createSubBuffer(
					null,
					cl.MEM_READ_WRITE,
					cl.BUFFER_CREATE_TYPE_REGION,
					{ origin: 0, size: 2 }
				),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_VALUE if bufferCreateType is not BUFFER_CREATE_TYPE_REGION', () => {
			assert.throws(
				() => cl.createSubBuffer(buffer, 0, -1, { origin: 0, size: 2 }),
				cl.INVALID_VALUE,
			);
		});
		
		it('creates a subBuffer', () => {
			const subBuffer = cl.createSubBuffer(
				buffer, 0, cl.BUFFER_CREATE_TYPE_REGION, { origin: 0, size: 2 },
			);
			
			cl.releaseMemObject(subBuffer);
		});
		
		it('creates a subBuffer', () => {
			const subBuffer = cl.createSubBuffer(
				buffer,
				cl.MEM_WRITE_ONLY,
				cl.BUFFER_CREATE_TYPE_REGION,
				{ origin: 0, size: 2 },
			);
			
			cl.releaseMemObject(subBuffer);
		});
		
		it('creates a subBuffer', () => {
			const subBuffer = cl.createSubBuffer(
				buffer,
				cl.MEM_READ_ONLY,
				cl.BUFFER_CREATE_TYPE_REGION,
				{ origin: 0, size: 2 },
			);
			
			cl.releaseMemObject(subBuffer);
		});
		
		it('creates a subBuffer', () => {
			const i32Array = new Int32Array(8);
			const buffer = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 8, i32Array);
			const subBuffer = cl.createSubBuffer(
				buffer,
				0,
				cl.BUFFER_CREATE_TYPE_REGION,
				{ origin: 0, size: 2 },
			);
			
			cl.releaseMemObject(subBuffer);
			cl.releaseMemObject(buffer);
		});
		
		it('creates a subBuffer', () => {
			const buffer = cl.createBuffer(context, cl.MEM_ALLOC_HOST_PTR, 8, null);
			const subBuffer = cl.createSubBuffer(
				buffer,
				0,
				cl.BUFFER_CREATE_TYPE_REGION,
				{ origin: 0, size: 2 },
			);
			
			cl.releaseMemObject(subBuffer);
			cl.releaseMemObject(buffer);
		});
		
		it('creates a subBuffer', () => {
			const i32Array = new Int32Array(8);
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 8, i32Array);
			const subBuffer = cl.createSubBuffer(
				buffer, 0, cl.BUFFER_CREATE_TYPE_REGION, { origin: 0, size: 2 },
			);
			
			cl.releaseMemObject(subBuffer);
			cl.releaseMemObject(buffer);
		});
		
		it('creates a subBuffer', () => {
			const subBuffer = cl.createSubBuffer(
				buffer,
				cl.MEM_HOST_WRITE_ONLY,
				cl.BUFFER_CREATE_TYPE_REGION,
				{ origin: 0, size: 2 },
			);
			
			cl.releaseMemObject(subBuffer);
		});
		
		it('creates a subBuffer', () => {
			const subBuffer = cl.createSubBuffer(
				buffer,
				cl.MEM_HOST_READ_ONLY,
				cl.BUFFER_CREATE_TYPE_REGION,
				{ origin: 0, size: 2 },
			);
			
			cl.releaseMemObject(subBuffer);
		});
		
		it('creates a subBuffer', () => {
			const subBuffer = cl.createSubBuffer(
				buffer,
				cl.MEM_HOST_NO_ACCESS,
				cl.BUFFER_CREATE_TYPE_REGION,
				{ origin: 0, size: 2 },
			);
			
			cl.releaseMemObject(subBuffer);
		});
	});
	
	describe('#createImage', () => {
		const imageFormat = { 'channel_order': cl.RGBA, 'channel_data_type': cl.UNSIGNED_INT8};
		const imageDesc = {
			'type': cl.MEM_OBJECT_IMAGE2D,
			'width': 10,
			'height': 10,
			'depth': 8,
			'array_size': 1
		};
		
		it('creates an image with default flags', () => {
			const image = cl.createImage(context, 0, imageFormat, imageDesc, null);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - ', () => {
			const image = cl.createImage(
				context,
				cl.MEM_WRITE_ONLY,
				imageFormat,
				imageDesc,
				null
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - ', () => {
			const image = cl.createImage(context, cl.MEM_READ_ONLY, imageFormat, imageDesc, null);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - ', () => {
			const i32Array = new Int32Array(imageDesc.width * imageDesc.height);
			const image = cl.createImage(
				context, cl.MEM_USE_HOST_PTR, imageFormat, imageDesc, i32Array,
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - ', () => {
			const image = cl.createImage(
				context, cl.MEM_ALLOC_HOST_PTR, imageFormat, imageDesc, null,
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - MEM_COPY_HOST_PTR', () => {
			const i32Array = new Int32Array(imageDesc.width * imageDesc.height);
			const image = cl.createImage(
				context, cl.MEM_COPY_HOST_PTR, imageFormat, imageDesc, i32Array,
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - MEM_HOST_WRITE_ONLY', () => {
			const image = cl.createImage(
				context, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc, null,
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - MEM_HOST_READ_ONLY', () => {
			const image = cl.createImage(
				context, cl.MEM_HOST_READ_ONLY, imageFormat, imageDesc, null,
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - MEM_HOST_NO_ACCESS', () => {
			const image = cl.createImage(
				context, cl.MEM_HOST_NO_ACCESS, imageFormat, imageDesc, null,
			);
			cl.releaseMemObject(image);
		});
		
		it('throws cl.INVALID_CONTEXT if context is invalid', () => {
			assert.throws(
				() => cl.createImage(null, 0, imageFormat, imageDesc, null),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_VALUE if flags is invalid', () => {
			assert.throws(
				() => cl.createImage(
					context,
					cl.MEM_ALLOC_HOST_PTR | cl.MEM_USE_HOST_PTR,
					imageFormat,
					imageDesc,
					new Int32Array(8),
				),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_IMAGE_DESCRIPTOR if image_desc is not valid or null', () => {
			assert.throws(
				() => cl.createImage(context, 0, imageFormat, -1, null),
				new Error('Argument 3 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_IMAGE_FORMAT_DESCRIPTOR if image_format is invalid', () => {
			assert.throws(
				() => cl.createImage(context, 0, -1, imageDesc, null),
				new Error('Argument 2 must be of type `Object`'),
			);
		});
	});
	
	describe('#retainMemObject', () => {
		it('retains mem object', () => {
			const buffer = cl.createBuffer(context, 0, 8, null);
			cl.retainMemObject(buffer);
			const ret = cl.getMemObjectInfo(buffer, cl.MEM_REFERENCE_COUNT);
			assert.strictEqual(ret, 2);
			
			cl.releaseMemObject(buffer);
			cl.releaseMemObject(buffer);
		});
		
		it('throws if mem object is invalid', () => {
			assert.throws(
				() => cl.retainMemObject({}),
				new Error('Argument 0 must be a CL Wrapper.'),
			);
		});
	});
	
	describe('#releaseMemObject', () => {
		it('releases mem object', () => {
			const buffer = cl.createBuffer(context, 0, 8, null);
			cl.releaseMemObject(buffer);
		});
		
		it('can release twice', (t, done) => {
			const buffer = cl.createBuffer(context, 0, 8, null);
			cl.releaseMemObject(buffer);
			
			setTimeout(() => {
				cl.releaseMemObject(buffer);
				done();
			}, 500);
		});
		
		it('throws if mem object is invalid', () => {
			assert.throws(
				() => cl.releaseMemObject({}),
				new Error('Argument 0 must be a CL Wrapper.'),
			);
		});
	});
});

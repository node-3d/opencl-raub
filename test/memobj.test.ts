import { strict as assert } from 'node:assert';
import { describe, it, after } from 'node:test';
import cl from '../index.js';


describe('MemObj', () => {
	const { context, platform } = cl.quickStart();
	const buffer = cl.createBuffer(context, 0, 8);
	
	after(() => {
		cl.releaseMemObject(buffer);
	});
	
	describe('#createBuffer', () => {
		it('throws cl.INVALID_CONTEXT if context is invalid', () => {
			assert.throws(
				() => cl.createBuffer(null as unknown as cl.TClContext, 0, 4),
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
				() => cl.createBuffer(context, 0, 0),
				cl.INVALID_BUFFER_SIZE,
			);
		});
		
		it('uses cl.MEM_READ_WRITE as default value when flags is 0', () => {
			const buffer = cl.createBuffer(context, 0, 8);
			const flags = cl.getMemObjectInfo(buffer, cl.MEM_FLAGS);
			assert.equal(flags, cl.MEM_READ_WRITE);
			cl.releaseMemObject(buffer);
		});
		
		it('copies memory when passed a Buffer', () => {
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 32, Buffer.alloc(32));
			cl.releaseMemObject(buffer);
		});
		
		it('copies memory when passed a TypedArray', () => {
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 32, new Int32Array(8));
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
					'testtest' as unknown as ArrayBuffer,
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
					[1, 2, 3, 4, 5, 6, 7, 8] as unknown as ArrayBuffer,
				),
				new Error('Could not read buffer data.'),
			);
		});
	});
	
	describe('#createSubBuffer', () => {
		it('throws if buffer is not valid', () => {
			assert.throws(
				() => cl.createSubBuffer(
					{} as unknown as cl.TClMem,
					cl.MEM_READ_WRITE,
					0,
					2,
				),
			);
		});
		
		it('creates a subBuffer - empty flags', () => {
			const subBuffer = cl.createSubBuffer(
				buffer, 0, 0, 2,
			);
			
			cl.releaseMemObject(subBuffer);
		});
		
		it('creates a subBuffer - cl.MEM_WRITE_ONLY', () => {
			const subBuffer = cl.createSubBuffer(
				buffer,
				cl.MEM_WRITE_ONLY,
				0,
				2,
			);
			
			cl.releaseMemObject(subBuffer);
		});
		
		it('creates a subBuffer - cl.MEM_READ_ONLY', () => {
			const subBuffer = cl.createSubBuffer(
				buffer,
				cl.MEM_READ_ONLY,
				0,
				2,
			);
			
			cl.releaseMemObject(subBuffer);
		});
		
		it('creates a subBuffer - cl.MEM_USE_HOST_PTR', () => {
			const i32Array = new Int32Array(8);
			const buffer = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 8, i32Array);
			const subBuffer = cl.createSubBuffer(
				buffer,
				0,
				0,
				2,
			);
			
			cl.releaseMemObject(subBuffer);
			cl.releaseMemObject(buffer);
		});
		
		it('creates a subBuffer - cl.MEM_ALLOC_HOST_PTR', () => {
			const buffer = cl.createBuffer(context, cl.MEM_ALLOC_HOST_PTR, 8);
			const subBuffer = cl.createSubBuffer(
				buffer,
				0,
				0,
				2,
			);
			
			cl.releaseMemObject(subBuffer);
			cl.releaseMemObject(buffer);
		});
		
		it('creates a subBuffer - cl.MEM_COPY_HOST_PTR', () => {
			const i32Array = new Int32Array(8);
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 8, i32Array);
			const subBuffer = cl.createSubBuffer(
				buffer, 0, 0, 2,
			);
			
			cl.releaseMemObject(subBuffer);
			cl.releaseMemObject(buffer);
		});
		
		it('creates a subBuffer - cl.MEM_HOST_WRITE_ONLY', () => {
			const subBuffer = cl.createSubBuffer(
				buffer,
				cl.MEM_HOST_WRITE_ONLY,
				0,
				2,
			);
			
			cl.releaseMemObject(subBuffer);
		});
		
		it('creates a subBuffer - cl.MEM_HOST_READ_ONLY', () => {
			const subBuffer = cl.createSubBuffer(
				buffer,
				cl.MEM_HOST_READ_ONLY,
				0,
				2,
			);
			
			cl.releaseMemObject(subBuffer);
		});
		
		it('creates a subBuffer - cl.MEM_HOST_NO_ACCESS', () => {
			const subBuffer = cl.createSubBuffer(
				buffer,
				cl.MEM_HOST_NO_ACCESS,
				0,
				2,
			);
			
			cl.releaseMemObject(subBuffer);
		});
	});
	
	describe('#createImage', () => {
		const imageFormat: cl.TClImageFormat = {
			'channel_order': cl.RGBA,
			'channel_data_type': cl.UNSIGNED_INT8,
		} as const;
		const imageDesc = {
			type: cl.MEM_OBJECT_IMAGE2D,
			width: 10,
			height: 10,
			depth: 8,
			'array_size': 1
		} as const;
		
		it('creates an image with default flags', () => {
			const image = cl.createImage(context, 0, imageFormat, imageDesc);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - cl.MEM_WRITE_ONLY', () => {
			const image = cl.createImage(
				context,
				cl.MEM_WRITE_ONLY,
				imageFormat,
				imageDesc,
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - cl.MEM_READ_ONLY', () => {
			const image = cl.createImage(context, cl.MEM_READ_ONLY, imageFormat, imageDesc);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - cl.MEM_USE_HOST_PTR', () => {
			const i32Array = new Int32Array(imageDesc.width * imageDesc.height);
			const image = cl.createImage(
				context, cl.MEM_USE_HOST_PTR, imageFormat, imageDesc, i32Array,
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - cl.MEM_ALLOC_HOST_PTR', () => {
			const image = cl.createImage(
				context, cl.MEM_ALLOC_HOST_PTR, imageFormat, imageDesc,
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - cl.MEM_COPY_HOST_PTR', () => {
			const i32Array = new Int32Array(imageDesc.width * imageDesc.height);
			const image = cl.createImage(
				context, cl.MEM_COPY_HOST_PTR, imageFormat, imageDesc, i32Array,
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - cl.MEM_HOST_WRITE_ONLY', () => {
			const image = cl.createImage(
				context, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc,
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - cl.MEM_HOST_READ_ONLY', () => {
			const image = cl.createImage(
				context, cl.MEM_HOST_READ_ONLY, imageFormat, imageDesc,
			);
			cl.releaseMemObject(image);
		});
		
		it('creates an image - cl.MEM_HOST_NO_ACCESS', () => {
			const image = cl.createImage(
				context, cl.MEM_HOST_NO_ACCESS, imageFormat, imageDesc,
			);
			cl.releaseMemObject(image);
		});
		
		it('throws if context is invalid', () => {
			assert.throws(
				() => cl.createImage(
					{} as unknown as cl.TClContext, 0, imageFormat, imageDesc,
				),
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
				() => cl.createImage(
					context, 0, imageFormat, -1 as unknown as cl.TClImageDesc,
				),
				new Error('Argument 3 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_IMAGE_FORMAT_DESCRIPTOR if image_format is invalid', () => {
			assert.throws(
				() => cl.createImage(
					context, 0, -1 as unknown as cl.TClImageFormat, imageDesc,
				),
				new Error('Argument 2 must be of type `Object`'),
			);
		});
	});
	
	describe('#retainMemObject', () => {
		it('retains mem object', () => {
			const buffer = cl.createBuffer(context, 0, 8);
			cl.retainMemObject(buffer);
			const ret = cl.getMemObjectInfo(buffer, cl.MEM_REFERENCE_COUNT);
			assert.strictEqual(ret, 2);
			
			cl.releaseMemObject(buffer);
			cl.releaseMemObject(buffer);
		});
		
		it('throws if mem object is invalid', () => {
			assert.throws(
				() => cl.retainMemObject({} as unknown as cl.TClMem),
			);
		});
	});
	
	describe('#releaseMemObject', () => {
		it('releases mem object', () => {
			const buffer = cl.createBuffer(context, 0, 8);
			cl.releaseMemObject(buffer);
		});
		
		it('throws if mem object is invalid', () => {
			assert.throws(
				() => cl.releaseMemObject({} as unknown as cl.TClMem),
			);
		});
	});
});

import { strict as assert } from 'node:assert';
import { describe, it, after } from 'node:test';
import cl from '../index.js';
import * as U from './utils.ts';


describe('MemObj', () => {
	const { context } = cl.quickStart();
	
	const buffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY, 8, null);
	const format: cl.TClImageFormat = {
		'channel_order': cl.RGBA,
		'channel_data_type': cl.UNSIGNED_INT8,
	};
	const desc: cl.TClImageDesc = {
		type: cl.MEM_OBJECT_IMAGE1D,
		width: 8,
	};
	const image = cl.createImage(
		context,
		cl.MEM_WRITE_ONLY,
		format,
		desc,
	);
	
	after(() => {
		cl.releaseMemObject(image);
		cl.releaseMemObject(buffer);
	});
	
	describe('#getSupportedImageFormats', () => {
		it('obtains supported read-write formats', () => {
			const formats = cl.getSupportedImageFormats(
				context,
				cl.MEM_READ_WRITE,
				cl.MEM_OBJECT_IMAGE2D,
			);
			U.assertType(formats, 'array');
			assert.notEqual(formats.length, 0);
		});
		
		it('obtains supported write-only formats', () => {
			const formats = cl.getSupportedImageFormats(
				context,
				cl.MEM_WRITE_ONLY,
				cl.MEM_OBJECT_IMAGE2D,
			);
			U.assertType(formats, 'array');
			assert.notEqual(formats.length, 0);
		});
		
		it('obtains supported read-only formats', () => {
			const formats = cl.getSupportedImageFormats(
				context,
				cl.MEM_READ_ONLY,
				cl.MEM_OBJECT_IMAGE2D,
			);
			U.assertType(formats, 'array');
			assert.notEqual(formats.length, 0);
		});
		
		it('throws if context is invalid', () => {
			assert.throws(
				() => cl.getSupportedImageFormats(
					buffer as unknown as cl.TClContext, 0, cl.MEM_OBJECT_IMAGE2D,
				),
			);
		});
	});
	
	describe('#getMemObjectInfo', () => {
		it('returns cl.MEM_TYPE', () => {
			const ret = cl.getMemObjectInfo(buffer, cl.MEM_TYPE);
			U.assertType(ret, 'number');
		});
		
		it('returns cl.MEM_FLAGS', () => {
			const ret = cl.getMemObjectInfo(buffer, cl.MEM_FLAGS);
			assert.strictEqual(ret, cl.MEM_WRITE_ONLY);
		});
		
		it('returns cl.MEM_SIZE', () => {
			const ret = cl.getMemObjectInfo(buffer, cl.MEM_SIZE);
			assert.strictEqual(ret, 8);
		});
		
		it('returns cl.MEM_OFFSET', () => {
			const ret = cl.getMemObjectInfo(buffer, cl.MEM_OFFSET);
			assert.strictEqual(ret, 0);
		});
		
		it('returns cl.MEM_MAP_COUNT', () => {
			const ret = cl.getMemObjectInfo(buffer, cl.MEM_MAP_COUNT);
			assert.strictEqual(ret, 0);
		});
		
		it('returns cl.MEM_REFERENCE_COUNT', () => {
			const ret = cl.getMemObjectInfo(buffer, cl.MEM_REFERENCE_COUNT);
			assert.strictEqual(ret, 1);
		});
		
		it('returns cl.MEM_CONTEXT', () => {
			const ret = cl.getMemObjectInfo(buffer, cl.MEM_CONTEXT);
			U.assertType(ret, 'object');
		});
		
		it('returns cl.MEM_HOST_PTR', () => {
			const buffer = cl.createBuffer(context, cl.MEM_ALLOC_HOST_PTR, 8, null);
			const ret = cl.getMemObjectInfo(buffer, cl.MEM_HOST_PTR);
			U.assertType(ret, 'object');
		});
		
		it('returns cl.MEM_CONTEXT', () => {
			const ret = cl.getMemObjectInfo(buffer, cl.MEM_CONTEXT);
			U.assertType(ret, 'object');
		});
		
		it('throws cl.INVALID_MEM_OBJECT if memory object is invalid', () => {
			assert.throws(
				() => cl.getMemObjectInfo(buffer, cl.MEM_ASSOCIATED_MEMOBJECT),
				cl.INVALID_MEM_OBJECT,
			);
		});
	});
	
	describe('#getImageInfo', () => {
		it('returns cl.IMAGE_FORMAT', () => {
			const imageInfo = cl.getImageInfo(image, cl.IMAGE_FORMAT);
			assert.deepStrictEqual(imageInfo, format);
		});
		
		it('returns cl.IMAGE_ELEMENT_SIZE', () => {
			const imageInfo = cl.getImageInfo(image, cl.IMAGE_ELEMENT_SIZE);
			assert.strictEqual(imageInfo, 4);
		});
		
		it('returns cl.IMAGE_ROW_PITCH', () => {
			const imageInfo = cl.getImageInfo(image, cl.IMAGE_ROW_PITCH);
			assert.strictEqual(imageInfo, 32);
		});
		
		it('returns cl.IMAGE_SLICE_PITCH', () => {
			const imageInfo = cl.getImageInfo(image, cl.IMAGE_ROW_PITCH);
			assert.strictEqual(imageInfo, 32);
		});
		
		it('returns cl.IMAGE_WIDTH', () => {
			const imageInfo = cl.getImageInfo(image, cl.IMAGE_WIDTH);
			assert.strictEqual(imageInfo, 8);
		});
		
		it('returns cl.IMAGE_HEIGHT', () => {
			const imageInfo = cl.getImageInfo(image, cl.IMAGE_HEIGHT);
			assert.strictEqual(imageInfo, 0);
		});
		
		it('returns cl.IMAGE_DEPTH', () => {
			const imageInfo = cl.getImageInfo(image, cl.IMAGE_DEPTH);
			assert.strictEqual(imageInfo, 0);
		});
		
		it('returns cl.IMAGE_ARRAY_SIZE', () => {
			const imageInfo = cl.getImageInfo(image, cl.IMAGE_ARRAY_SIZE);
			assert.strictEqual(imageInfo, 0);
		});
		
		it('returns cl.IMAGE_NUM_MIP_LEVELS', () => {
			const imageInfo = cl.getImageInfo(image, cl.IMAGE_NUM_MIP_LEVELS);
			assert.strictEqual(imageInfo, 0);
		});
		
		it('returns cl.IMAGE_NUM_SAMPLES', () => {
			const imageInfo = cl.getImageInfo(image, cl.IMAGE_NUM_SAMPLES);
			assert.strictEqual(imageInfo, 0);
		});
		
		it('returns cl.IMAGE_BUFFER', () => {
			assert.throws(
				() => cl.getImageInfo(image, cl.IMAGE_BUFFER),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_MEM_OBJECT if memory object is not image', () => {
			assert.throws(
				() => cl.getImageInfo(buffer, cl.IMAGE_NUM_SAMPLES),
				cl.INVALID_MEM_OBJECT,
			);
		});
		
		it('throws cl.INVALID_VALUE if param name is not valid ', () => {
			assert.throws(
				() => cl.getImageInfo(image, 0),
				cl.INVALID_VALUE,
			);
		});
	});
});

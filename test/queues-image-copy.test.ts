import { strict as assert } from 'node:assert';
import { describe, it, after } from 'node:test';
import cl from '../index.js';
import * as U from './utils.ts';


const imageFormat = {
	'channel_order': cl.RGBA,
	'channel_data_type': cl.UNSIGNED_INT8,
};

const imageDesc = {
	'type': cl.MEM_OBJECT_IMAGE2D,
	'width': 8,
	'height': 8,
};

const zeroArray = [0, 0, 0];
const validRegion = [8, 8, 1];


describe('CommandQueue - Image Copy', () => {
	const { context, device } = cl.quickStart();
	const cq = U.newQueue(context, device);
	
	after(() => {
		cl.releaseCommandQueue(cq);
	});
	
	describe('#enqueueCopyImage', () => {
		it('works with cl.MEM_READ_WRITE images', () => {
			const image1 = cl.createImage(
				context,
				cl.MEM_READ_WRITE,
				imageFormat,
				imageDesc,
				null
			);
			const image2 = cl.createImage(
				context,
				cl.MEM_READ_WRITE,
				imageFormat,
				imageDesc,
				null
			);
			// command queue, cl_image_src, cl_image_dst, origin_src, origin_dst, region
			const ret = cl.enqueueCopyImage(
				cq,
				image1,
				image2,
				zeroArray,
				zeroArray,
				validRegion
			);

			cl.releaseMemObject(image1);
			cl.releaseMemObject(image2);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('works with write images', () => {
			const image1 = cl.createImage(
				context,
				cl.MEM_HOST_WRITE_ONLY,
				imageFormat,
				imageDesc,
				null
			);
			const image2 = cl.createImage(
				context,
				cl.MEM_HOST_WRITE_ONLY,
				imageFormat,
				imageDesc,
				null
			);
			// command queue, cl_image_src, cl_image_dst, origin_src, origin_dst, region
			const ret = cl.enqueueCopyImage(
				cq,
				image1,
				image2,
				zeroArray,
				zeroArray,
				validRegion
			);

			cl.releaseMemObject(image1);
			cl.releaseMemObject(image2);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('works with read images', () => {
			const image1 = cl.createImage(
				context,
				cl.MEM_HOST_READ_ONLY,
				imageFormat,
				imageDesc,
				null
			);
			const image2 = cl.createImage(
				context,
				cl.MEM_HOST_READ_ONLY,
				imageFormat,
				imageDesc,
				null
			);
			
			const ret = cl.enqueueCopyImage(
				cq,
				image1,
				image2,
				zeroArray,
				zeroArray,
				validRegion
			);

			cl.releaseMemObject(image1);
			cl.releaseMemObject(image2);
			assert.strictEqual(ret, cl.SUCCESS);
		});
	});
	
	describe('#enqueueCopyImageToBuffer', () => {
		it('works with read only buffers', () => {
			const image = cl.createImage(
				context,
				cl.MEM_COPY_HOST_PTR,
				imageFormat,
				imageDesc,
				Buffer.alloc(64)
			);
			const buffer = cl.createBuffer(context, cl.MEM_HOST_READ_ONLY, 64, null);
			
			const ret = cl.enqueueCopyImageToBuffer(
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
		
		it('works with write buffers', () => {
			const image = cl.createImage(
				context,
				cl.MEM_COPY_HOST_PTR,
				imageFormat,
				imageDesc,
				Buffer.alloc(64)
			);
			const buffer = cl.createBuffer(context, cl.MEM_HOST_WRITE_ONLY, 64, null);
			
			const ret = cl.enqueueCopyImageToBuffer(
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
		
		it('works with different values of source and destination offsets', () => {
			const image = cl.createImage(
				context,
				cl.MEM_COPY_HOST_PTR,
				imageFormat,
				imageDesc,
				Buffer.alloc(64)
			);
			const buffer = cl.createBuffer(context, cl.MEM_HOST_READ_ONLY, 64, null);
			
			const ret = cl.enqueueCopyImageToBuffer(
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
		
		it('throws cl.INVALID_VALUE if origin is invalid', () => {
			const image = cl.createImage(
				context,
				cl.MEM_COPY_HOST_PTR,
				imageFormat,
				imageDesc,
				Buffer.alloc(64)
			);
			const buffer = cl.createBuffer(context, cl.MEM_HOST_READ_ONLY, 64, null);
			
			const invalidOrigin = [1, 1, 1];
			assert.throws(
				() => cl.enqueueCopyImageToBuffer(
					cq,
					image,
					buffer,
					invalidOrigin,
					[1, 1, 1],
					2
				),
				cl.INVALID_VALUE,
			);
			
			cl.releaseMemObject(image);
			cl.releaseMemObject(buffer);
		});
		
		it('throws cl.INVALID_VALUE if region is invalid', () => {
			const image = cl.createImage(
				context,
				cl.MEM_COPY_HOST_PTR,
				imageFormat,
				imageDesc,
				Buffer.alloc(64)
			);
			const buffer = cl.createBuffer(context, cl.MEM_HOST_READ_ONLY, 64, null);
			
			const invalidRegion = [1, 1, 2];
			assert.throws(
				() => cl.enqueueCopyImageToBuffer(
					cq,
					image,
					buffer,
					[1, 1, 0],
					invalidRegion,
					2
				),
				cl.INVALID_VALUE,
			);
			
			cl.releaseMemObject(image);
			cl.releaseMemObject(buffer);
		});
	});

	describe('#enqueueCopyBufferToImage', () => {
		it('works with read only buffers', () => {
			const image = cl.createImage(
				context,
				cl.MEM_HOST_READ_ONLY,
				imageFormat,
				imageDesc,
				null
			);
			const buffer = cl.createBuffer(context, cl.MEM_HOST_READ_ONLY, 8, null);
			
			const ret = cl.enqueueCopyBufferToImage(
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
		
		it('works with write buffers', () => {
			const image = cl.createImage(
				context,
				cl.MEM_HOST_WRITE_ONLY,
				imageFormat,
				imageDesc,
				null
			);
			const buffer = cl.createBuffer(context, cl.MEM_HOST_WRITE_ONLY, 8, null);
			
			const ret = cl.enqueueCopyBufferToImage(
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
		
		it('throws cl.INVALID_VALUE if origin is invalid', () => {
			const image = cl.createImage(context, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc, null);
			const buffer = cl.createBuffer(context, cl.MEM_HOST_WRITE_ONLY, 8, null);
			
			const invalidOrigin = [1, 1, 1];
			assert.throws(
				() => cl.enqueueCopyBufferToImage(
					cq,
					buffer,
					image,
					0,
					invalidOrigin,
					[1, 1, 1]
				),
				cl.INVALID_VALUE,
			);
			
			cl.releaseMemObject(image);
			cl.releaseMemObject(buffer);
		});
		
		it('throws cl.INVALID_VALUE if region is invalid', () => {
			const image = cl.createImage(context, cl.MEM_HOST_WRITE_ONLY, imageFormat, imageDesc, null);
			const buffer = cl.createBuffer(context, cl.MEM_HOST_WRITE_ONLY, 8, null);
			
			const invalidRegion = [1, 1, 2];
			assert.throws(
				() => cl.enqueueCopyBufferToImage(
					cq,
					buffer,
					image,
					0,
					[1, 1, 0],
					invalidRegion
				),
				cl.INVALID_VALUE,
			);
			
			cl.releaseMemObject(image);
			cl.releaseMemObject(buffer);
		});
	});

	describe('#enqueueMapImage', () => {
		it('returns a valid buffer', () => {
			const image = cl.createImage(context, 0, imageFormat, imageDesc, null);
			const ret = cl.enqueueMapImage(cq, image, true, cl.MAP_READ, zeroArray, [2, 2, 1]);
			assert.ok(ret.buffer instanceof ArrayBuffer);
			assert.ok(!ret.event);
			U.assertType(ret.image_row_pitch, 'number');
			U.assertType(ret.image_slice_pitch, 'number');
			cl.releaseMemObject(image);
		});
		
		it('returns a valid buffer', () => {
			const image = cl.createImage(context, 0, imageFormat, imageDesc, null);
			const ret = cl.enqueueMapImage(cq, image, true, cl.MAP_WRITE, zeroArray, [2, 2, 1]);
			assert.ok(ret.buffer instanceof ArrayBuffer);
			assert.ok(!ret.event);
			U.assertType(ret.image_row_pitch, 'number');
			U.assertType(ret.image_slice_pitch, 'number');
			cl.releaseMemObject(image);
		});
		
		it('returns a valid buffer', () => {
			const image = cl.createImage(context, 0, imageFormat, imageDesc, null);
			const ret = cl.enqueueMapImage(
				cq,
				image,
				true,
				cl.MAP_WRITE_INVALIDATE_REGION,
				zeroArray,
				[2, 2, 1]
			);
			assert.ok(ret.buffer instanceof ArrayBuffer);
			assert.ok(!ret.event);
			U.assertType(ret.image_row_pitch, 'number');
			U.assertType(ret.image_slice_pitch, 'number');
			cl.releaseMemObject(image);
		});
		
		it('doesnt throw as we are using the pointer from an event', (t, done) => {
			const image = cl.createImage(context, 0, imageFormat, imageDesc, null);
			const ret = cl.enqueueMapImage(
				cq,
				image,
				false,
				cl.MAP_READ,
				zeroArray,
				[2, 2, 1],
			);
			
			assert.ok(ret.buffer instanceof ArrayBuffer);
			assert.ok(ret.event);
			U.assertType(ret.image_row_pitch, 'number');
			U.assertType(ret.image_slice_pitch, 'number');
			
			cl.setEventCallback(
				ret.event,
				cl.COMPLETE,
				() => {
					cl.releaseMemObject(image);
					cl.releaseEvent(ret.event as unknown as cl.TClEvent);
					done();
				},
			);
		});
		
		it('doesnt throw as we are using the pointer from an event', (t, done) => {
			const image = cl.createImage(context, 0, imageFormat, imageDesc, null);
			const ret = cl.enqueueMapImage(
				cq,
				image,
				false,
				cl.MAP_WRITE,
				zeroArray,
				[2, 2, 1],
			);
			
			assert.ok(ret.buffer instanceof ArrayBuffer);
			assert.ok(ret.event);
			U.assertType(ret.image_row_pitch, 'number');
			U.assertType(ret.image_slice_pitch, 'number');
			
			cl.setEventCallback(ret.event, cl.COMPLETE, () => {
				cl.releaseMemObject(image);
				cl.releaseEvent(ret.event as unknown as cl.TClEvent);
				done();
			});
		});
	});
	
	describe('#enqueueMigrateMemObjects', () => {
		it('migrates mem objects with flag cl.MIGRATE_MEM_OBJECT_HOST', () => {
			const image = cl.createImage(
				context,
				cl.MEM_COPY_HOST_PTR,
				imageFormat,
				imageDesc,
				Buffer.alloc(64)
			);
			const buffer = cl.createBuffer(context, cl.MEM_HOST_READ_ONLY, 64, null);
			
			const ret = cl.enqueueMigrateMemObjects(
				cq,
				[image, buffer],
				cl.MIGRATE_MEM_OBJECT_HOST
			);
			
			assert.strictEqual(ret, cl.SUCCESS);
			cl.releaseMemObject(image);
			cl.releaseMemObject(buffer);
		});
		
		it('migrates mem objects with flag cl.MIGRATE_MEM_OBJECT_CONTENT_UNDEFINED', () => {
			const image = cl.createImage(
				context,
				cl.MEM_COPY_HOST_PTR,
				imageFormat,
				imageDesc,
				Buffer.alloc(64)
			);
			const buffer = cl.createBuffer(context, cl.MEM_HOST_READ_ONLY, 64, null);
			
			const ret = cl.enqueueMigrateMemObjects(
				cq,
				[image, buffer],
				cl.MIGRATE_MEM_OBJECT_CONTENT_UNDEFINED
			);
			
			assert.strictEqual(ret, cl.SUCCESS);
			cl.releaseMemObject(image);
			cl.releaseMemObject(buffer);
		});
		
		it('throws cl.INVALID_VALUE if memObjects is null', () => {
			assert.throws(
				() => cl.enqueueMigrateMemObjects(
					cq,
					null as unknown as cl.TClMem[],
					cl.MIGRATE_MEM_OBJECT_CONTENT_UNDEFINED
				),
				new Error('Argument 1 must be of type `Array`'),
			);
		});
		
		it('throws cl.INVALID_MEM_OBJECT', () => {
			const image = cl.createImage(
				context,
				cl.MEM_COPY_HOST_PTR,
				imageFormat,
				imageDesc,
				Buffer.alloc(64)
			);
			
			assert.throws(
				() => cl.enqueueMigrateMemObjects(
					cq,
					[image, null as unknown as cl.TClMem],
					cl.MIGRATE_MEM_OBJECT_CONTENT_UNDEFINED
				),
				cl.INVALID_MEM_OBJECT,
			);
			cl.releaseMemObject(image);
		});
	});
});

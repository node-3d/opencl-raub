'use strict';

const assert = require('node:assert').strict;
const { describe, it, after } = require('node:test');

const cl = require('../');
const U = require('./utils');

const makeCommandQueue = (context, device) => {
	return cl.createCommandQueue(context, device, null);
};


describe('CommandQueue - Buffer', () => {
	const context = U.newContext();
	const cq = U.newQueue(context);
	
	after(() => {
		cl.releaseCommandQueue(cq);
		cl.releaseContext(context);
	});
	
	describe('#enqueueReadBuffer', () => {
		it('works with valid buffers', () => {
			const buffer = cl.createBuffer(context, cl.MEM_READ_ONLY, 8, null);
			const nbuffer = Buffer.alloc(5);
			const ret = cl.enqueueReadBuffer(cq, buffer, true, 0, 8, nbuffer);
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('fails if buffer is null', () => {
			const nbuffer = Buffer.alloc(5);
			assert.throws(
				() => cl.enqueueReadBuffer(cq, null, true, 0, 8, nbuffer),
				new Error('Argument 1 must be of type `Object`'),
			);
		});
		
		it('fails if output buffer is null', () => {
			const buffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY, 8, null);
			assert.throws(
				() => cl.enqueueReadBuffer(cq, buffer, true, 0, 8, null),
				new Error('Argument 5 must be of type `Object`'),
			);
			cl.releaseMemObject(buffer);
		});
		
		it('returns an event', () => {
			const buffer = cl.createBuffer(context, cl.MEM_READ_ONLY, 8, null);
			const nbuffer = Buffer.alloc(5);
			const ret = cl.enqueueReadBuffer(cq, buffer, true, 0, 8, nbuffer, null, true);
			U.assertType(ret, 'object');
			cl.releaseEvent(ret);
			cl.releaseMemObject(buffer);
		});
		
		it('calls cb', (t, done) => {
			U.withAsyncContext((context, device, platform, ctxDone) => {
				const cq = makeCommandQueue(context, device);

				const buffer = cl.createBuffer(context, cl.MEM_READ_ONLY, 8, null);
				const nbuffer = Buffer.alloc(5);
				const ret = cl.enqueueReadBuffer(cq, buffer, true, 0, 8, nbuffer, null, true);

				cl.setEventCallback(ret, cl.COMPLETE, () => {
					cl.releaseEvent(ret);
					cl.releaseMemObject(buffer);
					ctxDone();
					done();
				}, {});
			});
		});
	});
	
	describe('#enqueueReadBufferRect', () => {
		it('works with valid buffers', () => {
			const buffer = cl.createBuffer(context, cl.MEM_READ_ONLY, 200, null);
			const nbuffer = Buffer.alloc(200);
			const ret = cl.enqueueReadBufferRect(
				cq, buffer, true,
				[0, 0, 0], [0, 0, 0], [1, 1, 1],
				2 * 4, 0, 8 * 4, 0, nbuffer,
			);
			
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('fails if buffer is null', () => {
			const nbuffer = Buffer.alloc(5);
			assert.throws(
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
					nbuffer,
				),
				new Error('Argument 1 must be of type `Object`'),
			);
		});
		
		it('fails if output buffer is null', () => {
			const buffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY, 8, null);
			assert.throws(
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
					null,
				),
				new Error('Argument 10 must be of type `Object`'),
			);
			
			cl.releaseMemObject(buffer);
		});
	});
	
	describe('#enqueueWriteBuffer', () => {
		it('works with valid buffers', () => {
			const buffer = cl.createBuffer(context, cl.MEM_READ_ONLY, 8, null);
			const nbuffer = Buffer.alloc(5);
			const ret = cl.enqueueWriteBuffer(cq, buffer, true, 0, 8, nbuffer);
			
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('fails if buffer is null', () => {
			const nbuffer = Buffer.alloc(5);
			assert.throws(
				() => cl.enqueueWriteBuffer(cq, null, true, 0, 8, nbuffer),
				new Error('Argument 1 must be of type `Object`'),
			);
		});
		
		it('fails if output buffer is null', () => {
			const buffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY, 8, null);
			assert.throws(
				() => cl.enqueueWriteBuffer(cq, buffer, true, 0, 8, null),
				new Error('Argument 5 must be of type `Object`'),
			);
					
			cl.releaseMemObject(buffer);
		});
	});
	
	describe('#enqueueWriteBufferRect', () => {
		it('works with valid buffers', () => {
			const buffer = cl.createBuffer(context, cl.MEM_READ_ONLY, 200, null);
			const nbuffer = Buffer.alloc(200);
			const ret = cl.enqueueWriteBufferRect(
				cq, buffer, true,
				[0, 0, 0], [0, 0, 0], [1, 1, 1],
				2 * 4, 0, 8 * 4, 0, nbuffer,
			);
			
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('fails if buffer is null', () => {
			const nbuffer = Buffer.alloc(5);
			assert.throws(
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
					nbuffer,
				),
				new Error('Argument 1 must be of type `Object`'),
			);
		});
		
		it('fails if output buffer is null', () => {
			const buffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY, 8, null);
			assert.throws(
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
					null,
				),
				new Error('Argument 10 must be of type `Object`'),
			);
			
			cl.releaseMemObject(buffer);
		});
	});
	
	describe('#enqueueFillBuffer', () => {
		it('fills a buffer with a scallar integer pattern', () => {
			const array = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
			
			const buffer = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 32, array);
			const ret = cl.enqueueFillBuffer(cq, buffer, 2, 0, 16);
			
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('fills a buffer with a scallar float pattern', () => {
			const array = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
			const buffer = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 32, array);
			const ret = cl.enqueueFillBuffer(cq, buffer, 2.5, 0, 16);
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('fills a buffer with a vector pattern', () => {
			const array = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
			// INTEGER VECTOR
			const pattern = Buffer.from([1, 2]);
			const buffer = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 32, array);
			const ret = cl.enqueueFillBuffer(cq, buffer, pattern, 0, 16);
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('fills a buffer with a vector pattern', () => {
			const array = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
			// FLOAT VECTOR
			const pattern = Buffer.from([1.5, 2.5]);
			const buffer = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 32, array);
			const ret = cl.enqueueFillBuffer(cq, buffer, pattern, 0, 16);
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
	});

	describe('#enqueueCopyBuffer', () => {
		it('works with read only buffers', () => {
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 32, Buffer.alloc(32));
			const dst = cl.createBuffer(context, cl.MEM_READ_ONLY, 8, null);
			const ret = cl.enqueueCopyBuffer(cq, buffer, dst, 0, 0, 8);
			
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('works with write buffers', () => {
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 32, Buffer.alloc(32));
			const dst = cl.createBuffer(context, cl.MEM_WRITE_ONLY, 8, null);
			const ret = cl.enqueueCopyBuffer(cq, buffer, dst, 0, 0, 8);
			
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});

	});
	
	describe('#enqueueCopyBufferRect', () => {
		it('works with read only buffers', () => {
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 32, Buffer.alloc(32));
			const dst = cl.createBuffer(context, cl.MEM_READ_ONLY, 32, null);
			const ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [0, 0, 0], [4, 4, 1],
				0, 0,
				0, 0,
			);
			
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('works with write only buffers', () => {
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 32, Buffer.alloc(32));
			const dst = cl.createBuffer(context, cl.MEM_WRITE_ONLY, 32, null);
			const ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [0, 0, 0], [4, 4, 1],
				0, 0,
				0, 0,
			);
			
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('works with different buffer origin values', () => {
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 64, Buffer.alloc(64));
			const dst = cl.createBuffer(context, cl.MEM_READ_ONLY, 64, null);
			let ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[1, 1, 1], [2, 2, 2], [4, 4, 1],
				0, 0,
				0, 0,
			);
			assert.strictEqual(ret, cl.SUCCESS);
			
			ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[1, 2, 0], [2, 2, 2], [4, 4, 1],
				0, 0,
				0, 0,
			);
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('works with different host origin values', () => {
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 64, Buffer.alloc(64));
			const dst = cl.createBuffer(context, cl.MEM_READ_ONLY, 64, null);
			let ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [1, 1, 0], [4, 4, 1],
				0, 0,
				0, 0,
			);
			assert.strictEqual(ret, cl.SUCCESS);
			
			ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [2, 2, 0], [4, 4, 1],
				0, 0,
				0, 0,
			);
			assert.strictEqual(ret, cl.SUCCESS);
			
			ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [1, 2, 1], [4, 4, 1],
				0, 0,
				0, 0,
			);
					
			cl.releaseMemObject(buffer);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('works with different region values', () => {
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 64, Buffer.alloc(64));
			const dst = cl.createBuffer(context, cl.MEM_READ_ONLY, 64, null);
			let ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [0, 0, 0], [1, 1, 1],
				0, 0,
				0, 0,
			);
			assert.strictEqual(ret, cl.SUCCESS);
			
			ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [0, 0, 0], [1, 4, 1],
				0, 0,
				0, 0,
			);
			assert.strictEqual(ret, cl.SUCCESS);
			
			ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [0, 0, 0], [5, 1, 1],
				0, 0,
				0, 0,
			);
			
			cl.releaseMemObject(buffer);
			
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('works with different row pitch values', () => {
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 64, Buffer.alloc(64));
			const dst = cl.createBuffer(context, cl.MEM_READ_ONLY, 64, null);
			let ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [0, 0, 0], [1, 1, 1],
				1, 0,
				0, 0,
			);
			assert.strictEqual(ret, cl.SUCCESS);
			
			ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [0, 0, 0], [2, 4, 1],
				2, 0,
				0, 0,
			);
			
			cl.releaseMemObject(buffer);
			
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('works with different splice pitch values', () => {
			const buffer = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 64, Buffer.alloc(64));
			const dst = cl.createBuffer(context, cl.MEM_READ_ONLY, 64, null);
			let ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [0, 0, 0], [1, 1, 1],
				1, 2,
				0, 0,
			);
			assert.strictEqual(ret, cl.SUCCESS);
			
			ret = cl.enqueueCopyBufferRect(
				cq, buffer, dst,
				[0, 0, 0], [0, 0, 0], [2, 4, 1],
				2, 2 * 4,
				0, 0,
			);
			
			cl.releaseMemObject(buffer);
			
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('works with different host pointer values', () => {
			const buffer1 = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, 64, Buffer.alloc(64));
			const dst = cl.createBuffer(context, cl.MEM_READ_ONLY, 64, null);
			let ret = cl.enqueueCopyBufferRect(cq, buffer1, dst,
				[0, 0, 0], [0, 0, 0], [2, 4, 1],
				0, 0,
				0, 0,
			);
			assert.strictEqual(ret, cl.SUCCESS);
			
			const buffer2 = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 64, Buffer.alloc(64));
			ret = cl.enqueueCopyBufferRect(cq, buffer2, dst,
				[0, 0, 0], [0, 0, 0], [2, 4, 1],
				0, 0,
				0, 0,
			);
			
			cl.releaseMemObject(buffer1);
			cl.releaseMemObject(dst);
			
			assert.strictEqual(ret, cl.SUCCESS);
		});
	});
	
	describe('# enqueueMapBuffer', () => {
		it('returns a valid buffer', () => {
			const buf = cl.createBuffer(context, cl.MEM_READ_WRITE, 8, null);
			const ret = cl.enqueueMapBuffer(cq, buf, true, cl.MAP_READ, 0, 8,[], false);
			const u8s = new Uint8Array(ret);
			assert.strictEqual(u8s.buffer instanceof ArrayBuffer, true);
			assert.equal(u8s.buffer.byteLength, 8);
			U.assertType(u8s[0], 'number');
		});
		
		it('fails to read from a not-allocated pointer', () => {
			const buf = cl.createBuffer(context, 0, 8, null);
			const ret = cl.enqueueMapBuffer(cq, buf, false, cl.MAP_READ, 0, 8, [], true);
			const u8s = new Uint8Array(ret);
			U.assertType(u8s[0], 'number');
			assert.equal(u8s.buffer.byteLength, 8);
		});
		
		it('doesn\'t throw as we are using the pointer from an event', (t, done) => {
			const buf = cl.createBuffer(context, 0, 8, null);
			const ret = cl.enqueueMapBuffer(cq, buf, false, 0, 0, 8, [], true);
			
			cl.setEventCallback(ret.event, cl.COMPLETE, () => {
				const u8s = new Uint8Array(ret);
				assert.strictEqual(u8s.buffer instanceof ArrayBuffer, true);
				assert.equal(u8s.buffer.byteLength, 8);
				U.assertType(u8s[0], 'number');
				cl.releaseMemObject(buf);
				cl.releaseEvent(ret.event);
				done();
			});
		});
	});
});

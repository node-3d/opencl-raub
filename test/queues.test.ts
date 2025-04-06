import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { describe, it, after } from 'node:test';
import cl from '../index.js';
import * as U from './utils.ts';

const squareKern = fs.readFileSync('test/kernels/square.cl').toString();
const squareOneKern = fs.readFileSync('test/kernels/square_one.cl').toString();


describe('CommandQueue - Common', () => {
	const { context, device } = cl.quickStart();
	const cq = U.newQueue(context, device);
	
	after(() => {
		cl.releaseCommandQueue(cq);
	});
	
	describe('#createCommandQueue', () => {
		it('fails given an invalid property', () => {
			assert.throws(
				() => cl.createCommandQueue(context, device, -1),
			);
		});
		
		it('fails given an invalid device', () => {
			assert.throws(
				() => cl.createCommandQueue(context, 'test' as unknown as cl.TClDevice),
				new Error('Argument 1 must be of type `Object`'),
			);
		});
	});
	
	describe('#retainCommandQueue', () => {
		it('increments ref count', () => {
			const cq = U.newQueue(context, device);
			cl.retainCommandQueue(cq);
			const after = cl.getCommandQueueInfo(cq, cl.QUEUE_REFERENCE_COUNT);
			assert.strictEqual(after, 2);
			cl.releaseCommandQueue(cq);
			cl.releaseCommandQueue(cq);
		});
	});
	
	describe('#releaseCommandQueue', () => {
		it('decrements ref count', () => {
			const cq = U.newQueue(context, device);
			cl.retainCommandQueue(cq);
			cl.releaseCommandQueue(cq);
			const after = cl.getCommandQueueInfo(cq, cl.QUEUE_REFERENCE_COUNT);
			assert.strictEqual(after, 1);
		});
	});
	
	describe('#getCommandQueueInfo', () => {
		it('returns info for QUEUE_REFERENCE_COUNT', () => {
			const val = cl.getCommandQueueInfo(cq, cl.QUEUE_REFERENCE_COUNT);
			U.assertType(val, 'number');
		});
		it('returns info for QUEUE_CONTEXT', () => {
			const val = cl.getCommandQueueInfo(cq, cl.QUEUE_CONTEXT);
			U.assertType(val, 'object');
		});
		it('returns info for QUEUE_DEVICE', () => {
			const val = cl.getCommandQueueInfo(cq, cl.QUEUE_DEVICE);
			U.assertType(val, 'object');
		});
		it('returns info for QUEUE_PROPERTIES', () => {
			const val = cl.getCommandQueueInfo(cq, cl.QUEUE_PROPERTIES);
			U.assertType(val, 'number');
		});
	});
	
	describe('#flush', () => {
		it('returns success', () => {
			assert.strictEqual(cl.flush(cq), cl.SUCCESS);
		});
	});
	
	describe('#finish', () => {
		it('returns success', () => {
			assert.strictEqual(cl.finish(cq), cl.SUCCESS);
		});
	});
	
	describe('#enqueueUnmapMemObject', () => {
		it('throws as we are unmapping a non mapped memobject', () => {
			const buf = cl.createBuffer(context, 0, 8, null);
			assert.throws(
				() => cl.enqueueUnmapMemObject(cq, buf, Buffer.alloc(5)),
			);
			cl.releaseMemObject(buf);
		});
		
		it('returns void', () => {
			const buf = cl.createBuffer(context, 0, 8, null);
			const mapped = cl.enqueueMapBuffer(cq, buf, true, cl.MAP_READ, 0, 8);
			const res = cl.enqueueUnmapMemObject(cq, buf, mapped.buffer);
			assert.equal(res, undefined);
			cl.releaseMemObject(buf);
		});
	});

	describe('#enqueueNDRangeKernel', () => {
		const inputs = Buffer.alloc(10000 * 4);
		const outputs = Buffer.alloc(10000 * 4);
		
		for (let i = 0; i < 10000; ++i) {
			inputs.writeUInt32LE(i, i * 4);
		}
		
		it('throws with a valid call but with no bound args', () => {
			U.withProgram(context, squareKern, (prg) => {
				cl.buildProgram(prg);
				const kern = cl.createKernel(prg, 'square');
				
				const inputsMem = cl.createBuffer(
					context, cl.MEM_COPY_HOST_PTR, 10000 * 4, inputs
				);
				const outputsMem = cl.createBuffer(
					context, cl.MEM_COPY_HOST_PTR, 10000 * 4, outputs
				);
				
				cl.setKernelArg(kern, 0, 'uint*', inputsMem);
				cl.setKernelArg(kern, 1, 'uint*', outputsMem);
				cl.setKernelArg(kern, 2, 'uint', 10000);
				
				cl.enqueueNDRangeKernel(cq, kern, 1, null, [100]);
				
				cl.releaseMemObject(inputsMem);
				cl.releaseMemObject(outputsMem);
				cl.releaseKernel(kern);
			});
		});
		
		it('fails if kern is invalid', () => {
			U.withProgram(context, squareKern, (prg) => {
				assert.throws(
					() => cl.enqueueNDRangeKernel(
						cq,
						null as unknown as cl.TClKernel,
						1,
						null,
						[100],
					),
					new Error('Argument 1 must be of type `Object`'),
				);
			});
		});
		
		it('fails if given dimensions does not match arrays', () => {
			U.withProgram(context, squareKern, (prg) => {
				cl.buildProgram(prg);
				const kern = cl.createKernel(prg, 'square');
				
				const inputsMem = cl.createBuffer(
					context, cl.MEM_COPY_HOST_PTR, 10000 * 4, inputs,
				);
				const outputsMem = cl.createBuffer(
					context, cl.MEM_COPY_HOST_PTR, 10000 * 4, outputs,
				);
				
				cl.setKernelArg(kern, 0, 'uint*', inputsMem);
				cl.setKernelArg(kern, 1, 'uint*', outputsMem);
				cl.setKernelArg(kern, 2, 'uint', 10000);
				assert.throws(
					() => cl.enqueueNDRangeKernel(
						cq,
						kern,
						1,
						null,
						[100, 200],
					),
					cl.INVALID_GLOBAL_WORK_SIZE,
				);
				
				cl.releaseMemObject(inputsMem);
				cl.releaseMemObject(outputsMem);
				cl.releaseKernel(kern);
			});
		});
	});
	
	describe('#enqueueTask', () => {
		it('works with a valid call', () => {
			U.withProgram(context, squareOneKern, (prg) => {
				cl.buildProgram(prg);
				const kern = cl.createKernel(prg, 'square_one');
				
				const outputsMem = cl.createBuffer(
					context, cl.MEM_WRITE_ONLY, 4, null,
				);
				
				cl.setKernelArg(kern, 0, 'uint*', outputsMem);
				cl.setKernelArg(kern, 1, 'uint', 9);
				
				cl.enqueueTask(cq, kern);
				
				const ret = cl.enqueueMapBuffer(cq, outputsMem, true, cl.MAP_READ, 0, 4);
				const outputs = new Uint32Array(ret.buffer);
				assert.ok(!ret.event);
				assert.strictEqual(81, outputs[0]);
				
				cl.releaseMemObject(outputsMem);
				cl.releaseKernel(kern);
			});
		});
		
		it('fails if kern is invalid', () => {
			assert.throws(
				() => cl.enqueueTask(cq, null as unknown as cl.TClKernel),
				new Error('Argument 1 must be of type `Object`'),
			);
		});
	});
	
	describe('#enqueueNativeKernel', () => {
		it('throws because not implemented', () => {
			assert.throws(() => cl.enqueueNativeKernel());
		});
	});
	
	describe('#enqueueMarkerWithWaitList', () => {
		it('enqueues marker with event wait list', () => {
			const array = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
			
			const buffer = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 32, array);
			const event = cl.enqueueFillBuffer(
				cq, buffer, Buffer.from([1, 2]), 0, 16, null, true,
			) as cl.TClEvent;
			
			const ret = cl.enqueueMarkerWithWaitList(cq, [event]);
			U.assertType(ret, 'object');
			
			cl.setEventCallback(ret, cl.COMPLETE, () => {
				cl.releaseMemObject(buffer);
				cl.releaseEvent(ret);
				cl.releaseEvent(event);
			});
		});
	});
	
	describe('#enqueueBarrierWithWaitList', () => {
		it('enqueues barrier with event wait list', () => {
			const array = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]);
			
			const buffer = cl.createBuffer(context, cl.MEM_USE_HOST_PTR, 32, array);
			const event = cl.enqueueFillBuffer(
				cq, buffer, Buffer.from([1, 2]), 0, 16, null, true,
			) as cl.TClEvent;
			
			const ret = cl.enqueueBarrierWithWaitList(cq, [event], true) as cl.TClEvent;
			U.assertType(ret, 'object');
			
			cl.setEventCallback(ret, cl.COMPLETE, () => {
				cl.releaseMemObject(buffer);
				cl.releaseEvent(ret);
				cl.releaseEvent(event);
			});
		});
	});
});

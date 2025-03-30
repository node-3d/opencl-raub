'use strict';

const cl = require('../');


const platform = cl.getPlatformIDs()[0];
const devices = cl.getDeviceIDs(platform, cl.DEVICE_TYPE_ALL);
const context = cl.createContext([cl.CONTEXT_PLATFORM, platform], devices);
const device = cl.getContextInfo(context, cl.CONTEXT_DEVICES)[0];
const queue = cl.createCommandQueue(context, device, null);

const BUFFER_SIZE = 10;
const BYTE_SIZE = BUFFER_SIZE * Uint32Array.BYTES_PER_ELEMENT;

const arrayA = new Uint32Array(BUFFER_SIZE);
const arrayB = new Uint32Array(BUFFER_SIZE);
const arrayC = new Uint32Array(BUFFER_SIZE);

for (let i = 0; i < BUFFER_SIZE; i++) {
	arrayA[i] = i;
	arrayB[i] = i * 2;
}

// Create buffer for arrayA and arrayB and copy host contents
const bufferA = cl.createBuffer(context, cl.MEM_READ_ONLY, BYTE_SIZE);
const bufferB = cl.createBuffer(context, cl.MEM_READ_ONLY, BYTE_SIZE);

// Create buffer for arrayC to read results
const bufferC = cl.createBuffer(context, cl.MEM_WRITE_ONLY, BYTE_SIZE);

// Create a program object
const program = cl.createProgramWithSource(context, `
	__kernel void vadd(__global int *a, __global int *b, __global int *c, uint num) {
		size_t i = get_global_id(0);
		if(i >= num) return;
		c[i] = a[i] + b[i];
	}
`);
cl.buildProgram(program);

// Create a kernel object
const kernel = cl.createKernel(program, 'vadd');

// Set kernel args
cl.setKernelArg(kernel, 0, 'uint*', bufferA);
cl.setKernelArg(kernel, 1, 'uint*', bufferB);
cl.setKernelArg(kernel, 2, 'uint*', bufferC);
cl.setKernelArg(kernel, 3, 'uint', BUFFER_SIZE);

// Do the work
cl.enqueueWriteBuffer(queue, bufferA, true, 0, BYTE_SIZE, arrayA);
cl.enqueueWriteBuffer(queue, bufferB, true, 0, BYTE_SIZE, arrayB);
cl.enqueueNDRangeKernel(queue, kernel, 1, null, [BUFFER_SIZE], null);
cl.enqueueReadBuffer(queue, bufferC, true, 0, BYTE_SIZE, arrayC);

// print results
console.log(`A = [${arrayA.join(', ')}]`);
console.log(`B = [${arrayB.join(', ')}]`);
console.log(`C = [${arrayC.join(', ')}]`);

// Cleanup - release each CL object
cl.releaseCommandQueue(queue);
cl.releaseKernel(kernel);
cl.releaseProgram(program);
cl.releaseMemObject(bufferA);
cl.releaseMemObject(bufferB);
cl.releaseMemObject(bufferC);
cl.releaseContext(context);

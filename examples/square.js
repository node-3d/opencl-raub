'use strict';

const cl = require('../');

const fs = require('node:fs');


console.log('Using Buffer');

const platform = cl.getPlatformIDs()[0];
const ctx = cl.createContext(
	[cl.CONTEXT_PLATFORM, platform],
	[cl.getDeviceIDs(platform, cl.DEVICE_TYPE_ALL)[0]]
);

const NVALUES = 100;
const BYTES_PER_ELEMENT = Uint32Array.BYTES_PER_ELEMENT;

const inputs = Buffer.alloc(NVALUES * BYTES_PER_ELEMENT); // *4 because uint is 4 bytes.
const outputs = Buffer.alloc(NVALUES * BYTES_PER_ELEMENT);
outputs.fill(0);

// Note: using little endian for Intel-based machines, GPU follows same convention
// as CPU typically but it should be detected with clGetDeviceInfo(CL_DEVICE_ENDIAN_LITTLE)

for (let i = 0; i < NVALUES; ++i) {
	inputs.writeUInt32LE(i, i * BYTES_PER_ELEMENT);
	// inputs[offset]=i with offset=i*4 since each uint32 value takes 4 bytes
}

const source = fs.readFileSync(__dirname + '/square.cl').toString();

const prog = cl.createProgramWithSource(ctx, source);

cl.buildProgram(prog);

const kern = cl.createKernel(prog, 'square');

const inputsMem = cl.createBuffer(
	ctx,
	cl.MEM_READ_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	inputs
);
const outputsMem = cl.createBuffer(
	ctx,
	cl.MEM_WRITE_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	outputs
);

cl.setKernelArg(kern, 0, 'uint*', inputsMem);
cl.setKernelArg(kern, 1, 'uint*', outputsMem);
cl.setKernelArg(kern, 2, 'uint', NVALUES);

const device = cl.getContextInfo(ctx, cl.CONTEXT_DEVICES)[0];
let cq;
if (cl.createCommandQueueWithProperties !== undefined) {
	cq = cl.createCommandQueueWithProperties(ctx, device, []); // OpenCL 2
} else {
	cq = cl.createCommandQueue(ctx, device, null); // OpenCL 1.x
}

cl.enqueueNDRangeKernel(cq, kern, 1, null, [NVALUES], null);

cl.enqueueReadBuffer(cq, outputsMem, true, 0, NVALUES * BYTES_PER_ELEMENT, outputs);
// contains i^2 for i=0,..., 10000-1

cl.finish(cq);

console.log('#elems in outputs: ' + outputs.length);
const lastValue = outputs.readUInt32LE(BYTES_PER_ELEMENT * (NVALUES - 1));
console.log('Last value is : ' + lastValue + ' should be ' + ((NVALUES - 1) * (NVALUES - 1)));

console.log('Using TypedArrays');


const inputs2 = new Uint32Array(NVALUES);
const outputs2 = new Uint32Array(NVALUES);
outputs2.fill(0);

for (let i = 0; i < NVALUES; ++i) {
	inputs2[i] = i;
}

const prog2 = cl.createProgramWithSource(ctx, source);

cl.buildProgram(prog2);

const kern2 = cl.createKernel(prog2, 'square');

const inputsMem2 = cl.createBuffer(
	ctx,
	cl.MEM_READ_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	inputs2
);
const outputsMem2 = cl.createBuffer(
	ctx,
	cl.MEM_WRITE_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	outputs2
);

cl.setKernelArg(kern2, 0, 'uint*', inputsMem2);
cl.setKernelArg(kern2, 1, 'uint*', outputsMem2);
cl.setKernelArg(kern2, 2, 'uint', NVALUES);

cl.enqueueNDRangeKernel(cq, kern2, 1, null, [NVALUES], null);

cl.enqueueReadBuffer(cq, outputsMem2, true, 0, NVALUES * BYTES_PER_ELEMENT, outputs2);
// contains i^2 for i=0,..., 10000-1

cl.finish(cq);

console.log('#elems in outputs2: ' + outputs2.length);
const lastValue2 = outputs2[NVALUES - 1];
console.log('Last value is : ' + lastValue2 + ' should be ' + ((NVALUES - 1) * (NVALUES - 1)));

console.log('DONE');

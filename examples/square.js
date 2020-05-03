'use strict';

const cl = require('../');

let fs = require('fs');


console.log('Using Buffer');

let platform = cl.getPlatformIDs()[0];
const ctx = cl.createContext(
	[cl.CONTEXT_PLATFORM, platform],
	[cl.getDeviceIDs(platform, cl.DEVICE_TYPE_ALL)[0]]
);

let NVALUES = 100;
let BYTES_PER_ELEMENT = Uint32Array.BYTES_PER_ELEMENT;

let inputs = Buffer.alloc(NVALUES * BYTES_PER_ELEMENT); // *4 because uint is 4 bytes.
let outputs = Buffer.alloc(NVALUES * BYTES_PER_ELEMENT);
outputs.fill(0);

// Note: using little endian for Intel-based machines, GPU follows same convention
// as CPU typically but it should be detected with clGetDeviceInfo(CL_DEVICE_ENDIAN_LITTLE)

for (let i = 0; i < NVALUES; ++i) {
	inputs.writeUInt32LE(i, i * BYTES_PER_ELEMENT);
	// inputs[offset]=i with offset=i*4 since each uint32 value takes 4 bytes
}

let source = fs.readFileSync(__dirname + '/square.cl').toString();

let prog = cl.createProgramWithSource(ctx, source);

cl.buildProgram(prog);

let kern = cl.createKernel(prog, 'square');

let inputsMem = cl.createBuffer(
	ctx,
	cl.MEM_READ_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	inputs
);
let outputsMem = cl.createBuffer(
	ctx,
	cl.MEM_WRITE_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	outputs
);

cl.setKernelArg(kern, 0, 'uint*', inputsMem);
cl.setKernelArg(kern, 1, 'uint*', outputsMem);
cl.setKernelArg(kern, 2, 'uint', NVALUES);

let device = cl.getContextInfo(ctx, cl.CONTEXT_DEVICES)[0];
let cq;
if (cl.createCommandQueueWithProperties !== undefined) {
	cq = cl.createCommandQueueWithProperties(ctx, device, []); // OpenCL 2
} else {
	cq = cl.createCommandQueue(ctx, device, null); // OpenCL 1.x
}

cl.enqueueNDRangeKernel(cq, kern, 1, null, [NVALUES], null);

cl.enqueueReadBuffer(cq, outputsMem, true, 0, NVALUES * BYTES_PER_ELEMENT, outputs);
// should contains i^2 for i=0,..., 10000-1

cl.finish(cq);

console.log('#elems in outputs: ' + outputs.length);
let lastValue = outputs.readUInt32LE(BYTES_PER_ELEMENT * (NVALUES - 1));
console.log('Last value is : ' + lastValue + ' should be ' + ((NVALUES - 1) * (NVALUES - 1)));

console.log('Using TypedArrays');


let inputs2 = new Uint32Array(NVALUES);
let outputs2 = new Uint32Array(NVALUES);
outputs2.fill(0);

for (let i = 0; i < NVALUES; ++i) {
	inputs2[i] = i;
}

let prog2 = cl.createProgramWithSource(ctx, source);

cl.buildProgram(prog2);

let kern2 = cl.createKernel(prog2, 'square');

let inputsMem2 = cl.createBuffer(
	ctx,
	cl.MEM_READ_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	inputs2
);
let outputsMem2 = cl.createBuffer(
	ctx,
	cl.MEM_WRITE_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	outputs2
);

cl.setKernelArg(kern2, 0, 'uint*', inputsMem2);
cl.setKernelArg(kern2, 1, 'uint*', outputsMem2);
cl.setKernelArg(kern2, 2, 'uint', NVALUES);

cl.enqueueNDRangeKernel(cq, kern2, 1, null, [NVALUES], null);

cl.enqueueReadBuffer(cq, outputsMem2, true, 0, NVALUES * BYTES_PER_ELEMENT, outputs2);
// should contains i^2 for i=0,..., 10000-1

cl.finish(cq);

console.log('#elems in outputs2: ' + outputs2.length);
let lastValue2 = outputs2[NVALUES - 1];
console.log('Last value is : ' + lastValue2 + ' should be ' + ((NVALUES - 1) * (NVALUES - 1)));

console.log('DONE');

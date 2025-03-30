'use strict';

const cl = require('../');

const fs = require('node:fs');


let ctx;
if (cl.createContextFromType !== undefined) {
	ctx = cl.createContextFromType(
		[cl.CONTEXT_PLATFORM, cl.getPlatformIDs()[0]], cl.DEVICE_TYPE_ALL, null, null);
}
else {
	const platform = cl.getPlatformIDs()[0];
	ctx = cl.createContext(
		[cl.CONTEXT_PLATFORM, platform],
		[cl.getDeviceIDs(platform, cl.DEVICE_TYPE_ALL)[0]]);
}

const NVALUES = 100;
const inputs = Buffer.alloc(NVALUES * 4);
const outputs = Buffer.alloc(NVALUES * 4);

for (let i = 0; i < NVALUES; ++i) {
	inputs.writeUInt32LE(i, i * 4);
}

const source = fs.readFileSync(__dirname + '/square.cl').toString();

const prog = cl.createProgramWithSource(ctx, source);

cl.buildProgram(prog);

const kern = cl.createKernel(prog, 'square');

const inputsMem = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, NVALUES * 4, inputs);
const outputsMem = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, NVALUES * 4, outputs);

cl.setKernelArg(kern, 0, 'uint*', inputsMem);
cl.setKernelArg(kern, 1, 'uint*', outputsMem);
cl.setKernelArg(kern, 2, 'uint', NVALUES);

const device = cl.getContextInfo(ctx, cl.CONTEXT_DEVICES)[0];
let cq;
if (cl.createCommandQueueWithProperties !== undefined) {
	cq = cl.createCommandQueueWithProperties(ctx, device, []);
} else {
	cq = cl.createCommandQueue(ctx, device, null);
}

// WARNING: non standard
// by using arg[7]=true, enqueueXXX() returns a user event

// here returned user event is not used
cl.enqueueNDRangeKernel(cq, kern, 1, null, [NVALUES], null, [], true);

// here we use the returned user event to associate a callback that will be called from OpenCL
// once read buffer is complete.
const ev = cl.enqueueReadBuffer(cq, outputsMem, true, 0, NVALUES * 4, outputs, [], true);

cl.setEventCallback(ev, cl.COMPLETE, () => {
	console.log('\nASYNC EVENT: Last value is : ' + outputs.readUInt32LE(4 * (NVALUES - 1)));
	process.exit();
});


// Main thread will always finish before CL callbacks are finished.
// Calling process.exit() in the main thread would skip CL callbacks from executing
console.log('SYNC DONE');

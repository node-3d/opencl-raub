'use strict';

const cl = require('../');

let fs = require('fs');


let ctx;
if (cl.createContextFromType !== undefined) {
	ctx = cl.createContextFromType(
		[cl.CONTEXT_PLATFORM, cl.getPlatformIDs()[0]], cl.DEVICE_TYPE_ALL, null, null);
}
else {
	let platform = cl.getPlatformIDs()[0];
	ctx = cl.createContext(
		[cl.CONTEXT_PLATFORM, platform],
		[cl.getDeviceIDs(platform, cl.DEVICE_TYPE_ALL)[0]]);
}

let NVALUES = 100;
let inputs = new Buffer.alloc(NVALUES * 4);
let outputs = new Buffer.alloc(NVALUES * 4);

for (let i = 0; i < NVALUES; ++i) {
	inputs.writeUInt32LE(i, i * 4);
}

let source = fs.readFileSync(__dirname + '/square.cl').toString();

let prog = cl.createProgramWithSource(ctx, source);

cl.buildProgram(prog);

let kern = cl.createKernel(prog, 'square');

let inputsMem = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, NVALUES * 4, inputs);
let outputsMem = cl.createBuffer(ctx, cl.MEM_COPY_HOST_PTR, NVALUES * 4, outputs);

cl.setKernelArg(kern, 0, 'uint*', inputsMem);
cl.setKernelArg(kern, 1, 'uint*', outputsMem);
cl.setKernelArg(kern, 2, 'uint', NVALUES);

let device = cl.getContextInfo(ctx, cl.CONTEXT_DEVICES)[0];
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
let ev = cl.enqueueReadBuffer(cq, outputsMem, true, 0, NVALUES * 4, outputs, [], true);

cl.setEventCallback(ev, cl.COMPLETE, function () {
	console.log('\nLast value is : ' + outputs.readUInt32LE(4 * (NVALUES - 1)));

	// now the program can end
	console.log('== CL callback thread terminated ==');
	process.exit();
});


// Main thread will always finish before CL callbacks are finished.
// Calling process.exit() in the main thread would skip CL callbacks from executing
console.log('DONE');

'use strict';

const cl = require('../');


const getEventExecTime = event => {
	// times are 64-bit values in nanoseconds. They are returned as [hi,lo] a 2-integer array
	// here we use the lo parts since this example is unlikely to go beyond 2^31 nanseconds per event.
	let startTime = cl.getEventProfilingInfo (event, cl.PROFILING_COMMAND_START);
	let endTime = cl.getEventProfilingInfo (event, cl.PROFILING_COMMAND_END);

	return (endTime[1] - startTime[1]) * 1e-6; // report in millisecond (from nanoseconds)
};

let VECTOR_SIZE = 512 * 1024;

console.log('SAXPY with vector size: ' + VECTOR_SIZE + ' elements');

let alpha = 2.0;
let A = new Float32Array(VECTOR_SIZE),
	B = new Float32Array(VECTOR_SIZE),
	C = new Float32Array(VECTOR_SIZE);

for (let i = 0; i < VECTOR_SIZE; i++) {
	A[i] = i;
	B[i] = (VECTOR_SIZE - i);
	C[i] = 0;
}

// create GPU context for this platform
let context;
if (cl.createContextFromType !== undefined) {
	context = cl.createContextFromType(
		[cl.CONTEXT_PLATFORM, cl.getPlatformIDs()[0]],
		cl.DEVICE_TYPE_GPU,
		null, null);
}
else {
	let platform = cl.getPlatformIDs()[0];
	let devices = cl.getDeviceIDs(platform, cl.DEVICE_TYPE_GPU);
	console.info('Found ' + devices.length + ' GPUs: ');
	let device = devices[0];
	for (let i = 0;i < devices.length;i++) {
		let name = cl.getDeviceInfo(devices[i],cl.DEVICE_NAME);
		console.info('  Devices ' + i + ': ' + name);
		if (name.indexOf('Intel') == -1) // prefer discrete GPU
			device = devices[i];
	}

	context = cl.createContext(
		[cl.CONTEXT_PLATFORM, platform],
		[device]);
}

let device = cl.getContextInfo(context, cl.CONTEXT_DEVICES)[0];
console.log('using device: ' + cl.getDeviceInfo(device, cl.DEVICE_NAME));

// Create command queue
let queue;
if (cl.createCommandQueueWithProperties !== undefined) {
	queue = cl.createCommandQueueWithProperties(context, device, [
		cl.QUEUE_PROPERTIES, cl.QUEUE_PROFILING_ENABLE
	]); // OpenCL 2
} else {
	queue = cl.createCommandQueue(context, device, cl.QUEUE_PROFILING_ENABLE); // OpenCL 1.x
}

let saxpyKernelSource = [
	'__kernel                             ',
	'void saxpy_kernel(float alpha,       ',
	'                  __global float *A, ',
	'                  __global float *B, ',
	'                  __global float *C) ',
	'{                                    ',
	'    int idx = get_global_id(0);      ',
	'    C[idx] = alpha* A[idx] + B[idx]; ',
	'}                                    ',
].join('\n');

//Create and program from source
let program = cl.createProgramWithSource(context, saxpyKernelSource);

//Build program
cl.buildProgram(program);

let size = VECTOR_SIZE * Float32Array.BYTES_PER_ELEMENT; // size in bytes

// Create buffer for A and B and copy host contents
let aBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY, size);
let bBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY, size);

// Create buffer for C to read results
let cBuffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY, size);

// Create kernel object
let kernel;
try {
	kernel = cl.createKernel(program, 'saxpy_kernel');
}
catch (err) {
	console.console.log(program.getBuildInfo(device,cl.PROGRAM_BUILD_LOG));
}

// Set kernel args
cl.setKernelArg(kernel, 0, 'float', alpha);
cl.setKernelArg(kernel, 1, 'float*', aBuffer);
cl.setKernelArg(kernel, 2, 'float*', bBuffer);
cl.setKernelArg(kernel, 3, 'float*', cBuffer);

// Do the work
let writeEvents = [];
writeEvents[0] = cl.enqueueWriteBuffer (queue, aBuffer, false, 0, size, A, null, true);
writeEvents[1] = cl.enqueueWriteBuffer (queue, bBuffer, false, 0, size, B, null, true);

// Execute (enqueue) kernel
let localWS = null; // process one list at a time
let globalWS = [VECTOR_SIZE]; // process entire list

let kernelEvent = cl.enqueueNDRangeKernel(queue, kernel, 1, null, globalWS, localWS, writeEvents, true);

// get results and block while getting them
let readEvent = cl.enqueueReadBuffer (queue, cBuffer, false, 0, size, C, [kernelEvent], true);

cl.waitForEvents([readEvent]);
// cl.finish(queue);
console.log('C[last_value]=' + C[VECTOR_SIZE - 1] + ' should be ' + (2 * (VECTOR_SIZE - 1) + 1));

// get all event statistics
console.log('Time to transfer matrix A: ' + getEventExecTime(writeEvents[0]) + ' ms');
console.log('Time to transfer matrix B: ' + getEventExecTime(writeEvents[1]) + ' ms');
console.log('Time to execute SAXPY kernel: ' + getEventExecTime(kernelEvent) + ' ms');
console.log('Time to read matrix C: ' + getEventExecTime(readEvent) + ' ms');

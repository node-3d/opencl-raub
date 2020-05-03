'use strict';

const cl = require('../');


const BUFFER_SIZE = 10;


const printResults = (A, B, C) => {
	// Print input vectors and result vector
	let output = '\nA = ';
	for (let i = 0; i < BUFFER_SIZE; i++) {
		output += A[i] + ', ';
	}
	output += '\nB = ';
	for (let i = 0; i < BUFFER_SIZE; i++) {
		output += B[i] + ', ';
	}
	output += '\nC = ';
	for (let i = 0; i < BUFFER_SIZE; i++) {
		output += C[i] + ', ';
	}

	console.log(output);
};


const A = new Uint32Array(BUFFER_SIZE);
const B = new Uint32Array(BUFFER_SIZE);

for (let i = 0; i < BUFFER_SIZE; i++) {
	A[i] = i;
	B[i] = i * 2;
}

const platforms = cl.getPlatformIDs();
for (let i = 0;i < platforms.length;i++)
	console.log('Platform ' + i + ': ' + cl.getPlatformInfo(platforms[i], cl.PLATFORM_NAME));
let platform = platforms[0];
console.log('platform', platform);

const devices = cl.getDeviceIDs(platform, cl.DEVICE_TYPE_ALL);
for (let i = 0;i < devices.length;i++)
	console.log('  Devices ' + i + ': ' + cl.getDeviceInfo(devices[i], cl.DEVICE_NAME));

console.log('creating context');

// let context = cl.createContextFromType(
//   [cl.CONTEXT_PLATFORM, platform],
//   cl.DEVICE_TYPE_GPU);
const context = cl.createContext([cl.CONTEXT_PLATFORM, platform], devices);

console.log('created context');

const kernelSourceCode = [
	'__kernel void vadd(__global int *a, __global int *b, __global int *c, uint iNumElements) ',
	'{                                                                           ',
	'    size_t i =  get_global_id(0);                                           ',
	'    if(i >= iNumElements) return;                                           ',
	'    c[i] = a[i] + b[i];                                                     ',
	'}                                                                           '
].join('\n');

//Create and program from source
const program = cl.createProgramWithSource(context, kernelSourceCode);

//Build program
cl.buildProgram(program);

const size = BUFFER_SIZE * Uint32Array.BYTES_PER_ELEMENT; // size in bytes

// Create buffer for A and B and copy host contents
const aBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY, size);
const bBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY, size);

// Create buffer for C to read results
const cBuffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY, size);

const device = cl.getContextInfo(context, cl.CONTEXT_DEVICES)[0];

// Create kernel object
let kernel;
try {
	kernel = cl.createKernel(program, 'vadd');
} catch (err) {
	console.error(cl.getProgramBuildInfo(program, device, cl.PROGRAM_BUILD_LOG));
	process.exit(-1);
}

// Set kernel args
cl.setKernelArg(kernel, 0, 'uint*', aBuffer);
cl.setKernelArg(kernel, 1, 'uint*', bBuffer);
cl.setKernelArg(kernel, 2, 'uint*', cBuffer);
cl.setKernelArg(kernel, 3, 'uint', BUFFER_SIZE);

// Create command queue
let queue = cl.createCommandQueue(context, device, null);

// Do the work
cl.enqueueWriteBuffer (queue, aBuffer, true, 0, A.length * Uint32Array.BYTES_PER_ELEMENT, A);
cl.enqueueWriteBuffer (queue, bBuffer, true, 0, B.length * Uint32Array.BYTES_PER_ELEMENT, B);

// Execute (enqueue) kernel
console.log('using enqueueNDRangeKernel');
cl.enqueueNDRangeKernel(queue, kernel, 1,
	null,
	[BUFFER_SIZE],
	null);

// get results and block while getting them
const C = new Uint32Array(BUFFER_SIZE);
cl.enqueueReadBuffer (queue, cBuffer, true, 0, C.length * Uint32Array.BYTES_PER_ELEMENT, C);

// print results
printResults(A, B, C);

// cleanup
// test release each CL object
cl.releaseCommandQueue(queue);
cl.releaseKernel(kernel);
cl.releaseProgram(program);
cl.releaseMemObject(aBuffer);
cl.releaseMemObject(bBuffer);
cl.releaseMemObject(cBuffer);
cl.releaseContext(context);

// test release all CL objects
// cl.releaseAll();

// if no manual cleanup specified, cl.releaseAll() is called at exit of program

console.log('DONE');

'use strict';

const cl = require('../');


let BUFFER_SIZE = 10;

const printResults = (A,B,C) => {
	//Print input vectors and result vector
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

let A = new Uint32Array(BUFFER_SIZE);
let B = new Uint32Array(BUFFER_SIZE);
let C = new Uint32Array(BUFFER_SIZE);

for (let i = 0; i < BUFFER_SIZE; i++) {
	A[i] = i;
	B[i] = i * 2;
	C[i] = 10;
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

let devices = cl.getContextInfo(context, cl.CONTEXT_DEVICES);
let device = devices[0];

console.log('using device: ' + cl.getDeviceInfo(device, cl.DEVICE_VENDOR).trim() +
    ' ' + cl.getDeviceInfo(device, cl.DEVICE_NAME));

let kernelSourceCode = [
	'__kernel void vadd(__global int *a, __global int *b, __global int *c, uint iNumElements) ',
	'{                                                                           ',
	'    size_t i =  get_global_id(0);                                           ',
	'    if(i > iNumElements) return;                                            ',
	'    c[i] = a[i] + b[i];                                                     ',
	'}                                                                           '
].join('\n');

//Create and program from source
let program = cl.createProgramWithSource(context, kernelSourceCode);

//Build program
cl.buildProgram(program);

let size = BUFFER_SIZE * Uint32Array.BYTES_PER_ELEMENT; // size in bytes

//Create kernel object
let kernel;
try {
	kernel = cl.createKernel(program, 'vadd');
}
catch (err) {
	console.log(cl.getProgramBuildInfo(program, device,cl.PROGRAM_BUILD_LOG));
}

// Create buffer for A and copy host contents
let aBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY | cl.MEM_USE_HOST_PTR, size, A);

// Create buffer for B and copy host contents
let bBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY | cl.MEM_USE_HOST_PTR, size, B);

// Create buffer for that uses the host ptr C
let cBuffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY | cl.MEM_USE_HOST_PTR, size, C);

//Set kernel args
cl.setKernelArg(kernel, 0, 'uint*', aBuffer);
cl.setKernelArg(kernel, 1, 'uint*', bBuffer);
cl.setKernelArg(kernel, 2, 'uint*', cBuffer);
cl.setKernelArg(kernel, 3, 'uint', BUFFER_SIZE);

// Create command queue
let queue = cl.createCommandQueue(context, device, null); // OpenCL 1.x

// Execute the OpenCL kernel on the list
// let localWS = [5]; // process one list at a time
// let globalWS = [clu.roundUp(localWS, BUFFER_SIZE)]; // process entire list
let localWS = null;
let globalWS = [BUFFER_SIZE];

console.log('Global work item size: ' + globalWS);
console.log('Local work item size: ' + localWS);

// Execute (enqueue) kernel
cl.enqueueNDRangeKernel(queue, kernel, 1,
	null,
	globalWS,
	localWS);

console.log('using enqueueMapBuffer');
// Map cBuffer to host pointer. This enforces a sync with
// the host backing space, remember we choose GPU device.
let map = cl.enqueueMapBuffer(queue,
	cBuffer, // cl buffer
	cl.TRUE, // block
	cl.MAP_READ, // flags
	0, // offset
	size); // size

let output = 'after map C= ';
for (let i = 0; i < BUFFER_SIZE; i++) {
	output += C[i] + ', ';
}
console.log(output);

// we are now reading values as bytes, we need to cast it to the output type we want
output = 'output = [' + map.byteLength + ' bytes] ';
let mapView = new Uint8Array(map);
for (let i = 0; i < mapView.length; i++) {
	output += mapView[i] + ', ';
}
console.log(output);

cl.enqueueUnmapMemObject(queue, cBuffer, map);

output = 'after unmap C= ';
for (let i = 0; i < BUFFER_SIZE; i++) {
	output += C[i] + ', ';
}
console.log(output);

cl.finish(queue); // Finish all the operations

printResults(A,B,C);

// cleanup
// cl.releaseAll();

console.log('DONE');

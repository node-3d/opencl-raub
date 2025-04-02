import cl from 'opencl-raub';

const { context, device } = cl.quickStart(true);


const BUFFER_SIZE = 10;

const A = new Uint32Array(BUFFER_SIZE);
const B = new Uint32Array(BUFFER_SIZE);
const C = new Uint32Array(BUFFER_SIZE);

for (let i = 0; i < BUFFER_SIZE; i++) {
	A[i] = i;
	B[i] = i * 2;
	C[i] = 10;
}

const kernelSourceCode = `
	__kernel
	void vadd(__global int *a, __global int *b, __global int *c, uint count) {
		size_t i =  get_global_id(0);
		if (i < count) {
			c[i] = a[i] + b[i];
		}
	}
`;

//Create and program from source
const program = cl.createProgramWithSource(context, kernelSourceCode);
cl.buildProgram(program);

const size = BUFFER_SIZE * Uint32Array.BYTES_PER_ELEMENT; // size in bytes

//Create kernel object
const kernel = cl.createKernel(program, 'vadd');
// console.log(cl.getProgramBuildInfo(program, device, cl.PROGRAM_BUILD_LOG));

// Create buffer for A and copy host contents
const aBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY | cl.MEM_USE_HOST_PTR, size, A);

// Create buffer for B and copy host contents
const bBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY | cl.MEM_USE_HOST_PTR, size, B);

// Create buffer for that uses the host ptr C
const cBuffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY | cl.MEM_USE_HOST_PTR, size, C);

//Set kernel args
cl.setKernelArg(kernel, 0, 'uint*', aBuffer);
cl.setKernelArg(kernel, 1, 'uint*', bBuffer);
cl.setKernelArg(kernel, 2, 'uint*', cBuffer);
cl.setKernelArg(kernel, 3, 'uint', BUFFER_SIZE);

// Create command queue
const queue = cl.createCommandQueue(context, device, null); // OpenCL 1.x

// Execute the OpenCL kernel on the list
// const localWS = [5]; // process one list at a time
// const globalWS = [clu.roundUp(localWS, BUFFER_SIZE)]; // process entire list
const localWS = null;
const globalWS = [BUFFER_SIZE];

console.log('Global work item size: ' + globalWS);
console.log('Local work item size: ' + localWS);

// Execute kernel
cl.enqueueNDRangeKernel(queue, kernel, 1, null, globalWS, localWS);

// Map cBuffer to host pointer (blocking mode)
const mapped = cl.enqueueMapBuffer(queue, cBuffer, true, cl.MAP_READ, 0, size);

let output = 'after mapped.buffer C= ';
for (let i = 0; i < BUFFER_SIZE; i++) {
	output += C[i] + ', ';
}
console.log(output);

// we are now reading values as bytes, we need to cast it to the output type we want
output = 'output = [' + mapped.buffer.byteLength + ' bytes] ';
const mapView = new Uint8Array(mapped.buffer);
for (let i = 0; i < mapView.length; i++) {
	output += mapView[i] + ', ';
}
console.log(output);

cl.enqueueUnmapMemObject(queue, cBuffer, mapped.buffer);

output = 'after unmap C= ';
for (let i = 0; i < BUFFER_SIZE; i++) {
	output += C[i] + ', ';
}
console.log(output);

cl.finish(queue); // Finish all the operations

// print results
console.log(`A = [${A.join(', ')}]`);
console.log(`B = [${B.join(', ')}]`);
console.log(`C = [${C.join(', ')}]`);

// cleanup
// cl.releaseAll();

console.log('DONE');

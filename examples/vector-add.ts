import cl from 'opencl-raub';

const { context, device } = cl.quickStart(true);


const BUFFER_SIZE: number = 10;

const A = new Uint32Array(BUFFER_SIZE);
const B = new Uint32Array(BUFFER_SIZE);

for (let i = 0; i < BUFFER_SIZE; i++) {
	A[i] = i;
	B[i] = i * 2;
}

console.log('created context');

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

//Build program
cl.buildProgram(program);

const size = BUFFER_SIZE * Uint32Array.BYTES_PER_ELEMENT; // size in bytes

// Create buffer for A and B and copy host contents
const aBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY, size);
const bBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY, size);

// Create buffer for C to read results
const cBuffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY, size);

// Create kernel object
const kernel = cl.createKernel(program, 'vadd');
// console.error(cl.getProgramBuildInfo(program, device, cl.PROGRAM_BUILD_LOG));

// Set kernel args
cl.setKernelArg(kernel, 0, 'uint*', aBuffer);
cl.setKernelArg(kernel, 1, 'uint*', bBuffer);
cl.setKernelArg(kernel, 2, 'uint*', cBuffer);
cl.setKernelArg(kernel, 3, 'uint', BUFFER_SIZE);

// Create command queue
const queue = cl.createCommandQueue(context, device, null);

// Do the work
cl.enqueueWriteBuffer (queue, aBuffer, true, 0, A.length * Uint32Array.BYTES_PER_ELEMENT, A);
cl.enqueueWriteBuffer (queue, bBuffer, true, 0, B.length * Uint32Array.BYTES_PER_ELEMENT, B);

// Execute (enqueue) kernel
cl.enqueueNDRangeKernel(
	queue, kernel, 1, null, [BUFFER_SIZE], null,
);

// get results and block while getting them
const C = new Uint32Array(BUFFER_SIZE);
cl.enqueueReadBuffer (queue, cBuffer, true, 0, C.length * Uint32Array.BYTES_PER_ELEMENT, C);

// print results
console.log(`A = [${A.join(', ')}]`);
console.log(`B = [${B.join(', ')}]`);
console.log(`C = [${C.join(', ')}]`);

// Cleanup - release each CL object
cl.releaseCommandQueue(queue);
cl.releaseKernel(kernel);
cl.releaseProgram(program);
cl.releaseMemObject(aBuffer);
cl.releaseMemObject(bBuffer);
cl.releaseMemObject(cBuffer);
cl.releaseContext(context);

console.log('DONE');

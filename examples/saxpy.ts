import cl from '../index.js';

const getEventExecTime = (event: cl.TClEvent): number => {
	// times are 64-bit values in nanoseconds. They are returned as [hi, lo] a 2-integer array
	// here we use the lo parts since this example is unlikely to go beyond 2^31 nanseconds per event.
	const startTime = cl.getEventProfilingInfo(event, cl.PROFILING_COMMAND_START);
	const endTime = cl.getEventProfilingInfo(event, cl.PROFILING_COMMAND_END);

	return (endTime[1] - startTime[1]) * 1e-6; // report in millisecond (from nanoseconds)
};

const VECTOR_SIZE = 512 * 1024;

console.log('SAXPY. Size:', VECTOR_SIZE);

const alpha = 2.0;
const A = new Float32Array(VECTOR_SIZE);
const B = new Float32Array(VECTOR_SIZE);
const C = new Float32Array(VECTOR_SIZE);

for (let i = 0; i < VECTOR_SIZE; i++) {
	A[i] = i;
	B[i] = (VECTOR_SIZE - i);
	C[i] = 0;
}

const { context, device } = cl.quickStart(true);

// Create command queue
const queue = cl.createCommandQueue(context, device, cl.QUEUE_PROFILING_ENABLE);

const saxpyKernelSource = `
	__kernel
	void saxpy_kernel(float alpha,
		__global float *A,
		__global float *B,
		__global float *C
	) {
		int idx = get_global_id(0);
		C[idx] = alpha* A[idx] + B[idx];
	}
`;

//Create and program from source
const program = cl.createProgramWithSource(context, saxpyKernelSource);

//Build program
cl.buildProgram(program);

const size = VECTOR_SIZE * Float32Array.BYTES_PER_ELEMENT; // size in bytes

// Create buffer for A and B and copy host contents
const aBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY, size);
const bBuffer = cl.createBuffer(context, cl.MEM_READ_ONLY, size);

// Create buffer for C to read results
const cBuffer = cl.createBuffer(context, cl.MEM_WRITE_ONLY, size);

// Create kernel object
const kernel = cl.createKernel(program, 'saxpy_kernel');
// console.log(cl.getProgramBuildInfo(program, device, cl.PROGRAM_BUILD_LOG));

// Set kernel args
cl.setKernelArg(kernel, 0, 'float', alpha);
cl.setKernelArg(kernel, 1, 'float*', aBuffer);
cl.setKernelArg(kernel, 2, 'float*', bBuffer);
cl.setKernelArg(kernel, 3, 'float*', cBuffer);

// Do the work
const writeEvents = [
	cl.enqueueWriteBuffer(queue, aBuffer, false, 0, size, A, null, true) as cl.TClEvent,
	cl.enqueueWriteBuffer(queue, bBuffer, false, 0, size, B, null, true) as cl.TClEvent,
];

// Execute (enqueue) kernel
const localWS = null; // process one list at a time
const globalWS = [VECTOR_SIZE]; // process entire list

const kernelEvent = cl.enqueueNDRangeKernel(
	queue, kernel, 1, null, globalWS, localWS, writeEvents, true,
) as cl.TClEvent;

// get results and block while getting them
const readEvent = cl.enqueueReadBuffer(
	queue, cBuffer, false, 0, size, C, [kernelEvent], true,
) as cl.TClEvent;

cl.waitForEvents([readEvent]);

console.log(
	`C[${VECTOR_SIZE - 1}] =`,
	C[VECTOR_SIZE - 1],
	C[VECTOR_SIZE - 1] === (2 * (VECTOR_SIZE - 1) + 1) ? '(correct!)' : '(wrong!)',
);

// get all event statistics
console.log('Transfer matrix A:', getEventExecTime(writeEvents[0]), 'msec');
console.log('Transfer matrix B:', getEventExecTime(writeEvents[1]), 'msec');
console.log('Execute SAXPY kernel:', getEventExecTime(kernelEvent), 'msec');
console.log('Read matrix C:', getEventExecTime(readEvent), 'msec');

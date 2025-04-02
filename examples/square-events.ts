import fs from 'node:fs';
import cl from 'opencl-raub';

const { context, device } = cl.quickStart(true);


const NVALUES = 100;
const inputs = Buffer.alloc(NVALUES * 4);
const outputs = Buffer.alloc(NVALUES * 4);

for (let i = 0; i < NVALUES; ++i) {
	inputs.writeUInt32LE(i, i * 4);
}

const source = fs.readFileSync('square.cl').toString();

const prog = cl.createProgramWithSource(context, source);

cl.buildProgram(prog);

const kern = cl.createKernel(prog, 'square');

const inputsMem = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, NVALUES * 4, inputs);
const outputsMem = cl.createBuffer(context, cl.MEM_COPY_HOST_PTR, NVALUES * 4, outputs);

cl.setKernelArg(kern, 0, 'uint*', inputsMem);
cl.setKernelArg(kern, 1, 'uint*', outputsMem);
cl.setKernelArg(kern, 2, 'uint', NVALUES);

const cq = cl.createCommandQueue(context, device, null);

cl.enqueueNDRangeKernel(cq, kern, 1, null, [NVALUES], null);

// here we use the returned user event to associate a callback that will be called from OpenCL
// once read buffer is complete.
const ev = cl.enqueueReadBuffer(
	cq, outputsMem, true, 0, NVALUES * 4, outputs, [], true,
) as cl.TClEvent;

const correctValue = (NVALUES - 1) * (NVALUES - 1);

cl.setEventCallback(
	ev,
	cl.COMPLETE,
	() => {
		console.log('\nASYNC EVENT:');
		console.log('\tLast value is:', outputs.readUInt32LE(4 * (NVALUES - 1)));
		console.log('\tCorrect value is:', correctValue);
		process.exit();
	},
);

// Main thread will always finish before CL callbacks are finished.
// Calling process.exit() in the main thread would skip CL callbacks from executing
console.log('SYNC DONE');

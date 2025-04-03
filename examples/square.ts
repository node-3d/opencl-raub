import fs from 'node:fs';
import cl from '../index.js';

const { context, device } = cl.quickStart(true);
const cq = cl.createCommandQueue(context, device);

const source = fs.readFileSync('square.cl').toString();

const NVALUES = 100;
const BYTES_PER_ELEMENT = Uint32Array.BYTES_PER_ELEMENT;

const inputs = new Uint32Array(NVALUES);
const outputs = new Uint32Array(NVALUES);

for (let i = 0; i < NVALUES; ++i) {
	inputs[i] = i;
}
outputs.fill(0);

const prog2 = cl.createProgramWithSource(context, source);
cl.buildProgram(prog2);
const kern2 = cl.createKernel(prog2, 'square');

const inputsMem = cl.createBuffer(
	context,
	cl.MEM_READ_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	inputs
);
const outputsMem = cl.createBuffer(
	context,
	cl.MEM_WRITE_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	outputs
);

cl.setKernelArg(kern2, 0, 'uint*', inputsMem);
cl.setKernelArg(kern2, 1, 'uint*', outputsMem);
cl.setKernelArg(kern2, 2, 'uint', NVALUES);

cl.enqueueNDRangeKernel(cq, kern2, 1, null, [NVALUES]);
cl.enqueueReadBuffer(cq, outputsMem, true, 0, NVALUES * BYTES_PER_ELEMENT, outputs);
cl.finish(cq);

// contains i^2 for i=0,..., 10000-1
const lastValue = outputs[NVALUES - 1];
const correctValue = (NVALUES - 1) * (NVALUES - 1);
console.log(
	'Last value is:',
	lastValue,
	lastValue === correctValue ? '(correct!)' : `(must be ${correctValue})`,
);

console.log('DONE');

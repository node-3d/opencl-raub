import fs from 'node:fs';
import cl from 'opencl-raub';

const { context, device } = cl.quickStart(true);
const cq = cl.createCommandQueue(context, device);

const source = fs.readFileSync('square.cl').toString();

const NVALUES = 100;
const BYTES_PER_ELEMENT = Uint32Array.BYTES_PER_ELEMENT;

const inputs2 = new Uint32Array(NVALUES);
const outputs2 = new Uint32Array(NVALUES);

for (let i = 0; i < NVALUES; ++i) {
	inputs2[i] = i;
}
outputs2.fill(0);

const prog2 = cl.createProgramWithSource(context, source);
cl.buildProgram(prog2);
const kern2 = cl.createKernel(prog2, 'square');

const inputsMem2 = cl.createBuffer(
	context,
	cl.MEM_READ_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	inputs2
);
const outputsMem2 = cl.createBuffer(
	context,
	cl.MEM_WRITE_ONLY | cl.MEM_COPY_HOST_PTR, NVALUES * BYTES_PER_ELEMENT,
	outputs2
);

cl.setKernelArg(kern2, 0, 'uint*', inputsMem2);
cl.setKernelArg(kern2, 1, 'uint*', outputsMem2);
cl.setKernelArg(kern2, 2, 'uint', NVALUES);

cl.enqueueNDRangeKernel(cq, kern2, 1, null, [NVALUES], null);
cl.enqueueReadBuffer(cq, outputsMem2, true, 0, NVALUES * BYTES_PER_ELEMENT, outputs2);
cl.finish(cq);

// contains i^2 for i=0,..., 10000-1
const lastValue2 = outputs2[NVALUES - 1];
const correctValue = (NVALUES - 1) * (NVALUES - 1);
console.log('Last value is:', lastValue2);
console.log('Correct value is:', correctValue);

console.log('DONE');

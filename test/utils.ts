import { strict as assert } from 'node:assert';
import cl from '../index.js';


export const newQueue = (context: cl.TClContext, device: cl.TClDevice) => {
	return cl.createCommandQueue(context, device, null);;
};

export const withProgram = (
	context: cl.TClContext,
	source: string,
	cb: (p: cl.TClProgram) => void,
) => {
	const prg = cl.createProgramWithSource(context, source);
	cl.buildProgram(prg, null, '-cl-kernel-arg-info');
	try {
		cb(prg);
	} finally {
		cl.releaseProgram(prg);
	}
};

export const withProgramAsync = (
	context: cl.TClContext,
	source: string,
	cb: (p: cl.TClProgram, done: () => void) => void,
) => {
	const prg = cl.createProgramWithSource(context, source);
	cl.buildProgram(prg, null, '-cl-kernel-arg-info');

	try {
		cb(prg, () => cl.releaseProgram(prg));
	} catch (_e) {
		cl.releaseProgram(prg);
	}
};

export const withCQ = (
	context: cl.TClContext,
	device: cl.TClDevice,
	cb: (p: cl.TClQueue) => void,
) => {
	const cq = newQueue(context, device);
	try { cb(cq); }
	finally { cl.releaseCommandQueue(cq); }
};

export const withAsyncCQ = (
	context: cl.TClContext,
	device: cl.TClDevice,
	cb: (p: cl.TClQueue, done: () => void) => void,
) => {
	const cq = newQueue(context, device);
	try {
		cb(cq, () => cl.releaseCommandQueue(cq));
	} catch (_e) { cl.releaseCommandQueue(cq); }
};

export const assertType = (v: unknown, name: string): void => {
	if (name === 'object') {
		assert.ok(v);
	}
	
	if (name === 'array') {
		assert.ok(v);
		assert.strictEqual(
			typeof v, 'object',
			'assertType(v, \'array\'): "v" must be an object',
		);
		assert.strictEqual(
			typeof (v as unknown[]).length, 'number',
			'assertType(v, \'array\'): "v.length" must be a number',
		);
		return;
	}
	
	assert.strictEqual(
		typeof v, name,
		`assertType(v, '${name}'): the type is "${typeof v}"`,
	);
};

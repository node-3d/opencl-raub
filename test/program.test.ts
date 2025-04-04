import fs from 'node:fs';
import { strict as assert } from 'node:assert';
import { describe, it, after } from 'node:test';
import cl from '../index.js';
import * as U from './utils.ts';

const squareKern = fs.readFileSync('test/kernels/square.cl').toString();
const squareCpyKern = fs.readFileSync('test/kernels/square_cpy.cl').toString();


describe('Program', async () => {
	const { platform, context, device } = cl.quickStart();
	
	describe('#createProgramWithSource', () => {
		it('returns a valid program', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			assert.ok(prg);
			cl.releaseProgram(prg);
		});
		
		it('throws as context is invalid', () => {
			assert.throws(
				() => cl.createProgramWithSource(null as unknown as cl.TClContext, squareKern),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
	});
	
	await describe('#buildProgram', async () => {
		it('builds using a valid program and a given device', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const ret = cl.buildProgram(prg, [device]);
			assert.strictEqual(ret, cl.SUCCESS);
			cl.releaseProgram(prg);
		});
		
		it('builds using a valid program', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const ret = cl.buildProgram(prg);
			assert.strictEqual(ret, cl.SUCCESS);
			cl.releaseProgram(prg);
		});
		
		it('builds and call the callback using a valid program', (_t, done) => {
			const cb: cl.TBuildProgramCb = (prg, userData) => {
				assert.ok(prg);
				cl.releaseProgram(prg);
				assert.strictEqual((userData as { done: () => void }).done, done);
				done();
			};
			const prg = cl.createProgramWithSource(context, squareKern);
			const ret = cl.buildProgram(prg, undefined, undefined, cb, { done });
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('builds using a valid program and options', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const ret = cl.buildProgram(prg, null, '-D NOCL_TEST=5');
			assert.strictEqual(ret, cl.SUCCESS);
			cl.releaseProgram(prg);
		});
		
		it('throws if program is nullptr', () => {
			assert.throws(
				() => cl.buildProgram(null as unknown as cl.TClProgram),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws if program is INVALID', () => {
			const prg = cl.createProgramWithSource(context, squareKern + '????');
			assert.throws(
				() => cl.buildProgram(prg, [device]),
				cl.BUILD_PROGRAM_FAILURE,
			);
		});
	});

	describe('#createProgramWithBinary', () => {
		it('fails as binaries list is empty', () => {
			assert.throws(
				() => cl.createProgramWithBinary(context, [device], []),
				cl.INVALID_VALUE,
			);
		});
	});
	
	describe('#createProgramWithBuiltInKernels', () => {
		it('fails as context is invalid', () => {
			assert.throws(
				() => cl.createProgramWithBuiltInKernels(
					null as unknown as cl.TClContext, [device], ['a'],
				),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('fails as device list is empty', () => {
			assert.throws(
				() => cl.createProgramWithBuiltInKernels(context, [], ['a']),
				cl.INVALID_VALUE,
			);
		});
		
		it('fails as names list is empty', () => {
			assert.throws(
				() => cl.createProgramWithBuiltInKernels(context, [device], []),
				cl.INVALID_VALUE,
			);
		});
		
		it('fails as names list contains non string values', () => {
			assert.throws(
				() => cl.createProgramWithBuiltInKernels(
					context, [device], [(() => 0) as unknown as string],
				),
				cl.INVALID_VALUE,
			);
		});
	});
	
	describe('#retainProgram', () => {
		it('increments the reference count', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			cl.retainProgram(prg);
			const after = cl.getProgramInfo(prg, cl.PROGRAM_REFERENCE_COUNT);
			assert.strictEqual(after, 2);
			cl.releaseProgram(prg);
		});
	});
	
	describe('#releaseProgram', () => {
		it('decrements the reference count', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			cl.retainProgram(prg);
			cl.releaseProgram(prg);
			const after = cl.getProgramInfo(prg, cl.PROGRAM_REFERENCE_COUNT);
			assert.strictEqual(after, 1);
			cl.releaseProgram(prg);
		});
	});
	
	describe('#compileProgram', () => {
		it('compiles a program', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const ret = cl.compileProgram(prg);
			assert.strictEqual(ret, cl.SUCCESS);
			cl.releaseProgram(prg);
		});
		
		it('compiles a program - async', (_t, done) => {
			const cb: cl.TBuildProgramCb = (prg, userData) => {
				assert.ok(prg);
				cl.releaseProgram(prg);
				assert.strictEqual((userData as { done: () => void }).done, done);
				done();
			};
			const prg = cl.createProgramWithSource(context, squareKern);
			const ret = cl.compileProgram(
				prg,
				null,
				null,
				null,
				null,
				cb,
				{ done }
			);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('compiles a program with header', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const prg2 = cl.createProgramWithSource(context, squareKern);
			
			const ret = cl.compileProgram(prg, null, null, [prg2], ['prg2.h']);
			assert.strictEqual(ret, cl.SUCCESS);
			cl.releaseProgram(prg);
		});
		
		it('fails with unnamed header', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const prg2 = cl.createProgramWithSource(context, squareKern);
			
			assert.throws(
				() => cl.compileProgram(prg, null, null, [prg2], []),
			);
			
			cl.releaseProgram(prg);
			cl.releaseProgram(prg2);
		});
	});
	
	describe('#linkProgram', () => {
		it('fails as context is invalid', () => {
			U.withProgram(context, squareKern, (prg) => {
				assert.throws(
					() => cl.linkProgram({} as unknown as cl.TClContext, null, null, [prg]),
				);
			});
		});
		
		it('fails as program is of bad type', () => {
			U.withProgram(context, squareKern, () => {
				assert.throws(
					() => cl.linkProgram(
						context, [device], null, [{} as unknown as cl.TClProgram],
					),
				);
			});
		});
		
		it('links one compiled program', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			cl.compileProgram(prg);
			
			const nprg = cl.linkProgram(context, null, null, [prg]);
			U.assertType(nprg, 'object');
			
			cl.releaseProgram(nprg);
			cl.releaseProgram(prg);
		});
		
		it('links one program and calls the callback', (_t, done) => {
			const cb: cl.TBuildProgramCb = (prg, userData) => {
				console.log('cb prg -', prg);
				assert.ok(prg);
				assert.strictEqual((userData as { done: () => void }).done, done);
				
				// cl.releaseProgram(prg);
				done();
			};
			
			const prg = cl.createProgramWithSource(context, squareKern);
			cl.compileProgram(prg);
			
			const nprg = cl.linkProgram(context, null, null, [prg], cb, { done, prg });
			
			console.log('ctx prg 1 2 -', context, prg, nprg);
			// cl.releaseProgram(prg);
			// cl.releaseProgram(nprg);
		});
		
		it('links one compiled program with a list of devices', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			cl.compileProgram(prg, [device]);
			const nprg = cl.linkProgram(context, [device], null, [prg]);
			U.assertType(nprg, 'object');
			cl.releaseProgram(prg);
		});
		
		it('links two compiled programs', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			cl.compileProgram(prg);
			
			const prg2 = cl.createProgramWithSource(context, squareCpyKern);
			cl.compileProgram(prg2);
			
			const nprg = cl.linkProgram(context, null, null, [prg, prg2]);
			U.assertType(nprg, 'object');
			
			cl.releaseProgram(prg);
			cl.releaseProgram(prg2);
		});
	});
	
	describe('#getProgramInfo', () => {
		const testForType = (key: keyof typeof cl, _assert: (v: unknown) => void) => {
			it('returns the good type for ' + key, () => {
				U.withProgram(context, squareKern, (prg) => {
					const val = cl.getProgramInfo(prg, cl[key] as unknown as number);
					_assert(val);
				});
			});
		};
		
		testForType('PROGRAM_REFERENCE_COUNT', (v) => U.assertType(v, 'number'));
		testForType('PROGRAM_NUM_DEVICES', (v) => U.assertType(v, 'number'));
		testForType('PROGRAM_CONTEXT', (v) => U.assertType(v, 'object'));
		testForType('PROGRAM_DEVICES', (v) => U.assertType(v, 'array'));
		testForType('PROGRAM_BINARIES', (v) => U.assertType(v, 'array'));
		testForType('PROGRAM_BINARY_SIZES', (v) => U.assertType(v, 'array'));
		testForType('PROGRAM_SOURCE', (v) => U.assertType(v, 'string'));
		
		it('has the same program source as the one given', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			assert(cl.getProgramInfo(prg, cl.PROGRAM_SOURCE) == squareKern);
			cl.releaseProgram(prg);
		});
	});
	
	describe('#getProgramBuildInfo', () => {
		const testForType = (key: keyof typeof cl, _assert: (v: unknown) => void) => {
			it('returns the good type for ' + key, () => {
				U.withProgram(context, squareKern, (prg) => {
					const val = cl.getProgramBuildInfo(prg, device, cl[key] as unknown as number);
					_assert(val);
				});
			});
		};
		
		testForType('PROGRAM_BUILD_STATUS', (v) => U.assertType(v, 'number'));
		testForType('PROGRAM_BUILD_OPTIONS', (v) => U.assertType(v, 'string'));
		testForType('PROGRAM_BUILD_LOG', (v) => U.assertType(v, 'string'));
		
		it('returns the same options string that was passed before', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const buildOpts = '-D NOCL_TEST=5';
			cl.buildProgram(prg, null, buildOpts);
			
			const opt = cl.getProgramBuildInfo(prg, device, cl.PROGRAM_BUILD_OPTIONS) as string;
			assert.ok(opt.includes(buildOpts));
			cl.releaseProgram(prg);
		});
	});
});

'use strict';

const fs = require('node:fs');

const assert = require('node:assert').strict;
const { describe, it, after } = require('node:test');

const cl = require('../');
const U = require('./utils');

const squareKern = fs.readFileSync(__dirname + '/kernels/square.cl').toString();
const squareCpyKern = fs.readFileSync(__dirname + '/kernels/square_cpy.cl').toString();


describe('Program', async () => {
	const context = U.newContext();
	const device = global.MAIN_DEVICE;
	
	after(() => {
		cl.releaseContext(context);
	});
	
	describe('#createProgramWithSource', () => {
		it('returns a valid program', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			assert.ok(prg);
			cl.releaseProgram(prg);
		});
		
		it('throws as context is invalid', () => {
			assert.throws(
				() => cl.createProgramWithSource(null, squareKern),
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
		
		await it('builds and call the callback using a valid program', new Promise((done) => {
			const mCB = (prg, userData) => {
				assert.ok(prg);
				cl.releaseProgram(prg);
				userData.done();
			};
			const prg = cl.createProgramWithSource(context, squareKern);
			const ret = cl.buildProgram(prg, undefined, undefined, mCB, { done });
			assert.strictEqual(ret, cl.SUCCESS);
		}));
		
		it('builds using a valid program and options', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const ret = cl.buildProgram(prg, null, '-D NOCL_TEST=5');
			assert.strictEqual(ret, cl.SUCCESS);
			cl.releaseProgram(prg);
		});
		
		it('throws if program is nullptr', () => {
			assert.throws(
				() => cl.buildProgram(null),
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
		it('creates a valid program from a binary', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			cl.buildProgram(prg, [device]);
			const bin = cl.getProgramInfo(prg, cl.PROGRAM_BINARIES);
			const sizes = cl.getProgramInfo(prg, cl.PROGRAM_BINARY_SIZES);
			
			const prg2 = cl.createProgramWithBinary(context, [device], sizes, bin);
			assert.ok(prg2);
			
			cl.releaseProgram(prg);
			cl.releaseProgram(prg2);
		});
		
		it('creates a valid program from a buffer', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			cl.buildProgram(prg, [device]);
			const bin = cl.getProgramInfo(prg, cl.PROGRAM_BINARIES);
			const sizes = cl.getProgramInfo(prg, cl.PROGRAM_BINARY_SIZES);
			
			const prg2 = cl.createProgramWithBinary(context, [device], sizes, bin);
			assert.ok(prg2);
			
			cl.releaseProgram(prg);
			cl.releaseProgram(prg2);
		});
		
		it('fails as binaries list is empty', () => {
			assert.throws(
				() => cl.createProgramWithBinary(context, [device], [], []),
				cl.INVALID_VALUE,
			);
		});
		
		it('fails as lists are not of the same length', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			cl.buildProgram(prg);
			const bin = cl.getProgramInfo(prg, cl.PROGRAM_BINARIES);
			const sizes = cl.getProgramInfo(prg, cl.PROGRAM_BINARY_SIZES);
			sizes.push(100);
			
			assert.throws(
				() => cl.createProgramWithBinary(context, [device], sizes, bin),
				cl.INVALID_VALUE,
			);
			cl.releaseProgram(prg);
		});
	});
	
	describe('#createProgramWithBuiltInKernels', () => {
		it('fails as context is invalid', () => {
			assert.throws(
				() => cl.createProgramWithBuiltInKernels(null, [device], ['a']),
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
				() => cl.createProgramWithBuiltInKernels(context, [device], [() => {}]),
				cl.INVALID_VALUE,
			);
		});
		
		it('fails as kernel name is unknown', () => {
			assert.throws(
				() => cl.createProgramWithBuiltInKernels(context, [device], ['nocl_test']),
				cl.INVALID_VALUE,
			);
		});
	});
	
	describe('#retainProgram', () => {
		it('increments the reference count', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const before = cl.getProgramInfo(prg, cl.PROGRAM_REFERENCE_COUNT);
			cl.retainProgram(prg);
			const after = cl.getProgramInfo(prg, cl.PROGRAM_REFERENCE_COUNT);
			assert(before + 1 == after);
			cl.releaseProgram(prg);
		});
	});
	
	describe('#releaseProgram', () => {
		it('decrements the reference count', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const before = cl.getProgramInfo(prg, cl.PROGRAM_REFERENCE_COUNT);
			cl.retainProgram(prg);
			cl.releaseProgram(prg);
			const after = cl.getProgramInfo(prg, cl.PROGRAM_REFERENCE_COUNT);
			assert(before == after);
			cl.releaseProgram(prg);
		});
	});
	
	describe('#compileProgram', () => {
		it('builds a program with no input headers', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const ret = cl.compileProgram(prg);
			assert.strictEqual(ret, cl.SUCCESS);
			cl.releaseProgram(prg);
		});
		
		it('builds and call the callback with no input header', (t, done) => {
			const mCB = (prg, userData) => {
				assert.ok(prg);
				cl.releaseProgram(prg);
				userData.done();
			};
			const prg = cl.createProgramWithSource(context, squareKern);
			const ret = cl.compileProgram(
				prg,
				undefined,
				undefined,
				undefined,
				undefined,
				mCB,
				{ done }
			);
			assert.strictEqual(ret, cl.SUCCESS);
		});
		
		it('builds a program with an input header', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			const prg2 = cl.createProgramWithSource(context, squareKern);
			
			const ret = cl.compileProgram(prg, null, null, [prg2], ['prg2.h']);
			assert.strictEqual(ret, cl.SUCCESS);
			cl.releaseProgram(prg);
		});
		
		it('fails as ain\'t no name for header', () => {
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
					() => cl.linkProgram(null, null, null, [prg]),
					new Error('Argument 0 must be of type `Object`'),
				);
			});
		});
		
		it('fails as program is of bad type', () => {
			U.withProgram(context, squareKern, () => {
				assert.throws(
					() => cl.linkProgram(context, [device], null, [context]),
				);
			});
		});
		
		it('links one compiled program', () => {
			U.withProgram(context, squareKern, (prg) => {
				cl.compileProgram(prg);
				const nprg = cl.linkProgram(context, [device], null, [prg]);
				U.assertType(nprg, 'object');
			});
		});
		
		it('links one program and calls the callback', (t, done) => {
			const mCB = (p, userData) => {
				assert.ok(userData.prg);
				cl.releaseProgram(userData.prg);
				userData.done();
			};
			const prg = cl.createProgramWithSource(context, squareKern);
			const ret = cl.compileProgram(prg);
			assert.strictEqual(ret, cl.SUCCESS);
			const nprg = cl.linkProgram(context, null, null, [prg], mCB, { done, prg });
			U.assertType(nprg, 'object');
		});
		
		it('links one compiled program with a list of devices', () => {
			U.withProgram(context, squareKern, (prg) => {
				cl.compileProgram(prg);
				const nprg = cl.linkProgram(context, [device], null, [prg]);
				U.assertType(nprg, 'object');
			});
		});
		
		it('links two compiled programs', () => {
			U.withProgram(context, squareKern, (prg) => {
				U.withProgram(context, squareCpyKern, (prg2) => {
					cl.compileProgram(prg);
					cl.compileProgram(prg2);
					const nprg = cl.linkProgram(context, null, null, [prg, prg2]);
					U.assertType(nprg, 'object');
				});
			});
		});
	});
	
	describe('#unloadPlatformCompiler', () => {
		it('is a function', () => {
			assert.strictEqual(typeof cl.unloadPlatformCompiler, 'function');
		});
	});
	
	describe('#getProgramInfo', () => {
		const testForType = (clKey, _assert) => {
			it('returns the good type for ' + clKey, () => {
				U.withProgram(context, squareKern, (prg) => {
					const val = cl.getProgramInfo(prg, cl[clKey]);
					_assert(val);
				});
			});
		};
		
		testForType('PROGRAM_REFERENCE_COUNT', (v) => U.assertType(v, 'number'));
		testForType('PROGRAM_NUM_DEVICES', (v) => U.assertType(v, 'number'));
		testForType('PROGRAM_CONTEXT', (v) => U.assertType(v, 'object'));
		testForType('PROGRAM_DEVICES', (v) => U.assertType(v, 'array'));
		testForType('PROGRAM_BINARY_SIZES', (v) => U.assertType(v, 'array'));
		testForType('PROGRAM_SOURCE', (v) => U.assertType(v, 'string'));
		
		it('has the same program source as the one given', () => {
			const prg = cl.createProgramWithSource(context, squareKern);
			assert(cl.getProgramInfo(prg, cl.PROGRAM_SOURCE) == squareKern);
			cl.releaseProgram(prg);
		});
	});
	
	describe('#getProgramBuildInfo', () => {
		const testForType = (clKey, _assert) => {
			it('returns the good type for ' + clKey, () => {
				U.withProgram(context, squareKern, (prg) => {
					const val = cl.getProgramBuildInfo(prg, device, cl[clKey]);
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
			
			const opt = cl.getProgramBuildInfo(prg, device, cl.PROGRAM_BUILD_OPTIONS);
			assert(opt.indexOf(buildOpts) !== -1); // there is an extra space in get info output
			cl.releaseProgram(prg);
		});
	});
});

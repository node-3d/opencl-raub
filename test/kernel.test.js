'use strict';

const fs = require('node:fs');

const assert = require('node:assert').strict;
const { describe, it } = require('node:test');

const cl = require('../');
const U = require('./utils');


const squareKern = fs.readFileSync(__dirname + '/kernels/square.cl').toString();
const squareCpyKern = fs.readFileSync(__dirname + '/kernels/square_cpy.cl').toString();


describe('Kernel', () => {
	describe('#createKernel', () => {
		it('returns a valid kernel', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					assert.ok(k);
					cl.releaseKernel(k);
				});
			});
		});
		
		it('fails as kernel does not exist', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					assert.throws(
						() => cl.createKernel(prg, 'i_do_not_exist')
					);
				});
			});
		});
	});
	
	describe('#createKernelsInProgram', () => {
		it('returns two valid kernels', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, [squareKern, squareCpyKern].join('\n'), (prg) => {
					const kerns = cl.createKernelsInProgram(prg);
					assert.ok(kerns);
					assert(kerns.length == 2);
					
					assert.ok(kerns[0]);
					assert.ok(kerns[1]);
					
					cl.releaseKernel(kerns[0]);
					cl.releaseKernel(kerns[1]);
				});
			});
		});
	});
	
	describe('#retainKernel', () => {
		it('increments reference count', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					const before = cl.getKernelInfo(k, cl.KERNEL_REFERENCE_COUNT);
					cl.retainKernel(k);
					const after = cl.getKernelInfo(k, cl.KERNEL_REFERENCE_COUNT);
					assert(before + 1 == after);
					cl.releaseKernel(k);
					cl.releaseKernel(k);
				});
			});
		});
	});

	describe('#releaseKernel', () => {
		it('decrements reference count', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					const before = cl.getKernelInfo(k, cl.KERNEL_REFERENCE_COUNT);
					
					cl.retainKernel(k);
					cl.releaseKernel(k);
					const after = cl.getKernelInfo(k, cl.KERNEL_REFERENCE_COUNT);
					// ???
					assert(before == after);
					cl.releaseKernel(k);
				});
			});
		});
	});
	
	describe('#setKernelArg', () => {
		it('accepts a memobject as first argument', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					const mem = cl.createBuffer(ctx, 0, 8, null);
					
					assert.equal(
						cl.setKernelArg(k, 0, null, mem),
						cl.SUCCESS,
						'works with empty arg type'
					);
					assert.equal(
						cl.setKernelArg(k, 0, 'float*', mem),
						cl.SUCCESS,
						'works with explicit arg type'
					);
					
					cl.releaseMemObject(mem);
					cl.releaseKernel(k);
				});
			});
		});
		
		it('fails when passed a scalar type as first argument', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					
					assert.throws(
						() => cl.setKernelArg(k, 0, null, 5),
						new Error('Argument 3 must be of type `Object`'),
					);
					assert.throws(
						() => cl.setKernelArg(k, 0, 'float*', 5),
						new Error('Argument 3 must be of type `Object`'),
					);
					
					cl.releaseKernel(k);
				});
			});
		});
		
		it('fails when passed a vector type as first argument', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					
					assert.throws(
						() => cl.setKernelArg(k, 0, null, [5, 10, 15]),
						new Error('Argument 3 must be a CL Wrapper.'),
					);
					assert.throws(
						() => cl.setKernelArg(k, 0, 'float*', [5, 10, 15]),
						new Error('Argument 3 must be a CL Wrapper.'),
					);
					
					cl.releaseKernel(k);
				});
			});
		});
		
		it('accepts an integer as third argument', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					
					assert(cl.setKernelArg(k, 2, null, 5) == cl.SUCCESS);
					assert(cl.setKernelArg(k, 2, 'uint', 5) == cl.SUCCESS);
					
					cl.releaseKernel(k);
				});
			});
		});
		
		it('fails when passed a char as third argument (expected : integer)', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					
					assert.throws(
						() => cl.setKernelArg(k, 2, null, 'a'),
						cl.INVALID_ARG_VALUE,
					);
					assert.throws(
						() => cl.setKernelArg(k, 2, 'char', 'a'),
						cl.INVALID_ARG_VALUE,
					);
					
					cl.releaseKernel(k);
				});
			});
		});
		
		it('fails when passed a vector as third argument (expected : integer)', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					
					assert.throws(
						() => cl.setKernelArg(k, 2, null, [5, 10, 15]),
						cl.INVALID_ARG_VALUE,
					);
					assert.throws(
						() => cl.setKernelArg(k, 2, 'int', [5, 10, 15]),
						cl.INVALID_ARG_VALUE,
					);
					
					cl.releaseKernel(k);
				});
			});
		});
		
		it('fails when passed a memobject as third argument (expected : integer)', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					const mem = cl.createBuffer(ctx, 0, 8, null);
					
					assert.throws(
						() => cl.setKernelArg(k, 2, null, mem),
						cl.INVALID_ARG_VALUE,
					);
					assert.throws(
						() => cl.setKernelArg(k, 2, 'int', mem),
						cl.INVALID_ARG_VALUE,
					);
					
					cl.releaseKernel(k);
				});
			});
		});
		
		it('fails when passed a fourth argument on a kernel that only has three', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					assert.throws(
						() => cl.setKernelArg(k, 3, null, 5),
					);
					assert.throws(
						() => cl.setKernelArg(k, 3, 'int', 5),
						cl.INVALID_ARG_INDEX,
					);
					
					cl.releaseKernel(k);
				});
			});
		});
	});

	describe('#getKernelInfo', () => {
		const testForType = (clKey, _assert) => {
			it('returns the good type for ' + clKey, () => {
				U.withContext((ctx) => {
					U.withProgram(ctx, squareKern, (prg) => {
						const k = cl.createKernel(prg, 'square');
						const val = cl.getKernelInfo(k, cl[clKey]);
						cl.releaseKernel(k);
						_assert(val);
					});
				});
			});
		};
		if (cl.VERSION_1_2) {
			testForType('KERNEL_ATTRIBUTES', (v) => U.assertType(v, 'string'));
		}
		
		testForType('KERNEL_FUNCTION_NAME', (v) => U.assertType(v, 'string'));
		testForType('KERNEL_REFERENCE_COUNT', (v) => U.assertType(v, 'number'));
		testForType('KERNEL_NUM_ARGS', (v) => U.assertType(v, 'number'));
		testForType('KERNEL_CONTEXT', (v) => U.assertType(v, 'object'));
		testForType('KERNEL_PROGRAM', (v) => U.assertType(v, 'object'));
		
		it('returns the corresponding number of arguments', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					const nbArgs = cl.getKernelInfo(k, cl.KERNEL_NUM_ARGS);
					cl.releaseKernel(k);
					if (nbArgs != 3) {
						assert.fail(nbArgs, 3);
					}
				});
			});
		});
		
		it('returns the corresponding kernel name', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					const name = cl.getKernelInfo(k, cl.KERNEL_FUNCTION_NAME);
					cl.releaseKernel(k);
					if (name != 'square') {
						assert.fail(name, 'square');
					}
				});
			});
		});
		
		it.skip('returns the corresponding context', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					const c = cl.getKernelInfo(k, cl.KERNEL_CONTEXT);
					cl.releaseKernel(k);
					assert(c === ctx, 'c === ctx');
				});
			});
		});
		
		it.skip('returns the corresponding program', () => {
			U.withContext((ctx) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					const p = cl.getKernelInfo(k, cl.KERNEL_PROGRAM);
					cl.releaseKernel(k);
					assert(p === prg, 'p === prg');
				});
			});
		});

	});
	
	describe('#getKernelArgInfo', () => {
		const testForType = (clKey, _assert) => {
			it('returns the good type for ' + clKey, () => {
				U.withContext((ctx) => {
					U.withProgram(ctx, squareKern, (prg) => {
						const k = cl.createKernel(prg, 'square');
						const val = cl.getKernelArgInfo(k, 0, cl[clKey]);
						cl.releaseKernel(k);
						_assert(val);
					});
				});
			});
		};
		if (cl.VERSION_2_0) {
			testForType('KERNEL_ARG_ADDRESS_QUALIFIER', (v) => U.assertType(v, 'number'));
			testForType('KERNEL_ARG_ACCESS_QUALIFIER', (v) => U.assertType(v, 'number'));
			testForType('KERNEL_ARG_TYPE_QUALIFIER', (v) => U.assertType(v, 'number'));
		}
		
		if (cl.VERSION_2_0) {
			it('returns the corresponding names', () => {
				U.withContext((ctx) => {
					U.withProgram(ctx, squareKern, (prg) => {
						const k = cl.createKernel(prg, 'square');
						const n1 = cl.getKernelArgInfo(k, 0, cl.KERNEL_ARG_NAME);
						const n2 = cl.getKernelArgInfo(k, 1, cl.KERNEL_ARG_NAME);
						const n3 = cl.getKernelArgInfo(k, 2, cl.KERNEL_ARG_NAME);
						cl.releaseKernel(k);
						assert.equal(n1, 'input');
						assert.equal(n2, 'output');
						assert.equal(n3, 'count');
					});
				});
			});
			
			it('returns the corresponding types', () => {
				U.withContext((ctx) => {
					U.withProgram(ctx, squareKern, (prg) => {
						const k = cl.createKernel(prg, 'square');
						const n1 = cl.getKernelArgInfo(k, 0, cl.KERNEL_ARG_TYPE_NAME);
						const n2 = cl.getKernelArgInfo(k, 1, cl.KERNEL_ARG_TYPE_NAME);
						const n3 = cl.getKernelArgInfo(k, 2, cl.KERNEL_ARG_TYPE_NAME);
						cl.releaseKernel(k);
						assert.equal(n1, 'float*');
						assert.equal(n2, 'float*');
						assert.equal(n3, 'uint');
					});
				});
			});
		}
	});
	
	describe('#getKernelWorkGroupInfo', () => {
		const testForType = (clKey, _assert) => {
			it('returns the good type for ' + clKey, () => {
				U.withContext((ctx, device) => {
					U.withProgram(ctx, squareKern, (prg) => {
						const k = cl.createKernel(prg, 'square');
						const val = cl.getKernelWorkGroupInfo(k, device, cl[clKey]);
						cl.releaseKernel(k);
						_assert(val);
					});
				});
			});
		};
		
		testForType('KERNEL_COMPILE_WORK_GROUP_SIZE', (v) => U.assertType(v, 'array'));
		testForType('KERNEL_PREFERRED_WORK_GROUP_SIZE_MULTIPLE', (v) => U.assertType(v, 'number'));
		testForType('KERNEL_WORK_GROUP_SIZE', (v) => U.assertType(v, 'number'));
		testForType('KERNEL_LOCAL_MEM_SIZE', (v) => U.assertType(v, 'array'));
		testForType('KERNEL_PRIVATE_MEM_SIZE', (v) => U.assertType(v, 'array'));
		
		it('throws INVALID_VALUE when looking for KERNEL_GLOBAL_WORK_SIZE', () => {
			U.withContext((ctx, device) => {
				U.withProgram(ctx, squareKern, (prg) => {
					const k = cl.createKernel(prg, 'square');
					assert.throws(
						() => cl.getKernelWorkGroupInfo(
							k,
							device,
							cl.KERNEL_GLOBAL_WORK_SIZE
						),
						cl.INVALID_VALUE);
					cl.releaseKernel(k);
				});
			});
		});
	});
});

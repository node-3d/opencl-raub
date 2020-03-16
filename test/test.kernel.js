'use strict';

let fs = require('fs');
let assert = require('chai').assert;

const cl = require('../');
let U = require('./utils/utils');


let squareKern = fs.readFileSync(__dirname + '/kernels/square.cl').toString();
let squareCpyKern = fs.readFileSync(__dirname + '/kernels/square_cpy.cl').toString();


describe('Kernel', function () {

	describe('#createKernel', function () {

		it('should return a valid kernel', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');

					assert.isNotNull(k);
					assert.isDefined(k);
					cl.releaseKernel(k);
				});
			});
		});

		it('should fail as kernel does not exists', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					U.bind(cl.createKernel, prg, 'i_do_not_exist').should.throw();
				});
			});
		});

	});


	describe('#createKernelsInProgram', function () {

		it('should return two valid kernels', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, [squareKern, squareCpyKern].join('\n'), function (prg) {
					let kerns = cl.createKernelsInProgram(prg);

					assert.isNotNull(kerns);
					assert.isDefined(kerns);
					assert(kerns.length == 2);
					assert.isNotNull(kerns[0]);
					assert.isDefined(kerns[0]);
					assert.isNotNull(kerns[1]);
					assert.isDefined(kerns[1]);

					cl.releaseKernel(kerns[0]);
					cl.releaseKernel(kerns[1]);
				});
			});
		});

	});


	describe('#retainKernel', function () {

		it('should increment reference count', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');

					let before = cl.getKernelInfo(k, cl.KERNEL_REFERENCE_COUNT);
					cl.retainKernel(k);
					let after = cl.getKernelInfo(k, cl.KERNEL_REFERENCE_COUNT);
					assert(before + 1 == after);
					cl.releaseKernel(k);
					cl.releaseKernel(k);
				});
			});
		});

	});

	describe('#releaseKernel', function () {

		it('should decrement reference count', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');
					let before = cl.getKernelInfo(k, cl.KERNEL_REFERENCE_COUNT);

					cl.retainKernel(k);
					cl.releaseKernel(k);
					let after = cl.getKernelInfo(k, cl.KERNEL_REFERENCE_COUNT);
					// ???
					assert(before == after);
					cl.releaseKernel(k);
				});
			});
		});

	});

	describe('#setKernelArg', function () {

		it('should successfully accept a memobject as first argument', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');
					let mem = cl.createBuffer(ctx, 0, 8, null);

					if (cl.VERSION_1_2) {
						assert.equal(
							cl.setKernelArg(k, 0, null, mem),
							cl.SUCCESS,
							'setKernelArg should succeed'
						);
					}
					assert.equal(
						cl.setKernelArg(k, 0, 'float*', mem),
						cl.SUCCESS,
						'setKernelArg should succeed'
					);

					cl.releaseMemObject(mem);
					cl.releaseKernel(k);
				});
			});
		});

		it('should fail when passed a scalar type as first argument (expected : memobject)', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');

					if (cl.VERSION_1_2) {
						U.bind(cl.setKernelArg, k, 0, null, 5)
							.should.throw(cl.INVALID_MEM_OBJECT.message);
					}
					U.bind(cl.setKernelArg, k, 0, 'float*', 5)
						.should.throw(cl.INVALID_MEM_OBJECT.message);

					cl.releaseKernel(k);
				});
			});
		});

		it('should fail when passed a vector type as first argument (expected : memobject)', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');

					if (cl.VERSION_1_2) {
						U.bind(cl.setKernelArg, k, 0, null, [5, 10, 15])
							.should.throw(cl.INVALID_MEM_OBJECT.message);
					}
					U.bind(cl.setKernelArg, k, 0, 'float*', [5, 10, 15])
						.should.throw(cl.INVALID_MEM_OBJECT.message);

					cl.releaseKernel(k);
				});
			});
		});

		it('should successfully accept an integer as third argument', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');

					if (cl.VERSION_1_2) {
						assert(cl.setKernelArg(k, 2, null, 5) == cl.SUCCESS);
					}
					assert(cl.setKernelArg(k, 2, 'uint', 5) == cl.SUCCESS);

					cl.releaseKernel(k);
				});
			});
		});

		it('should fail when passed a char as third argument (expected : integer)', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');

					if (cl.VERSION_1_2) {
						U.bind(cl.setKernelArg, k, 2, null, 'a')
							.should.throw(cl.INVALID_ARG_VALUE.message);
					}
					U.bind(cl.setKernelArg, k, 2, 'char', 'a')
						.should.throw(cl.INVALID_ARG_VALUE.message);

					cl.releaseKernel(k);
				});
			});
		});

		it('should fail when passed a vector as third argument (expected : integer)', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');

					if (cl.VERSION_1_2) {
						U.bind(cl.setKernelArg, k, 2, null, [5, 10, 15])
							.should.throw(cl.INVALID_ARG_VALUE.message);
					}
					U.bind(cl.setKernelArg, k, 2, 'int', [5, 10, 15])
						.should.throw(cl.INVALID_ARG_VALUE.message);

					cl.releaseKernel(k);
				});
			});
		});


		it('should fail when passed a memobject as third argument (expected : integer)', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');
					let mem = cl.createBuffer(ctx, 0, 8, null);

					if (cl.VERSION_1_2) {
						U.bind(cl.setKernelArg, k, 2, null, mem)
							.should.throw(cl.INVALID_ARG_VALUE.message);
					}
					U.bind(cl.setKernelArg, k, 2, 'int', mem)
						.should.throw(cl.INVALID_ARG_VALUE.message);

					cl.releaseKernel(k);
				});
			});
		});



		it('should fail when passed a fourth argument on a kernel that only have three', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');

					if (cl.VERSION_1_2) {
						U.bind(cl.setKernelArg, k, 3, null, 5)
							.should.throw(cl.INVALID_ARG_INDEX.message);
					}
					U.bind(cl.setKernelArg, k, 3, 'int', 5)
						.should.throw(cl.INVALID_ARG_INDEX.message);

					cl.releaseKernel(k);
				});
			});
		});

	});

	describe('#getKernelInfo', function () {

		let testForType = function (clKey, _assert) {
			it('should return the good type for ' + clKey, function () {
				U.withContext(function (ctx) {
					U.withProgram(ctx, squareKern, function (prg) {
						let k = cl.createKernel(prg, 'square');
						let val = cl.getKernelInfo(k, cl[clKey]);
						cl.releaseKernel(k);
						_assert(val);
						console.console.log(clKey + ' = ' + val);
					});
				});
			});
		};
		if (cl.VERSION_1_2) {
			testForType('KERNEL_ATTRIBUTES', assert.isString.bind(assert));
		}
		testForType('KERNEL_FUNCTION_NAME', assert.isString.bind(assert));
		testForType('KERNEL_REFERENCE_COUNT', assert.isNumber.bind(assert));
		testForType('KERNEL_NUM_ARGS', assert.isNumber.bind(assert));
		testForType('KERNEL_CONTEXT', assert.isObject.bind(assert));
		testForType('KERNEL_PROGRAM', assert.isObject.bind(assert));

		it('should return the corresponding number of arguments', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');
					let nbArgs = cl.getKernelInfo(k, cl.KERNEL_NUM_ARGS);
					cl.releaseKernel(k);
					if (nbArgs != 3) {
						assert.fail(nbArgs, 3);
					}
				});
			});
		});

		it('should return the corresponding kernel name', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');
					let name = cl.getKernelInfo(k, cl.KERNEL_FUNCTION_NAME);
					cl.releaseKernel(k);
					if (name != 'square') {
						assert.fail(name, 'square');
					}
				});
			});
		});

		it.skip('should return the corresponding context', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');
					let c = cl.getKernelInfo(k, cl.KERNEL_CONTEXT);
					cl.releaseKernel(k);
					assert(c === ctx, 'c === ctx');
				});
			});
		});

		it.skip('should return the corresponding program', function () {
			U.withContext(function (ctx) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');
					let p = cl.getKernelInfo(k, cl.KERNEL_PROGRAM);
					cl.releaseKernel(k);
					assert(p === prg, 'p === prg');
				});
			});
		});

	});

	describe('#getKernelArgInfo', function () {
		let testForType = function (clKey, _assert) {
			it('should return the good type for ' + clKey, function () {
				U.withContext(function (ctx) {
					U.withProgram(ctx, squareKern, function (prg) {
						let k = cl.createKernel(prg, 'square');
						let val = cl.getKernelArgInfo(k, 0, cl[clKey]);
						cl.releaseKernel(k);
						_assert(val);
						console.console.log(clKey + ' = ' + val);
					});
				});
			});
		};
		if (cl.VERSION_2_0) {
			testForType('KERNEL_ARG_ADDRESS_QUALIFIER', assert.isNumber.bind(assert));
			testForType('KERNEL_ARG_ACCESS_QUALIFIER', assert.isNumber.bind(assert));
			testForType('KERNEL_ARG_TYPE_QUALIFIER', assert.isNumber.bind(assert));
		}

		if (cl.VERSION_2_0) {
			it('should return the corresponding names', function () {
				U.withContext(function (ctx) {
					U.withProgram(ctx, squareKern, function (prg) {
						let k = cl.createKernel(prg, 'square');
						let n1 = cl.getKernelArgInfo(k, 0, cl.KERNEL_ARG_NAME);
						let n2 = cl.getKernelArgInfo(k, 1, cl.KERNEL_ARG_NAME);
						let n3 = cl.getKernelArgInfo(k, 2, cl.KERNEL_ARG_NAME);
						cl.releaseKernel(k);
						assert.equal(n1, 'input');
						assert.equal(n2, 'output');
						assert.equal(n3, 'count');
					});
				});
			});
    
			it('should return the corresponding types', function () {
				U.withContext(function (ctx) {
					U.withProgram(ctx, squareKern, function (prg) {
						let k = cl.createKernel(prg, 'square');
						let n1 = cl.getKernelArgInfo(k, 0, cl.KERNEL_ARG_TYPE_NAME);
						let n2 = cl.getKernelArgInfo(k, 1, cl.KERNEL_ARG_TYPE_NAME);
						let n3 = cl.getKernelArgInfo(k, 2, cl.KERNEL_ARG_TYPE_NAME);
						cl.releaseKernel(k);
						assert.equal(n1, 'float*');
						assert.equal(n2, 'float*');
						assert.equal(n3, 'uint');
					});
				});
			});
		}
	});
	describe('#getKernelWorkGroupInfo', function () {

		let testForType = function (clKey, _assert) {
			it('should return the good type for ' + clKey, function () {
				U.withContext(function (ctx, device) {
					U.withProgram(ctx, squareKern, function (prg) {
						let k = cl.createKernel(prg, 'square');
						let val = cl.getKernelWorkGroupInfo(k, device, cl[clKey]);
						cl.releaseKernel(k);
						_assert(val);
						console.console.log(clKey + ' = ' + val);
					});
				});
			});
		};

		testForType('KERNEL_COMPILE_WORK_GROUP_SIZE', assert.isArray.bind(assert));
		testForType('KERNEL_PREFERRED_WORK_GROUP_SIZE_MULTIPLE', assert.isNumber.bind(assert));
		testForType('KERNEL_WORK_GROUP_SIZE', assert.isNumber.bind(assert));
		testForType('KERNEL_LOCAL_MEM_SIZE', assert.isArray.bind(assert));
		testForType('KERNEL_PRIVATE_MEM_SIZE', assert.isArray.bind(assert));


		it('should throw INVALID_VALUE when looking for KERNEL_GLOBAL_WORK_SIZE', function () {
			U.withContext(function (ctx, device) {
				U.withProgram(ctx, squareKern, function (prg) {
					let k = cl.createKernel(prg, 'square');
					const getInfoBound = cl.getKernelWorkGroupInfo.bind(
						cl.getKernelWorkGroupInfo,
						k,
						device,
						cl.KERNEL_GLOBAL_WORK_SIZE
					);
					getInfoBound.should.throw(cl.INVALID_VALUE.message);
					cl.releaseKernel(k);
				});
			});
		});
	});
});

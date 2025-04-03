# OpenCL for Node.js

This is a part of [Node3D](https://github.com/node-3d) project.

[![NPM](https://badge.fury.io/js/opencl-raub.svg)](https://badge.fury.io/js/opencl-raub)
[![ESLint](https://github.com/node-3d/opencl-raub/actions/workflows/eslint.yml/badge.svg)](https://github.com/node-3d/opencl-raub/actions/workflows/eslint.yml)
[![Test](https://github.com/node-3d/opencl-raub/actions/workflows/test.yml/badge.svg)](https://github.com/node-3d/opencl-raub/actions/workflows/test.yml)
[![Cpplint](https://github.com/node-3d/opencl-raub/actions/workflows/cpplint.yml/badge.svg)](https://github.com/node-3d/opencl-raub/actions/workflows/cpplint.yml)

```console
npm i -s opencl-raub
```

> This addon is ABI-compatible across Node.js versions. **There is no compilation** during `npm i`.

**Node.js** addon with **OpenCL 1.2** bindings. This is not WebCL.

The API directly reflects the low-level **OpenCL** interface. There are minor changes
similar to how WebGL is different from OpenGL.
* All `cl*` methods are available as `cl.*` starting lowercase,
	e.g: `clCreateKernel -> cl.createKernel`.
* All `CL_*` constants are available as `cl.*`, e.g.: `CL_SUCCESS -> cl.SUCCESS`.
* The CL resource pointers are wrapped in JS objects, such as `TClPlatform`, `TClContext`, `TClEvent`.
* For `cl.enqueue*()` methods, you can pass `hasEvent = true`, in that case a `TClEvent` is returned.

Most of the method arguments comply to the original C-style spec, some parameters are omitted
due to JS specifics. For example, passing an array, you don't need to specify its length.

See [TypeScript declarations](/index.d.ts) for more details.


## Examples

1. Import the module:
	```ts
	import cl from 'opencl-raub';
	```
2. Fetch the CL control objects:
	```ts
	const { context, device } = cl.quickStart(); // see /index.js
	const queue = cl.createCommandQueue(context, device);
	```
3. Prepare the data input/output buffers:
	```ts
	const BUFFER_SIZE = 10;
	const BYTE_SIZE = BUFFER_SIZE * Uint32Array.BYTES_PER_ELEMENT;
	
	const arrayA = new Uint32Array(BUFFER_SIZE);
	const arrayB = new Uint32Array(BUFFER_SIZE);
	const arrayC = new Uint32Array(BUFFER_SIZE);
	
	for (let i = 0; i < BUFFER_SIZE; i++) {
		arrayA[i] = i;
		arrayB[i] = i * 2;
	}
	
	// Create buffer for arrayA and arrayB and copy host contents
	const bufferA = cl.createBuffer(context, cl.MEM_READ_ONLY, BYTE_SIZE);
	const bufferB = cl.createBuffer(context, cl.MEM_READ_ONLY, BYTE_SIZE);
	
	// Create buffer for arrayC to read results
	const bufferC = cl.createBuffer(context, cl.MEM_WRITE_ONLY, BYTE_SIZE);
	```
4. Create a valid CL program, e.g. from source:
	```ts
	const program = cl.createProgramWithSource(context, `
		__kernel
		void vadd(__global int *a, __global int *b, __global int *c, uint num) {
			size_t i = get_global_id(0);
			if (i < num) {
				c[i] = a[i] + b[i];
			}
		}
	`);
	cl.buildProgram(program);
	```
5. Fetch and setup a kernel from within the program:
	```ts
	// Create a kernel object
	const kernel = cl.createKernel(program, 'vadd');
	
	// Set kernel args
	cl.setKernelArg(kernel, 0, 'uint*', bufferA);
	cl.setKernelArg(kernel, 1, 'uint*', bufferB);
	cl.setKernelArg(kernel, 2, 'uint*', bufferC);
	cl.setKernelArg(kernel, 3, 'uint', BUFFER_SIZE);
	```
6. Launch the kernel and then read the results:
	```ts
	// Do the work
	cl.enqueueWriteBuffer(queue, bufferA, true, 0, BYTE_SIZE, arrayA);
	cl.enqueueWriteBuffer(queue, bufferB, true, 0, BYTE_SIZE, arrayB);
	cl.enqueueNDRangeKernel(queue, kernel, 1, null, [BUFFER_SIZE]);
	cl.enqueueReadBuffer(queue, bufferC, true, 0, BYTE_SIZE, arrayC);
	```
7. See if it worked:
	```ts
	console.log(`A = [${arrayA.join(', ')}]`);
	console.log(`B = [${arrayB.join(', ')}]`);
	console.log(`C = [${arrayC.join(', ')}]`);
	```
8. Release the CL objects:
	```ts
	cl.releaseCommandQueue(queue);
	cl.releaseKernel(kernel);
	cl.releaseProgram(program);
	cl.releaseMemObject(bufferA);
	cl.releaseMemObject(bufferB);
	cl.releaseMemObject(bufferC);
	```


See `examples` for more details. The full code of the above example is available
[here](examples/simple.js).

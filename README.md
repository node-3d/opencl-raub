# OpenCL for Node.js

This is a part of [Node3D](https://github.com/node-3d) project.

[![NPM](https://nodei.co/npm/opencl-raub.png?compact=true)](https://www.npmjs.com/package/opencl-raub)

[![Build Status](https://api.travis-ci.com/node-3d/opencl-raub.svg?branch=master)](https://travis-ci.com/node-3d/opencl-raub)
[![CodeFactor](https://www.codefactor.io/repository/github/node-3d/opencl-raub/badge)](https://www.codefactor.io/repository/github/node-3d/opencl-raub)

> npm i opencl-raub


## Synopsis

**Node.js** addon with **OpenCL** bindings.

> Note: this **addon uses N-API**, and therefore is ABI-compatible across different
Node.js versions. Addon binaries are precompiled and **there is no compilation**
step during the `npm i` command.

* Exposes low-level **OpenCL** interface, native-like functions.

The API is very close to the low-level one, although there are minor changes
when it comes to lengths and, of course, pointers.


## Usage

This is a rather low level interface, where most of the stuff is directly reflecting
OpenCL interfaces.

1. Import the module:
	```
	const cl = require('opencl-raub');
	```
2. Fetch the CL control objects:
	```
	const platform = cl.getPlatformIDs()[0];
	const devices = cl.getDeviceIDs(platform, cl.DEVICE_TYPE_ALL);
	const context = cl.createContext([cl.CONTEXT_PLATFORM, platform], devices);
	const device = cl.getContextInfo(context, cl.CONTEXT_DEVICES)[0];
	const queue = cl.createCommandQueue(context, device, null);
	```
3. Prepare the data input/output buffers:
	```
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
	```
	const program = cl.createProgramWithSource(context, `
		__kernel void vadd(__global int *a, __global int *b, __global int *c, uint num) {
			size_t i = get_global_id(0);
			if(i >= num) return;
			c[i] = a[i] + b[i];
		}
	`);
	cl.buildProgram(program);
	```
5. Fetch and setup a kernel from within the program:
	```
	// Create a kernel object
	let kernel = cl.createKernel(program, 'vadd');
	
	// Set kernel args
	cl.setKernelArg(kernel, 0, 'uint*', bufferA);
	cl.setKernelArg(kernel, 1, 'uint*', bufferB);
	cl.setKernelArg(kernel, 2, 'uint*', bufferC);
	cl.setKernelArg(kernel, 3, 'uint', BUFFER_SIZE);
	```
6. Launch the kernel and then read the results:
	```
	// Do the work
	cl.enqueueWriteBuffer(queue, bufferA, true, 0, BYTE_SIZE, arrayA);
	cl.enqueueWriteBuffer(queue, bufferB, true, 0, BYTE_SIZE, arrayB);
	cl.enqueueNDRangeKernel(queue, kernel, 1, null, [BUFFER_SIZE], null);
	cl.enqueueReadBuffer(queue, bufferC, true, 0, BYTE_SIZE, arrayC);
	```
7. See if it worked:
	```
	console.log(`A = [${arrayA.join(', ')}]`);
	console.log(`B = [${arrayB.join(', ')}]`);
	console.log(`C = [${arrayC.join(', ')}]`);
	```
8. Release the CL objects:
	```
	cl.releaseCommandQueue(queue);
	cl.releaseKernel(kernel);
	cl.releaseProgram(program);
	cl.releaseMemObject(bufferA);
	cl.releaseMemObject(bufferB);
	cl.releaseMemObject(bufferC);
	cl.releaseContext(context);
	```


See `examples` for more details. The full code of the above example is available
[here](examples/simple.js).


## Exported Methods

The returned `number` type corresponds to `cl_int` values of CL error codes.

The returned object types (`Platform`, `Context`, `Event`, etc.) are wrappers around CL
resource ids, that can be passed to further CL method calls.

* `cl.getPlatformIDs(): [Platform]` - .
* `cl.getPlatformInfo(): string` - .

* `cl.createContext(): Context` - .
* `cl.createContextFromType(): Context` - .
* `cl.retainContext(): number` - .
* `cl.releaseContext(): number` - .
* `cl.getContextInfo(): number` - .

* `cl.getDeviceIDs(): [Device]` - .
* `cl.getDeviceInfo(): string | number | boolean | Platform | [number] | null` - .
* `cl.createSubDevices(): [Device]` - .
* `cl.retainDevice(): number` - .
* `cl.releaseDevice(): number` - .

* `cl.createCommandQueue(): Queue` - .
* `cl.retainCommandQueue(): number` - .
* `cl.releaseCommandQueue(): number` - .
* `cl.getCommandQueueInfo(): number` - .
* `cl.flush(): number` - .
* `cl.finish(): number` - .

> NOTE: For `enqueueXXX()` methods, you can pass ` = true` (the last argument).
In this case a `cl.Event` is returned, it can be used to coordinate calls, profiling etc.

* `cl.enqueueReadBuffer(): number | Event` - .
* `cl.enqueueReadBufferRect(): number | Event` - .
* `cl.enqueueWriteBuffer(): number | Event` - .
* `cl.enqueueWriteBufferRect(): number | Event` - .
* `cl.enqueueCopyBuffer(): number | Event` - .
* `cl.enqueueCopyBufferRect(): number | Event` - .
* `cl.enqueueReadImage(): number | Event` - .
* `cl.enqueueWriteImage(): number | Event` - .
* `cl.enqueueCopyImage(): number | Event` - .
* `cl.enqueueCopyImageToBuffer(): number | Event` - .
* `cl.enqueueCopyBufferToImage(): number | Event` - .
* `cl.enqueueMapBuffer(): number | Event` - .
* `cl.enqueueMapImage(): number | Event` - .
* `cl.enqueueUnmapMemObject(): number | Event` - .
* `cl.enqueueNDRangeKernel(): number | Event` - .
* `cl.enqueueTask(): number | Event` - .
* `cl.enqueueNativeKernel(): number | Event` - .
* `cl.enqueueMarkerWithWaitList(): number | Event` - .
* `cl.enqueueBarrierWithWaitList(): number | Event` - .
* `cl.enqueueFillBuffer(): number | Event` - .
* `cl.enqueueFillImage(): number | Event` - .
* `cl.enqueueMigrateMemObjects(): number | Event` - .
* `cl.enqueueAcquireGLObjects(): number | Event` - .
* `cl.enqueueReleaseGLObjects(): number | Event` - .

* `cl.createKernel(): Kernel` - .
* `cl.createKernelsInProgram(): number` - .
* `cl.retainKernel(): number` - .
* `cl.releaseKernel(): number` - .
* `cl.setKernelArg(): number` - .
* `cl.getKernelInfo(): number` - .
* `cl.getKernelArgInfo(): number` - .
* `cl.getKernelWorkGroupInfo(): number` - .

* `cl.createBuffer(): number` - .
* `cl.createSubBuffer(): number` - .
* `cl.createImage(): number` - .
* `cl.retainMemObject(): number` - .
* `cl.releaseMemObject(): number` - .
* `cl.getSupportedImageFormats(): number` - .
* `cl.getMemObjectInfo(): number` - .
* `cl.getImageInfo(): number` - .
* `cl.createFromGLBuffer(): number` - .

* `cl.createProgramWithSource(): number` - .
* `cl.createProgramWithBinary(): number` - .
* `cl.createProgramWithBuiltInKernels(): number` - .
* `cl.retainProgram(): number` - .
* `cl.releaseProgram(): number` - .
* `cl.buildProgram(): number` - .
* `cl.compileProgram(): number` - .
* `cl.linkProgram(): number` - .
* `cl.unloadPlatformCompiler(): number` - .
* `cl.getProgramInfo(): number` - .
* `cl.getProgramBuildInfo(): number` - .

* `cl.retainSampler(): number` - .
* `cl.releaseSampler(): number` - .
* `cl.getSamplerInfo(): number` - .
* `cl.createSampler(): number` - .

* `cl.waitForEvents(): number` - .
* `cl.getEventInfo(): number` - .
* `cl.createUserEvent(): number` - .
* `cl.retainEvent(): number` - .
* `cl.releaseEvent(): number` - .
* `cl.setUserEventStatus(): number` - .
* `cl.setEventCallback(): number` - .
* `cl.getEventProfilingInfo(): number` - .

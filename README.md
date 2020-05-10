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


## API Notes

The methods, returning `cl_int` values of CL error codes, would return a `number` to JS.
That `number` may be checked against `cl.SUCCESS` and other error codes.

The returned object types (`Platform`, `Context`, `Event`, etc.) are wrappers around CL
resource ids, that can be passed to further CL method calls.

Most of the method arguments comply to the original C-style spec, some parameters are omitted
due to JS specifics. For example, passing an array, you don't need to specify the length.
The specific set of parameters for each method is documented below, so it can be compared
to the original spec, when in doubt.

For `enqueueXXX()` methods, you can pass `hasEvent = true` (the last argument).
In this case an `Event` is returned, it can be used to coordinate calls, profiling etc.


## Exported Methods

* `cl.getPlatformIDs(): [Platform]` -
	[clGetPlatformIDs](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetPlatformIDs.html).
* `cl.getPlatformInfo(platform: Platform, param_name: string): string` -
	[clGetPlatformInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetPlatformInfo.html).

* `cl.createContext(properties: [number | Platform], devices: [Device]): Context` -
	[clCreateContext](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateContext.html).
* `cl.createContextFromType(properties: [number | Platform], device_type: number): Context` -
	[clCreateContext](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateContextFromType.html).
* `cl.retainContext(context: Context): number` -
	[clRetainContext](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainContext.html).
* `cl.releaseContext(context: Context): number` -
	[clReleaseContext](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseContext.html).
* `cl.getContextInfo(context: Context, param_name: string): [Device] | number | [number | Platform]` -
	[clGetContextInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetContextInfo.html).

* `cl.getDeviceIDs(platform: Platform, device_type: number): [Device]` -
	[clGetDeviceIDs](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetDeviceIDs.html).
* `cl.getDeviceInfo(device: Device, param_name: number): string | number | boolean | Platform | [number] | null` -
	[clGetDeviceInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetDeviceInfo.html).
* `cl.createSubDevices(device: Device, properties: [number | Platform]): [Device]` - .
* `cl.retainDevice(device: Device): number` -
	[clRetainDevice](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainDevice.html).
* `cl.releaseDevice(device: Device): number` -
	[clReleaseDevice](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseDevice.html).

* `cl.createCommandQueue(context: Context, device: Device, properties: number): Queue` -
	[clCreateCommandQueue](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateCommandQueue.html).
* `cl.retainCommandQueue(queue: Queue): number` -
	[clRetainCommandQueue](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainCommandQueue.html).
* `cl.releaseCommandQueue(queue: Queue): number` -
	[clReleaseCommandQueue](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseCommandQueue.html).
* `cl.getCommandQueueInfo(queue: Queue, param_name: number): number` -
	[clGetCommandQueueInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetCommandQueueInfo.html).
* `cl.flush(queue: Queue): number` -
	[clFlush](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clFlush.html).
* `cl.finish(queue: Queue): number` -
	[clFinish](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clFinish.html).

* `cl.enqueueReadBuffer(queue: Queue, buffer: Memory, blocking_read: boolean, offset: number, size: number, buffer: Buffer | TypedArray, event_wait_list: [Event], hasEvent: boolean): number | Event` -
	[clEnqueueReadBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueReadBuffer.html).
* `cl.enqueueReadBufferRect(queue: Queue, buffer: Memory, blocking_read: boolean, buffer_offset: [number], host_offset: [number], region: [number], buffer_row_pitch: number, buffer_slice_pitch: number, host_row_pitch: number, host_slice_pitch: number, buffer: Buffer | TypedArray, event_wait_list: [Event], hasEvent: boolean): number | Event` -
	[clEnqueueReadBufferRect](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueReadBufferRect.html).
* `cl.enqueueWriteBuffer(): number | Event` -
	[clEnqueueWriteBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueWriteBuffer.html).
* `cl.enqueueWriteBufferRect(): number | Event` -
	[clEnqueueWriteBufferRect](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueWriteBufferRect.html).
* `cl.enqueueCopyBuffer(): number | Event` -
	[clEnqueueCopyBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueCopyBuffer.html).
* `cl.enqueueCopyBufferRect(): number | Event` -
	[clEnqueueCopyBufferRect](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueCopyBufferRect.html).
* `cl.enqueueReadImage(): number | Event` -
	[clEnqueueReadImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueReadImage.html).
* `cl.enqueueWriteImage(): number | Event` -
	[clEnqueueWriteImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueWriteImage.html).
* `cl.enqueueCopyImage(): number | Event` -
	[clEnqueueCopyImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueCopyImage.html).
* `cl.enqueueCopyImageToBuffer(): number | Event` -
	[clEnqueueCopyImageToBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueCopyImageToBuffer.html).
* `cl.enqueueCopyBufferToImage(): number | Event` -
	[clEnqueueCopyBufferToImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueCopyBufferToImage.html).
* `cl.enqueueMapBuffer(): number | Event` -
	[clEnqueueMapBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueMapBuffer.html).
* `cl.enqueueMapImage(): number | Event` -
	[clEnqueueMapImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueMapImage.html).
* `cl.enqueueUnmapMemObject(): number | Event` -
	[clEnqueueUnmapMemObject](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueUnmapMemObject.html).
* `cl.enqueueNDRangeKernel(): number | Event` -
	[clEnqueueNDRangeKernel](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueNDRangeKernel.html).
* `cl.enqueueTask(): number | Event` -
	[clEnqueueTask](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueTask.html).
* `cl.enqueueNativeKernel(): number | Event` -
	[clEnqueueNativeKernel](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueNativeKernel.html).
* `cl.enqueueMarkerWithWaitList(): number | Event` -
	[clEnqueueMarkerWithWaitList](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueMarkerWithWaitList.html).
* `cl.enqueueBarrierWithWaitList(): number | Event` -
	[clEnqueueBarrierWithWaitList](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueBarrierWithWaitList.html).
* `cl.enqueueFillBuffer(): number | Event` -
	[clEnqueueFillBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueFillBuffer.html).
* `cl.enqueueFillImage(): number | Event` -
	[clEnqueueFillImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueFillImage.html).
* `cl.enqueueMigrateMemObjects(): number | Event` -
	[clEnqueueMigrateMemObjects](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueMigrateMemObjects.html).
* `cl.enqueueAcquireGLObjects(): number | Event` -
	[clEnqueueAcquireGLObjects](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueAcquireGLObjects.html).
* `cl.enqueueReleaseGLObjects(): number | Event` -
	[clEnqueueReleaseGLObjects](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueReleaseGLObjects.html).

* `cl.createKernel(): Kernel` -
	[clCreateKernel](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateKernel.html).
* `cl.createKernelsInProgram(): number` -
	[clCreateKernelsInProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateKernelsInProgram.html).
* `cl.retainKernel(): number` -
	[clRetainKernel](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainKernel.html).
* `cl.releaseKernel(): number` -
	[clReleaseKernel](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseKernel.html).
* `cl.setKernelArg(): number` -
	[clSetKernelArg](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clSetKernelArg.html).
* `cl.getKernelInfo(): number` -
	[clGetKernelInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetKernelInfo.html).
* `cl.getKernelArgInfo(): number` -
	[clGetKernelArgInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetKernelArgInfo.html).
* `cl.getKernelWorkGroupInfo(): number` -
	[clGetKernelWorkGroupInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetKernelWorkGroupInfo.html).

* `cl.createBuffer(): number` -
	[clCreateBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateBuffer.html).
* `cl.createSubBuffer(): number` -
	[clCreateSubBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateSubBuffer.html).
* `cl.createImage(): number` -
	[clCreateImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateImage.html).
* `cl.retainMemObject(): number` -
	[clRetainMemObject](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainMemObject.html).
* `cl.releaseMemObject(): number` -
	[clReleaseMemObject](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseMemObject.html).
* `cl.getSupportedImageFormats(): number` -
	[clGetSupportedImageFormats](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetSupportedImageFormats.html).
* `cl.getMemObjectInfo(): number` -
	[clGetMemObjectInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetMemObjectInfo.html).
* `cl.getImageInfo(): number` -
	[clGetImageInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetImageInfo.html).
* `cl.createFromGLBuffer(): number` -
	[clCreateFromGLBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateFromGLBuffer.html).

* `cl.createProgramWithSource(): number` -
	[clCreateProgramWithSource](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateProgramWithSource.html).
* `cl.createProgramWithBinary(): number` -
	[clCreateProgramWithBinary](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateProgramWithBinary.html).
* `cl.createProgramWithBuiltInKernels(): number` -
	[clCreateProgramWithBuiltInKernels](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateProgramWithBuiltInKernels.html).
* `cl.retainProgram(): number` -
	[clRetainProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainProgram.html).
* `cl.releaseProgram(): number` -
	[clReleaseProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseProgram.html).
* `cl.buildProgram(): number` -
	[clBuildProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clBuildProgram.html).
* `cl.compileProgram(): number` -
	[clCompileProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCompileProgram.html).
* `cl.linkProgram(): number` -
	[clLinkProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clLinkProgram.html).
* `cl.unloadPlatformCompiler(): number` -
	[clUnloadPlatformCompiler](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clUnloadPlatformCompiler.html).
* `cl.getProgramInfo(): number` -
	[clGetProgramInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetProgramInfo.html).
* `cl.getProgramBuildInfo(): number` -
	[clGetProgramBuildInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetProgramBuildInfo.html).

* `cl.retainSampler(): number` -
	[clRetainSampler](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainSampler.html).
* `cl.releaseSampler(): number` -
	[clReleaseSampler](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseSampler.html).
* `cl.getSamplerInfo(): number` -
	[clGetSamplerInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetSamplerInfo.html).
* `cl.createSampler(): number` -
	[clCreateSampler](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateSampler.html).

* `cl.waitForEvents(): number` -
	[clWaitForEvents](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clWaitForEvents.html).
* `cl.getEventInfo(): number` -
	[clGetEventInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetEventInfo.html).
* `cl.createUserEvent(): number` -
	[clCreateUserEvent](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateUserEvent.html).
* `cl.retainEvent(): number` -
	[clRetainEvent](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainEvent.html).
* `cl.releaseEvent(): number` -
	[clReleaseEvent](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseEvent.html).
* `cl.setUserEventStatus(): number` -
	[clSetUserEventStatus](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clSetUserEventStatus.html).
* `cl.setEventCallback(): number` -
	[clSetEventCallback](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clSetEventCallback.html).
* `cl.getEventProfilingInfo(): number` -
	[clGetEventProfilingInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetEventProfilingInfo.html).

#ifndef OPENCL_COMMON_H
#define OPENCL_COMMON_H

#include <addon-tools.hpp>

#include <string>
#include <memory>
#include <vector>

#define CL_TARGET_OPENCL_VERSION 120

#if defined (__APPLE__)
	#ifdef __ECLIPSE__
		#include <cl_platform.h>
		#include <cl.h>
		#include <cl_ext.h>
	#else
		#include <OpenCL/opencl.h>
	#endif
	#define HAS_clGetContextInfo
#elif defined(_WIN32)
	#include <CL/opencl.h>
	#define strcasecmp _stricmp
	#define strncasecmp _strnicmp
#else
	#include <CL/opencl.h>
#endif

#ifndef CL_CURRENT_DEVICE_FOR_GL_CONTEXT_KHR
	#define CL_CURRENT_DEVICE_FOR_GL_CONTEXT_KHR 0x2006
#endif
#ifndef CL_DEVICES_FOR_GL_CONTEXT_KHR
	#define CL_DEVICES_FOR_GL_CONTEXT_KHR 0x2007
#endif

#define CHECK_ERR(code) { \
	cl_int _err = (code); \
	if (_err != CL_SUCCESS) { THROW_ERR(_err); } \
}

#define THROW_ERR(code) { \
	JS_THROW(opencl::getExceptionMessage(code)); \
	RET_UNDEFINED; \
}

namespace opencl {

void getPtrAndLen(Napi::Object obj, void** ptr, size_t *len);
const char* getExceptionMessage(cl_int code);

JS_METHOD(createKernel);
JS_METHOD(createKernelsInProgram);
JS_METHOD(retainKernel);
JS_METHOD(releaseKernel);
JS_METHOD(setKernelArg);
JS_METHOD(getKernelInfo);
JS_METHOD(getKernelArgInfo);
JS_METHOD(getKernelWorkGroupInfo);

JS_METHOD(createBuffer);
JS_METHOD(createSubBuffer);
JS_METHOD(createImage);
JS_METHOD(retainMemObject);
JS_METHOD(releaseMemObject);
JS_METHOD(getSupportedImageFormats);
JS_METHOD(getMemObjectInfo);
JS_METHOD(getImageInfo);

JS_METHOD(getPlatformIDs);
JS_METHOD(getPlatformInfo);

JS_METHOD(createProgramWithSource);
JS_METHOD(createProgramWithBinary);
JS_METHOD(createProgramWithBuiltInKernels);
JS_METHOD(retainProgram);
JS_METHOD(releaseProgram);
JS_METHOD(buildProgram);
JS_METHOD(compileProgram);
JS_METHOD(linkProgram);
JS_METHOD(unloadPlatformCompiler);
JS_METHOD(getProgramInfo);
JS_METHOD(getProgramBuildInfo);

JS_METHOD(retainSampler);
JS_METHOD(releaseSampler);
JS_METHOD(getSamplerInfo);
JS_METHOD(createSampler);
JS_METHOD(createCommandQueue);

JS_METHOD(retainCommandQueue);
JS_METHOD(releaseCommandQueue);
JS_METHOD(getCommandQueueInfo);
JS_METHOD(flush);
JS_METHOD(finish);
JS_METHOD(enqueueReadBuffer);
JS_METHOD(enqueueReadBufferRect);
JS_METHOD(enqueueWriteBuffer);
JS_METHOD(enqueueWriteBufferRect);
JS_METHOD(enqueueCopyBuffer);
JS_METHOD(enqueueCopyBufferRect);
JS_METHOD(enqueueReadImage);
JS_METHOD(enqueueWriteImage);
JS_METHOD(enqueueCopyImage);
JS_METHOD(enqueueCopyImageToBuffer);
JS_METHOD(enqueueCopyBufferToImage);
JS_METHOD(enqueueMapBuffer);
JS_METHOD(enqueueMapImage);
JS_METHOD(enqueueUnmapMemObject);
JS_METHOD(enqueueNDRangeKernel);
JS_METHOD(enqueueTask);
JS_METHOD(enqueueNativeKernel);
JS_METHOD(enqueueMarkerWithWaitList);
JS_METHOD(enqueueBarrierWithWaitList);
JS_METHOD(enqueueFillBuffer);
JS_METHOD(enqueueFillImage);
JS_METHOD(enqueueMigrateMemObjects);

JS_METHOD(createContext);
JS_METHOD(retainContext);
JS_METHOD(releaseContext);
JS_METHOD(getContextInfo);

JS_METHOD(getDeviceIDs);
JS_METHOD(getDeviceInfo);
JS_METHOD(createSubDevices);
JS_METHOD(retainDevice);
JS_METHOD(releaseDevice);

JS_METHOD(waitForEvents);
JS_METHOD(getEventInfo);
JS_METHOD(createUserEvent);
JS_METHOD(retainEvent);
JS_METHOD(releaseEvent);
JS_METHOD(setUserEventStatus);
JS_METHOD(setEventCallback);
JS_METHOD(getEventProfilingInfo);

} // namespace opencl

#endif // OPENCL_COMMON_H

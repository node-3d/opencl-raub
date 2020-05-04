#include "common.hpp"


namespace opencl {

void getPtrAndLen(Napi::Object obj, void** ptr, size_t *len) {
	*ptr = nullptr;
	int intSize = 0;
	if (obj.IsTypedArray() || obj.IsArrayBuffer()) {
		*ptr = getArrayData<uint8_t>(obj.Env(), obj, &intSize);
	} else if (obj.IsBuffer()) {
		*ptr = getBufferData<uint8_t>(obj.Env(), obj, &intSize);
	}
	if (len) {
		*len = intSize;
	}
}

#define CASE_RET(CODE, MSG) case CODE: return MSG;

const char* getExceptionMessage(const cl_int code) {
	switch (code) {
		CASE_RET(CL_SUCCESS, "Success!");
		CASE_RET(CL_DEVICE_NOT_FOUND, "Device not found.");
		CASE_RET(CL_DEVICE_NOT_AVAILABLE, "Device not available");
		CASE_RET(CL_COMPILER_NOT_AVAILABLE, "Compiler not available");
		CASE_RET(CL_MEM_OBJECT_ALLOCATION_FAILURE, "Memory object allocation failure");
		CASE_RET(CL_OUT_OF_RESOURCES, "Out of resources");
		CASE_RET(CL_OUT_OF_HOST_MEMORY, "Out of host memory");
		CASE_RET(CL_PROFILING_INFO_NOT_AVAILABLE, "Profiling information not available");
		CASE_RET(CL_MEM_COPY_OVERLAP, "Memory copy overlap");
		CASE_RET(CL_IMAGE_FORMAT_MISMATCH, "Image format mismatch");
		CASE_RET(CL_IMAGE_FORMAT_NOT_SUPPORTED, "Image format not supported");
		CASE_RET(CL_BUILD_PROGRAM_FAILURE, "Program build failure");
		CASE_RET(CL_MAP_FAILURE, "Map failure");
		CASE_RET(CL_MISALIGNED_SUB_BUFFER_OFFSET, "Misaligned sub-buffer offset");
		CASE_RET(CL_EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST, "Execution status error for events in wait list");
		CASE_RET(CL_COMPILE_PROGRAM_FAILURE, "Compile program failure");
		CASE_RET(CL_LINKER_NOT_AVAILABLE, "Linker not available");
		CASE_RET(CL_LINK_PROGRAM_FAILURE, "Link program failure");
		CASE_RET(CL_DEVICE_PARTITION_FAILED, "Device partition failed");
		CASE_RET(CL_KERNEL_ARG_INFO_NOT_AVAILABLE, "Kernel argument info not available");
		CASE_RET(CL_INVALID_VALUE, "Invalid value");
		CASE_RET(CL_INVALID_DEVICE_TYPE, "Invalid device type");
		CASE_RET(CL_INVALID_PLATFORM, "Invalid platform");
		CASE_RET(CL_INVALID_DEVICE, "Invalid device");
		CASE_RET(CL_INVALID_CONTEXT, "Invalid context");
		CASE_RET(CL_INVALID_QUEUE_PROPERTIES, "Invalid queue properties");
		CASE_RET(CL_INVALID_COMMAND_QUEUE, "Invalid command queue");
		CASE_RET(CL_INVALID_HOST_PTR, "Invalid host pointer");
		CASE_RET(CL_INVALID_MEM_OBJECT, "Invalid memory object");
		CASE_RET(CL_INVALID_IMAGE_FORMAT_DESCRIPTOR, "Invalid image format descriptor");
		CASE_RET(CL_INVALID_IMAGE_SIZE, "Invalid image size");
		CASE_RET(CL_INVALID_SAMPLER, "Invalid sampler");
		CASE_RET(CL_INVALID_BINARY, "Invalid binary");
		CASE_RET(CL_INVALID_BUILD_OPTIONS, "Invalid build options");
		CASE_RET(CL_INVALID_PROGRAM, "Invalid program");
		CASE_RET(CL_INVALID_PROGRAM_EXECUTABLE, "Invalid program executable");
		CASE_RET(CL_INVALID_KERNEL_NAME, "Invalid kernel name");
		CASE_RET(CL_INVALID_KERNEL_DEFINITION, "Invalid kernel definition");
		CASE_RET(CL_INVALID_KERNEL, "Invalid kernel");
		CASE_RET(CL_INVALID_ARG_INDEX, "Invalid argument index");
		CASE_RET(CL_INVALID_ARG_VALUE, "Invalid argument value");
		CASE_RET(CL_INVALID_ARG_SIZE, "Invalid argument size");
		CASE_RET(CL_INVALID_KERNEL_ARGS, "Invalid kernel arguments");
		CASE_RET(CL_INVALID_WORK_DIMENSION, "Invalid work dimension");
		CASE_RET(CL_INVALID_WORK_GROUP_SIZE, "Invalid work group size");
		CASE_RET(CL_INVALID_WORK_ITEM_SIZE, "Invalid work item size");
		CASE_RET(CL_INVALID_GLOBAL_OFFSET, "Invalid global offset");
		CASE_RET(CL_INVALID_EVENT_WAIT_LIST, "Invalid event wait list");
		CASE_RET(CL_INVALID_EVENT, "Invalid event");
		CASE_RET(CL_INVALID_OPERATION, "Invalid operation");
		CASE_RET(CL_INVALID_GL_OBJECT, "Invalid OpenGL object");
		CASE_RET(CL_INVALID_BUFFER_SIZE, "Invalid buffer size");
		CASE_RET(CL_INVALID_MIP_LEVEL, "Invalid mip-map level");
		CASE_RET(CL_INVALID_GLOBAL_WORK_SIZE, "Invalid global work size");
		CASE_RET(CL_INVALID_PROPERTY, "Invalid property");
		CASE_RET(CL_INVALID_IMAGE_DESCRIPTOR, "Invalid image descriptor");
		CASE_RET(CL_INVALID_COMPILER_OPTIONS, "Invalid compiler options");
		CASE_RET(CL_INVALID_LINKER_OPTIONS, "Invalid linker options");
		CASE_RET(CL_INVALID_DEVICE_PARTITION_COUNT, "Invalid device partition count");
		default: return "Unknown error";
	}
}

} // namespace opencl

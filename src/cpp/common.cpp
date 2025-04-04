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

const char* getExceptionMessage(const cl_int code) {
	switch (code) {
		case CL_SUCCESS:
			return "Success!";
		case CL_DEVICE_NOT_FOUND:
			return "Device not found.";
		case CL_DEVICE_NOT_AVAILABLE:
			return "Device not available";
		case CL_COMPILER_NOT_AVAILABLE:
			return "Compiler not available";
		case CL_MEM_OBJECT_ALLOCATION_FAILURE:
			return "Memory object allocation failure";
		case CL_OUT_OF_RESOURCES:
			return "Out of resources";
		case CL_OUT_OF_HOST_MEMORY:
			return "Out of host memory";
		case CL_PROFILING_INFO_NOT_AVAILABLE:
			return "Profiling information not available";
		case CL_MEM_COPY_OVERLAP:
			return "Memory copy overlap";
		case CL_IMAGE_FORMAT_MISMATCH:
			return "Image format mismatch";
		case CL_IMAGE_FORMAT_NOT_SUPPORTED:
			return "Image format not supported";
		case CL_BUILD_PROGRAM_FAILURE:
			return "Program build failure";
		case CL_MAP_FAILURE:
			return "Map failure";
		case CL_MISALIGNED_SUB_BUFFER_OFFSET:
			return "Misaligned sub-buffer offset";
		case CL_EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST:
			return "Execution status error for events in wait list";
		case CL_COMPILE_PROGRAM_FAILURE:
			return "Compile program failure";
		case CL_LINKER_NOT_AVAILABLE:
			return "Linker not available";
		case CL_LINK_PROGRAM_FAILURE:
			return "Link program failure";
		case CL_DEVICE_PARTITION_FAILED:
			return "Device partition failed";
		case CL_KERNEL_ARG_INFO_NOT_AVAILABLE:
			return "Kernel argument info not available";
		case CL_INVALID_VALUE:
			return "Invalid value";
		case CL_INVALID_DEVICE_TYPE:
			return "Invalid device type";
		case CL_INVALID_PLATFORM:
			return "Invalid platform";
		case CL_INVALID_DEVICE:
			return "Invalid device";
		case CL_INVALID_CONTEXT:
			return "Invalid context";
		case CL_INVALID_QUEUE_PROPERTIES:
			return "Invalid queue properties";
		case CL_INVALID_COMMAND_QUEUE:
			return "Invalid command queue";
		case CL_INVALID_HOST_PTR:
			return "Invalid host pointer";
		case CL_INVALID_MEM_OBJECT:
			return "Invalid memory object";
		case CL_INVALID_IMAGE_FORMAT_DESCRIPTOR:
			return "Invalid image format descriptor";
		case CL_INVALID_IMAGE_SIZE:
			return "Invalid image size";
		case CL_INVALID_SAMPLER:
			return "Invalid sampler";
		case CL_INVALID_BINARY:
			return "Invalid binary";
		case CL_INVALID_BUILD_OPTIONS:
			return "Invalid build options";
		case CL_INVALID_PROGRAM:
			return "Invalid program";
		case CL_INVALID_PROGRAM_EXECUTABLE:
			return "Invalid program executable";
		case CL_INVALID_KERNEL_NAME:
			return "Invalid kernel name";
		case CL_INVALID_KERNEL_DEFINITION:
			return "Invalid kernel definition";
		case CL_INVALID_KERNEL:
			return "Invalid kernel";
		case CL_INVALID_ARG_INDEX:
			return "Invalid argument index";
		case CL_INVALID_ARG_VALUE:
			return "Invalid argument value";
		case CL_INVALID_ARG_SIZE:
			return "Invalid argument size";
		case CL_INVALID_KERNEL_ARGS:
			return "Invalid kernel arguments";
		case CL_INVALID_WORK_DIMENSION:
			return "Invalid work dimension";
		case CL_INVALID_WORK_GROUP_SIZE:
			return "Invalid work group size";
		case CL_INVALID_WORK_ITEM_SIZE:
			return "Invalid work item size";
		case CL_INVALID_GLOBAL_OFFSET:
			return "Invalid global offset";
		case CL_INVALID_EVENT_WAIT_LIST:
			return "Invalid event wait list";
		case CL_INVALID_EVENT:
			return "Invalid event";
		case CL_INVALID_OPERATION:
			return "Invalid operation";
		case CL_INVALID_GL_OBJECT:
			return "Invalid OpenGL object";
		case CL_INVALID_BUFFER_SIZE:
			return "Invalid buffer size";
		case CL_INVALID_MIP_LEVEL:
			return "Invalid mip-map level";
		case CL_INVALID_GLOBAL_WORK_SIZE:
			return "Invalid global work size";
		case CL_INVALID_PROPERTY:
			return "Invalid property";
		case CL_INVALID_IMAGE_DESCRIPTOR:
			return "Invalid image descriptor";
		case CL_INVALID_COMPILER_OPTIONS:
			return "Invalid compiler options";
		case CL_INVALID_LINKER_OPTIONS:
			return "Invalid linker options";
		case CL_INVALID_DEVICE_PARTITION_COUNT:
			return "Invalid device partition count";
		case CL_PLATFORM_NOT_FOUND_KHR:
			return "Platform not found (ICD)";
		case CL_INVALID_GL_SHAREGROUP_REFERENCE_KHR:
			return "Invalid GL sharegroup reference";
		default:
			fprintf(stderr, "OpenCL Unknown error: %d\n", code);
			return "Unknown error";
	}
}

} // namespace opencl

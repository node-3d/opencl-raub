#include "types.hpp"


namespace opencl {

/* Device APIs */
// extern CL_API_ENTRY cl_int CL_API_CALL
// clGetDeviceIDs(cl_platform_id   /* platform */,
//                cl_device_type   /* device_type */,
//                cl_uint          /* num_entries */,
//                cl_device_id *   /* devices */,
//                cl_uint *        /* num_devices */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(getDeviceIDs) { NAPI_ENV;
	REQ_CL_ARG(0, platform, cl_platform_id);
	USE_OFFS_ARG(1, type, CL_DEVICE_TYPE_ALL);
	
	cl_uint n = 0;
	CHECK_ERR(clGetDeviceIDs(platform, type, 0, nullptr, &n));
	
	std::unique_ptr<cl_device_id[]> devices(new cl_device_id[n]);
	CHECK_ERR(clGetDeviceIDs(
		platform,
		type,
		n,
		devices.get(),
		nullptr
	));
	
	Napi::Array deviceArray = Napi::Array::New(env);
	for (uint32_t i = 0; i < n; i++) {
		// This is a noop for root-level devices but properly retains sub-devices.
		CHECK_ERR(clRetainDevice(devices[i]));
		deviceArray.Set(i, Wrapper::fromRaw(env, devices[i]));
	}
	
	RET_VALUE(deviceArray);
}

inline Napi::Value getDeviceInfoString(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	char param_value[1024];
	size_t param_value_size_ret = 0;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(char) * 1024,
		param_value,
		&param_value_size_ret
	));
	RET_STR(param_value);
}

inline Napi::Value getDeviceInfoPlatform(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	cl_platform_id param_value;
	
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(cl_platform_id),
		&param_value,
		nullptr
	));
	
	if (param_value) {
		RET_WRAPPER(param_value);
	}
	RET_NULL;
}

inline Napi::Value getDeviceInfoType(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	cl_device_type param_value;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(cl_device_type),
		&param_value,
		nullptr
	));
	RET_NUM(param_value);
}

inline Napi::Value getDeviceInfoMemType(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	cl_device_local_mem_type param_value;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(cl_device_local_mem_type),
		&param_value,
		nullptr
	));
	RET_NUM(param_value);
}

inline Napi::Value getDeviceInfoCacheType(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	cl_device_mem_cache_type param_value;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(cl_device_mem_cache_type),
		&param_value,
		nullptr
	));
	RET_NUM(param_value);
}

inline Napi::Value getDeviceInfoCaps(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	cl_device_exec_capabilities param_value;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(cl_device_exec_capabilities),
		&param_value,
		nullptr
	));
	RET_NUM(param_value);
}

inline Napi::Value getDeviceInfoQueueProps(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	cl_command_queue_properties param_value;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(cl_command_queue_properties),
		&param_value,
		nullptr
	));
	RET_NUM(param_value);
}

inline Napi::Value getDeviceInfoFpConfig(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	cl_device_fp_config param_value;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(cl_device_fp_config),
		&param_value,
		nullptr
	));
	RET_NUM(param_value);
}

inline Napi::Value getDeviceInfoMaxWorkItem(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	// get CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS param
	cl_uint max_work_item_dimensions;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS,
		sizeof(size_t),
		&max_work_item_dimensions,
		nullptr
	));
	
	// get CL_DEVICE_MAX_WORK_ITEM_SIZES array param
	std::unique_ptr<size_t[]> param_value(new size_t[max_work_item_dimensions]);
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		max_work_item_dimensions * sizeof(size_t),
		param_value.get(),
		nullptr
	));
	
	Napi::Array arr = Napi::Array::New(env);
	for(cl_uint i = 0; i < max_work_item_dimensions; i++) {
		arr.Set(i, JS_NUM(param_value[i]));
	}
	
	RET_VALUE(arr);
}

inline Napi::Value getDeviceInfoBool(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	cl_bool param_value;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(cl_bool),
		&param_value,
		nullptr
	));
	// keeping as Integer vs Boolean so comparisons with cl.TRUE/cl.FALSE work
	RET_BOOL(param_value == CL_TRUE);
}

inline Napi::Value getDeviceInfoUint(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	cl_uint param_value;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(cl_uint),
		&param_value,
		nullptr
	));
	RET_NUM(param_value);
}

inline Napi::Value getDeviceInfoUlong(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	cl_ulong param_value;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(cl_ulong),
		&param_value,
		nullptr
	));
	
	/**
		JS Compatibility
		
		As JS does not support 64 bits integer, we return a 2-integer array with
			output_values[0] = (input_value >> 32) & 0xffffffff;
			output_values[1] = input_value & 0xffffffff;
		
		and reconstruction as
			input_value = ((int64_t) output_values[0]) << 32) | output_values[1];
	*/
	// TODO: maybe bollox, try modern x64 values
	Napi::Array arr = Napi::Array::New(env);
	arr.Set(0u, JS_NUM(param_value>>32)); // hi
	arr.Set(1u, JS_NUM(param_value & 0xffffffff)); // lo
	RET_VALUE(arr);
}

inline Napi::Value getDeviceInfoSize(Napi::Env env, cl_device_id device_id, uint32_t param_name) {
	size_t param_value;
	CHECK_ERR(clGetDeviceInfo(
		device_id,
		param_name,
		sizeof(size_t),
		&param_value,
		nullptr
	));
	RET_NUM(param_value);
}

#define CASES_CL_STRING                                                                \
	case CL_DEVICE_NAME:                                                               \
	case CL_DEVICE_VENDOR:                                                             \
	case CL_DRIVER_VERSION:                                                            \
	case CL_DEVICE_PROFILE:                                                            \
	case CL_DEVICE_VERSION:                                                            \
	case CL_DEVICE_OPENCL_C_VERSION:                                                   \
	case CL_DEVICE_EXTENSIONS:

#define CASES_CL_FP                                                                    \
	case CL_DEVICE_HALF_FP_CONFIG:                                                     \
	case CL_DEVICE_SINGLE_FP_CONFIG:                                                   \
	case CL_DEVICE_DOUBLE_FP_CONFIG:


#if !defined (__APPLE__)
	#define CASES_CL_UINT                                                              \
		case CL_DEVICE_ADDRESS_BITS:                                                   \
		case CL_DEVICE_GLOBAL_MEM_CACHELINE_SIZE:                                      \
		case CL_DEVICE_MAX_CLOCK_FREQUENCY:                                            \
		case CL_DEVICE_MAX_COMPUTE_UNITS:                                              \
		case CL_DEVICE_MAX_CONSTANT_ARGS:                                              \
		case CL_DEVICE_MAX_READ_IMAGE_ARGS:                                            \
		case CL_DEVICE_MAX_SAMPLERS:                                                   \
		case CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS:                                       \
		case CL_DEVICE_MAX_WRITE_IMAGE_ARGS:                                           \
		case CL_DEVICE_MEM_BASE_ADDR_ALIGN:                                            \
		case CL_DEVICE_MIN_DATA_TYPE_ALIGN_SIZE:                                       \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_CHAR:                                       \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_SHORT:                                      \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_INT:                                        \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_LONG:                                       \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_FLOAT:                                      \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE:                                     \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_HALF:                                       \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_CHAR:                                    \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_SHORT:                                   \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_INT:                                     \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_LONG:                                    \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT:                                   \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE:                                  \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_HALF:                                    \
		case CL_DEVICE_VENDOR_ID:                                                      \
		case CL_DEVICE_COMPUTE_CAPABILITY_MAJOR_NV:                                    \
		case CL_DEVICE_COMPUTE_CAPABILITY_MINOR_NV:                                    \
		case CL_DEVICE_REGISTERS_PER_BLOCK_NV:                                         \
		case CL_DEVICE_WARP_SIZE_NV:                                                   \
		case CL_DEVICE_GPU_OVERLAP_NV:                                                 \
		case CL_DEVICE_KERNEL_EXEC_TIMEOUT_NV:                                         \
		case CL_DEVICE_INTEGRATED_MEMORY_NV:                                           \
		case CL_DEVICE_REFERENCE_COUNT:                                                \
		case CL_DEVICE_PARTITION_MAX_SUB_DEVICES:
#else
	#define CASES_CL_UINT                                                              \
		case CL_DEVICE_ADDRESS_BITS:                                                   \
		case CL_DEVICE_GLOBAL_MEM_CACHELINE_SIZE:                                      \
		case CL_DEVICE_MAX_CLOCK_FREQUENCY:                                            \
		case CL_DEVICE_MAX_COMPUTE_UNITS:                                              \
		case CL_DEVICE_MAX_CONSTANT_ARGS:                                              \
		case CL_DEVICE_MAX_READ_IMAGE_ARGS:                                            \
		case CL_DEVICE_MAX_SAMPLERS:                                                   \
		case CL_DEVICE_MAX_WORK_ITEM_DIMENSIONS:                                       \
		case CL_DEVICE_MAX_WRITE_IMAGE_ARGS:                                           \
		case CL_DEVICE_MEM_BASE_ADDR_ALIGN:                                            \
		case CL_DEVICE_MIN_DATA_TYPE_ALIGN_SIZE:                                       \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_CHAR:                                       \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_SHORT:                                      \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_INT:                                        \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_LONG:                                       \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_FLOAT:                                      \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE:                                     \
		case CL_DEVICE_NATIVE_VECTOR_WIDTH_HALF:                                       \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_CHAR:                                    \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_SHORT:                                   \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_INT:                                     \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_LONG:                                    \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT:                                   \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE:                                  \
		case CL_DEVICE_PREFERRED_VECTOR_WIDTH_HALF:                                    \
		case CL_DEVICE_VENDOR_ID:                                                      \
		case CL_DEVICE_REFERENCE_COUNT:                                                \
		case CL_DEVICE_PARTITION_MAX_SUB_DEVICES:
#endif

#define CASES_CL_BOOL                                                                  \
	case CL_DEVICE_AVAILABLE:                                                          \
	case CL_DEVICE_COMPILER_AVAILABLE:                                                 \
	case CL_DEVICE_ENDIAN_LITTLE:                                                      \
	case CL_DEVICE_ERROR_CORRECTION_SUPPORT:                                           \
	case CL_DEVICE_HOST_UNIFIED_MEMORY:                                                \
	case CL_DEVICE_IMAGE_SUPPORT:

#define CASES_CL_ULONG                                                                 \
	case CL_DEVICE_GLOBAL_MEM_CACHE_SIZE:                                              \
	case CL_DEVICE_GLOBAL_MEM_SIZE:                                                    \
	case CL_DEVICE_LOCAL_MEM_SIZE:                                                     \
	case CL_DEVICE_MAX_CONSTANT_BUFFER_SIZE:                                           \
	case CL_DEVICE_MAX_MEM_ALLOC_SIZE:

#define CASES_CL_SIZE                                                                  \
	case CL_DEVICE_IMAGE2D_MAX_HEIGHT:                                                 \
	case CL_DEVICE_IMAGE2D_MAX_WIDTH:                                                  \
	case CL_DEVICE_IMAGE3D_MAX_DEPTH:                                                  \
	case CL_DEVICE_IMAGE3D_MAX_HEIGHT:                                                 \
	case CL_DEVICE_IMAGE3D_MAX_WIDTH:                                                  \
	case CL_DEVICE_MAX_PARAMETER_SIZE:                                                 \
	case CL_DEVICE_MAX_WORK_GROUP_SIZE:                                                \
	case CL_DEVICE_PROFILING_TIMER_RESOLUTION:                                         \
	case CL_DEVICE_IMAGE_MAX_BUFFER_SIZE:                                              \
	case CL_DEVICE_IMAGE_MAX_ARRAY_SIZE:

// extern CL_API_ENTRY cl_int CL_API_CALL
// clGetDeviceInfo(cl_device_id    /* device */,
//                 cl_device_info  /* param_name */,
//                 size_t          /* param_value_size */,
//                 void *          /* param_value */,
//                 size_t *        /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(getDeviceInfo) { NAPI_ENV;
	REQ_CL_ARG(0, device_id, cl_device_id);
	REQ_UINT32_ARG(1, param_name);
	
	switch (param_name) {
	CASES_CL_STRING
		return getDeviceInfoString(env, device_id, param_name);
	case CL_DEVICE_PLATFORM:
		return getDeviceInfoPlatform(env, device_id, param_name);
	case CL_DEVICE_TYPE:
		return getDeviceInfoType(env, device_id, param_name);
	case CL_DEVICE_LOCAL_MEM_TYPE:
		return getDeviceInfoMemType(env, device_id, param_name);
	case CL_DEVICE_GLOBAL_MEM_CACHE_TYPE:
		return getDeviceInfoCacheType(env, device_id, param_name);
	case CL_DEVICE_EXECUTION_CAPABILITIES:
		return getDeviceInfoCaps(env, device_id, param_name);
	case CL_DEVICE_QUEUE_PROPERTIES:
		return getDeviceInfoQueueProps(env, device_id, param_name);
	CASES_CL_FP
		return getDeviceInfoFpConfig(env, device_id, param_name);
	case CL_DEVICE_MAX_WORK_ITEM_SIZES:
		return getDeviceInfoMaxWorkItem(env, device_id, param_name);
	CASES_CL_BOOL
		return getDeviceInfoBool(env, device_id, param_name);
	CASES_CL_UINT
		return getDeviceInfoUint(env, device_id, param_name);
	CASES_CL_ULONG
		return getDeviceInfoUlong(env, device_id, param_name);
	CASES_CL_SIZE
		return getDeviceInfoSize(env, device_id, param_name);
	default: break;
	}
	
	THROW_ERR(CL_INVALID_VALUE);
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clCreateSubDevices(cl_device_id                         /* in_device */,
//                    const cl_device_partition_property * /* properties */,
//                    cl_uint                              /* num_devices */,
//                    cl_device_id *                       /* out_devices */,
//                    cl_uint *                            /* num_devices_ret */) CL_API_SUFFIX__VERSION_1_2;
JS_METHOD(createSubDevices) { NAPI_ENV;
	REQ_CL_ARG(0, deviceId, cl_device_id);
	
	// Arg 2
	std::vector<cl_device_partition_property> cl_properties;
	REQ_ARRAY_ARG(1, js_properties);
	for (unsigned int i = 0; i < js_properties.Length(); ++ i) {
		cl_properties.push_back(js_properties.Get(i).ToNumber().Int64Value());
	}

	cl_uint capacity = 0;
	cl_device_partition_property pps[] = {
		CL_DEVICE_PARTITION_BY_COUNTS,
		3,
		1,
		CL_DEVICE_PARTITION_BY_COUNTS_LIST_END,
		0
	};

	cl_int ret = clCreateSubDevices(deviceId, pps, 0, nullptr, &capacity);
	CHECK_ERR(ret);
	
	std::unique_ptr<cl_device_id[]> subDevices(new cl_device_id[capacity]);
	ret = clCreateSubDevices(
		deviceId,
		&cl_properties.front(),
		capacity,
		subDevices.get(),
		nullptr
	);
	CHECK_ERR(ret);
	
	Napi::Array subDevicesArray = Napi::Array::New(env);
	for (uint32_t i = 0; i<capacity; i++) {
		subDevicesArray.Set(i, Wrapper::fromRaw(env, subDevices[i]));
	}
	
	RET_VALUE(subDevicesArray);
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clRetainDevice(cl_device_id /* device */) CL_API_SUFFIX__VERSION_1_2;
JS_METHOD(retainDevice) { NAPI_ENV;
	REQ_CL_ARG(0, deviceId, cl_device_id);
	
	cl_device_id parentId = nullptr;
	
	clGetDeviceInfo(
		deviceId,
		CL_DEVICE_PARENT_DEVICE,
		sizeof(cl_device_id),
		&parentId,
		nullptr
	);
	
	if (parentId == nullptr) {
		THROW_ERR(CL_INVALID_DEVICE);
	}
	
	cl_int ret = clRetainDevice(deviceId);
	
	CHECK_ERR(ret);
	RET_NUM(ret);
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clReleaseDevice(cl_device_id /* device */) CL_API_SUFFIX__VERSION_1_2;
JS_METHOD(releaseDevice) { NAPI_ENV;
	REQ_CL_ARG(0, deviceId, cl_device_id);
	
	cl_device_id parentId = nullptr;
	
	clGetDeviceInfo(
		deviceId,
		CL_DEVICE_PARENT_DEVICE,
		sizeof(cl_device_id),
		&parentId,
		nullptr
	);
	
	if (parentId == nullptr) {
		THROW_ERR(CL_INVALID_DEVICE);
	}
	
	cl_int ret = clReleaseDevice(deviceId);
	
	CHECK_ERR(ret);
	RET_NUM(ret);
}

} // namespace opencl

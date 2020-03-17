#include "types.hpp"


#define JS_CL_CONSTANT(name)                                                  \
	exports.Set(#name, static_cast<double>(CL_ ## name));

#define JS_CONSTANT(name, value)                                              \
	exports.Set(#name, JS_NUM(value));

#define JS_ERROR(msg)                                                         \
	Napi::Error::New(env, msg).Value()

#define JS_CL_ERROR(name)                                                     \
	exports.Set(#name, JS_ERROR(opencl::getExceptionMessage(CL_ ## name)));

#define JS_CL_SET_METHOD(name)                                                \
	exports.DefineProperty(                                                   \
		Napi::PropertyDescriptor::Function(                                   \
			env,                                                              \
			exports,                                                          \
			#name,                                                            \
			opencl::name,                                                     \
			napi_writable                                                     \
		)                                                                     \
	);


Napi::Object initModule(Napi::Env env, Napi::Object exports) {
	
	exports.Set("CL_VERSION_1_2", JS_BOOL(true));
	
	opencl::Wrapper::init(env, exports);
	
	JS_CL_SET_METHOD(createKernel);
	JS_CL_SET_METHOD(createKernelsInProgram);
	JS_CL_SET_METHOD(retainKernel);
	JS_CL_SET_METHOD(releaseKernel);
	JS_CL_SET_METHOD(setKernelArg);
	JS_CL_SET_METHOD(getKernelInfo);
	JS_CL_SET_METHOD(getKernelArgInfo);
	JS_CL_SET_METHOD(getKernelWorkGroupInfo);
	
	JS_CL_SET_METHOD(createBuffer);
	JS_CL_SET_METHOD(createSubBuffer);
	JS_CL_SET_METHOD(createImage);
	JS_CL_SET_METHOD(retainMemObject);
	JS_CL_SET_METHOD(releaseMemObject);
	JS_CL_SET_METHOD(getSupportedImageFormats);
	JS_CL_SET_METHOD(getMemObjectInfo);
	JS_CL_SET_METHOD(getImageInfo);
	
	JS_CL_SET_METHOD(getPlatformIDs);
	JS_CL_SET_METHOD(getPlatformInfo);
	
	JS_CL_SET_METHOD(createProgramWithSource);
	JS_CL_SET_METHOD(createProgramWithBinary);
	JS_CL_SET_METHOD(createProgramWithBuiltInKernels);
	JS_CL_SET_METHOD(retainProgram);
	JS_CL_SET_METHOD(releaseProgram);
	JS_CL_SET_METHOD(buildProgram);
	JS_CL_SET_METHOD(compileProgram);
	JS_CL_SET_METHOD(linkProgram);
	JS_CL_SET_METHOD(unloadPlatformCompiler);
	JS_CL_SET_METHOD(getProgramInfo);
	JS_CL_SET_METHOD(getProgramBuildInfo);
	
	JS_CL_SET_METHOD(retainSampler);
	JS_CL_SET_METHOD(releaseSampler);
	JS_CL_SET_METHOD(getSamplerInfo);
	JS_CL_SET_METHOD(createSampler);
	JS_CL_SET_METHOD(createCommandQueue);
	
	JS_CL_SET_METHOD(retainCommandQueue);
	JS_CL_SET_METHOD(releaseCommandQueue);
	JS_CL_SET_METHOD(getCommandQueueInfo);
	JS_CL_SET_METHOD(flush);
	JS_CL_SET_METHOD(finish);
	JS_CL_SET_METHOD(enqueueReadBuffer);
	JS_CL_SET_METHOD(enqueueReadBufferRect);
	JS_CL_SET_METHOD(enqueueWriteBuffer);
	JS_CL_SET_METHOD(enqueueWriteBufferRect);
	JS_CL_SET_METHOD(enqueueCopyBuffer);
	JS_CL_SET_METHOD(enqueueCopyBufferRect);
	JS_CL_SET_METHOD(enqueueReadImage);
	JS_CL_SET_METHOD(enqueueWriteImage);
	JS_CL_SET_METHOD(enqueueCopyImage);
	JS_CL_SET_METHOD(enqueueCopyImageToBuffer);
	JS_CL_SET_METHOD(enqueueCopyBufferToImage);
	JS_CL_SET_METHOD(enqueueMapBuffer);
	JS_CL_SET_METHOD(enqueueMapImage);
	JS_CL_SET_METHOD(enqueueUnmapMemObject);
	JS_CL_SET_METHOD(enqueueNDRangeKernel);
	JS_CL_SET_METHOD(enqueueTask);
	JS_CL_SET_METHOD(enqueueNativeKernel);
	JS_CL_SET_METHOD(enqueueMarkerWithWaitList);
	JS_CL_SET_METHOD(enqueueBarrierWithWaitList);
	JS_CL_SET_METHOD(enqueueFillBuffer);
	JS_CL_SET_METHOD(enqueueFillImage);
	JS_CL_SET_METHOD(enqueueMigrateMemObjects);
	
	JS_CL_SET_METHOD(createContext);
	JS_CL_SET_METHOD(retainContext);
	JS_CL_SET_METHOD(releaseContext);
	JS_CL_SET_METHOD(getContextInfo);
	
	JS_CL_SET_METHOD(getDeviceIDs);
	JS_CL_SET_METHOD(getDeviceInfo);
	JS_CL_SET_METHOD(createSubDevices);
	JS_CL_SET_METHOD(retainDevice);
	JS_CL_SET_METHOD(releaseDevice);
	
	JS_CL_SET_METHOD(waitForEvents);
	JS_CL_SET_METHOD(getEventInfo);
	JS_CL_SET_METHOD(createUserEvent);
	JS_CL_SET_METHOD(retainEvent);
	JS_CL_SET_METHOD(releaseEvent);
	JS_CL_SET_METHOD(setUserEventStatus);
	JS_CL_SET_METHOD(setEventCallback);
	JS_CL_SET_METHOD(getEventProfilingInfo);
	
	
	// Platform-dependent byte sizes
	JS_CONSTANT("size_CHAR", sizeof(char));
	JS_CONSTANT("size_SHORT", sizeof(short));
	JS_CONSTANT("size_INT", sizeof(int));
	JS_CONSTANT("size_LONG", sizeof(long));
	JS_CONSTANT("size_FLOAT", sizeof(float));
	JS_CONSTANT("size_DOUBLE", sizeof(double));
	JS_CONSTANT("size_HALF", sizeof(float) >> 1);
	
	// Error Codes
	JS_CL_CONSTANT(SUCCESS);
	JS_CL_ERROR(DEVICE_NOT_FOUND);
	JS_CL_ERROR(DEVICE_NOT_AVAILABLE);
	JS_CL_ERROR(COMPILER_NOT_AVAILABLE);
	JS_CL_ERROR(MEM_OBJECT_ALLOCATION_FAILURE);
	JS_CL_ERROR(OUT_OF_RESOURCES);
	JS_CL_ERROR(OUT_OF_HOST_MEMORY);
	JS_CL_ERROR(PROFILING_INFO_NOT_AVAILABLE);
	JS_CL_ERROR(MEM_COPY_OVERLAP);
	JS_CL_ERROR(IMAGE_FORMAT_MISMATCH);
	JS_CL_ERROR(IMAGE_FORMAT_NOT_SUPPORTED);
	JS_CL_ERROR(BUILD_PROGRAM_FAILURE);
	JS_CL_ERROR(MAP_FAILURE);
	JS_CL_ERROR(MISALIGNED_SUB_BUFFER_OFFSET);
	JS_CL_ERROR(EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST);
	JS_CL_ERROR(COMPILE_PROGRAM_FAILURE);
	JS_CL_ERROR(LINKER_NOT_AVAILABLE);
	JS_CL_ERROR(LINK_PROGRAM_FAILURE);
	JS_CL_ERROR(DEVICE_PARTITION_FAILED);
	JS_CL_ERROR(KERNEL_ARG_INFO_NOT_AVAILABLE);
	JS_CL_ERROR(INVALID_VALUE);
	JS_CL_ERROR(INVALID_DEVICE_TYPE);
	JS_CL_ERROR(INVALID_PLATFORM);
	JS_CL_ERROR(INVALID_DEVICE);
	JS_CL_ERROR(INVALID_CONTEXT);
	JS_CL_ERROR(INVALID_QUEUE_PROPERTIES);
	JS_CL_ERROR(INVALID_COMMAND_QUEUE);
	JS_CL_ERROR(INVALID_HOST_PTR);
	JS_CL_ERROR(INVALID_MEM_OBJECT);
	JS_CL_ERROR(INVALID_IMAGE_FORMAT_DESCRIPTOR);
	JS_CL_ERROR(INVALID_IMAGE_SIZE);
	JS_CL_ERROR(INVALID_SAMPLER);
	JS_CL_ERROR(INVALID_BINARY);
	JS_CL_ERROR(INVALID_BUILD_OPTIONS);
	JS_CL_ERROR(INVALID_PROGRAM);
	JS_CL_ERROR(INVALID_PROGRAM_EXECUTABLE);
	JS_CL_ERROR(INVALID_KERNEL_NAME);
	JS_CL_ERROR(INVALID_KERNEL_DEFINITION);
	JS_CL_ERROR(INVALID_KERNEL);
	JS_CL_ERROR(INVALID_ARG_INDEX);
	JS_CL_ERROR(INVALID_ARG_VALUE);
	JS_CL_ERROR(INVALID_ARG_SIZE);
	JS_CL_ERROR(INVALID_KERNEL_ARGS);
	JS_CL_ERROR(INVALID_WORK_DIMENSION);
	JS_CL_ERROR(INVALID_WORK_GROUP_SIZE);
	JS_CL_ERROR(INVALID_WORK_ITEM_SIZE);
	JS_CL_ERROR(INVALID_GLOBAL_OFFSET);
	JS_CL_ERROR(INVALID_EVENT_WAIT_LIST);
	JS_CL_ERROR(INVALID_EVENT);
	JS_CL_ERROR(INVALID_OPERATION);
	JS_CL_ERROR(INVALID_GL_OBJECT);
	JS_CL_ERROR(INVALID_BUFFER_SIZE);
	JS_CL_ERROR(INVALID_MIP_LEVEL);
	JS_CL_ERROR(INVALID_GLOBAL_WORK_SIZE);
	JS_CL_ERROR(INVALID_PROPERTY);
	JS_CL_ERROR(INVALID_IMAGE_DESCRIPTOR);
	JS_CL_ERROR(INVALID_COMPILER_OPTIONS);
	JS_CL_ERROR(INVALID_LINKER_OPTIONS);
	JS_CL_ERROR(INVALID_DEVICE_PARTITION_COUNT);
	
	// OpenCL Version
	JS_CL_CONSTANT(VERSION_1_0);
	JS_CL_CONSTANT(VERSION_1_1);
	JS_CL_CONSTANT(VERSION_1_2);
	
	// cl_bool
	JS_CL_CONSTANT(FALSE);
	JS_CL_CONSTANT(TRUE);
	JS_CL_CONSTANT(BLOCKING);
	JS_CL_CONSTANT(NON_BLOCKING);
	
	// cl_platform_info
	JS_CL_CONSTANT(PLATFORM_PROFILE);
	JS_CL_CONSTANT(PLATFORM_VERSION);
	JS_CL_CONSTANT(PLATFORM_NAME);
	JS_CL_CONSTANT(PLATFORM_VENDOR);
	JS_CL_CONSTANT(PLATFORM_EXTENSIONS);
	
	// cl_device_type - bitfield
	JS_CL_CONSTANT(DEVICE_TYPE_DEFAULT);
	JS_CL_CONSTANT(DEVICE_TYPE_CPU);
	JS_CL_CONSTANT(DEVICE_TYPE_GPU);
	JS_CL_CONSTANT(DEVICE_TYPE_ACCELERATOR);
	JS_CL_CONSTANT(DEVICE_TYPE_CUSTOM);
	JS_CL_CONSTANT(DEVICE_TYPE_ALL);

	// cl_device_info
	JS_CL_CONSTANT(DEVICE_TYPE);
	JS_CL_CONSTANT(DEVICE_VENDOR_ID);
	JS_CL_CONSTANT(DEVICE_MAX_COMPUTE_UNITS);
	JS_CL_CONSTANT(DEVICE_MAX_WORK_ITEM_DIMENSIONS);
	JS_CL_CONSTANT(DEVICE_MAX_WORK_GROUP_SIZE);
	JS_CL_CONSTANT(DEVICE_MAX_WORK_ITEM_SIZES);
	JS_CL_CONSTANT(DEVICE_PREFERRED_VECTOR_WIDTH_CHAR);
	JS_CL_CONSTANT(DEVICE_PREFERRED_VECTOR_WIDTH_SHORT);
	JS_CL_CONSTANT(DEVICE_PREFERRED_VECTOR_WIDTH_INT);
	JS_CL_CONSTANT(DEVICE_PREFERRED_VECTOR_WIDTH_LONG);
	JS_CL_CONSTANT(DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT);
	JS_CL_CONSTANT(DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE);
	JS_CL_CONSTANT(DEVICE_MAX_CLOCK_FREQUENCY);
	JS_CL_CONSTANT(DEVICE_ADDRESS_BITS);
	JS_CL_CONSTANT(DEVICE_MAX_READ_IMAGE_ARGS);
	JS_CL_CONSTANT(DEVICE_MAX_WRITE_IMAGE_ARGS);
	JS_CL_CONSTANT(DEVICE_MAX_MEM_ALLOC_SIZE);
	JS_CL_CONSTANT(DEVICE_IMAGE2D_MAX_WIDTH);
	JS_CL_CONSTANT(DEVICE_IMAGE2D_MAX_HEIGHT);
	JS_CL_CONSTANT(DEVICE_IMAGE3D_MAX_WIDTH);
	JS_CL_CONSTANT(DEVICE_IMAGE3D_MAX_HEIGHT);
	JS_CL_CONSTANT(DEVICE_IMAGE3D_MAX_DEPTH);
	JS_CL_CONSTANT(DEVICE_IMAGE_SUPPORT);
	JS_CL_CONSTANT(DEVICE_MAX_PARAMETER_SIZE);
	JS_CL_CONSTANT(DEVICE_MAX_SAMPLERS);
	JS_CL_CONSTANT(DEVICE_MEM_BASE_ADDR_ALIGN);
	JS_CL_CONSTANT(DEVICE_MIN_DATA_TYPE_ALIGN_SIZE);
	JS_CL_CONSTANT(DEVICE_SINGLE_FP_CONFIG);
	JS_CL_CONSTANT(DEVICE_GLOBAL_MEM_CACHE_TYPE);
	JS_CL_CONSTANT(DEVICE_GLOBAL_MEM_CACHELINE_SIZE);
	JS_CL_CONSTANT(DEVICE_GLOBAL_MEM_CACHE_SIZE);
	JS_CL_CONSTANT(DEVICE_GLOBAL_MEM_SIZE);
	JS_CL_CONSTANT(DEVICE_MAX_CONSTANT_BUFFER_SIZE);
	JS_CL_CONSTANT(DEVICE_MAX_CONSTANT_ARGS);
	JS_CL_CONSTANT(DEVICE_LOCAL_MEM_TYPE);
	JS_CL_CONSTANT(DEVICE_LOCAL_MEM_SIZE);
	JS_CL_CONSTANT(DEVICE_ERROR_CORRECTION_SUPPORT);
	JS_CL_CONSTANT(DEVICE_PROFILING_TIMER_RESOLUTION);
	JS_CL_CONSTANT(DEVICE_ENDIAN_LITTLE);
	JS_CL_CONSTANT(DEVICE_AVAILABLE);
	JS_CL_CONSTANT(DEVICE_COMPILER_AVAILABLE);
	JS_CL_CONSTANT(DEVICE_EXECUTION_CAPABILITIES);
	JS_CL_CONSTANT(DEVICE_QUEUE_PROPERTIES);
	JS_CL_CONSTANT(DEVICE_NAME);
	JS_CL_CONSTANT(DEVICE_VENDOR);
	JS_CL_CONSTANT(DRIVER_VERSION);
	JS_CL_CONSTANT(DEVICE_PROFILE);
	JS_CL_CONSTANT(DEVICE_VERSION);
	JS_CL_CONSTANT(DEVICE_EXTENSIONS);
	JS_CL_CONSTANT(DEVICE_PLATFORM);
	JS_CL_CONSTANT(DEVICE_DOUBLE_FP_CONFIG);
	JS_CL_CONSTANT(DEVICE_HALF_FP_CONFIG);
	JS_CL_CONSTANT(DEVICE_PREFERRED_VECTOR_WIDTH_HALF);
	JS_CL_CONSTANT(DEVICE_HOST_UNIFIED_MEMORY);
	JS_CL_CONSTANT(DEVICE_NATIVE_VECTOR_WIDTH_CHAR);
	JS_CL_CONSTANT(DEVICE_NATIVE_VECTOR_WIDTH_SHORT);
	JS_CL_CONSTANT(DEVICE_NATIVE_VECTOR_WIDTH_INT);
	JS_CL_CONSTANT(DEVICE_NATIVE_VECTOR_WIDTH_LONG);
	JS_CL_CONSTANT(DEVICE_NATIVE_VECTOR_WIDTH_FLOAT);
	JS_CL_CONSTANT(DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE);
	JS_CL_CONSTANT(DEVICE_NATIVE_VECTOR_WIDTH_HALF);
	JS_CL_CONSTANT(DEVICE_OPENCL_C_VERSION);
	JS_CL_CONSTANT(DEVICE_LINKER_AVAILABLE);
	JS_CL_CONSTANT(DEVICE_BUILT_IN_KERNELS);
	JS_CL_CONSTANT(DEVICE_IMAGE_MAX_BUFFER_SIZE);
	JS_CL_CONSTANT(DEVICE_IMAGE_MAX_ARRAY_SIZE);
	JS_CL_CONSTANT(DEVICE_PARENT_DEVICE);
	JS_CL_CONSTANT(DEVICE_PARTITION_MAX_SUB_DEVICES);
	JS_CL_CONSTANT(DEVICE_PARTITION_PROPERTIES);
	JS_CL_CONSTANT(DEVICE_PARTITION_AFFINITY_DOMAIN);
	JS_CL_CONSTANT(DEVICE_PARTITION_TYPE);
	JS_CL_CONSTANT(DEVICE_REFERENCE_COUNT);
	JS_CL_CONSTANT(DEVICE_PREFERRED_INTEROP_USER_SYNC);
	JS_CL_CONSTANT(DEVICE_PRINTF_BUFFER_SIZE);
	
	// cl_device_fp_config - bitfield
	JS_CL_CONSTANT(FP_DENORM);
	JS_CL_CONSTANT(FP_INF_NAN);
	JS_CL_CONSTANT(FP_ROUND_TO_NEAREST);
	JS_CL_CONSTANT(FP_ROUND_TO_ZERO);
	JS_CL_CONSTANT(FP_ROUND_TO_INF);
	JS_CL_CONSTANT(FP_FMA);
	JS_CL_CONSTANT(FP_SOFT_FLOAT);
	JS_CL_CONSTANT(FP_CORRECTLY_ROUNDED_DIVIDE_SQRT);
	
	// cl_device_mem_cache_type
	JS_CL_CONSTANT(NONE);
	JS_CL_CONSTANT(READ_ONLY_CACHE);
	JS_CL_CONSTANT(READ_WRITE_CACHE);
	
	// cl_device_local_mem_type
	JS_CL_CONSTANT(LOCAL);
	JS_CL_CONSTANT(GLOBAL);
	
	// cl_device_exec_capabilities - bitfield
	JS_CL_CONSTANT(EXEC_KERNEL);
	JS_CL_CONSTANT(EXEC_NATIVE_KERNEL);
	
	// cl_command_queue_properties - bitfield
	JS_CL_CONSTANT(QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE);
	JS_CL_CONSTANT(QUEUE_PROFILING_ENABLE);
	
	// cl_context_info
	JS_CL_CONSTANT(CONTEXT_REFERENCE_COUNT);
	JS_CL_CONSTANT(CONTEXT_DEVICES);
	JS_CL_CONSTANT(CONTEXT_PROPERTIES);
	JS_CL_CONSTANT(CONTEXT_NUM_DEVICES);
	
	// cl_context_info + cl_context_properties
	JS_CL_CONSTANT(CONTEXT_PLATFORM);
	JS_CL_CONSTANT(CONTEXT_INTEROP_USER_SYNC);
	
	// cl_device_partition_property
	JS_CL_CONSTANT(DEVICE_PARTITION_EQUALLY);
	JS_CL_CONSTANT(DEVICE_PARTITION_BY_COUNTS);
	JS_CL_CONSTANT(DEVICE_PARTITION_BY_COUNTS_LIST_END);
	JS_CL_CONSTANT(DEVICE_PARTITION_BY_AFFINITY_DOMAIN);
	
	// cl_device_affinity_domain
	JS_CL_CONSTANT(DEVICE_AFFINITY_DOMAIN_NUMA);
	JS_CL_CONSTANT(DEVICE_AFFINITY_DOMAIN_L4_CACHE);
	JS_CL_CONSTANT(DEVICE_AFFINITY_DOMAIN_L3_CACHE);
	JS_CL_CONSTANT(DEVICE_AFFINITY_DOMAIN_L2_CACHE);
	JS_CL_CONSTANT(DEVICE_AFFINITY_DOMAIN_L1_CACHE);
	JS_CL_CONSTANT(DEVICE_AFFINITY_DOMAIN_NEXT_PARTITIONABLE);
	
	// cl_command_queue_info
	JS_CL_CONSTANT(QUEUE_CONTEXT);
	JS_CL_CONSTANT(QUEUE_DEVICE);
	JS_CL_CONSTANT(QUEUE_REFERENCE_COUNT);
	JS_CL_CONSTANT(QUEUE_PROPERTIES);
	
	// cl_mem_flags - bitfield
	JS_CL_CONSTANT(MEM_READ_WRITE);
	JS_CL_CONSTANT(MEM_WRITE_ONLY);
	JS_CL_CONSTANT(MEM_READ_ONLY);
	JS_CL_CONSTANT(MEM_USE_HOST_PTR);
	JS_CL_CONSTANT(MEM_ALLOC_HOST_PTR);
	JS_CL_CONSTANT(MEM_COPY_HOST_PTR);
	JS_CL_CONSTANT(MEM_HOST_WRITE_ONLY);
	JS_CL_CONSTANT(MEM_HOST_READ_ONLY);
	JS_CL_CONSTANT(MEM_HOST_NO_ACCESS);
	
	// cl_mem_migration_flags - bitfield
	JS_CL_CONSTANT(MIGRATE_MEM_OBJECT_HOST);
	JS_CL_CONSTANT(MIGRATE_MEM_OBJECT_CONTENT_UNDEFINED);
	
	// cl_channel_order
	JS_CL_CONSTANT(R);
	JS_CL_CONSTANT(A);
	JS_CL_CONSTANT(RG);
	JS_CL_CONSTANT(RA);
	JS_CL_CONSTANT(RGB);
	JS_CL_CONSTANT(RGBA);
	JS_CL_CONSTANT(BGRA);
	JS_CL_CONSTANT(ARGB);
	JS_CL_CONSTANT(INTENSITY);
	JS_CL_CONSTANT(LUMINANCE);
	JS_CL_CONSTANT(Rx);
	JS_CL_CONSTANT(RGx);
	JS_CL_CONSTANT(RGBx);
	JS_CL_CONSTANT(DEPTH);
	JS_CL_CONSTANT(DEPTH_STENCIL);
	
	// cl_channel_type
	JS_CL_CONSTANT(SNORM_INT8);
	JS_CL_CONSTANT(SNORM_INT16);
	JS_CL_CONSTANT(UNORM_INT8);
	JS_CL_CONSTANT(UNORM_INT16);
	JS_CL_CONSTANT(UNORM_SHORT_565);
	JS_CL_CONSTANT(UNORM_SHORT_555);
	JS_CL_CONSTANT(UNORM_INT_101010);
	JS_CL_CONSTANT(SIGNED_INT8);
	JS_CL_CONSTANT(SIGNED_INT16);
	JS_CL_CONSTANT(SIGNED_INT32);
	JS_CL_CONSTANT(UNSIGNED_INT8);
	JS_CL_CONSTANT(UNSIGNED_INT16);
	JS_CL_CONSTANT(UNSIGNED_INT32);
	JS_CL_CONSTANT(HALF_FLOAT);
	JS_CL_CONSTANT(FLOAT);
	
	// cl_mem_object_type
	JS_CL_CONSTANT(MEM_OBJECT_BUFFER);
	JS_CL_CONSTANT(MEM_OBJECT_IMAGE2D);
	JS_CL_CONSTANT(MEM_OBJECT_IMAGE3D);
	JS_CL_CONSTANT(MEM_OBJECT_IMAGE2D_ARRAY);
	JS_CL_CONSTANT(MEM_OBJECT_IMAGE1D);
	JS_CL_CONSTANT(MEM_OBJECT_IMAGE1D_ARRAY);
	JS_CL_CONSTANT(MEM_OBJECT_IMAGE1D_BUFFER);
	
	// cl_mem_info
	JS_CL_CONSTANT(MEM_TYPE);
	JS_CL_CONSTANT(MEM_FLAGS);
	JS_CL_CONSTANT(MEM_SIZE);
	JS_CL_CONSTANT(MEM_HOST_PTR);
	JS_CL_CONSTANT(MEM_MAP_COUNT);
	JS_CL_CONSTANT(MEM_REFERENCE_COUNT);
	JS_CL_CONSTANT(MEM_CONTEXT);
	JS_CL_CONSTANT(MEM_ASSOCIATED_MEMOBJECT);
	JS_CL_CONSTANT(MEM_OFFSET);
	
	// cl_image_info
	JS_CL_CONSTANT(IMAGE_FORMAT);
	JS_CL_CONSTANT(IMAGE_ELEMENT_SIZE);
	JS_CL_CONSTANT(IMAGE_ROW_PITCH);
	JS_CL_CONSTANT(IMAGE_SLICE_PITCH);
	JS_CL_CONSTANT(IMAGE_WIDTH);
	JS_CL_CONSTANT(IMAGE_HEIGHT);
	JS_CL_CONSTANT(IMAGE_DEPTH);
	JS_CL_CONSTANT(IMAGE_ARRAY_SIZE);
	JS_CL_CONSTANT(IMAGE_BUFFER);
	JS_CL_CONSTANT(IMAGE_NUM_MIP_LEVELS);
	JS_CL_CONSTANT(IMAGE_NUM_SAMPLES);
	
	// cl_addressing_mode
	JS_CL_CONSTANT(ADDRESS_NONE);
	JS_CL_CONSTANT(ADDRESS_CLAMP_TO_EDGE);
	JS_CL_CONSTANT(ADDRESS_CLAMP);
	JS_CL_CONSTANT(ADDRESS_REPEAT);
	JS_CL_CONSTANT(ADDRESS_MIRRORED_REPEAT);
	
	// cl_filter_mode
	JS_CL_CONSTANT(FILTER_NEAREST);
	JS_CL_CONSTANT(FILTER_LINEAR);
	
	// cl_sampler_info
	JS_CL_CONSTANT(SAMPLER_REFERENCE_COUNT);
	JS_CL_CONSTANT(SAMPLER_CONTEXT);
	JS_CL_CONSTANT(SAMPLER_NORMALIZED_COORDS);
	JS_CL_CONSTANT(SAMPLER_ADDRESSING_MODE);
	JS_CL_CONSTANT(SAMPLER_FILTER_MODE);
	
	// cl_map_flags - bitfield
	JS_CL_CONSTANT(MAP_READ);
	JS_CL_CONSTANT(MAP_WRITE);
	JS_CL_CONSTANT(MAP_WRITE_INVALIDATE_REGION);
	
	// cl_program_info
	JS_CL_CONSTANT(PROGRAM_REFERENCE_COUNT);
	JS_CL_CONSTANT(PROGRAM_CONTEXT);
	JS_CL_CONSTANT(PROGRAM_NUM_DEVICES);
	JS_CL_CONSTANT(PROGRAM_DEVICES);
	JS_CL_CONSTANT(PROGRAM_SOURCE);
	JS_CL_CONSTANT(PROGRAM_BINARY_SIZES);
	JS_CL_CONSTANT(PROGRAM_BINARIES);
	JS_CL_CONSTANT(PROGRAM_NUM_KERNELS);
	JS_CL_CONSTANT(PROGRAM_KERNEL_NAMES);
	
	// cl_program_build_info
	JS_CL_CONSTANT(PROGRAM_BUILD_STATUS);
	JS_CL_CONSTANT(PROGRAM_BUILD_OPTIONS);
	JS_CL_CONSTANT(PROGRAM_BUILD_LOG);
	JS_CL_CONSTANT(PROGRAM_BINARY_TYPE);
	
	// cl_program_binary_type
	JS_CL_CONSTANT(PROGRAM_BINARY_TYPE_NONE);
	JS_CL_CONSTANT(PROGRAM_BINARY_TYPE_COMPILED_OBJECT);
	JS_CL_CONSTANT(PROGRAM_BINARY_TYPE_LIBRARY);
	JS_CL_CONSTANT(PROGRAM_BINARY_TYPE_EXECUTABLE);
	
	// cl_build_status
	JS_CL_CONSTANT(BUILD_SUCCESS);
	JS_CL_CONSTANT(BUILD_NONE);
	JS_CL_CONSTANT(BUILD_ERROR);
	JS_CL_CONSTANT(BUILD_IN_PROGRESS);
	
	// cl_kernel_info
	JS_CL_CONSTANT(KERNEL_FUNCTION_NAME);
	JS_CL_CONSTANT(KERNEL_NUM_ARGS);
	JS_CL_CONSTANT(KERNEL_REFERENCE_COUNT);
	JS_CL_CONSTANT(KERNEL_CONTEXT);
	JS_CL_CONSTANT(KERNEL_PROGRAM);
	JS_CL_CONSTANT(KERNEL_ATTRIBUTES);
	
	// cl_kernel_arg_info
	JS_CL_CONSTANT(KERNEL_ARG_ADDRESS_QUALIFIER);
	JS_CL_CONSTANT(KERNEL_ARG_ACCESS_QUALIFIER);
	JS_CL_CONSTANT(KERNEL_ARG_TYPE_NAME);
	JS_CL_CONSTANT(KERNEL_ARG_TYPE_QUALIFIER);
	JS_CL_CONSTANT(KERNEL_ARG_NAME);
	
	// cl_kernel_arg_address_qualifier
	JS_CL_CONSTANT(KERNEL_ARG_ADDRESS_GLOBAL);
	JS_CL_CONSTANT(KERNEL_ARG_ADDRESS_LOCAL);
	JS_CL_CONSTANT(KERNEL_ARG_ADDRESS_CONSTANT);
	JS_CL_CONSTANT(KERNEL_ARG_ADDRESS_PRIVATE);
	
	// cl_kernel_arg_access_qualifier
	JS_CL_CONSTANT(KERNEL_ARG_ACCESS_READ_ONLY);
	JS_CL_CONSTANT(KERNEL_ARG_ACCESS_WRITE_ONLY);
	JS_CL_CONSTANT(KERNEL_ARG_ACCESS_READ_WRITE);
	JS_CL_CONSTANT(KERNEL_ARG_ACCESS_NONE);
	
	// cl_kernel_arg_type_qualifer
	JS_CL_CONSTANT(KERNEL_ARG_TYPE_NONE);
	JS_CL_CONSTANT(KERNEL_ARG_TYPE_CONST);
	JS_CL_CONSTANT(KERNEL_ARG_TYPE_RESTRICT);
	JS_CL_CONSTANT(KERNEL_ARG_TYPE_VOLATILE);
	
	// cl_kernel_work_group_info
	JS_CL_CONSTANT(KERNEL_WORK_GROUP_SIZE);
	JS_CL_CONSTANT(KERNEL_COMPILE_WORK_GROUP_SIZE);
	JS_CL_CONSTANT(KERNEL_LOCAL_MEM_SIZE);
	JS_CL_CONSTANT(KERNEL_PREFERRED_WORK_GROUP_SIZE_MULTIPLE);
	JS_CL_CONSTANT(KERNEL_PRIVATE_MEM_SIZE);
	JS_CL_CONSTANT(KERNEL_GLOBAL_WORK_SIZE);
	
	// cl_event_info
	JS_CL_CONSTANT(EVENT_COMMAND_QUEUE);
	JS_CL_CONSTANT(EVENT_COMMAND_TYPE);
	JS_CL_CONSTANT(EVENT_REFERENCE_COUNT);
	JS_CL_CONSTANT(EVENT_COMMAND_EXECUTION_STATUS);
	JS_CL_CONSTANT(EVENT_CONTEXT);
	
	// cl_command_type
	JS_CL_CONSTANT(COMMAND_NDRANGE_KERNEL);
	JS_CL_CONSTANT(COMMAND_TASK);
	JS_CL_CONSTANT(COMMAND_NATIVE_KERNEL);
	JS_CL_CONSTANT(COMMAND_READ_BUFFER);
	JS_CL_CONSTANT(COMMAND_WRITE_BUFFER);
	JS_CL_CONSTANT(COMMAND_COPY_BUFFER);
	JS_CL_CONSTANT(COMMAND_READ_IMAGE);
	JS_CL_CONSTANT(COMMAND_WRITE_IMAGE);
	JS_CL_CONSTANT(COMMAND_COPY_IMAGE);
	JS_CL_CONSTANT(COMMAND_COPY_IMAGE_TO_BUFFER);
	JS_CL_CONSTANT(COMMAND_COPY_BUFFER_TO_IMAGE);
	JS_CL_CONSTANT(COMMAND_MAP_BUFFER);
	JS_CL_CONSTANT(COMMAND_MAP_IMAGE);
	JS_CL_CONSTANT(COMMAND_UNMAP_MEM_OBJECT);
	JS_CL_CONSTANT(COMMAND_MARKER);
	JS_CL_CONSTANT(COMMAND_READ_BUFFER_RECT);
	JS_CL_CONSTANT(COMMAND_WRITE_BUFFER_RECT);
	JS_CL_CONSTANT(COMMAND_COPY_BUFFER_RECT);
	JS_CL_CONSTANT(COMMAND_USER);
	JS_CL_CONSTANT(COMMAND_BARRIER);
	JS_CL_CONSTANT(COMMAND_MIGRATE_MEM_OBJECTS);
	JS_CL_CONSTANT(COMMAND_FILL_BUFFER);
	JS_CL_CONSTANT(COMMAND_FILL_IMAGE);
	
	// command execution status
	JS_CL_CONSTANT(COMPLETE);
	JS_CL_CONSTANT(RUNNING);
	JS_CL_CONSTANT(SUBMITTED);
	JS_CL_CONSTANT(QUEUED);
	
	// cl_buffer_create_type
	JS_CL_CONSTANT(BUFFER_CREATE_TYPE_REGION);
	
	// cl_profiling_info
	JS_CL_CONSTANT(PROFILING_COMMAND_QUEUED);
	JS_CL_CONSTANT(PROFILING_COMMAND_SUBMIT);
	JS_CL_CONSTANT(PROFILING_COMMAND_START);
	JS_CL_CONSTANT(PROFILING_COMMAND_END);
	
	// cl_khr_fp64 extension - no extension exports.since it has no functions
	JS_CL_CONSTANT(DEVICE_DOUBLE_FP_CONFIG);
	
	// cl_khr_fp16 extension - no extension exports.since it has no functions
	JS_CL_CONSTANT(DEVICE_HALF_FP_CONFIG);
	
	// cl_khr_icd extension
	#if !defined (__APPLE__)
		// cl_platform_info
		JS_CL_CONSTANT(PLATFORM_ICD_SUFFIX_KHR);
		// Additional Error Codes
		JS_CL_CONSTANT(PLATFORM_NOT_FOUND_KHR);
	#endif

	// cl_nv_device_attribute_query extension
	#if !defined (__APPLE__)
		// cl_nv_device_attribute_query extension
		// no extension exports since it has no functions
		JS_CL_CONSTANT(DEVICE_COMPUTE_CAPABILITY_MAJOR_NV);
		JS_CL_CONSTANT(DEVICE_COMPUTE_CAPABILITY_MINOR_NV);
		JS_CL_CONSTANT(DEVICE_REGISTERS_PER_BLOCK_NV);
		JS_CL_CONSTANT(DEVICE_WARP_SIZE_NV);
		JS_CL_CONSTANT(DEVICE_GPU_OVERLAP_NV);
		JS_CL_CONSTANT(DEVICE_KERNEL_EXEC_TIMEOUT_NV);
		JS_CL_CONSTANT(DEVICE_INTEGRATED_MEMORY_NV);
	#endif
	
	return exports;
	
}


NODE_API_MODULE(opencl, initModule)
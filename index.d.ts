declare namespace cl {
	// Byte sizes
	const size_CHAR: number;
	const size_SHORT: number;
	const size_INT: number;
	const size_LONG: number;
	const size_FLOAT: number;
	const size_DOUBLE: number;
	const size_HALF: number;
	
	// Error Codes
	const SUCCESS: number;
	const DEVICE_NOT_FOUND: Error;
	const DEVICE_NOT_AVAILABLE: Error;
	const COMPILER_NOT_AVAILABLE: Error;
	const MEM_OBJECT_ALLOCATION_FAILURE: Error;
	const OUT_OF_RESOURCES: Error;
	const OUT_OF_HOST_MEMORY: Error;
	const PROFILING_INFO_NOT_AVAILABLE: Error;
	const MEM_COPY_OVERLAP: Error;
	const IMAGE_FORMAT_MISMATCH: Error;
	const IMAGE_FORMAT_NOT_SUPPORTED: Error;
	const BUILD_PROGRAM_FAILURE: Error;
	const MAP_FAILURE: Error;
	const MISALIGNED_SUB_BUFFER_OFFSET: Error;
	const EXEC_STATUS_ERROR_FOR_EVENTS_IN_WAIT_LIST: Error;
	const COMPILE_PROGRAM_FAILURE: Error;
	const LINKER_NOT_AVAILABLE: Error;
	const LINK_PROGRAM_FAILURE: Error;
	const DEVICE_PARTITION_FAILED: Error;
	const KERNEL_ARG_INFO_NOT_AVAILABLE: Error;
	const INVALID_VALUE: Error;
	const INVALID_DEVICE_TYPE: Error;
	const INVALID_PLATFORM: Error;
	const INVALID_DEVICE: Error;
	const INVALID_CONTEXT: Error;
	const INVALID_QUEUE_PROPERTIES: Error;
	const INVALID_COMMAND_QUEUE: Error;
	const INVALID_HOST_PTR: Error;
	const INVALID_MEM_OBJECT: Error;
	const INVALID_IMAGE_FORMAT_DESCRIPTOR: Error;
	const INVALID_IMAGE_SIZE: Error;
	const INVALID_SAMPLER: Error;
	const INVALID_BINARY: Error;
	const INVALID_BUILD_OPTIONS: Error;
	const INVALID_PROGRAM: Error;
	const INVALID_PROGRAM_EXECUTABLE: Error;
	const INVALID_KERNEL_NAME: Error;
	const INVALID_KERNEL_DEFINITION: Error;
	const INVALID_KERNEL: Error;
	const INVALID_ARG_INDEX: Error;
	const INVALID_ARG_VALUE: Error;
	const INVALID_ARG_SIZE: Error;
	const INVALID_KERNEL_ARGS: Error;
	const INVALID_WORK_DIMENSION: Error;
	const INVALID_WORK_GROUP_SIZE: Error;
	const INVALID_WORK_ITEM_SIZE: Error;
	const INVALID_GLOBAL_OFFSET: Error;
	const INVALID_EVENT_WAIT_LIST: Error;
	const INVALID_EVENT: Error;
	const INVALID_OPERATION: Error;
	const INVALID_GL_OBJECT: Error;
	const INVALID_BUFFER_SIZE: Error;
	const INVALID_MIP_LEVEL: Error;
	const INVALID_GLOBAL_WORK_SIZE: Error;
	const INVALID_PROPERTY: Error;
	const INVALID_IMAGE_DESCRIPTOR: Error;
	const INVALID_COMPILER_OPTIONS: Error;
	const INVALID_LINKER_OPTIONS: Error;
	const INVALID_DEVICE_PARTITION_COUNT: Error;
	// Additional Error Codes
	const PLATFORM_NOT_FOUND_KHR: Error;
	const INVALID_GL_SHAREGROUP_REFERENCE_KHR: Error;
	
	// OpenCL Version
	const VERSION_1_0: number;
	const VERSION_1_1: number;
	const VERSION_1_2: number;
	
	// cl_bool
	const FALSE: number;
	const TRUE: number;
	const BLOCKING: number;
	const NON_BLOCKING: number;
	
	// cl_platform_info
	const PLATFORM_PROFILE: number;
	const PLATFORM_VERSION: number;
	const PLATFORM_NAME: number;
	const PLATFORM_VENDOR: number;
	const PLATFORM_EXTENSIONS: number;
	
	// cl_device_type - bitfield
	const DEVICE_TYPE_DEFAULT: number;
	const DEVICE_TYPE_CPU: number;
	const DEVICE_TYPE_GPU: number;
	const DEVICE_TYPE_ACCELERATOR: number;
	const DEVICE_TYPE_CUSTOM: number;
	const DEVICE_TYPE_ALL: number;

	// cl_device_info
	const DEVICE_TYPE: number;
	const DEVICE_VENDOR_ID: number;
	const DEVICE_MAX_COMPUTE_UNITS: number;
	const DEVICE_MAX_WORK_ITEM_DIMENSIONS: number;
	const DEVICE_MAX_WORK_GROUP_SIZE: number;
	const DEVICE_MAX_WORK_ITEM_SIZES: number;
	const DEVICE_PREFERRED_VECTOR_WIDTH_CHAR: number;
	const DEVICE_PREFERRED_VECTOR_WIDTH_SHORT: number;
	const DEVICE_PREFERRED_VECTOR_WIDTH_INT: number;
	const DEVICE_PREFERRED_VECTOR_WIDTH_LONG: number;
	const DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT: number;
	const DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE: number;
	const DEVICE_MAX_CLOCK_FREQUENCY: number;
	const DEVICE_ADDRESS_BITS: number;
	const DEVICE_MAX_READ_IMAGE_ARGS: number;
	const DEVICE_MAX_WRITE_IMAGE_ARGS: number;
	const DEVICE_MAX_MEM_ALLOC_SIZE: number;
	const DEVICE_IMAGE2D_MAX_WIDTH: number;
	const DEVICE_IMAGE2D_MAX_HEIGHT: number;
	const DEVICE_IMAGE3D_MAX_WIDTH: number;
	const DEVICE_IMAGE3D_MAX_HEIGHT: number;
	const DEVICE_IMAGE3D_MAX_DEPTH: number;
	const DEVICE_IMAGE_SUPPORT: number;
	const DEVICE_MAX_PARAMETER_SIZE: number;
	const DEVICE_MAX_SAMPLERS: number;
	const DEVICE_MEM_BASE_ADDR_ALIGN: number;
	const DEVICE_MIN_DATA_TYPE_ALIGN_SIZE: number;
	const DEVICE_SINGLE_FP_CONFIG: number;
	const DEVICE_GLOBAL_MEM_CACHE_TYPE: number;
	const DEVICE_GLOBAL_MEM_CACHELINE_SIZE: number;
	const DEVICE_GLOBAL_MEM_CACHE_SIZE: number;
	const DEVICE_GLOBAL_MEM_SIZE: number;
	const DEVICE_MAX_CONSTANT_BUFFER_SIZE: number;
	const DEVICE_MAX_CONSTANT_ARGS: number;
	const DEVICE_LOCAL_MEM_TYPE: number;
	const DEVICE_LOCAL_MEM_SIZE: number;
	const DEVICE_ERROR_CORRECTION_SUPPORT: number;
	const DEVICE_PROFILING_TIMER_RESOLUTION: number;
	const DEVICE_ENDIAN_LITTLE: number;
	const DEVICE_AVAILABLE: number;
	const DEVICE_COMPILER_AVAILABLE: number;
	const DEVICE_EXECUTION_CAPABILITIES: number;
	const DEVICE_QUEUE_PROPERTIES: number;
	const DEVICE_NAME: number;
	const DEVICE_VENDOR: number;
	const DRIVER_VERSION: number;
	const DEVICE_PROFILE: number;
	const DEVICE_VERSION: number;
	const DEVICE_EXTENSIONS: number;
	const DEVICE_PLATFORM: number;
	const DEVICE_DOUBLE_FP_CONFIG: number;
	const DEVICE_HALF_FP_CONFIG: number;
	const DEVICE_PREFERRED_VECTOR_WIDTH_HALF: number;
	const DEVICE_HOST_UNIFIED_MEMORY: number;
	const DEVICE_NATIVE_VECTOR_WIDTH_CHAR: number;
	const DEVICE_NATIVE_VECTOR_WIDTH_SHORT: number;
	const DEVICE_NATIVE_VECTOR_WIDTH_INT: number;
	const DEVICE_NATIVE_VECTOR_WIDTH_LONG: number;
	const DEVICE_NATIVE_VECTOR_WIDTH_FLOAT: number;
	const DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE: number;
	const DEVICE_NATIVE_VECTOR_WIDTH_HALF: number;
	const DEVICE_OPENCL_C_VERSION: number;
	const DEVICE_LINKER_AVAILABLE: number;
	const DEVICE_BUILT_IN_KERNELS: number;
	const DEVICE_IMAGE_MAX_BUFFER_SIZE: number;
	const DEVICE_IMAGE_MAX_ARRAY_SIZE: number;
	const DEVICE_PARENT_DEVICE: number;
	const DEVICE_PARTITION_MAX_SUB_DEVICES: number;
	const DEVICE_PARTITION_PROPERTIES: number;
	const DEVICE_PARTITION_AFFINITY_DOMAIN: number;
	const DEVICE_PARTITION_TYPE: number;
	const DEVICE_REFERENCE_COUNT: number;
	const DEVICE_PREFERRED_INTEROP_USER_SYNC: number;
	const DEVICE_PRINTF_BUFFER_SIZE: number;
	
	// cl_device_fp_config - bitfield
	const FP_DENORM: number;
	const FP_INF_NAN: number;
	const FP_ROUND_TO_NEAREST: number;
	const FP_ROUND_TO_ZERO: number;
	const FP_ROUND_TO_INF: number;
	const FP_FMA: number;
	const FP_SOFT_FLOAT: number;
	const FP_CORRECTLY_ROUNDED_DIVIDE_SQRT: number;
	
	// cl_device_mem_cache_type
	const NONE: number;
	const READ_ONLY_CACHE: number;
	const READ_WRITE_CACHE: number;
	
	// cl_device_local_mem_type
	const LOCAL: number;
	const GLOBAL: number;
	
	// cl_device_exec_capabilities - bitfield
	const EXEC_KERNEL: number;
	const EXEC_NATIVE_KERNEL: number;
	
	// cl_command_queue_properties - bitfield
	const QUEUE_OUT_OF_ORDER_EXEC_MODE_ENABLE: number;
	const QUEUE_PROFILING_ENABLE: number;
	
	// cl_context_info
	const CONTEXT_REFERENCE_COUNT: number;
	const CONTEXT_DEVICES: number;
	const CONTEXT_PROPERTIES: number;
	const CONTEXT_NUM_DEVICES: number;
	
	// cl_context_info + cl_context_properties
	const CONTEXT_PLATFORM: number;
	const CONTEXT_INTEROP_USER_SYNC: number;
	
	// cl_device_partition_property
	const DEVICE_PARTITION_EQUALLY: number;
	const DEVICE_PARTITION_BY_COUNTS: number;
	const DEVICE_PARTITION_BY_COUNTS_LIST_END: number;
	const DEVICE_PARTITION_BY_AFFINITY_DOMAIN: number;
	
	// cl_device_affinity_domain
	const DEVICE_AFFINITY_DOMAIN_NUMA: number;
	const DEVICE_AFFINITY_DOMAIN_L4_CACHE: number;
	const DEVICE_AFFINITY_DOMAIN_L3_CACHE: number;
	const DEVICE_AFFINITY_DOMAIN_L2_CACHE: number;
	const DEVICE_AFFINITY_DOMAIN_L1_CACHE: number;
	const DEVICE_AFFINITY_DOMAIN_NEXT_PARTITIONABLE: number;
	
	// cl_command_queue_info
	const QUEUE_CONTEXT: number;
	const QUEUE_DEVICE: number;
	const QUEUE_REFERENCE_COUNT: number;
	const QUEUE_PROPERTIES: number;
	
	// cl_mem_flags - bitfield
	const MEM_READ_WRITE: number;
	const MEM_WRITE_ONLY: number;
	const MEM_READ_ONLY: number;
	const MEM_USE_HOST_PTR: number;
	const MEM_ALLOC_HOST_PTR: number;
	const MEM_COPY_HOST_PTR: number;
	const MEM_HOST_WRITE_ONLY: number;
	const MEM_HOST_READ_ONLY: number;
	const MEM_HOST_NO_ACCESS: number;
	
	// cl_mem_migration_flags - bitfield
	const MIGRATE_MEM_OBJECT_HOST: number;
	const MIGRATE_MEM_OBJECT_CONTENT_UNDEFINED: number;
	
	// cl_channel_order
	const R: number;
	const A: number;
	const RG: number;
	const RA: number;
	const RGB: number;
	const RGBA: number;
	const BGRA: number;
	const ARGB: number;
	const INTENSITY: number;
	const LUMINANCE: number;
	const Rx: number;
	const RGx: number;
	const RGBx: number;
	const DEPTH: number;
	const DEPTH_STENCIL: number;
	
	// cl_channel_type
	const SNORM_INT8: number;
	const SNORM_INT16: number;
	const UNORM_INT8: number;
	const UNORM_INT16: number;
	const UNORM_SHORT_565: number;
	const UNORM_SHORT_555: number;
	const UNORM_INT_101010: number;
	const SIGNED_INT8: number;
	const SIGNED_INT16: number;
	const SIGNED_INT32: number;
	const UNSIGNED_INT8: number;
	const UNSIGNED_INT16: number;
	const UNSIGNED_INT32: number;
	const HALF_FLOAT: number;
	const FLOAT: number;
	
	// cl_mem_object_type
	const MEM_OBJECT_BUFFER: number;
	const MEM_OBJECT_IMAGE2D: number;
	const MEM_OBJECT_IMAGE3D: number;
	const MEM_OBJECT_IMAGE2D_ARRAY: number;
	const MEM_OBJECT_IMAGE1D: number;
	const MEM_OBJECT_IMAGE1D_ARRAY: number;
	const MEM_OBJECT_IMAGE1D_BUFFER: number;
	
	// cl_mem_info
	const MEM_TYPE: number;
	const MEM_FLAGS: number;
	const MEM_SIZE: number;
	const MEM_HOST_PTR: number;
	const MEM_MAP_COUNT: number;
	const MEM_REFERENCE_COUNT: number;
	const MEM_CONTEXT: number;
	const MEM_ASSOCIATED_MEMOBJECT: number;
	const MEM_OFFSET: number;
	
	// cl_image_info
	const IMAGE_FORMAT: number;
	const IMAGE_ELEMENT_SIZE: number;
	const IMAGE_ROW_PITCH: number;
	const IMAGE_SLICE_PITCH: number;
	const IMAGE_WIDTH: number;
	const IMAGE_HEIGHT: number;
	const IMAGE_DEPTH: number;
	const IMAGE_ARRAY_SIZE: number;
	const IMAGE_BUFFER: number;
	const IMAGE_NUM_MIP_LEVELS: number;
	const IMAGE_NUM_SAMPLES: number;
	
	// cl_addressing_mode
	const ADDRESS_NONE: number;
	const ADDRESS_CLAMP_TO_EDGE: number;
	const ADDRESS_CLAMP: number;
	const ADDRESS_REPEAT: number;
	const ADDRESS_MIRRORED_REPEAT: number;
	
	// cl_filter_mode
	const FILTER_NEAREST: number;
	const FILTER_LINEAR: number;
	
	// cl_sampler_info
	const SAMPLER_REFERENCE_COUNT: number;
	const SAMPLER_CONTEXT: number;
	const SAMPLER_NORMALIZED_COORDS: number;
	const SAMPLER_ADDRESSING_MODE: number;
	const SAMPLER_FILTER_MODE: number;
	
	// cl_map_flags - bitfield
	const MAP_READ: number;
	const MAP_WRITE: number;
	const MAP_WRITE_INVALIDATE_REGION: number;
	
	// cl_program_info
	const PROGRAM_REFERENCE_COUNT: number;
	const PROGRAM_CONTEXT: number;
	const PROGRAM_NUM_DEVICES: number;
	const PROGRAM_DEVICES: number;
	const PROGRAM_SOURCE: number;
	const PROGRAM_BINARY_SIZES: number;
	const PROGRAM_BINARIES: number;
	const PROGRAM_NUM_KERNELS: number;
	const PROGRAM_KERNEL_NAMES: number;
	
	// cl_program_build_info
	const PROGRAM_BUILD_STATUS: number;
	const PROGRAM_BUILD_OPTIONS: number;
	const PROGRAM_BUILD_LOG: number;
	const PROGRAM_BINARY_TYPE: number;
	
	// cl_program_binary_type
	const PROGRAM_BINARY_TYPE_NONE: number;
	const PROGRAM_BINARY_TYPE_COMPILED_OBJECT: number;
	const PROGRAM_BINARY_TYPE_LIBRARY: number;
	const PROGRAM_BINARY_TYPE_EXECUTABLE: number;
	
	// cl_build_status
	const BUILD_SUCCESS: number;
	const BUILD_NONE: number;
	const BUILD_ERROR: number;
	const BUILD_IN_PROGRESS: number;
	
	// cl_kernel_info
	const KERNEL_FUNCTION_NAME: number;
	const KERNEL_NUM_ARGS: number;
	const KERNEL_REFERENCE_COUNT: number;
	const KERNEL_CONTEXT: number;
	const KERNEL_PROGRAM: number;
	const KERNEL_ATTRIBUTES: number;
	
	// cl_kernel_arg_info
	const KERNEL_ARG_ADDRESS_QUALIFIER: number;
	const KERNEL_ARG_ACCESS_QUALIFIER: number;
	const KERNEL_ARG_TYPE_NAME: number;
	const KERNEL_ARG_TYPE_QUALIFIER: number;
	const KERNEL_ARG_NAME: number;
	
	// cl_kernel_arg_address_qualifier
	const KERNEL_ARG_ADDRESS_GLOBAL: number;
	const KERNEL_ARG_ADDRESS_LOCAL: number;
	const KERNEL_ARG_ADDRESS_CONSTANT: number;
	const KERNEL_ARG_ADDRESS_PRIVATE: number;
	
	// cl_kernel_arg_access_qualifier
	const KERNEL_ARG_ACCESS_READ_ONLY: number;
	const KERNEL_ARG_ACCESS_WRITE_ONLY: number;
	const KERNEL_ARG_ACCESS_READ_WRITE: number;
	const KERNEL_ARG_ACCESS_NONE: number;
	
	// cl_kernel_arg_type_qualifer
	const KERNEL_ARG_TYPE_NONE: number;
	const KERNEL_ARG_TYPE_CONST: number;
	const KERNEL_ARG_TYPE_RESTRICT: number;
	const KERNEL_ARG_TYPE_VOLATILE: number;
	
	// cl_kernel_work_group_info
	const KERNEL_WORK_GROUP_SIZE: number;
	const KERNEL_COMPILE_WORK_GROUP_SIZE: number;
	const KERNEL_LOCAL_MEM_SIZE: number;
	const KERNEL_PREFERRED_WORK_GROUP_SIZE_MULTIPLE: number;
	const KERNEL_PRIVATE_MEM_SIZE: number;
	const KERNEL_GLOBAL_WORK_SIZE: number;
	
	// cl_event_info
	const EVENT_COMMAND_QUEUE: number;
	const EVENT_COMMAND_TYPE: number;
	const EVENT_REFERENCE_COUNT: number;
	const EVENT_COMMAND_EXECUTION_STATUS: number;
	const EVENT_CONTEXT: number;
	
	// cl_command_type
	const COMMAND_NDRANGE_KERNEL: number;
	const COMMAND_TASK: number;
	const COMMAND_NATIVE_KERNEL: number;
	const COMMAND_READ_BUFFER: number;
	const COMMAND_WRITE_BUFFER: number;
	const COMMAND_COPY_BUFFER: number;
	const COMMAND_READ_IMAGE: number;
	const COMMAND_WRITE_IMAGE: number;
	const COMMAND_COPY_IMAGE: number;
	const COMMAND_COPY_IMAGE_TO_BUFFER: number;
	const COMMAND_COPY_BUFFER_TO_IMAGE: number;
	const COMMAND_MAP_BUFFER: number;
	const COMMAND_MAP_IMAGE: number;
	const COMMAND_UNMAP_MEM_OBJECT: number;
	const COMMAND_MARKER: number;
	const COMMAND_READ_BUFFER_RECT: number;
	const COMMAND_WRITE_BUFFER_RECT: number;
	const COMMAND_COPY_BUFFER_RECT: number;
	const COMMAND_USER: number;
	const COMMAND_BARRIER: number;
	const COMMAND_MIGRATE_MEM_OBJECTS: number;
	const COMMAND_FILL_BUFFER: number;
	const COMMAND_FILL_IMAGE: number;
	const COMMAND_ACQUIRE_GL_OBJECTS: number;
	const COMMAND_RELEASE_GL_OBJECTS: number;
	
	// command execution status
	const COMPLETE: number;
	const RUNNING: number;
	const SUBMITTED: number;
	const QUEUED: number;
	
	// cl_buffer_create_type
	const BUFFER_CREATE_TYPE_REGION: number;
	
	// cl_profiling_info
	const PROFILING_COMMAND_QUEUED: number;
	const PROFILING_COMMAND_SUBMIT: number;
	const PROFILING_COMMAND_START: number;
	const PROFILING_COMMAND_END: number;
	
	// cl_khr_gl_sharing - use GL VBOs
	const GL_CONTEXT_KHR: number;
	const WGL_HDC_KHR: number;
	const GLX_DISPLAY_KHR: number;
	const CGL_SHAREGROUP_KHR: number;
	const CURRENT_DEVICE_FOR_GL_CONTEXT_KHR: number;
	const DEVICES_FOR_GL_CONTEXT_KHR: number;
	
	// ---- Not available on Apple:
	// cl_khr_icd extension:
	// cl_platform_info
	const PLATFORM_ICD_SUFFIX_KHR: number;
	
	// cl_nv_device_attribute_query extension:
	// no extension exports since it has no functions
	const DEVICE_COMPUTE_CAPABILITY_MAJOR_NV: number;
	const DEVICE_COMPUTE_CAPABILITY_MINOR_NV: number;
	const DEVICE_REGISTERS_PER_BLOCK_NV: number;
	const DEVICE_WARP_SIZE_NV: number;
	const DEVICE_GPU_OVERLAP_NV: number;
	const DEVICE_KERNEL_EXEC_TIMEOUT_NV: number;
	const DEVICE_INTEGRATED_MEMORY_NV: number;
	
	export type TClStatus = number;

	/**
	 * Common CL object holder, wraps C++ OpenCL pointers for JS.
	*/
	export type TClObject = {
		/**
		 * This property allows direct access to underlying OpenCL primitive (void* pointer).
		 * It may be used to extract the pointer and reuse it in another C++ addon.
		 * Although unlikely necessary, but still a possible use case.
		*/
		_: number,
	};
	
	export type TClPlatform = TClObject & { __brand: "cl_platform_id" };
	export type TClDevice = TClObject & { __brand: "cl_device_id" };
	export type TClContext = TClObject & { __brand: "cl_context" };
	export type TClProgram = TClObject & { __brand: "cl_program" };
	export type TClKernel = TClObject & { __brand: "cl_kernel" };
	export type TClMem = TClObject & { __brand: "cl_mem" };
	export type TClSampler = TClObject & { __brand: "cl_sampler" };
	export type TClQueue = TClObject & { __brand: "cl_command_queue" };
	export type TClEvent = TClObject & { __brand: "cl_event" };
	export type TClMapped = TClObject & { __brand: "cl_mapped_ptr" };
	
	export type TClEventOrVoid = TClEvent | undefined;
	export type TClHostData = ArrayBuffer | ArrayBufferView | Buffer;
	
	type TClImageFormat = {
		channel_order?: number,
		channel_data_type?: number,
	};
	
	type TClSubBufferInfo = {
		origin: number,
		size: number,
	};
	
	/**
	 * @see [clCreateKernel](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateKernel.html)
	 */
	const createKernel: (program: TClProgram, name: string) => TClKernel;
	
	/**
	 * @see [clCreateKernelsInProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateKernelsInProgram.html)
	 */
	const createKernelsInProgram: (program: TClProgram) => TClKernel[];
	
	/**
	 * @see [clRetainKernel](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainKernel.html)
	 */
	const retainKernel: (kernel: TClKernel) => TClStatus;
	
	/**
	 * @see [clReleaseKernel](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseKernel.html)
	 */
	const releaseKernel: (kernel: TClKernel) => TClStatus;
	
	/**
	 * @see [clSetKernelArg](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clSetKernelArg.html)
	 */
	const setKernelArg: (
		kernel: TClKernel,
		arg_idx: number,
		arg_type: string | null,
		value: unknown,
	) => TClStatus;
	
	/**
	 * @see [clGetKernelInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetKernelInfo.html)
	 */
	const getKernelInfo: (
		kernel: TClKernel,
		param_name: number,
	) => (string | number | TClContext | TClProgram);
	
	/**
	 * @see [clGetKernelArgInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetKernelArgInfo.html)
	 */
	const getKernelArgInfo: (
		kernel: TClKernel,
		arg_idx: number,
		param_name: number,
	) => (string | number);
	
	/**
	 * @see [clGetKernelWorkGroupInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetKernelWorkGroupInfo.html)
	 */
	const getKernelWorkGroupInfo: (
		kernel: TClKernel,
		device: TClDevice,
		param_name: number,
	) => (number | number[]);
	
	
	/**
	 * @see [clCreateBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateBuffer.html)
	 */
	const createBuffer: (
		context: TClContext,
		flags: number,
		size: number,
		buffer?: TClHostData | null,
	) => TClMem;
	
	/**
	 * Note: only `type = cl.BUFFER_CREATE_TYPE_REGION` is supported.
	 * @see [clCreateSubBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateSubBuffer.html)
	 */
	const createSubBuffer: (
		mem: TClMem,
		flags: number,
		type: number,
		info: TClSubBufferInfo,
	) => TClMem;
	
	type TClImageDesc = {
		type?: number,
		width?: number,
		height?: number,
		depth?: number,
		array_size?: number,
		row_pitch?: number,
		slice_pitch?: number,
		buffer?: TClMem | null,
	};
	/**
	 * @see [clCreateImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateImage.html)
	 */
	const createImage: (
		context: TClContext,
		flags: number,
		format: TClImageFormat,
		desc: TClImageDesc,
		host?: TClHostData | null,
	) => TClMem;
	
	/**
	 * @see [clRetainMemObject](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainMemObject.html)
	 */
	const retainMemObject: (mem: TClMem) => TClStatus;
	
	/**
	 * @see [clReleaseMemObject](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseMemObject.html)
	 */
	const releaseMemObject: (mem: TClMem) => TClStatus;
	
	/**
	 * @see [clGetSupportedImageFormats](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetSupportedImageFormats.html)
	 */
	const getSupportedImageFormats: (
		context: TClContext,
		flags: number,
		image_type: number,
	) => TClImageFormat[];
	
	/**
	 * @see [clGetMemObjectInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetMemObjectInfo.html)
	 */
	const getMemObjectInfo: (
		mem: TClMem,
		param_name: number,
	) => (number | TClMem | TClContext | Object);
	
	/**
	 * @see [clGetImageInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetImageInfo.html)
	 */
	const getImageInfo: (mem: TClMem, param_name: number) => (number | TClMem);
	
	/**
	 * @see [clCreateFromGLBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateFromGLBuffer.html)
	 */
	const createFromGLBuffer: (
		context: TClContext,
		flags: number,
		vboId: number,
	) => TClMem;
	
	/**
	 * @see [clCreateFromGLRenderbuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateFromGLRenderbuffer.html)
	 */
	const createFromGLRenderbuffer: (
		context: TClContext,
		flags: number,
		rboId: number,
	) => TClMem;
	
	/**
	 * @see [clCreateFromGLTexture](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateFromGLTexture.html)
	 */
	const createFromGLTexture: (
		context: TClContext,
		flags: number,
		target: number,
		mip: number,
		vboId: number,
	) => TClMem;
	
	
	/**
	 * @see [clGetPlatformIDs](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetPlatformIDs.html)
	 */
	const getPlatformIDs: () => TClPlatform[];
	
	/**
	 * @see [clGetPlatformInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetPlatformInfo.html)
	 */
	const getPlatformInfo: (platform: TClPlatform, param_name: number) => string;
	
	/**
	 * @see [clCreateProgramWithSource](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateProgramWithSource.html)
	 */
	const createProgramWithSource: (context: TClContext, source: string) => TClProgram;
	
	/**
	 * @see [clCreateProgramWithBinary](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateProgramWithBinary.html)
	 */
	const createProgramWithBinary: (
		context: TClContext,
		devices: TClDevice[],
		binaries: TClHostData[],
	) => TClProgram;
	
	/**
	 * @see [clCreateProgramWithBuiltInKernels](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateProgramWithBuiltInKernels.html)
	 */
	const createProgramWithBuiltInKernels: (
		context: TClContext,
		devices: TClDevice[],
		names: string[],
	) => TClProgram;
	
	/**
	 * @see [clRetainProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainProgram.html)
	 */
	const retainProgram: (program: TClProgram) => TClStatus;
	
	/**
	 * @see [clReleaseProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseProgram.html)
	 */
	const releaseProgram: (program: TClProgram) => TClStatus;
	
	export type TBuildProgramCb = (program: TClProgram, user_data: Object) => undefined;
	
	/**
	 * @see [clBuildProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clBuildProgram.html)
	 */
	const buildProgram: (
		program: TClProgram,
		devices?: TClDevice[] | null,
		options?: string | null,
		cb?: TBuildProgramCb | null,
		user_data?: Object,
	) => TClStatus;
	
	/**
	 * @see [clCompileProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCompileProgram.html)
	 */
	const compileProgram: (
		program: TClProgram,
		devices?: TClDevice[] | null,
		options?: string | null,
		headers?: TClProgram[] | null,
		names?: string[] | null,
		cb?: TBuildProgramCb | null,
		user_data?: Object,
	) => TClStatus;
	
	/**
	 * @see [clLinkProgram](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clLinkProgram.html)
	 */
	const linkProgram: (
		context: TClContext,
		devices?: TClDevice[] | null,
		options?: string | null,
		programs?: TClProgram[],
		cb?: TBuildProgramCb | null,
		user_data?: Object,
	) => TClProgram;
	
	/**
	 * @see [clUnloadPlatformCompiler](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clUnloadPlatformCompiler.html)
	 */
	const unloadPlatformCompiler: (platform: TClPlatform) => TClStatus;
	
	/**
	 * @see [clGetProgramInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetProgramInfo.html)
	 */
	const getProgramInfo: (
		program: TClProgram,
		param_name: number,
	) => (number | TClContext | TClDevice[] | number[] | Object[] | string);
	
	/**
	 * @see [clGetProgramBuildInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetProgramBuildInfo.html)
	 */
	const getProgramBuildInfo: (
		program: TClProgram,
		device: TClDevice,
		param_name: number,
	) => (number | string);
	
	
	/**
	 * @see [clRetainSampler](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainSampler.html)
	 */
	const retainSampler: (sampler: TClSampler) => TClStatus;
	
	/**
	 * @see [clReleaseSampler](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseSampler.html)
	 */
	const releaseSampler: (sampler: TClSampler) => TClStatus;
	
	/**
	 * @see [clGetSamplerInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetSamplerInfo.html)
	 */
	const getSamplerInfo: (
		sampler: TClSampler,
		param_name: number,
	) => (number | boolean | TClContext);
	
	/**
	 * @see [clCreateSampler](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateSampler.html)
	 */
	const createSampler: (
		context: TClContext,
		normalized: boolean | number,
		addressing_mode: number,
		filter_mode: number,
	) => TClSampler;
	
	/**
	 * @see [clCreateCommandQueue](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateCommandQueue.html)
	 */
	const createCommandQueue: (
		context: TClContext,
		device: TClDevice,
		properties?: number | null,
	) => TClQueue;
	
	
	/**
	 * @see [clRetainCommandQueue](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainCommandQueue.html)
	 */
	const retainCommandQueue: (queue: TClQueue) => TClStatus;
	
	/**
	 * @see [clReleaseCommandQueue](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseCommandQueue.html)
	 */
	const releaseCommandQueue: (queue: TClQueue) => TClStatus;
	
	/**
	 * @see [clGetCommandQueueInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetCommandQueueInfo.html)
	 */
	const getCommandQueueInfo: (
		queue: TClQueue,
		param_name: number,
	) => (TClContext | TClDevice | number);
	
	/**
	 * @see [clFlush](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clFlush.html)
	 */
	const flush: (queue: TClQueue) => TClStatus;
	
	/**
	 * @see [clFinish](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clFinish.html)
	 */
	const finish: (queue: TClQueue) => TClStatus;
	
	/**
	 * @see [clEnqueueReadBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueReadBuffer.html)
	 */
	const enqueueReadBuffer: (
		queue: TClQueue,
		buffer: TClMem,
		blocking_read: boolean,
		offset: number,
		size: number,
		host: TClHostData,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueReadBufferRect](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueReadBufferRect.html)
	 */
	const enqueueReadBufferRect: (
		queue: TClQueue,
		buffer: TClMem,
		blocking_read: boolean,
		buffer_offset: number[],
		host_offset: number[],
		region: number[],
		buffer_row_pitch: number,
		buffer_slice_pitch: number,
		host_row_pitch: number,
		host_slice_pitch: number,
		host: TClHostData,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueWriteBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueWriteBuffer.html)
	 */
	const enqueueWriteBuffer: (
		queue: TClQueue,
		buffer: TClMem,
		blocking_write: boolean,
		offset: number,
		size: number,
		host: TClHostData,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueWriteBufferRect](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueWriteBufferRect.html)
	 */
	const enqueueWriteBufferRect: (
		queue: TClQueue,
		buffer: TClMem,
		blocking_write: boolean,
		bufferOffsets: number[],
		hostOffsets: number[],
		regions: number[],
		buffer_row_pitch: number,
		buffer_slice_pitch: number,
		host_row_pitch: number,
		host_slice_pitch: number,
		host: TClHostData,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueCopyBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueCopyBuffer.html)
	 */
	const enqueueCopyBuffer: (
		queue: TClQueue,
		src: TClMem,
		dest: TClMem,
		src_offset: number,
		dest_ofset: number,
		size: number,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueCopyBufferRect](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueCopyBufferRect.html)
	 */
	const enqueueCopyBufferRect: (
		queue: TClQueue,
		src: TClMem,
		dest: TClMem,
		src_origins: number[],
		dest_origins: number[],
		regions: number[],
		src_row_pitch: number,
		src_slice_pitch: number,
		dest_row_pitch: number,
		dest_slice_pitch: number,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueReadImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueReadImage.html)
	 */
	const enqueueReadImage: (
		queue: TClQueue,
		image: TClMem,
		blocking_read: boolean,
		src_origins: number[],
		regions: number[],
		row_pitch: number,
		slice_pitch: number,
		host: TClHostData,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueWriteImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueWriteImage.html)
	 */
	const enqueueWriteImage: (
		queue: TClQueue,
		image: TClMem,
		blocking_write: boolean,
		src_origins: number[],
		regions: number[],
		row_pitch: number,
		slice_pitch: number,
		host: TClHostData,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueCopyImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueCopyImage.html)
	 */
	const enqueueCopyImage: (
		queue: TClQueue,
		src: TClMem,
		dest: TClMem,
		src_origins: number[],
		dest_origins: number[],
		regions: number[],
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueCopyImageToBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueCopyImageToBuffer.html)
	 */
	const enqueueCopyImageToBuffer: (
		queue: TClQueue,
		src: TClMem,
		dest: TClMem,
		src_origins: number[],
		regions: number[],
		dest_offset: number,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueCopyBufferToImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueCopyBufferToImage.html)
	 */
	const enqueueCopyBufferToImage: (
		queue: TClQueue,
		src: TClMem,
		dest: TClMem,
		src_offset: number,
		dest_origins: number[],
		regions: number[],
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueMapBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueMapBuffer.html)
	 */
	const enqueueMapBuffer: (
		queue: TClQueue,
		mem: TClMem,
		blocking_map: boolean, // if false, use result.event
		map_flags: number,
		offset: number,
		size: number,
		event_wait_list?: TClEvent[] | null,
	) => Readonly<{
		buffer: ArrayBuffer,
		event: TClEvent | null,
	}>;
	
	/**
	 * @see [clEnqueueMapImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueMapImage.html)
	 */
	const enqueueMapImage: (
		queue: TClQueue,
		mem: TClMem,
		blocking_map: boolean, // if false, use result.event
		map_flags: number,
		origins: number[],
		regions: number[],
		event_wait_list?: TClEvent[] | null,
	) => Readonly<{
		buffer: ArrayBuffer,
		event: TClEvent | null,
		image_row_pitch: number,
		image_slice_pitch: number,
	}>;
	
	/**
	 * @see [clEnqueueUnmapMemObject](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueUnmapMemObject.html)
	 */
	const enqueueUnmapMemObject: (
		queue: TClQueue,
		mem: TClMem,
		host: TClHostData,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueNDRangeKernel](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueNDRangeKernel.html)
	 */
	const enqueueNDRangeKernel: (
		queue: TClQueue,
		kernel: TClKernel,
		work_dim: number,
		work_offset?: number[] | null,
		work_global?: number[] | null,
		work_local?: number[] | null,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueTask](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueTask.html)
	 */
	const enqueueTask: (
		queue: TClQueue,
		kernel: TClKernel,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * FIXME: not implemented.
	 * @see [clEnqueueNativeKernel](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueNativeKernel.html)
	 */
	const enqueueNativeKernel: () => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueMarker](https://registry.khronos.org/OpenCL/sdk/1.0/docs/man/xhtml/clEnqueueMarker.html)
	 */
	const enqueueMarker: (
		queue: TClQueue,
	) => TClEvent;
	
	/**
	 * @see [clEnqueueMarkerWithWaitList](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueMarkerWithWaitList.html)
	 */
	const enqueueMarkerWithWaitList: (
		queue: TClQueue,
		event_wait_list: TClEvent[],
	) => TClEvent;
	
	/**
	 * @see [clEnqueueBarrierWithWaitList](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueBarrierWithWaitList.html)
	 */
	const enqueueBarrierWithWaitList: (
		queue: TClQueue,
		event_wait_list: TClEvent[],
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueBarrier](https://registry.khronos.org/OpenCL/sdk/1.0/docs/man/xhtml/clEnqueueBarrier.html)
	 */
	const enqueueBarrier: (
		queue: TClQueue,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueFillBuffer](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueFillBuffer.html)
	 */
	const enqueueFillBuffer: (
		queue: TClQueue,
		buffer: TClMem,
		pattern: number | TClHostData,
		offset: number,
		size: number,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueFillImage](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueFillImage.html)
	 */
	const enqueueFillImage: (
		queue: TClQueue,
		image: TClMem,
		host: TClHostData,
		src_origins: number[],
		regions: number[],
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueMigrateMemObjects](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueMigrateMemObjects.html)
	 */
	const enqueueMigrateMemObjects: (
		queue: TClQueue,
		objectt: TClMem[],
		flags: number,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueAcquireGLObjects](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueAcquireGLObjects.html)
	 */
	const enqueueAcquireGLObjects: (
		queue: TClQueue,
		mem: TClMem,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * @see [clEnqueueReleaseGLObjects](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clEnqueueReleaseGLObjects.html)
	 */
	const enqueueReleaseGLObjects: (
		queue: TClQueue,
		mem: TClMem,
		event_wait_list?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	
	/**
	 * @see [clCreateContext](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateContext.html)
	 */
	const createContext: (
		properties: (number | TClPlatform)[] | null,
		devices: TClDevice[],
	) => TClContext;
	
	/**
	 * @see [clCreateContext](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateContextFromType.html)
	 */
	const createContextFromType: (
		properties: (number | TClPlatform)[] | null,
		device_type: number,
	) => TClContext;
	
	/**
	 * @see [clRetainContext](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainContext.html)
	 */
	const retainContext: (context: TClContext) => TClStatus;
	
	/**
	 * @see [clReleaseContext](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseContext.html)
	 */
	const releaseContext: (context: TClContext) => TClStatus;
	
	/**
	 * @see [clGetContextInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetContextInfo.html)
	 */
	const getContextInfo: (
		context: TClContext,
		param_name: number,
	) => TClDevice[] | number | number[] | TClPlatform[];
	
	
	/**
	 * @see [clGetDeviceIDs](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetDeviceIDs.html)
	 */
	const getDeviceIDs: (
		platform: TClPlatform,
		device_type?: number, // default is `cl.DEVICE_TYPE_ALL`
	) => TClDevice[];
	
	/**
	 * @see [clGetDeviceInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetDeviceInfo.html)
	 */
	const getDeviceInfo: (
		device: TClDevice,
		param_name: number,
	) => string | number | boolean | TClPlatform | number[] | null;
	
	/**
	 * @see 
	 */
	const createSubDevices: (
		device: TClDevice,
		properties: number[],
	) => TClDevice[];
	
	/**
	 * @see [clRetainDevice](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainDevice.html)
	 */
	const retainDevice: (device: TClDevice) => TClStatus;
	
	/**
	 * @see [clReleaseDevice](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseDevice.html)
	 */
	const releaseDevice: (device: TClDevice) => TClStatus;
	
	
	/**
	 * @see [clWaitForEvents](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clWaitForEvents.html)
	 */
	const waitForEvents: (event_wait_list: TClEvent[]) => TClStatus;
	
	/**
	 * @see [clGetEventInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetEventInfo.html)
	 */
	const getEventInfo: (
		event: TClEvent,
		param_name: number,
	) => (TClQueue | TClContext | number);
	
	/**
	 * @see [clCreateUserEvent](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clCreateUserEvent.html)
	 */
	const createUserEvent: (context: TClContext) => TClEvent;
	
	/**
	 * @see [clRetainEvent](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clRetainEvent.html)
	 */
	const retainEvent: (event: TClEvent) => TClStatus;
	
	/**
	 * @see [clReleaseEvent](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clReleaseEvent.html)
	 */
	const releaseEvent: (event: TClEvent) => TClStatus;
	
	/**
	 * @see [clSetUserEventStatus](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clSetUserEventStatus.html)
	 */
	const setUserEventStatus: (event: TClEvent, status: number) => TClStatus;
	
	/**
	 * @see [clSetEventCallback](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clSetEventCallback.html)
	 */
	const setEventCallback: (
		event: TClEvent,
		status_type: number,
		cb: (user_data: Object, status: number, event: TClEvent) => void,
		user_data?: Object,
	) => TClStatus;
	
	/**
	 * TODO: hould it be 1 x64 number?
	 * @see [clGetEventProfilingInfo](https://www.khronos.org/registry/OpenCL/sdk/1.2/docs/man/xhtml/clGetEventProfilingInfo.html)
	 */
	const getEventProfilingInfo: (
		event: TClEvent,
		param_name: number,
	) => number;
	
	/**
	 * A small helper to quickly grab a good CL context.
	 * 
	 * Multiple calls to this function will return the same `context`.
	 * Pass `true` to see the intermediate device list (from where we choose).
	 */
	const quickStart: (isLoggingDevices?: boolean) => Readonly<{
		platform: TClPlatform,
		device: TClDevice,
		context: TClContext,
		version: string,
		name: string,
		type: number,
		label: string,
	}>;
}

export = cl;

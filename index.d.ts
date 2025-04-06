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
	
	export type TClEventOrVoid = TClEvent | void;
	export type TClHostData = ArrayBuffer | ArrayBufferView | Buffer;
	
	export type TClImageFormat = {
		channel_order?: number,
		channel_data_type?: number,
	};
	
	export type TClImageDesc = {
		type?: number,
		width?: number,
		height?: number,
		depth?: number,
		array_size?: number,
		row_pitch?: number,
		slice_pitch?: number,
		buffer?: TClMem | null,
	};
	
	export type TClSubBufferInfo = {
		origin: number,
		size: number,
	};
	
	export type TBuildProgramCb = (program: TClProgram, userData: unknown) => void;
	
	/**
	 * Creates a kernel object.
	 * 
	 * @see [clCreateKernel](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateKernel.html)
	 */
	const createKernel: (program: TClProgram, name: string) => TClKernel;
	
	/**
	 * Creates kernel objects for all kernel functions in a program object.
	 * 
	 * @see [clCreateKernelsInProgram](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateKernelsInProgram.html)
	 */
	const createKernelsInProgram: (program: TClProgram) => TClKernel[];
	
	/**
	 * Increments the kernel object reference count.
	 * 
	 * @see [clRetainKernel](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clRetainKernel.html)
	 */
	const retainKernel: (kernel: TClKernel) => void;
	
	/**
	 * Decrements the kernel reference count.
	 * 
	 * @see [clReleaseKernel](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clReleaseKernel.html)
	 */
	const releaseKernel: (kernel: TClKernel) => void;
	
	/**
	 * Set the argument value for a specific argument of a kernel.
	 * 
	 * It is possible to omit `argType` if the program was built with `-cl-kernel-arg-info`,
	 * the implementation will fetch the necessary data in that case.
	 * 
	 * @see [clSetKernelArg](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clSetKernelArg.html)
	 */
	const setKernelArg: (
		kernel: TClKernel,
		argIdx: number,
		argType: string | null,
		value: unknown,
	) => void;
	
	/**
	 * Returns information about the kernel object.
	 * 
	 * @see [clGetKernelInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetKernelInfo.html)
	 */
	const getKernelInfo: (
		kernel: TClKernel,
		paramName: number,
	) => (string | number | TClContext | TClProgram);
	
	/**
	 * Returns information about the arguments of a kernel.
	 * 
	 * @see [clGetKernelArgInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetKernelArgInfo.html)
	 */
	const getKernelArgInfo: (
		kernel: TClKernel,
		argIdx: number,
		paramName: number,
	) => (string | number);
	
	/**
	 * Returns information about the kernel object that may be specific to a device.
	 * 
	 * @see [clGetKernelWorkGroupInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetKernelWorkGroupInfo.html)
	 */
	const getKernelWorkGroupInfo: (
		kernel: TClKernel,
		device: TClDevice,
		paramName: number,
	) => (number | number[]);
	
	
	/**
	 * Creates a buffer object.
	 * 
	 * @see [clCreateBuffer](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateBuffer.html)
	 */
	const createBuffer: (
		context: TClContext,
		flags: number,
		size: number,
		buffer?: TClHostData | null,
	) => TClMem;
	
	/**
	 * Creates a new buffer object (referred to as a sub-buffer object) from an existing buffer object.
	 * 
	 * The CL argument `type` is omitted as being redundant. Arguments `origin` and `size`
	 * are unwrapped from "info", the same way as in WebCL.
	 * 
	 * @see [clCreateSubBuffer](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateSubBuffer.html)
	 */
	const createSubBuffer: (
		mem: TClMem,
		flags: number,
		origin: number,
		size: number,
	) => TClMem;
	
	/**
	 * Creates a 1D image, 1D image buffer, 1D image array, 2D image, 2D image array or 3D image object.
	 * 
	 * @see [clCreateImage](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateImage.html)
	 */
	const createImage: (
		context: TClContext,
		flags: number,
		format: TClImageFormat,
		desc: TClImageDesc,
		host?: TClHostData | null,
	) => TClMem;
	
	/**
	 * Increments the memory object reference count.
	 * 
	 * @see [clRetainMemObject](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clRetainMemObject.html)
	 */
	const retainMemObject: (mem: TClMem) => void;
	
	/**
	 * Decrements the memory object reference count.
	 * 
	 * @see [clReleaseMemObject](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clReleaseMemObject.html)
	 */
	const releaseMemObject: (mem: TClMem) => void;
	
	/**
	 * Get the list of image formats supported by an OpenCL implementation.
	 * 
	 * @see [clGetSupportedImageFormats](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetSupportedImageFormats.html)
	 */
	const getSupportedImageFormats: (
		context: TClContext,
		flags: number,
		imageType: number,
	) => TClImageFormat[];
	
	/**
	 * Get information that is common to all memory objects (buffer and image objects).
	 * 
	 * For `cl.MEM_HOST_PTR` returns `ArrayBuffer` for `cl.MEM_USE_HOST_PTR` buffers, and `null` for others.
	 * @see [clGetMemObjectInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetMemObjectInfo.html)
	 */
	const getMemObjectInfo: (
		mem: TClMem,
		paramName: number,
	) => (number | TClMem | TClContext | ArrayBuffer | null);
	
	/**
	 * Get information specific to an image object created with clCreateImage.
	 * 
	 * @see [clGetImageInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetImageInfo.html)
	 */
	const getImageInfo: (mem: TClMem, paramName: number) => (number | TClMem);
	
	/**
	 * Create OpenCL buffer object from an OpenGL buffer object.
	 * 
	 * @see [clCreateFromGLBuffer](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateFromGLBuffer.html)
	 */
	const createFromGLBuffer: (
		context: TClContext,
		flags: number,
		vboId: number,
	) => TClMem;
	
	/**
	 * Create OpenCL 2D image object from an OpenGL renderbuffer.
	 * 
	 * @see [clCreateFromGLRenderbuffer](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateFromGLRenderbuffer.html)
	 */
	const createFromGLRenderbuffer: (
		context: TClContext,
		flags: number,
		rboId: number,
	) => TClMem;
	
	/**
	 * Create OpenCL image object from an OpenGL texture object.
	 * 
	 * @see [clCreateFromGLTexture](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateFromGLTexture.html)
	 */
	const createFromGLTexture: (
		context: TClContext,
		flags: number,
		target: number,
		mip: number,
		vboId: number,
	) => TClMem;
	
	
	/**
	 * Query list of available platforms.
	 * 
	 * @see [clGetPlatformIDs](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetPlatformIDs.html)
	 */
	const getPlatformIDs: () => TClPlatform[];
	
	/**
	 * Query information about an OpenCL platform.
	 * 
	 * @see [clGetPlatformInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetPlatformInfo.html)
	 */
	const getPlatformInfo: (platform: TClPlatform, paramName: number) => string;
	
	/**
	 * Creates a program object for a context, and loads `source` code into the program object.
	 * 
	 * @see [clCreateProgramWithSource](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateProgramWithSource.html)
	 */
	const createProgramWithSource: (context: TClContext, source: string) => TClProgram;
	
	/**
	 * Creates a program object for a context, and loads binary bits into the program object.
	 * 
	 * @see [clCreateProgramWithBinary](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateProgramWithBinary.html)
	 */
	const createProgramWithBinary: (
		context: TClContext,
		devices: TClDevice[],
		binaries: TClHostData[],
	) => TClProgram;
	
	/**
	 * Creates a program object for a context, and loads the information related to the built-in kernels into a program object.
	 * 
	 * @see [clCreateProgramWithBuiltInKernels](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateProgramWithBuiltInKernels.html)
	 */
	const createProgramWithBuiltInKernels: (
		context: TClContext,
		devices: TClDevice[],
		names: string[],
	) => TClProgram;
	
	/**
	 * Increments the program reference count.
	 * 
	 * @see [clRetainProgram](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clRetainProgram.html)
	 */
	const retainProgram: (program: TClProgram) => void;
	
	/**
	 * Decrements the program reference count.
	 * @see [clReleaseProgram](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clReleaseProgram.html)
	 */
	const releaseProgram: (program: TClProgram) => void;
	
	/**
	 * Builds (compiles and links) a program executable from the program source or binary.
	 * 
	 * This can be done in async mode if you pass `cb`. The callback receives both the resulting
	 * `program` and any `userData` if specified.
	 * 
	 * @see [clBuildProgram](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clBuildProgram.html)
	 */
	const buildProgram: (
		program: TClProgram,
		devices?: TClDevice[] | null,
		options?: string | null,
		cb?: TBuildProgramCb | null,
		userData?: unknown,
	) => void;
	
	/**
	 * Compiles a program's source for all the devices or a specific device(s) in the OpenCL context associated with a program.
	 * 
	 * This can be done in async mode if you pass `cb`. The callback receives both the resulting
	 * `program` and any `userData` if specified.
	 * 
	 * @see [clCompileProgram](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCompileProgram.html)
	 */
	const compileProgram: (
		program: TClProgram,
		devices?: TClDevice[] | null,
		options?: string | null,
		headers?: TClProgram[] | null,
		names?: string[] | null,
		cb?: TBuildProgramCb | null,
		userData?: unknown,
	) => void;
	
	/**
	 * Links a set of compiled program objects and libraries for all the devices or a specific device(s) in the OpenCL context and creates a library or executable.
	 * 
	 * This can be done in async mode if you pass `cb`. The callback receives both the resulting
	 * `program` and any `userData` if specified.
	 * 
	 * @see [clLinkProgram](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clLinkProgram.html)
	 */
	const linkProgram: (
		context: TClContext,
		devices?: TClDevice[] | null,
		options?: string | null,
		programs?: TClProgram[],
		cb?: TBuildProgramCb | null,
		userData?: unknown,
	) => TClProgram;
	
	/**
	 * Allows the implementation to release the resources allocated by the OpenCL compiler for a platform.
	 * 
	 * Note: depending on how bad the CL driver is, this may crash the app, or have no effect at all.
	 * 
	 * @see [clUnloadPlatformCompiler](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clUnloadPlatformCompiler.html)
	 */
	const unloadPlatformCompiler: (platform: TClPlatform) => void;
	
	/**
	 * Returns information about the program object.
	 * 
	 * The return type depends on requested info.
	 * 
	 * @see [clGetProgramInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetProgramInfo.html)
	 */
	const getProgramInfo: (
		program: TClProgram,
		paramName: number,
	) => (number | TClContext | TClDevice[] | number[] | ArrayBuffer[] | string);
	
	/**
	 * Returns build information for each device in the program object.
	 * 
	 * @see [clGetProgramBuildInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetProgramBuildInfo.html)
	 */
	const getProgramBuildInfo: (
		program: TClProgram,
		device: TClDevice,
		paramName: number,
	) => (number | string);
	
	
	/**
	 * Creates a sampler object.
	 * 
	 * @see [clCreateSampler](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateSampler.html)
	 */
	const createSampler: (
		context: TClContext,
		normalized: boolean | number,
		addressingMode: number,
		filterMode: number,
	) => TClSampler;
	
	/**
	 * Increments the sampler reference count.
	 * 
	 * @see [clRetainSampler](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clRetainSampler.html)
	 */
	const retainSampler: (sampler: TClSampler) => void;
	
	/**
	 * Decrements the sampler reference count.
	 * 
	 * @see [clReleaseSampler](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clReleaseSampler.html)
	 */
	const releaseSampler: (sampler: TClSampler) => void;
	
	/**
	 * Returns information about the sampler object.
	 * 
	 * @see [clGetSamplerInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetSamplerInfo.html)
	 */
	const getSamplerInfo: (
		sampler: TClSampler,
		paramName: number,
	) => (number | boolean | TClContext);
	
	/**
	 * Create a host command-queue on a specific device.
	 * 
	 * @see [clCreateCommandQueue](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateCommandQueue.html)
	 */
	const createCommandQueue: (
		context: TClContext,
		device: TClDevice,
		properties?: number | null,
	) => TClQueue;
	
	
	/**
	 * Increments the command_queue reference count.
	 * 
	 * @see [clRetainCommandQueue](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clRetainCommandQueue.html)
	 */
	const retainCommandQueue: (queue: TClQueue) => void;
	
	/**
	 * Decrements the command_queue reference count.
	 * 
	 * @see [clReleaseCommandQueue](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clReleaseCommandQueue.html)
	 */
	const releaseCommandQueue: (queue: TClQueue) => void;
	
	/**
	 * Query information about a command-queue.
	 * 
	 * @see [clGetCommandQueueInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetCommandQueueInfo.html)
	 */
	const getCommandQueueInfo: (
		queue: TClQueue,
		paramName: number,
	) => (TClContext | TClDevice | number);
	
	/**
	 * Issues all previously queued OpenCL commands in a command-queue to the device associated with the command-queue.
	 * 
	 * @see [clFlush](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clFlush.html)
	 */
	const flush: (queue: TClQueue) => void;
	
	/**
	 * Blocks until all previously queued OpenCL commands in a command-queue are issued to the associated device and have completed.
	 * 
	 * @see [clFinish](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clFinish.html)
	 */
	const finish: (queue: TClQueue) => void;
	
	/**
	 * Enqueue commands to read from a buffer object to host memory.
	 * 
	 * @see [clEnqueueReadBuffer](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueReadBuffer.html)
	 */
	const enqueueReadBuffer: (
		queue: TClQueue,
		buffer: TClMem,
		blockingRead: boolean,
		offset: number,
		size: number,
		host: TClHostData,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueue command to read from a 2D or 3D rectangular region from a buffer object to host memory.
	 * 
	 * @see [clEnqueueReadBufferRect](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueReadBufferRect.html)
	 */
	const enqueueReadBufferRect: (
		queue: TClQueue,
		buffer: TClMem,
		blockingRead: boolean,
		bufferOffset: number[],
		hostOffset: number[],
		region: number[],
		bufferRowPitch: number,
		bufferSlicePitch: number,
		hostRowPitch: number,
		hostSlicePitch: number,
		host: TClHostData,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueue commands to read from a buffer object to host memory.
	 * 
	 * @see [clEnqueueWriteBuffer](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueWriteBuffer.html)
	 */
	const enqueueWriteBuffer: (
		queue: TClQueue,
		buffer: TClMem,
		blockingWrite: boolean,
		offset: number,
		size: number,
		host: TClHostData,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueue command to read from a 2D or 3D rectangular region from a buffer object to host memory.
	 * 
	 * @see [clEnqueueWriteBufferRect](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueWriteBufferRect.html)
	 */
	const enqueueWriteBufferRect: (
		queue: TClQueue,
		buffer: TClMem,
		blockingWrite: boolean,
		bufferOffsets: number[],
		hostOffsets: number[],
		regions: number[],
		bufferRowPitch: number,
		bufferSlicePitch: number,
		hostRowPitch: number,
		hostSlicePitch: number,
		host: TClHostData,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to copy from one buffer object to another.
	 * 
	 * @see [clEnqueueCopyBuffer](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueCopyBuffer.html)
	 */
	const enqueueCopyBuffer: (
		queue: TClQueue,
		src: TClMem,
		dest: TClMem,
		srcOffset: number,
		destOfset: number,
		size: number,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to copy a 2D or 3D rectangular region from a buffer object to another buffer object.
	 * 
	 * @see [clEnqueueCopyBufferRect](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueCopyBufferRect.html)
	 */
	const enqueueCopyBufferRect: (
		queue: TClQueue,
		src: TClMem,
		dest: TClMem,
		srcOrigins: number[],
		destOrigins: number[],
		regions: number[],
		srcRowPitch: number,
		srcSlicePitch: number,
		destRowPitch: number,
		destSlicePitch: number,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueue commands to read from an image or image array object to host memory.
	 * 
	 * @see [clEnqueueReadImage](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueReadImage.html)
	 */
	const enqueueReadImage: (
		queue: TClQueue,
		image: TClMem,
		blockingRead: boolean,
		srcOrigins: number[],
		regions: number[],
		rowPitch: number,
		slicePitch: number,
		host: TClHostData,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to write from a 2D or 3D image object to host memory.
	 * 
	 * @see [clEnqueueWriteImage](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueWriteImage.html)
	 */
	const enqueueWriteImage: (
		queue: TClQueue,
		image: TClMem,
		blockingWrite: boolean,
		srcOrigins: number[],
		regions: number[],
		rowPitch: number,
		slicePitch: number,
		host: TClHostData,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to copy image objects.
	 * 
	 * @see [clEnqueueCopyImage](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueCopyImage.html)
	 */
	const enqueueCopyImage: (
		queue: TClQueue,
		src: TClMem,
		dest: TClMem,
		srcOrigins: number[],
		destOrigins: number[],
		regions: number[],
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to copy an image object to a buffer object.
	 * 
	 * @see [clEnqueueCopyImageToBuffer](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueCopyImageToBuffer.html)
	 */
	const enqueueCopyImageToBuffer: (
		queue: TClQueue,
		src: TClMem,
		dest: TClMem,
		srcOrigins: number[],
		regions: number[],
		destOffset: number,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to copy a buffer object to an image object.
	 * 
	 * @see [clEnqueueCopyBufferToImage](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueCopyBufferToImage.html)
	 */
	const enqueueCopyBufferToImage: (
		queue: TClQueue,
		src: TClMem,
		dest: TClMem,
		srcOffset: number,
		destOrigins: number[],
		regions: number[],
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to map a region of a buffer object into the host address space and returns a pointer to this mapped region.
	 * 
	 * Parameter `blockingMap` determines if output `event` exists. When map is blocking, the `event` will be `null`.
	 * 
	 * @see [clEnqueueMapBuffer](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueMapBuffer.html)
	 */
	const enqueueMapBuffer: (
		queue: TClQueue,
		mem: TClMem,
		blockingMap: boolean, // if false, use result.event
		mapFlags: number,
		offset: number,
		size: number,
		waitList?: TClEvent[] | null,
	) => Readonly<{
		buffer: ArrayBuffer,
		event: TClEvent | null,
	}>;
	
	/**
	 * Enqueues a command to map a region of an image object into the host address space and returns a pointer to this mapped region.
	 * 
	 * Parameter `blockingMap` determines if output `event` exists. When map is blocking, the `event` will be `null`.
	 * 
	 * @see [clEnqueueMapImage](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueMapImage.html)
	 */
	const enqueueMapImage: (
		queue: TClQueue,
		mem: TClMem,
		blockingMap: boolean, // if false, use result.event
		mapFlags: number,
		origins: number[],
		regions: number[],
		waitList?: TClEvent[] | null,
	) => Readonly<{
		buffer: ArrayBuffer,
		event: TClEvent | null,
		image_row_pitch: number,
		image_slice_pitch: number,
	}>;
	
	/**
	 * Enqueues a command to unmap a previously mapped region of a memory object.
	 * 
	 * @see [clEnqueueUnmapMemObject](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueUnmapMemObject.html)
	 */
	const enqueueUnmapMemObject: (
		queue: TClQueue,
		mem: TClMem,
		host: TClHostData,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to execute a kernel on a device.
	 * 
	 * @see [clEnqueueNDRangeKernel](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueNDRangeKernel.html)
	 */
	const enqueueNDRangeKernel: (
		queue: TClQueue,
		kernel: TClKernel,
		workDim: number,
		workOffset?: number[] | null,
		workGlobal?: number[] | null,
		workLocal?: number[] | null,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to execute a kernel, using a single work-item, on a device.
	 * 
	 * @see [clEnqueueTask](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueTask.html)
	 */
	const enqueueTask: (
		queue: TClQueue,
		kernel: TClKernel,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to execute a native C/C++ function not compiled using the OpenCL compiler.
	 * 
	 * FIXME: not implemented.
	 * 
	 * @see [clEnqueueNativeKernel](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueNativeKernel.html)
	 */
	const enqueueNativeKernel: () => TClEventOrVoid;
	
	/**
	 * Enqueues a marker command which waits for all previously enqueued commands to complete.
	 * 
	 * @see [clEnqueueMarker](https://registry.khronos.org/OpenCL/sdk/1.0/docs/man/xhtml/clEnqueueMarker.html)
	 */
	const enqueueMarker: (
		queue: TClQueue,
	) => TClEvent;
	
	/**
	 * Enqueues a marker command which waits for either a list of events to complete, or all previously enqueued commands to complete.
	 * 
	 * @see [clEnqueueMarkerWithWaitList](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueMarkerWithWaitList.html)
	 */
	const enqueueMarkerWithWaitList: (
		queue: TClQueue,
		waitList: TClEvent[],
	) => TClEvent;
	
	/**
	 * A synchronization point that enqueues a barrier operation.
	 * 
	 * @see [clEnqueueBarrierWithWaitList](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueBarrierWithWaitList.html)
	 */
	const enqueueBarrierWithWaitList: (
		queue: TClQueue,
		waitList: TClEvent[],
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * A synchronization point that enqueues a barrier operation.
	 * 
	 * @see [clEnqueueBarrier](https://registry.khronos.org/OpenCL/sdk/1.0/docs/man/xhtml/clEnqueueBarrier.html)
	 */
	const enqueueBarrier: (
		queue: TClQueue,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to fill a buffer object with a pattern of a given pattern size.
	 * 
	 * A short `pattern` can be given as an integer value - will be treated as `uint32_t`.
	 * I.e. `0x0` to `0xffffffff` values make sense.
	 * 
	 * @see [clEnqueueFillBuffer](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueFillBuffer.html)
	 */
	const enqueueFillBuffer: (
		queue: TClQueue,
		buffer: TClMem,
		pattern: number | TClHostData,
		offset: number,
		size: number,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to fill an image object with a specified color.
	 * 
	 * @see [clEnqueueFillImage](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueFillImage.html)
	 */
	const enqueueFillImage: (
		queue: TClQueue,
		image: TClMem,
		host: TClHostData,
		srcOrigins: number[],
		regions: number[],
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Enqueues a command to indicate which device a set of memory objects should be associated with.
	 * 
	 * @see [clEnqueueMigrateMemObjects](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueMigrateMemObjects.html)
	 */
	const enqueueMigrateMemObjects: (
		queue: TClQueue,
		objectt: TClMem[],
		flags: number,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Acquire OpenCL memory objects created from OpenGL objects.
	 * 
	 * @see [clEnqueueAcquireGLObjects](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueAcquireGLObjects.html)
	 */
	const enqueueAcquireGLObjects: (
		queue: TClQueue,
		mem: TClMem,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	/**
	 * Release OpenCL memory objects created from OpenGL objects.
	 * 
	 * @see [clEnqueueReleaseGLObjects](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clEnqueueReleaseGLObjects.html)
	 */
	const enqueueReleaseGLObjects: (
		queue: TClQueue,
		mem: TClMem,
		waitList?: TClEvent[] | null,
		hasEvent?: boolean,
	) => TClEventOrVoid;
	
	
	/**
	 * Create an OpenCL context.
	 * 
	 * @see [clCreateContext](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateContext.html)
	 */
	const createContext: (
		properties: (number | TClPlatform)[] | null,
		devices: TClDevice[],
	) => TClContext;
	
	/**
	 * Create an OpenCL context from a device type.
	 * 
	 * @see [clCreateContextFromType](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateContextFromType.html)
	 */
	const createContextFromType: (
		properties: (number | TClPlatform)[] | null,
		deviceType: number,
	) => TClContext;
	
	/**
	 * Retain an OpenCL context.
	 * 
	 * @see [clRetainContext](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clRetainContext.html)
	 */
	const retainContext: (context: TClContext) => void;
	
	/**
	 * Release an OpenCL context.
	 * 
	 * @see [clReleaseContext](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clReleaseContext.html)
	 */
	const releaseContext: (context: TClContext) => void;
	
	/**
	 * Query information about an OpenCL context.
	 * 
	 * @see [clGetContextInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetContextInfo.html)
	 */
	const getContextInfo: (
		context: TClContext,
		paramName: number,
	) => TClDevice[] | number | number[] | TClPlatform[];
	
	
	/**
	 * Query devices available on a platform.
	 * 
	 * @see [clGetDeviceIDs](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetDeviceIDs.html)
	 */
	const getDeviceIDs: (
		platform: TClPlatform,
		deviceType?: number, // default is `cl.DEVICE_TYPE_ALL`
	) => TClDevice[];
	
	/**
	 * Query specific information about a device.
	 * 
	 * @see [clGetDeviceInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetDeviceInfo.html)
	 */
	const getDeviceInfo: (
		device: TClDevice,
		paramName: number,
	) => string | number | boolean | TClPlatform | number[] | null;
	
	/**
	 * Create sub-devices partitioning an OpenCL device.
	 * 
	 * Note: this doesn't really work (driver-wise). Who needs that, anyway.
	 * 
	 * @see [clCreateSubDevices](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateSubDevices.html)
	 */
	const createSubDevices: (
		device: TClDevice,
		properties: number[],
	) => TClDevice[];
	
	/**
	 * Retain an OpenCL device.
	 * 
	 * @see [clRetainDevice](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clRetainDevice.html)
	 */
	const retainDevice: (device: TClDevice) => void;
	
	/**
	 * Release an OpenCL device.
	 * 
	 * @see [clReleaseDevice](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clReleaseDevice.html)
	 */
	const releaseDevice: (device: TClDevice) => void;
	
	
	/**
	 * Waits on the host thread for commands identified by event objects to complete.
	 * 
	 * @see [clWaitForEvents](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clWaitForEvents.html)
	 */
	const waitForEvents: (waitList: TClEvent[]) => void;
	
	/**
	 * Returns information about the event object.
	 * 
	 * @see [clGetEventInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetEventInfo.html)
	 */
	const getEventInfo: (
		event: TClEvent,
		paramName: number,
	) => (TClQueue | TClContext | number);
	
	/**
	 * Creates a user event object.
	 * 
	 * @see [clCreateUserEvent](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clCreateUserEvent.html)
	 */
	const createUserEvent: (context: TClContext) => TClEvent;
	
	/**
	 * Increments the event reference count.
	 * 
	 * @see [clRetainEvent](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clRetainEvent.html)
	 */
	const retainEvent: (event: TClEvent) => void;
	
	/**
	 * Decrements the event reference count.
	 * 
	 * @see [clReleaseEvent](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clReleaseEvent.html)
	 */
	const releaseEvent: (event: TClEvent) => void;
	
	/**
	 * Sets the execution status of a user event object.
	 * 
	 * @see [clSetUserEventStatus](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clSetUserEventStatus.html)
	 */
	const setUserEventStatus: (event: TClEvent, status: number) => void;
	
	/**
	 * Registers a user callback function for a specific command execution status.
	 * 
	 * @see [clSetEventCallback](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clSetEventCallback.html)
	 */
	const setEventCallback: (
		event: TClEvent,
		statusType: number,
		cb: (event: TClEvent, status: number, userData: unknown) => void,
		userData?: unknown,
	) => void;
	
	/**
	 * Returns profiling information for the command associated with event if profiling is enabled.
	 * 
	 * @see [clGetEventProfilingInfo](https://registry.khronos.org/OpenCL/sdk/3.0/docs/man/html/clGetEventProfilingInfo.html)
	 */
	const getEventProfilingInfo: (
		event: TClEvent,
		paramName: number,
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

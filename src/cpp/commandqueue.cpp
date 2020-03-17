#include <algorithm>

#include "types.hpp"


namespace opencl {

#define GET_EVENT_FLAG(n)                                                     \
	cl_event event = nullptr;                                                 \
	cl_event* eventPtr =                                                      \
		(!IS_ARG_EMPTY(n) && info[n].ToBoolean().Value())                     \
		? &event : nullptr;

#define GET_WAIT_LIST_AND_EVENT(n)                                            \
	GET_WAIT_LIST(n);                                                         \
	GET_EVENT_FLAG(n + 1);

#define RET_EVENT                                                             \
	if (eventPtr) {                                                           \
		RET_WRAPPER(event);                              \
	} else {                                                                  \
		RET_NUM(CL_SUCCESS);                                                  \
	}


// /* Command Queue APIs */
// extern CL_API_ENTRY cl_command_queue CL_API_CALL
// clCreateCommandQueue(cl_context                     /* context */,
//                      cl_device_id                   /* device */,
//                      cl_command_queue_properties    /* properties */,
//                      cl_int *                       /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(createCommandQueue) { NAPI_ENV;
	
	REQ_CL_ARG(0, context, cl_context);
	REQ_CL_ARG(1, device, cl_device_id);
	LET_UINT32_ARG(2, properties);
	
	cl_int err;
	cl_command_queue q = clCreateCommandQueue(context, device, properties, &err);
	
	CHECK_ERR(err)
	RET_WRAPPER(q);
	
}


// extern CL_API_ENTRY cl_int CL_API_CALL
// clRetainCommandQueue(cl_command_queue /* command_queue */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(retainCommandQueue) { NAPI_ENV;
	
	REQ_WRAP_ARG(0, q);
	
	cl_int err = q->acquire();
	CHECK_ERR(err)
	
	RET_NUM(err);
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clReleaseCommandQueue(cl_command_queue /* command_queue */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(releaseCommandQueue) { NAPI_ENV;
	
	REQ_WRAP_ARG(0, q);
	
	cl_int err = q->release();
	CHECK_ERR(err)
	
	RET_NUM(err);
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clGetCommandQueueInfo(cl_command_queue      /* command_queue */,
//                       cl_command_queue_info /* param_name */,
//                       size_t                /* param_value_size */,
//                       void *                /* param_value */,
//                       size_t *              /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(getCommandQueueInfo) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_UINT32_ARG(1, param_name);
	
	switch(param_name) {
		case CL_QUEUE_CONTEXT: {
			cl_context val;
			CHECK_ERR(clGetCommandQueueInfo(
				clQueue,
				param_name,
				sizeof(cl_context),
				&val, nullptr
			));
			CHECK_ERR(clRetainContext(val))
			RET_WRAPPER(val);
		}
		case CL_QUEUE_DEVICE: {
			cl_device_id val;
			CHECK_ERR(clGetCommandQueueInfo(
				clQueue,
				param_name,
				sizeof(cl_device_id),
				&val,
				nullptr
			));
			CHECK_ERR(clRetainDevice(val))
			RET_WRAPPER(val);
		}
		case CL_QUEUE_REFERENCE_COUNT: {
			cl_uint val;
			CHECK_ERR(clGetCommandQueueInfo(
				clQueue,
				param_name,
				sizeof(cl_uint),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
		case CL_QUEUE_PROPERTIES: {
			cl_command_queue_properties val;
			CHECK_ERR(clGetCommandQueueInfo(
				clQueue,
				param_name,
				sizeof(cl_command_queue_properties),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
	
}

// /* Flush and Finish APIs */
// extern CL_API_ENTRY cl_int CL_API_CALL
// clFlush(cl_command_queue /* command_queue */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(flush) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	
	cl_int err = clFlush(clQueue);
	
	CHECK_ERR(err);
	RET_NUM(err);
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clFinish(cl_command_queue /* command_queue */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(finish) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	
	cl_int err = clFinish(clQueue);
	
	CHECK_ERR(err);
	RET_NUM(err);
	
}

// /* Enqueued Commands APIs */
// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueReadBuffer(cl_command_queue    /* command_queue */,
//                     cl_mem              /* buffer */,
//                     cl_bool             /* blocking_read */,
//                     size_t              /* offset */,
//                     size_t              /* size */,
//                     void *              /* ptr */,
//                     cl_uint             /* num_events_in_wait_list */,
//                     const cl_event *    /* event_wait_list */,
//                     cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueReadBuffer) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, clMem, cl_mem);
	SOFT_BOOL_ARG(2, blocking_read);
	REQ_OFFS_ARG(3, offset);
	REQ_OFFS_ARG(4, size);
	REQ_OBJ_ARG(5, buffer);
	
	void *ptr = nullptr;
	size_t len = 0;
	getPtrAndLen(buffer, &ptr, &len);
	if (!ptr || !len) {
		JS_THROW("Could not read buffer data.");
		RET_UNDEFINED;
	}
	
	GET_WAIT_LIST_AND_EVENT(6);
	
	CHECK_ERR(clEnqueueReadBuffer(
		clQueue,
		clMem,
		blocking_read,
		offset,
		size,
		ptr,
		(cl_uint) cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueReadBufferRect(cl_command_queue    /* command_queue */,
//                         cl_mem              /* buffer */,
//                         cl_bool             /* blocking_read */,
//                         const size_t *      /* buffer_offset */,
//                         const size_t *      /* host_offset */,
//                         const size_t *      /* region */,
//                         size_t              /* buffer_row_pitch */,
//                         size_t              /* buffer_slice_pitch */,
//                         size_t              /* host_row_pitch */,
//                         size_t              /* host_slice_pitch */,
//                         void *              /* ptr */,
//                         cl_uint             /* num_events_in_wait_list */,
//                         const cl_event *    /* event_wait_list */,
//                         cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_1;
JS_METHOD(enqueueReadBufferRect) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, clMem, cl_mem);
	SOFT_BOOL_ARG(2, blocking_read);
	REQ_ARRAY_ARG(3, bufferOffsetArray);
	REQ_ARRAY_ARG(4, hostOffsetArray);
	REQ_ARRAY_ARG(5, regionArray);
	REQ_OFFS_ARG(6, buffer_row_pitch);
	REQ_OFFS_ARG(7, buffer_slice_pitch);
	REQ_OFFS_ARG(8, host_row_pitch);
	REQ_OFFS_ARG(9, host_slice_pitch);
	REQ_OBJ_ARG(10, buffer);
	
	size_t bufferOffsetArrayLen = std::max(bufferOffsetArray.Length(), 2u);
	size_t hostOffsetArrayLen = std::max(hostOffsetArray.Length(), 2u);
	size_t regionArrayLen = std::max(regionArray.Length(), 2u);
	size_t buffer_offset[] = { 0, 0, 0 };
	size_t host_offset[] = { 0, 0, 0 };
	size_t region[] = { 1, 1, 1 };
	
	for(size_t i = 0; i < bufferOffsetArrayLen; i++) {
		buffer_offset[i] = bufferOffsetArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < hostOffsetArrayLen; i++) {
		host_offset[i] = hostOffsetArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < regionArrayLen; i++) {
		region[i] = regionArray.Get(i).ToNumber().Int64Value();
	}
	
	void *ptr = nullptr;
	size_t len = 0;
	getPtrAndLen(buffer, &ptr, &len);
	
	if (!ptr || !len) {
		JS_THROW("Could not read buffer data.");
		RET_UNDEFINED;
	}
	
	GET_WAIT_LIST_AND_EVENT(11)
	
	CHECK_ERR(clEnqueueReadBufferRect(
		clQueue,
		clMem,
		blocking_read,
		buffer_offset,
		host_offset,
		region,
		buffer_row_pitch,
		buffer_slice_pitch,
		host_row_pitch,
		host_slice_pitch,ptr,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueWriteBuffer(cl_command_queue   /* command_queue */,
//                      cl_mem             /* buffer */,
//                      cl_bool            /* blocking_write */,
//                      size_t             /* offset */,
//                      size_t             /* size */,
//                      const void *       /* ptr */,
//                      cl_uint            /* num_events_in_wait_list */,
//                      const cl_event *   /* event_wait_list */,
//                      cl_event *         /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueWriteBuffer) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, clMem, cl_mem);
	SOFT_BOOL_ARG(2, blocking_write);
	REQ_OFFS_ARG(3, offset);
	REQ_OFFS_ARG(4, size);
	REQ_OBJ_ARG(5, buffer);
	
	void *ptr = nullptr;
	size_t len = 0;
	getPtrAndLen(buffer, &ptr, &len);
	
	if (!ptr || !len) {
		JS_THROW("Could not read buffer data.");
		RET_UNDEFINED;
	}
	
	GET_WAIT_LIST_AND_EVENT(6);
	
	CHECK_ERR(clEnqueueWriteBuffer(
		clQueue,
		clMem,
		blocking_write,
		offset,
		size,
		ptr,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueWriteBufferRect(cl_command_queue    /* command_queue */,
//                          cl_mem              /* buffer */,
//                          cl_bool             /* blocking_write */,
//                          const size_t *      /* buffer_offset */,
//                          const size_t *      /* host_offset */,
//                          const size_t *      /* region */,
//                          size_t              /* buffer_row_pitch */,
//                          size_t              /* buffer_slice_pitch */,
//                          size_t              /* host_row_pitch */,
//                          size_t              /* host_slice_pitch */,
//                          const void *        /* ptr */,
//                          cl_uint             /* num_events_in_wait_list */,
//                          const cl_event *    /* event_wait_list */,
//                          cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_1;
JS_METHOD(enqueueWriteBufferRect) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, clMem, cl_mem);
	SOFT_BOOL_ARG(2, blocking_write);
	REQ_ARRAY_ARG(3, bufferOffsetArray);
	REQ_ARRAY_ARG(4, hostOffsetArray);
	REQ_ARRAY_ARG(5, regionArray);
	REQ_OFFS_ARG(6, buffer_row_pitch);
	REQ_OFFS_ARG(7, buffer_slice_pitch);
	REQ_OFFS_ARG(8, host_row_pitch);
	REQ_OFFS_ARG(9, host_slice_pitch);
	REQ_OBJ_ARG(10, buffer);
	
	size_t bufferOffsetArrayLen = std::max(bufferOffsetArray.Length(), 2u);
	size_t hostOffsetArrayLen = std::max(hostOffsetArray.Length(), 2u);
	size_t regionArrayLen = std::max(regionArray.Length(), 2u);
	size_t buffer_offset[] = { 0, 0, 0 };
	size_t host_offset[] = { 0, 0, 0 };
	size_t region[] = { 1, 1, 1 };
	
	for(size_t i = 0; i < bufferOffsetArrayLen; i++) {
		buffer_offset[i] = bufferOffsetArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < hostOffsetArrayLen; i++) {
		host_offset[i] = hostOffsetArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < regionArrayLen; i++) {
		region[i] = regionArray.Get(i).ToNumber().Int64Value();
	}
	
	void *ptr = nullptr;
	size_t len = 0;
	getPtrAndLen(buffer, &ptr, &len);
	
	if (!ptr || !len) {
		JS_THROW("Could not read buffer data.");
		RET_UNDEFINED;
	}
	
	GET_WAIT_LIST_AND_EVENT(11);
	
	CHECK_ERR(clEnqueueWriteBufferRect(
		clQueue,
		clMem,
		blocking_write,
		buffer_offset,
		host_offset,
		region,
		buffer_row_pitch,
		buffer_slice_pitch,
		host_row_pitch,
		host_slice_pitch,
		ptr,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueFillBuffer(cl_command_queue   /* command_queue */,
//                     cl_mem             /* buffer */,
//                     const void *       /* pattern */,
//                     size_t             /* pattern_size */,
//                     size_t             /* offset */,
//                     size_t             /* size */,
//                     cl_uint            /* num_events_in_wait_list */,
//                     const cl_event *   /* event_wait_list */,
//                     cl_event *         /* event */) CL_API_SUFFIX__VERSION_1_2;
JS_METHOD(enqueueFillBuffer) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, clMem, cl_mem);
	
	void *pattern = nullptr;
	size_t len = 0;
	if (info[2].IsNumber()) {
		REQ_DOUBLE_ARG(2, scalar_pattern_double);
		pattern = &scalar_pattern_double;
		len = sizeof(scalar_pattern_double);
	} else {
		REQ_OBJ_ARG(2, buffer);
		getPtrAndLen(buffer, &pattern, &len);
	}
	
	if (!pattern || !len) {
		JS_THROW("Could not read buffer data.");
		RET_UNDEFINED;
	}
	
	REQ_OFFS_ARG(3, offset);
	REQ_OFFS_ARG(4, size);
	
	GET_WAIT_LIST_AND_EVENT(5);
	
	CHECK_ERR(clEnqueueFillBuffer(
		clQueue,
		clMem,
		pattern,
		len,
		offset,
		size,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueCopyBuffer(cl_command_queue    /* command_queue */,
//                     cl_mem              /* src_buffer */,
//                     cl_mem              /* dst_buffer */,
//                     size_t              /* src_offset */,
//                     size_t              /* dst_offset */,
//                     size_t              /* size */,
//                     cl_uint             /* num_events_in_wait_list */,
//                     const cl_event *    /* event_wait_list */,
//                     cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueCopyBuffer) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, src_buffer, cl_mem);
	REQ_CL_ARG(2, dst_buffer, cl_mem);
	REQ_OFFS_ARG(3, src_offset);
	REQ_OFFS_ARG(4, dst_offset);
	REQ_OFFS_ARG(5, size);
	
	GET_WAIT_LIST_AND_EVENT(6);
	
	CHECK_ERR(clEnqueueCopyBuffer(
		clQueue,
		src_buffer,
		dst_buffer,
		src_offset,
		dst_offset,
		size,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueCopyBufferRect(cl_command_queue    /* command_queue */,
//                         cl_mem              /* src_buffer */,
//                         cl_mem              /* dst_buffer */,
//                         const size_t *      /* src_origin */,
//                         const size_t *      /* dst_origin */,
//                         const size_t *      /* region */,
//                         size_t              /* src_row_pitch */,
//                         size_t              /* src_slice_pitch */,
//                         size_t              /* dst_row_pitch */,
//                         size_t              /* dst_slice_pitch */,
//                         cl_uint             /* num_events_in_wait_list */,
//                         const cl_event *    /* event_wait_list */,
//                         cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_1;
JS_METHOD(enqueueCopyBufferRect) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, src_buffer, cl_mem);
	REQ_CL_ARG(2, dst_buffer, cl_mem);
	REQ_ARRAY_ARG(3, srcOriginArray);
	REQ_ARRAY_ARG(4, destOriginArray);
	REQ_ARRAY_ARG(5, regionArray);
	REQ_OFFS_ARG(6, src_row_pitch);
	REQ_OFFS_ARG(7, src_slice_pitch);
	REQ_OFFS_ARG(8, dst_row_pitch);
	REQ_OFFS_ARG(9, dst_slice_pitch);
	
	size_t srcOriginArrayLen = std::max(srcOriginArray.Length(), 2u);
	size_t destOriginArrayLen = std::max(destOriginArray.Length(), 2u);
	size_t regionArrayLen = std::max(regionArray.Length(), 2u);
	size_t src_origin[] = { 0, 0, 0 };
	size_t dst_origin[] = { 0, 0, 0 };
	size_t region[] = { 1, 1, 1 };
	
	for(size_t i = 0; i < srcOriginArrayLen; i++) {
		src_origin[i] = srcOriginArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < destOriginArrayLen; i++) {
		dst_origin[i] = destOriginArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < regionArrayLen; i++) {
		region[i] = regionArray.Get(i).ToNumber().Int64Value();
	}
	
	GET_WAIT_LIST_AND_EVENT(10);
	
	CHECK_ERR(clEnqueueCopyBufferRect(
		clQueue,
		src_buffer,
		dst_buffer,
		src_origin,
		dst_origin,
		region,
		src_row_pitch,
		src_slice_pitch,
		dst_row_pitch,
		dst_slice_pitch,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueReadImage(cl_command_queue     /* command_queue */,
//                    cl_mem               /* image */,
//                    cl_bool              /* blocking_read */,
//                    const size_t *       /* origin[3] */,
//                    const size_t *       /* region[3] */,
//                    size_t               /* row_pitch */,
//                    size_t               /* slice_pitch */,
//                    void *               /* ptr */,
//                    cl_uint              /* num_events_in_wait_list */,
//                    const cl_event *     /* event_wait_list */,
//                    cl_event *           /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueReadImage) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, image, cl_mem);
	SOFT_BOOL_ARG(2, blocking_read);
	REQ_ARRAY_ARG(3, srcOriginArray);
	REQ_ARRAY_ARG(4, regionArray);
	REQ_OFFS_ARG(5, row_pitch);
	REQ_OFFS_ARG(6, slice_pitch);
	REQ_OBJ_ARG(7, buffer);
	
	size_t srcOriginArrayLen = std::max(srcOriginArray.Length(), 2u);
	size_t regionArrayLen = std::max(regionArray.Length(), 2u);
	size_t origin[]={0,0,0};
	size_t region[]={1,1,1};
	
	for(size_t i = 0; i < srcOriginArrayLen; i++) {
		origin[i] = srcOriginArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < regionArrayLen; i++) {
		region[i] = regionArray.Get(i).ToNumber().Int64Value();
	}
	
	void *ptr = nullptr;
	size_t len = 0;
	getPtrAndLen(buffer, &ptr, &len);
	
	if (!ptr || !len) {
		JS_THROW("Could not read buffer data.");
		RET_UNDEFINED;
	}
	
	GET_WAIT_LIST_AND_EVENT(8);
	
	CHECK_ERR(clEnqueueReadImage(
		clQueue,
		image,
		blocking_read,
		origin,
		region,
		row_pitch,
		slice_pitch,
		ptr,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueWriteImage(cl_command_queue    /* command_queue */,
//                     cl_mem              /* image */,
//                     cl_bool             /* blocking_write */,
//                     const size_t *      /* origin[3] */,
//                     const size_t *      /* region[3] */,
//                     size_t              /* input_row_pitch */,
//                     size_t              /* input_slice_pitch */,
//                     const void *        /* ptr */,
//                     cl_uint             /* num_events_in_wait_list */,
//                     const cl_event *    /* event_wait_list */,
//                     cl_event *          /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueWriteImage) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, image, cl_mem);
	SOFT_BOOL_ARG(2, blocking_write);
	REQ_ARRAY_ARG(3, srcOriginArray);
	REQ_ARRAY_ARG(4, regionArray);
	REQ_OFFS_ARG(5, row_pitch);
	REQ_OFFS_ARG(6, slice_pitch);
	REQ_OBJ_ARG(7, buffer);
	
	size_t srcOriginArrayLen = std::max(srcOriginArray.Length(), 2u);
	size_t regionArrayLen = std::max(regionArray.Length(), 2u);
	size_t origin[]={0,0,0};
	size_t region[]={1,1,1};
	
	for(size_t i = 0; i < srcOriginArrayLen; i++) {
		origin[i] = srcOriginArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < regionArrayLen; i++) {
		region[i] = regionArray.Get(i).ToNumber().Int64Value();
	}
	
	void *ptr = nullptr;
	size_t len = 0;
	getPtrAndLen(buffer, &ptr, &len);
	
	if (!ptr || !len) {
		JS_THROW("Could not read buffer data.");
		RET_UNDEFINED;
	}
	
	GET_WAIT_LIST_AND_EVENT(8);
	
	CHECK_ERR(clEnqueueWriteImage(
		clQueue,
		image,
		blocking_write,
		origin,
		region,
		row_pitch,
		slice_pitch,
		ptr,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}


// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueFillImage(cl_command_queue   /* command_queue */,
//                    cl_mem             /* image */,
//                    const void *       /* fill_color */,
//                    const size_t *     /* origin[3] */,
//                    const size_t *     /* region[3] */,
//                    cl_uint            /* num_events_in_wait_list */,
//                    const cl_event *   /* event_wait_list */,
//                    cl_event *         /* event */) CL_API_SUFFIX__VERSION_1_2;
JS_METHOD(enqueueFillImage) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, image, cl_mem);
	REQ_OBJ_ARG(2, buffer);
	REQ_ARRAY_ARG(3, srcOriginArray);
	REQ_ARRAY_ARG(4, regionArray);
	
	void *ptr = nullptr;
	size_t len = 0;
	getPtrAndLen(buffer, &ptr, &len);
	
	if (!ptr || !len) {
		JS_THROW("Could not read buffer data.");
		RET_UNDEFINED;
	}
	
	size_t origin[]={0,0,0};
	size_t region[]={1,1,1};
	size_t srcOriginArrayLen = std::max(srcOriginArray.Length(), 2u);
	size_t regionArrayLen = std::max(regionArray.Length(), 2u);
	
	for(size_t i = 0; i < srcOriginArrayLen; i++) {
		origin[i] = srcOriginArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < regionArrayLen; i++) {
		region[i] = regionArray.Get(i).ToNumber().Int64Value();
	}
	
	GET_WAIT_LIST_AND_EVENT(5);
	
	CHECK_ERR(clEnqueueFillImage(
		clQueue,
		image,
		ptr,
		origin,
		region,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueCopyImage(cl_command_queue     /* command_queue */,
//                    cl_mem               /* src_image */,
//                    cl_mem               /* dst_image */,
//                    const size_t *       /* src_origin[3] */,
//                    const size_t *       /* dst_origin[3] */,
//                    const size_t *       /* region[3] */,
//                    cl_uint              /* num_events_in_wait_list */,
//                    const cl_event *     /* event_wait_list */,
//                    cl_event *           /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueCopyImage) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, src_buffer, cl_mem);
	REQ_CL_ARG(2, dst_buffer, cl_mem);
	REQ_ARRAY_ARG(3, srcOriginArray);
	REQ_ARRAY_ARG(4, destOriginArray);
	REQ_ARRAY_ARG(5, regionArray);
	
	size_t srcOriginArrayLen = std::max(srcOriginArray.Length(), 2u);
	size_t destOriginArrayLen = std::max(destOriginArray.Length(), 2u);
	size_t regionArrayLen = std::max(regionArray.Length(), 2u);
	size_t src_origin[] = { 0, 0, 0 };
	size_t dst_origin[] = { 0, 0, 0 };
	size_t region[] = { 1, 1, 1 };
	
	for(size_t i = 0; i < srcOriginArrayLen; i++) {
		src_origin[i] = srcOriginArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < destOriginArrayLen; i++) {
		dst_origin[i] = destOriginArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < regionArrayLen; i++) {
		region[i] = regionArray.Get(i).ToNumber().Int64Value();
	}
	
	GET_WAIT_LIST_AND_EVENT(6);
	
	CHECK_ERR(clEnqueueCopyImage(
		clQueue,
		src_buffer,
		dst_buffer,
		src_origin,
		dst_origin,
		region,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueCopyImageToBuffer(cl_command_queue /* command_queue */,
//                            cl_mem           /* src_image */,
//                            cl_mem           /* dst_buffer */,
//                            const size_t *   /* src_origin[3] */,
//                            const size_t *   /* region[3] */,
//                            size_t           /* dst_offset */,
//                            cl_uint          /* num_events_in_wait_list */,
//                            const cl_event * /* event_wait_list */,
//                            cl_event *       /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueCopyImageToBuffer) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, src_buffer, cl_mem);
	REQ_CL_ARG(2, dst_buffer, cl_mem);
	REQ_ARRAY_ARG(3, srcOriginArray);
	REQ_ARRAY_ARG(4, regionArray);
	REQ_OFFS_ARG(5, dst_offset);
	
	size_t srcOriginArrayLen = std::max(srcOriginArray.Length(), 2u);
	size_t regionArrayLen = std::max(regionArray.Length(), 2u);
	size_t src_origin[] = { 0, 0, 0 };
	size_t region[] = { 1, 1, 1 };
	
	for(size_t i = 0; i < srcOriginArrayLen; i++) {
		src_origin[i] = srcOriginArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < regionArrayLen; i++) {
		region[i] = regionArray.Get(i).ToNumber().Int64Value();
	}
	
	GET_WAIT_LIST_AND_EVENT(6);
	
	CHECK_ERR(clEnqueueCopyImageToBuffer(
		clQueue,
		src_buffer,
		dst_buffer,
		src_origin,
		region,
		dst_offset,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueCopyBufferToImage(cl_command_queue /* command_queue */,
//                            cl_mem           /* src_buffer */,
//                            cl_mem           /* dst_image */,
//                            size_t           /* src_offset */,
//                            const size_t *   /* dst_origin[3] */,
//                            const size_t *   /* region[3] */,
//                            cl_uint          /* num_events_in_wait_list */,
//                            const cl_event * /* event_wait_list */,
//                            cl_event *       /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueCopyBufferToImage) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, src_buffer, cl_mem);
	REQ_CL_ARG(2, dst_buffer, cl_mem);
	REQ_OFFS_ARG(3, src_offset);
	REQ_ARRAY_ARG(4, dstOriginArray);
	REQ_ARRAY_ARG(5, regionArray);

	size_t dst_origin[]={0,0,0};
	size_t region[]={1,1,1};
	size_t dstOriginArrayLen = std::max(dstOriginArray.Length(), 2u);
	size_t regionArrayLen = std::max(regionArray.Length(), 2u);
	
	for(size_t i = 0; i < dstOriginArrayLen; i++) {
		dst_origin[i] = dstOriginArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < regionArrayLen; i++) {
		region[i] = regionArray.Get(i).ToNumber().Int64Value();
	}
	
	GET_WAIT_LIST_AND_EVENT(6);
	
	CHECK_ERR(clEnqueueCopyBufferToImage(
		clQueue,
		src_buffer,
		dst_buffer,
		src_offset,
		dst_origin,
		region,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// static std::unordered_map<void*,int> mapPointers;

void CL_CALLBACK notifyMapCB (cl_event event, cl_int event_command_exec_status, void *user_data)
{
	// NoCLMapCB* asyncCB = static_cast<NoCLMapCB*>(user_data);
	// if (asyncCB!=nullptr)
	//     asyncCB->CallBackIsDone();
}

// extern CL_API_ENTRY void * CL_API_CALL
// clEnqueueMapBuffer(cl_command_queue /* command_queue */,
//                    cl_mem           /* buffer */,
//                    cl_bool          /* blocking_map */,
//                    cl_map_flags     /* map_flags */,
//                    size_t           /* offset */,
//                    size_t           /* size */,
//                    cl_uint          /* num_events_in_wait_list */,
//                    const cl_event * /* event_wait_list */,
//                    cl_event *       /* event */,
//                    cl_int *         /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueMapBuffer) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, mem, cl_mem);
	SOFT_BOOL_ARG(2, blocking_map);
	REQ_OFFS_ARG(3, map_flags);
	REQ_OFFS_ARG(4, offset);
	REQ_OFFS_ARG(5, size);
	GET_WAIT_LIST_AND_EVENT(6);
	
	void* mPtr = nullptr;
	cl_int err;
	
	mPtr = clEnqueueMapBuffer(
		clQueue,
		mem,
		blocking_map,
		map_flags,
		offset,
		size,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr,
		&err
	);
	
	CHECK_ERR(err);
	
	Napi::ArrayBuffer obj = Napi::ArrayBuffer::New(env, mPtr, size);
	
	if (eventPtr) {
		obj.Set("event", Wrapper::fromRaw(env, event));
	}
	
	if (!blocking_map) {
		// TODO? buf->SetIndexedPropertiesToExternalArrayData(
		// 	nullptr,
		// 	buf->GetIndexedPropertiesExternalArrayDataType(),
		// 	0
		// );
		// NoCLMapCB* cb = new NoCLMapCB(buf,size,mPtr);
		// err = clSetEventCallback(event,CL_COMPLETE,notifyMapCB,cb);
		// CHECK_ERR(err)
	}
	
	RET_VALUE(obj);
	
}

// extern CL_API_ENTRY void * CL_API_CALL
// clEnqueueMapImage(cl_command_queue  /* command_queue */,
//                   cl_mem            /* image */,
//                   cl_bool           /* blocking_map */,
//                   cl_map_flags      /* map_flags */,
//                   const size_t *    /* origin[3] */,
//                   const size_t *    /* region[3] */,
//                   size_t *          /* image_row_pitch */,
//                   size_t *          /* image_slice_pitch */,
//                   cl_uint           /* num_events_in_wait_list */,
//                   const cl_event *  /* event_wait_list */,
//                   cl_event *        /* event */,
//                   cl_int *          /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueMapImage) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, mem, cl_mem);
	SOFT_BOOL_ARG(2, blocking_map);
	REQ_OFFS_ARG(3, map_flags);
	REQ_ARRAY_ARG(4, srcOriginArray);
	REQ_ARRAY_ARG(5, regionArray);
	
	size_t origin[]={0,0,0};
	size_t region[]={1,1,1};
	size_t srcOriginArrayLen = std::max(srcOriginArray.Length(), 2u);
	size_t regionArrayLen = std::max(regionArray.Length(), 2u);
	
	for(size_t i = 0; i < srcOriginArrayLen; i++) {
		origin[i] = srcOriginArray.Get(i).ToNumber().Int64Value();
	}
	for(size_t i = 0; i < regionArrayLen; i++) {
		region[i] = regionArray.Get(i).ToNumber().Int64Value();
	}
	
	size_t image_row_pitch;
	size_t image_slice_pitch;
	
	GET_WAIT_LIST_AND_EVENT(6);
	
	void* mPtr = nullptr;
	cl_int err;
	
	mPtr = clEnqueueMapImage(
		clQueue,
		mem,
		blocking_map,
		map_flags,
		origin,
		region,
		&image_row_pitch,
		&image_slice_pitch,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr,
		&err
	);
	
	CHECK_ERR(err)
	
	size_t size = image_row_pitch * region[1];
	if (image_slice_pitch) {
		size = image_slice_pitch * region[2];
	}
	
	Napi::ArrayBuffer obj = Napi::ArrayBuffer::New(env, mPtr, size);
	obj.Set("image_row_pitch", JS_NUM(image_row_pitch));
	obj.Set("image_slice_pitch", JS_NUM(image_slice_pitch));
	
	if (eventPtr) {
		obj.Set("event", Wrapper::fromRaw(env, event));
	}
	
	if (!blocking_map) {
		//TODO? buf->SetIndexedPropertiesToExternalArrayData(nullptr, buf->GetIndexedPropertiesExternalArrayDataType(), 0);
		// NoCLMapCB* cb = new NoCLMapCB(buf,size,mPtr);
		// err = clSetEventCallback(event,CL_COMPLETE,notifyMapCB,cb);
		// CHECK_ERR(err)
	}
	
	RET_VALUE(obj);
//
//  cl_event event = nullptr;
//  if (!IS_ARG_EMPTY(9)) {
//    NOCL_UNWRAP(evt, NoCLEvent, info[9]);
//    event = evt->getRaw();
//  }
//
//  cl_int ret = CL_SUCCESS;
//  void *ptr = clEnqueueMapImage(
//    clQueue,image->getRaw(),blocking_map,map_flags,
//    origin, region, (size_t*)image_row_pitch, (size_t*)image_slice_pitch,
//    cl_events.size(), NOCL_TO_CL_ARRAY(cl_events, NoCLEvent),
//    event ? &event : nullptr,
//    &ret);
//
//  CHECK_ERR(ret);
//
//  RET_WRAPPER(ptr);
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueUnmapMemObject(cl_command_queue /* command_queue */,
//                         cl_mem           /* memobj */,
//                         void *           /* mapped_ptr */,
//                         cl_uint          /* num_events_in_wait_list */,
//                         const cl_event *  /* event_wait_list */,
//                         cl_event *        /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueUnmapMemObject) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, mem, cl_mem);
	REQ_OBJ_ARG(2, buffer);
	
	void *ptr = nullptr;
	size_t len = 0;
	getPtrAndLen(buffer, &ptr, &len);
	
	if (!ptr || !len) {
		JS_THROW("Could not read buffer data.");
		RET_UNDEFINED;
	}
	
	GET_WAIT_LIST_AND_EVENT(3);
	
	cl_int err;
	err = clEnqueueUnmapMemObject(
		clQueue,
		mem,
		ptr,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	);
	CHECK_ERR(err)
	
	RET_EVENT;
	
}


// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueMigrateMemObjects(cl_command_queue       /* command_queue */,
//                            cl_uint                /* num_mem_objects */,
//                            const cl_mem *         /* mem_objects */,
//                            cl_mem_migration_flags /* flags */,
//                            cl_uint                /* num_events_in_wait_list */,
//                            const cl_event *       /* event_wait_list */,
//                            cl_event *             /* event */) CL_API_SUFFIX__VERSION_1_2;
JS_METHOD(enqueueMigrateMemObjects) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_ARRAY_ARG(1, objArray);
	REQ_UINT32_ARG(2, flags);
	
	size_t objArrayLen = objArray.Length();
	std::unique_ptr<cl_mem[]> mem_objects(new cl_mem[objArrayLen]);
	for(size_t i = 0; i < objArrayLen; i++) {
		Napi::Value mem = objArray.Get(i);
		if (IS_EMPTY(mem)) {
			THROW_ERR(CL_INVALID_MEM_OBJECT);
		}
		Wrapper *memWrapper = Wrapper::unwrap(mem.As<Napi::Object>());
		mem_objects[i] = memWrapper->as<cl_mem>();
	}
	
	GET_WAIT_LIST_AND_EVENT(3);
	
	CHECK_ERR(clEnqueueMigrateMemObjects(
		clQueue,
		objArrayLen,
		mem_objects.get(),
		flags,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueNDRangeKernel(cl_command_queue /* command_queue */,
//                        cl_kernel        /* kernel */,
//                        cl_uint          /* work_dim */,
//                        const size_t *   /* global_work_offset */,
//                        const size_t *   /* global_work_size */,
//                        const size_t *   /* local_work_size */,
//                        cl_uint          /* num_events_in_wait_list */,
//                        const cl_event * /* event_wait_list */,
//                        cl_event *       /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueNDRangeKernel) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, k, cl_kernel);
	REQ_UINT32_ARG(2, work_dim);
	
	std::vector<size_t> cl_work_offset;
	std::vector<size_t> cl_work_global;
	std::vector<size_t> cl_work_local;
	
	if (!IS_ARG_EMPTY(3)) {
		REQ_ARRAY_ARG(3, js_work_offset);
		
		if (js_work_offset.Length() != work_dim) {
			THROW_ERR(CL_INVALID_GLOBAL_OFFSET);
		}
		
		for (unsigned int i = 0; i < work_dim; ++ i) {
			cl_work_offset.push_back(js_work_offset.Get(i).ToNumber().Int64Value());
		}
	}
	
	if (!IS_ARG_EMPTY(4)) {
		REQ_ARRAY_ARG(4, js_work_global);
		
		if (js_work_global.Length() != work_dim) {
			THROW_ERR(CL_INVALID_GLOBAL_WORK_SIZE);
		}
		
		for (unsigned int i = 0; i < work_dim; ++ i) {
			cl_work_global.push_back(js_work_global.Get(i).ToNumber().Int64Value());
		}
	}
	
	if (!IS_ARG_EMPTY(5)) {
		REQ_ARRAY_ARG(5, js_work_local);
		
		if (js_work_local.Length() != work_dim) {
			THROW_ERR(CL_INVALID_WORK_GROUP_SIZE);
		}
		
		for (unsigned int i = 0; i < work_dim; ++ i) {
			cl_work_local.push_back(js_work_local.Get(i).ToNumber().Int64Value());
		}
	}
	
	GET_WAIT_LIST_AND_EVENT(6);
	
	CHECK_ERR(clEnqueueNDRangeKernel(
		clQueue,
		k,
		work_dim,
		cl_work_offset.size() ? cl_work_offset.data() : nullptr,
		cl_work_global.size() ? cl_work_global.data() : nullptr,
		cl_work_local.size() ? cl_work_local.data() : nullptr,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}


// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueTask(cl_command_queue  /* command_queue */,
//               cl_kernel         /* kernel */,
//               cl_uint           /* num_events_in_wait_list */,
//               const cl_event *  /* event_wait_list */,
//               cl_event *        /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(enqueueTask) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	REQ_CL_ARG(1, k, cl_kernel);
	
	GET_WAIT_LIST_AND_EVENT(2);
	
	CHECK_ERR(clEnqueueTask(
		clQueue,
		k,
		cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}



// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueNativeKernel(cl_command_queue  /* command_queue */,
//             void (CL_CALLBACK * /*user_func*/)(void *),
//                       void *            /* info */,
//                       size_t            /* cb_info */,
//                       cl_uint           /* num_mem_objects */,
//                       const cl_mem *    /* mem_list */,
//                       const void **     /* args_mem_loc */,
//                       cl_uint           /* num_events_in_wait_list */,
//                       const cl_event *  /* event_wait_list */,
//                       cl_event *        /* event */) CL_API_SUFFIX__VERSION_1_0;

// Note: only available if CL_EXEC_NATIVE_KERNEL capability
JS_METHOD(enqueueNativeKernel) { NAPI_ENV;
	
	JS_THROW("enqueueNativeKernel is not supported by Node OpenCL");
	
	RET_UNDEFINED;
	
}


// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueMarkerWithWaitList(cl_command_queue /* command_queue */,
//                             cl_uint           /* num_events_in_wait_list */,
//                             const cl_event *  /* event_wait_list */,
//                             cl_event *        /* event */) CL_API_SUFFIX__VERSION_1_2;
JS_METHOD(enqueueMarkerWithWaitList) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	
	GET_WAIT_LIST_AND_EVENT(1);
	
	CHECK_ERR(clEnqueueMarkerWithWaitList(
		clQueue,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clEnqueueBarrierWithWaitList(cl_command_queue /* command_queue */,
//                              cl_uint           /* num_events_in_wait_list */,
//                              const cl_event *  /* event_wait_list */,
//                              cl_event *        /* event */) CL_API_SUFFIX__VERSION_1_2;
JS_METHOD(enqueueBarrierWithWaitList) { NAPI_ENV;
	
	REQ_CL_ARG(0, clQueue, cl_command_queue);
	
	GET_WAIT_LIST_AND_EVENT(1);
	
	CHECK_ERR(clEnqueueBarrierWithWaitList(
		clQueue,
		(cl_uint)cl_events.size(),
		&cl_events.front(),
		eventPtr
	));
	
	RET_EVENT;
}


JS_METHOD(enqueueAcquireGLObjects) { NAPI_ENV;
	
	REQ_CL_ARG(0, queue, cl_command_queue);
	REQ_CL_ARG(1, mem, cl_mem);
	
	CHECK_ERR(clEnqueueAcquireGLObjects(queue, 1, &mem, 0, 0, 0));
	
	RET_NUM(CL_SUCCESS);
	
}


JS_METHOD(enqueueReleaseGLObjects) { NAPI_ENV;
	
	REQ_CL_ARG(0, queue, cl_command_queue);
	REQ_CL_ARG(1, mem, cl_mem);
	
	CHECK_ERR(clEnqueueReleaseGLObjects(queue, 1, &mem, 0,0,0 ) );
	
	RET_NUM(CL_SUCCESS);
	
}


} // namespace opencl

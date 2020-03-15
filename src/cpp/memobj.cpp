#include "types.hpp"


namespace opencl {

// /* Memory Object APIs */
// extern CL_API_ENTRY cl_mem CL_API_CALL
// clCreateBuffer(cl_context   /* context */,
//                cl_mem_flags /* flags */,
//                size_t       /* size */,
//                void *       /* host_ptr */,
//                cl_int *     /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(createBuffer) { NAPI_ENV;
	
	REQ_CL_ARG(0, context, cl_context);
	REQ_OFFS_ARG(1, flags);
	REQ_OFFS_ARG(2, size);
	
	void *host_ptr = nullptr;
	if(!IS_ARG_EMPTY(3)) {
		REQ_OBJ_ARG(3, buffer);
		size_t len = 0;
		getPtrAndLen(buffer, &host_ptr, &len);
		
		if(!host_ptr || !len) {
			JS_THROW("Could not read buffer data.");
			RET_UNDEFINED;
		}
	}
	
	cl_int ret;
	cl_mem mem = clCreateBuffer(context, flags, size, host_ptr, &ret);
	CHECK_ERR(ret);
	
	RET_WRAPPER(mem);
	
}

// extern CL_API_ENTRY cl_mem CL_API_CALL
// clCreateSubBuffer(cl_mem                   /* buffer */,
//                   cl_mem_flags             /* flags */,
//                   cl_buffer_create_type    /* buffer_create_type */,
//                   const void *             /* buffer_create_info */,
//                   cl_int *                 /* errcode_ret */) CL_API_SUFFIX__VERSION_1_1;
JS_METHOD(createSubBuffer) { NAPI_ENV;
	
	REQ_CL_ARG(0, buffer, cl_mem);
	REQ_OFFS_ARG(1, flags);
	REQ_UINT32_ARG(2, buffer_create_type);
	
	if(buffer_create_type == CL_BUFFER_CREATE_TYPE_REGION) {
		REQ_OBJ_ARG(3, obj);
		cl_buffer_region buffer_create_info;
		buffer_create_info.origin = obj.Get("origin").ToNumber().Int64Value();
		buffer_create_info.size = obj.Get("size").ToNumber().Int64Value();
		
		cl_int ret = CL_SUCCESS;
		cl_mem mem = clCreateSubBuffer(
			buffer,
			flags,
			buffer_create_type,
			&buffer_create_info,
			&ret
		);
		CHECK_ERR(ret);
		
		RET_WRAPPER(mem);
	}
	
	CHECK_ERR(CL_INVALID_VALUE);
	RET_UNDEFINED;
	
}

// extern CL_API_ENTRY cl_mem CL_API_CALL
// clCreateImage(cl_context              /* context */,
//               cl_mem_flags            /* flags */,
//               const cl_image_format * /* image_format */,
//               const cl_image_desc *   /* image_desc */,
//               void *                  /* host_ptr */,
//               cl_int *                /* errcode_ret */) CL_API_SUFFIX__VERSION_1_2;
JS_METHOD(createImage) { NAPI_ENV;
	
	REQ_CL_ARG(0, context, cl_context);
	REQ_OFFS_ARG(1, flags);
	REQ_OBJ_ARG(2, formatObj);
	
	cl_image_format image_format;
	image_format.image_channel_order = formatObj.Has("channel_order")
		? 0
		: formatObj.Get("channel_order").ToNumber().Uint32Value();
	image_format.image_channel_data_type = formatObj.Has("channel_data_type")
		? 0
		: formatObj.Get("channel_data_type").ToNumber().Uint32Value();
	
	REQ_OBJ_ARG(3, descObj);
	cl_image_desc desc;
	memset(&desc, 0, sizeof(cl_image_desc));
	
	desc.image_type = descObj.Has("type")
		? 0
		: descObj.Get("type").ToNumber().Uint32Value();
	desc.image_width = descObj.Has("width")
		? 0
		: descObj.Get("width").ToNumber().Int64Value();
	desc.image_height = descObj.Has("height")
		? 0
		: descObj.Get("height").ToNumber().Int64Value();
	desc.image_depth = descObj.Has("depth")
		? 0
		: descObj.Get("depth").ToNumber().Int64Value();
	desc.image_array_size = descObj.Has("array_size")
		? 0
		: descObj.Get("array_size").ToNumber().Int64Value();
	desc.image_row_pitch = descObj.Has("row_pitch")
		? 0
		: descObj.Get("row_pitch").ToNumber().Int64Value();
	desc.image_slice_pitch = descObj.Has("slice_pitch")
		? 0
		: descObj.Get("slice_pitch").ToNumber().Int64Value();
	
	Napi::Value buffer_value = descObj.Get("buffer");
	if (buffer_value.IsObject()) {
		Wrapper *m = Wrapper::unwrap(buffer_value.As<Napi::Object>());
		cl_mem buffer = m->as<cl_mem>();
		desc.buffer = buffer;
	}

	void *host_ptr = nullptr;
	if(!IS_ARG_EMPTY(4)) {
		REQ_OBJ_ARG(4, buffer);
		size_t len = 0;
		getPtrAndLen(buffer, &host_ptr, &len);
		
		if(!host_ptr || !len) {
			JS_THROW("Could not read buffer data.");
			RET_UNDEFINED;
		}
	}
	
	cl_int ret = CL_SUCCESS;
	cl_mem mem = clCreateImage(
		context,
		flags,
		&image_format,
		&desc,
		host_ptr,
		&ret
	);
	CHECK_ERR(ret);
	
	// if(host_ptr) {
	//   NoCLAvoidGC* user_data = new NoCLAvoidGC(info[3].As<Object>());
	//   clSetMemObjectDestructorCallback(mem,notifyFreeClMemObj,user_data);
	// }
	
	RET_WRAPPER(mem);
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clRetainMemObject(cl_mem /* memobj */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(retainMemObject) { NAPI_ENV;
	
	REQ_WRAP_ARG(0, mem);
	
	cl_int ret = mem->acquire();
	CHECK_ERR(ret);
	
	RET_NUM(CL_SUCCESS);
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clReleaseMemObject(cl_mem /* memobj */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(releaseMemObject) { NAPI_ENV;
	
	REQ_WRAP_ARG(0, mem);
	
	cl_int ret = mem->release();
	CHECK_ERR(ret);
	
	RET_NUM(CL_SUCCESS);
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clGetSupportedImageFormats(cl_context           /* context */,
//                            cl_mem_flags         /* flags */,
//                            cl_mem_object_type   /* image_type */,
//                            cl_uint              /* num_entries */,
//                            cl_image_format *    /* image_formats */,
//                            cl_uint *            /* num_image_formats */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(getSupportedImageFormats) { NAPI_ENV;
	
	REQ_CL_ARG(0, context, cl_context);
	REQ_OFFS_ARG(1, flags);
	REQ_OFFS_ARG(2, image_type);
	
	cl_uint numEntries = 0;
	CHECK_ERR(clGetSupportedImageFormats(
		context,
		flags,
		image_type,
		0,
		nullptr,
		&numEntries
	));
	
	std::unique_ptr<cl_image_format[]> image_formats(new cl_image_format[numEntries]);
	CHECK_ERR(clGetSupportedImageFormats(
		context,
		flags,
		image_type,
		numEntries,
		image_formats.get(),
		nullptr
	));
	
	Napi::Array imageFormats = Napi::Array::New(env);
	for (size_t i = 0; i < numEntries; i++) {
		Napi::Object format = Napi::Object::New(env);
		format.Set("channel_order", JS_NUM(image_formats[i].image_channel_order));
		format.Set("channel_data_type", JS_NUM(image_formats[i].image_channel_data_type));
		imageFormats.Set(i, format);
	}
	
	RET_VALUE(imageFormats);
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clGetMemObjectInfo(cl_mem           /* memobj */,
//                    cl_mem_info      /* param_name */,
//                    size_t           /* param_value_size */,
//                    void *           /* param_value */,
//                    size_t *         /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(getMemObjectInfo) { NAPI_ENV;
	
	REQ_CL_ARG(0, mem, cl_mem);
	REQ_OFFS_ARG(1, param_name);
	
	switch(param_name) {
		case CL_MEM_TYPE: {
			cl_mem_object_type val;
			CHECK_ERR(clGetMemObjectInfo(
				mem,
				param_name,
				sizeof(cl_mem_object_type),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
		case CL_MEM_FLAGS: {
			cl_mem_flags val;
			CHECK_ERR(clGetMemObjectInfo(
				mem,
				param_name,
				sizeof(cl_mem_flags),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
		case CL_MEM_SIZE:
		case CL_MEM_OFFSET:
		{
			size_t val;
			CHECK_ERR(clGetMemObjectInfo(
				mem,
				param_name,
				sizeof(size_t),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
		case CL_MEM_MAP_COUNT:
		case CL_MEM_REFERENCE_COUNT:
		{
			cl_uint val;
			CHECK_ERR(clGetMemObjectInfo(
				mem,
				param_name,
				sizeof(cl_uint),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
		case CL_MEM_HOST_PTR: {
			void* val;
			CHECK_ERR(clGetMemObjectInfo(
				mem,
				param_name,
				sizeof(void*),
				&val,
				nullptr
			));
			RET_WRAPPER(val);
		}
		case CL_MEM_CONTEXT: {
			cl_context val;
			CHECK_ERR(clGetMemObjectInfo(
				mem,
				param_name,
				sizeof(cl_context),
				&val,
				nullptr
			));
			CHECK_ERR(clRetainContext(val))
			RET_WRAPPER(val);
		}
		case CL_MEM_ASSOCIATED_MEMOBJECT: {
			cl_mem val;
			CHECK_ERR(clGetMemObjectInfo(
				mem,
				param_name,
				sizeof(cl_mem),
				&val,
				nullptr
			));
			CHECK_ERR(clRetainMemObject(val))
			RET_WRAPPER(val);
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clGetImageInfo(cl_mem           /* image */,
//                cl_image_info    /* param_name */,
//                size_t           /* param_value_size */,
//                void *           /* param_value */,
//                size_t *         /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(getImageInfo) { NAPI_ENV;
	
	REQ_CL_ARG(0, mem, cl_mem);
	REQ_OFFS_ARG(1, param_name);
	
	switch(param_name) {
		case CL_IMAGE_FORMAT: {
			cl_image_format val;
			CHECK_ERR(clGetImageInfo(
				mem,
				param_name,
				sizeof(cl_image_format),
				&val,
				nullptr
			));
			Napi::Array arr = Napi::Array::New(env);
			arr.Set("channel_order", JS_NUM(val.image_channel_order));
			arr.Set("channel_data_type", JS_NUM(val.image_channel_data_type));
			RET_VALUE(arr);
		}
		case CL_IMAGE_ELEMENT_SIZE:
		case CL_IMAGE_ROW_PITCH:
		case CL_IMAGE_SLICE_PITCH:
		case CL_IMAGE_WIDTH:
		case CL_IMAGE_HEIGHT:
		case CL_IMAGE_DEPTH:
		case CL_IMAGE_ARRAY_SIZE:
		{
			size_t val;
			CHECK_ERR(clGetImageInfo(
				mem,
				param_name,
				sizeof(size_t),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
		case CL_IMAGE_BUFFER: {
			cl_mem val;
			CHECK_ERR(clGetImageInfo(
				mem,
				param_name,
				sizeof(cl_mem),
				&val,
				nullptr
			));
			CHECK_ERR(clRetainMemObject(val))
			RET_WRAPPER(val);
		}
		case CL_IMAGE_NUM_MIP_LEVELS:
		case CL_IMAGE_NUM_SAMPLES:
		{
			cl_uint val;
			CHECK_ERR(clGetImageInfo(
				mem,
				param_name,
				sizeof(cl_uint),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
	
}

} // namespace opencl

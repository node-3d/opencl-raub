#include "types.hpp"


namespace opencl {

JS_METHOD(createBuffer) { NAPI_ENV;
	REQ_CL_ARG(0, context, cl_context);
	REQ_OFFS_ARG(1, flags);
	REQ_OFFS_ARG(2, size);
	
	if (!flags) {
		flags = CL_MEM_READ_WRITE;
	}
	
	void *host_ptr = nullptr;
	if (!IS_ARG_EMPTY(3)) {
		REQ_OBJ_ARG(3, buffer);
		size_t len = 0;
		getPtrAndLen(buffer, &host_ptr, &len);
		
		if (!host_ptr || !len) {
			JS_THROW("Could not read buffer data.");
			RET_UNDEFINED;
		}
	}
	
	cl_int ret;
	cl_mem mem = clCreateBuffer(context, flags, size, host_ptr, &ret);
	CHECK_ERR(ret);
	
	RET_WRAPPER(mem);
}

JS_METHOD(createSubBuffer) { NAPI_ENV;
	REQ_CL_ARG(0, buffer, cl_mem);
	REQ_OFFS_ARG(1, flags);
	REQ_UINT32_ARG(2, buffer_create_type);
	
	if (buffer_create_type == CL_BUFFER_CREATE_TYPE_REGION) {
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

JS_METHOD(createImage) { NAPI_ENV;
	REQ_CL_ARG(0, context, cl_context);
	REQ_OFFS_ARG(1, flags);
	REQ_OBJ_ARG(2, formatObj);
	
	cl_image_format image_format;
	image_format.image_channel_order = formatObj.Has("channel_order")
		? formatObj.Get("channel_order").ToNumber().Uint32Value()
		: 0;
	image_format.image_channel_data_type = formatObj.Has("channel_data_type")
		? formatObj.Get("channel_data_type").ToNumber().Uint32Value()
		: 0;
	
	REQ_OBJ_ARG(3, descObj);
	cl_image_desc desc;
	memset(&desc, 0, sizeof(cl_image_desc));
	
	desc.image_type = descObj.Has("type")
		? descObj.Get("type").ToNumber().Uint32Value()
		: CL_MEM_OBJECT_IMAGE1D;
	desc.image_width = descObj.Has("width")
		? descObj.Get("width").ToNumber().Int64Value()
		: 1;
	desc.image_height = descObj.Has("height")
		? descObj.Get("height").ToNumber().Int64Value()
		: 1;
	desc.image_depth = descObj.Has("depth")
		? descObj.Get("depth").ToNumber().Int64Value()
		: 1;
	desc.image_array_size = descObj.Has("array_size")
		? descObj.Get("array_size").ToNumber().Int64Value()
		: 0;
	desc.image_row_pitch = descObj.Has("row_pitch")
		? descObj.Get("row_pitch").ToNumber().Int64Value()
		: 0;
	desc.image_slice_pitch = descObj.Has("slice_pitch")
		? descObj.Get("slice_pitch").ToNumber().Int64Value()
		: 0;
	
	Napi::Value buffer_value = descObj.Get("buffer");
	if (buffer_value.IsObject()) {
		Wrapper *m = Wrapper::unwrap(buffer_value.As<Napi::Object>());
		cl_mem buffer = m->as<cl_mem>();
		desc.buffer = buffer;
	}
	
	void *host_ptr = nullptr;
	if (!IS_ARG_EMPTY(4)) {
		REQ_OBJ_ARG(4, buffer);
		size_t len = 0;
		getPtrAndLen(buffer, &host_ptr, &len);
		
		if (!host_ptr || !len) {
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
	
	// if (host_ptr) {
	//   NoCLAvoidGC* user_data = new NoCLAvoidGC(info[3].As<Object>());
	//   clSetMemObjectDestructorCallback(mem, notifyFreeClMemObj, user_data);
	// }
	
	RET_WRAPPER(mem);
}

JS_METHOD(retainMemObject) { NAPI_ENV;
	REQ_WRAP_ARG(0, mem);
	
	cl_int ret = mem->acquire();
	CHECK_ERR(ret);
	
	RET_NUM(CL_SUCCESS);
}

JS_METHOD(releaseMemObject) { NAPI_ENV;
	REQ_WRAP_ARG(0, mem);
	
	cl_int ret = mem->release();
	CHECK_ERR(ret);
	
	RET_NUM(CL_SUCCESS);
}

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
	
	Napi::Array imageFormats = Napi::Array::New(env);
	if (!numEntries) {
		RET_VALUE(imageFormats);
	}
	
	std::unique_ptr<cl_image_format[]> image_formats(new cl_image_format[numEntries]);
	CHECK_ERR(clGetSupportedImageFormats(
		context,
		flags,
		image_type,
		numEntries,
		image_formats.get(),
		nullptr
	));
	
	for (size_t i = 0; i < numEntries; i++) {
		Napi::Object format = Napi::Object::New(env);
		format.Set("channel_order", JS_NUM(image_formats[i].image_channel_order));
		format.Set("channel_data_type", JS_NUM(image_formats[i].image_channel_data_type));
		imageFormats.Set(i, format);
	}
	
	RET_VALUE(imageFormats);
}

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
		case CL_MEM_OFFSET: {
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
		case CL_MEM_REFERENCE_COUNT: {
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
			size_t memSize;
			CHECK_ERR(clGetMemObjectInfo(
				mem,
				CL_MEM_SIZE,
				sizeof(size_t),
				&memSize,
				nullptr
			));
			if (!memSize) {
				RET_NULL;
			}
			void* memPtr;
			CHECK_ERR(clGetMemObjectInfo(
				mem,
				param_name,
				sizeof(void*),
				&memPtr,
				nullptr
			));
			if (!memPtr) {
				RET_NULL;
			}
			RET_VALUE(Napi::ArrayBuffer::New(env, memPtr, memSize));
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
			Napi::Object obj = Napi::Object::New(env);
			obj.Set("channel_order", JS_NUM(val.image_channel_order));
			obj.Set("channel_data_type", JS_NUM(val.image_channel_data_type));
			RET_VALUE(obj);
		}
		case CL_IMAGE_ELEMENT_SIZE:
		case CL_IMAGE_ROW_PITCH:
		case CL_IMAGE_SLICE_PITCH:
		case CL_IMAGE_WIDTH:
		case CL_IMAGE_HEIGHT:
		case CL_IMAGE_DEPTH:
		case CL_IMAGE_ARRAY_SIZE: {
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
			// This is buggy and deprecated - intentionally cut support
			THROW_ERR(CL_INVALID_VALUE);
		}
		case CL_IMAGE_NUM_MIP_LEVELS:
		case CL_IMAGE_NUM_SAMPLES: {
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


JS_METHOD(createFromGLBuffer) { NAPI_ENV;
	REQ_CL_ARG(0, context, cl_context);
	REQ_OFFS_ARG(1, flags);
	REQ_OFFS_ARG(2, vboId);
	
	cl_int ret = CL_SUCCESS;
	cl_mem mem = clCreateFromGLBuffer(context, flags, vboId, &ret);
	CHECK_ERR(ret);
	
	RET_WRAPPER(mem);
}

JS_METHOD(createFromGLRenderbuffer) { NAPI_ENV;
	REQ_CL_ARG(0, context, cl_context);
	REQ_OFFS_ARG(1, flags);
	REQ_OFFS_ARG(2, rboId);
	
	cl_int ret = CL_SUCCESS;
	cl_mem mem = clCreateFromGLRenderbuffer(context, flags, rboId, &ret);
	CHECK_ERR(ret);
	
	RET_WRAPPER(mem);
}

JS_METHOD(createFromGLTexture) { NAPI_ENV;
	REQ_CL_ARG(0, context, cl_context);
	REQ_OFFS_ARG(1, flags);
	REQ_OFFS_ARG(2, target);
	REQ_OFFS_ARG(3, mip);
	REQ_OFFS_ARG(4, texId);
	
	cl_int ret = CL_SUCCESS;
	cl_mem mem = clCreateFromGLTexture(context, flags, target, mip, texId, &ret);
	CHECK_ERR(ret);
	
	RET_WRAPPER(mem);
}

} // namespace opencl

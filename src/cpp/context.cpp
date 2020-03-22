#include "types.hpp"


namespace opencl {

// /* Context APIs  */
// extern CL_API_ENTRY cl_context CL_API_CALL
// clCreateContext(const cl_context_properties * /* properties */,
//                 cl_uint                 /* num_devices */,
//                 const cl_device_id *    /* devices */,
//                 void (CL_CALLBACK * /* pfn_notify */)(const char *, const void *, size_t, void *),
//                 void *                  /* user_data */,
//                 cl_int *                /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(createContext) { NAPI_ENV;
	
	LET_ARRAY_ARG(0, js_properties);
	std::vector<cl_context_properties> cl_properties;
	size_t propLen = js_properties.Length();
	for (size_t i = 0; i < propLen; i++) {
		cl_uint prop_id = js_properties.Get(i).ToNumber().Uint32Value();
		cl_properties.push_back(prop_id);
		if (prop_id == CL_CONTEXT_PLATFORM) {
			Wrapper *platform = Wrapper::unwrap(js_properties.Get(++i).As<Napi::Object>());
			cl_properties.push_back(
				(cl_context_properties) platform->as<cl_platform_id>()
			);
		} else if (prop_id == CL_GL_CONTEXT_KHR || prop_id == CL_WGL_HDC_KHR) {
			cl_properties.push_back(js_properties.Get(++i).ToNumber().Int64Value());
		}
	}
	cl_properties.push_back(0);
	
	REQ_ARRAY_ARG(1, js_devices);
	std::vector<cl_device_id> cl_devices;
	if (Wrapper::fromJsArray(js_devices, &cl_devices)) {
		RET_UNDEFINED;
	}
	int err = CL_SUCCESS;
	cl_context ctx = clCreateContext(
		&cl_properties.front(),
		(int) cl_devices.size(),
		&cl_devices.front(),
		nullptr, // TODO: callback support
		nullptr,
		&err
	);
	
	CHECK_ERR(err);
	
	RET_WRAPPER(ctx);
	
}


// extern CL_API_ENTRY cl_context CL_API_CALL
// clCreateContextFromType(const cl_context_properties * /* properties */,
//                         cl_device_type          /* device_type */,
//                         void (CL_CALLBACK *     /* pfn_notify*/ )(const char *, const void *, size_t, void *),
//                         void *                  /* user_data */,
//                         cl_int *                /* errcode_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(createContextFromType) { NAPI_ENV;
	
	REQ_ARRAY_ARG(0, js_properties);
	std::vector<cl_context_properties> cl_properties;
	size_t propLen = js_properties.Length();
	for (size_t i = 0; i < propLen; i++) {
		cl_uint prop_id = js_properties.Get(i).ToNumber().Uint32Value();
		cl_properties.push_back(prop_id);
		if (prop_id == CL_CONTEXT_PLATFORM) {
			Wrapper *platform = Wrapper::unwrap(js_properties.Get(++i).As<Napi::Object>());
			cl_properties.push_back(
				(cl_context_properties) platform->as<cl_platform_id>()
			);
		} else if (prop_id == CL_GL_CONTEXT_KHR || prop_id == CL_WGL_HDC_KHR) {
			cl_properties.push_back(js_properties.Get(++i).ToNumber().Int64Value());
		}
	}
	cl_properties.push_back(0);

	REQ_UINT32_ARG(1, device_type);

	int err = CL_SUCCESS;
	cl_context ctx = clCreateContextFromType(
		cl_properties.data(),
		device_type,
		nullptr, // TODO: callback support
		nullptr,
		&err
	);
	
	CHECK_ERR(err);
	
	RET_WRAPPER(ctx);
	
}


// extern CL_API_ENTRY cl_int CL_API_CALL
// clRetainContext(cl_context /* context */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(retainContext) { NAPI_ENV;
	
	REQ_WRAP_ARG(0, ctx);
	
	cl_int err = ctx->acquire();
	CHECK_ERR(err)
	
	RET_NUM(err);
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clReleaseContext(cl_context /* context */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(releaseContext) { NAPI_ENV;
	
	REQ_WRAP_ARG(0, ctx);
	
	cl_int err = ctx->release();
	CHECK_ERR(err)
	
	RET_NUM(err);
	
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clGetContextInfo(cl_context         /* context */,
//                  cl_context_info    /* param_name */,
//                  size_t             /* param_value_size */,
//                  void *             /* param_value */,
//                  size_t *           /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(getContextInfo) { NAPI_ENV;
	
	REQ_CL_ARG(0, context, cl_context);
	REQ_UINT32_ARG(1, param_name);
	
	switch (param_name) {
	case CL_CONTEXT_REFERENCE_COUNT:
	case CL_CONTEXT_NUM_DEVICES: {
		cl_uint param_value = 0;
		CHECK_ERR(clGetContextInfo(
			context,
			param_name,
			sizeof(cl_uint),
			&param_value,
			nullptr
		));
		RET_NUM(param_value);
	}
	case CL_CONTEXT_DEVICES: {
		size_t n = 0;
		CHECK_ERR(clGetContextInfo(context, param_name, 0, nullptr, &n));
		n /= sizeof(cl_device_id);

		std::unique_ptr<cl_device_id[]> devices(new cl_device_id[n]);
		CHECK_ERR(clGetContextInfo(
			context,
			param_name,
			sizeof(cl_device_id) * n,
			devices.get(),
			nullptr
		));

		Napi::Array arr = Napi::Array::New(env);
		for(size_t i = 0; i < n; i++) {
			CHECK_ERR(clRetainDevice(devices[i]))
			arr.Set(i, Wrapper::fromRaw(env, devices[i]));
		}
		RET_VALUE(arr);
	}
	case CL_CONTEXT_PROPERTIES: {
		size_t n = 0;
		CHECK_ERR(clGetContextInfo(context,param_name,0,nullptr, &n));
		std::unique_ptr<cl_context_properties[]> ctx(new cl_context_properties[n]);
		CHECK_ERR(clGetContextInfo(
			context,
			param_name,
			sizeof(cl_context_properties)*n, ctx.get(), nullptr));

		Napi::Array arr = Napi::Array::New(env);
		for(size_t i = 0; i < n; i++) {
			arr.Set(i, JS_NUM(ctx[i]));
		}
		
		RET_VALUE(arr);
	}
	default: {
		THROW_ERR(CL_INVALID_VALUE);
		RET_UNDEFINED;
	}
	}
	
	RET_UNDEFINED;
	
}

} // namespace opencl

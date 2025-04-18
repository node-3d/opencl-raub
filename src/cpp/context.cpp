#include "wrapper.hpp"


namespace opencl {

constexpr uint32_t COUNT_CTX_PROPERTY_MAX = 127; // reserve 1 slot for `0` termination
cl_context_properties bufferCtxProperties[COUNT_CTX_PROPERTY_MAX * 2 + 2];

cl_context_properties *readCtxProperties(Napi::Array jsProperties) {
	uint32_t propLen = std::min(COUNT_CTX_PROPERTY_MAX, jsProperties.Length());
	if (!propLen) {
		return nullptr;
	}
	
	uint32_t at = 0;
	for (at = 0; at < propLen; at += 2) {
		cl_uint key = jsProperties.Get(at).ToNumber().Uint32Value();
		bufferCtxProperties[at] = key;
		
		const uint32_t valueIdx = at + 1;
		
		if (key == CL_CONTEXT_PLATFORM) {
			Wrapper *platform = Wrapper::unwrap(jsProperties.Get(valueIdx).As<Napi::Object>());
			bufferCtxProperties[valueIdx] = platform->as<cl_context_properties>();
			continue;
		}
		
		bufferCtxProperties[valueIdx] = jsProperties.Get(valueIdx).ToNumber().Int64Value();
	}
	
	bufferCtxProperties[at] = 0;
	return bufferCtxProperties;
}

JS_METHOD(createContext) { NAPI_ENV;
	LET_ARRAY_ARG(0, jsProperties);
	REQ_ARRAY_ARG(1, jsDevices);
	
	cl_context_properties *clProperties = readCtxProperties(jsProperties);
	std::vector<cl_device_id> clDevices;
	if (Wrapper::fromJsArray(jsDevices, &clDevices)) {
		RET_UNDEFINED;
	}
	int err = CL_SUCCESS;
	cl_context ctx = clCreateContext(
		clProperties,
		static_cast<cl_uint>(clDevices.size()),
		&clDevices.front(),
		nullptr, // TODO: callback support?
		nullptr,
		&err
	);
	
	CHECK_ERR(err);
	
	RET_WRAPPER(ctx);
}

JS_METHOD(createContextFromType) { NAPI_ENV;
	REQ_ARRAY_ARG(0, jsProperties);
	REQ_UINT32_ARG(1, device_type);
	
	cl_context_properties *clProperties = readCtxProperties(jsProperties);
	
	int err = CL_SUCCESS;
	cl_context ctx = clCreateContextFromType(
		clProperties,
		device_type,
		nullptr, // TODO: callback support
		nullptr,
		&err
	);
	
	CHECK_ERR(err);
	
	RET_WRAPPER(ctx);
}

JS_METHOD(retainContext) { NAPI_ENV;
	REQ_WRAP_ARG(0, ctx);
	
	cl_int err = ctx->acquire();
	CHECK_ERR(err)
	
	RET_NUM(err);
}

JS_METHOD(releaseContext) { NAPI_ENV;
	REQ_WRAP_ARG(0, ctx);
	
	cl_int err = ctx->release();
	CHECK_ERR(err)
	
	RET_NUM(err);
}

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
			arr.Set(i, Wrapper::from(env, devices[i]));
		}
		RET_VALUE(arr);
	}
	case CL_CONTEXT_PROPERTIES: {
		size_t n = 0;
		CHECK_ERR(clGetContextInfo(context, param_name, 0, nullptr, &n));
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

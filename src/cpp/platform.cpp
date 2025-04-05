#include "wrapper.hpp"


namespace opencl {

JS_METHOD(getPlatformIDs) { NAPI_ENV;
	cl_uint num_entries = 0;
	CHECK_ERR(clGetPlatformIDs(0, nullptr, &num_entries));
	
	Napi::Array platformArray = Napi::Array::New(env);
	if (!num_entries) {
		RET_VALUE(platformArray);
	}
	
	std::unique_ptr<cl_platform_id[]> platforms(new cl_platform_id[num_entries]);
	CHECK_ERR(clGetPlatformIDs(num_entries, platforms.get(), nullptr));
	
	for (size_t i = 0; i < num_entries; i++) {
		platformArray.Set(i, Wrapper::from(env, platforms[i]));
	}
	
	RET_VALUE(platformArray);
}

JS_METHOD(getPlatformInfo) { NAPI_ENV;
	REQ_CL_ARG(0, platform_id, cl_platform_id);
	REQ_OFFS_ARG(1, param_name);
	
	char param_value[1024];
	size_t param_value_size_ret = 0;
	
	CHECK_ERR(clGetPlatformInfo(
		platform_id,
		param_name,
		1024,
		param_value,
		&param_value_size_ret
	));
	
	RET_STR(param_value);
}


} // namespace opencl

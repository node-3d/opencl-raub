#include <uv.h>

#include "wrapper.hpp"
#include "notify-helper.hpp"


namespace opencl {

JS_METHOD(createProgramWithSource) { NAPI_ENV;
	REQ_CL_ARG(0, context, cl_context);
	REQ_STR_ARG(1, str);
	
	cl_int ret = CL_SUCCESS;
	size_t lengths[] = { str.length() };
	const char *strings[] = { str.c_str() };
	cl_program p = clCreateProgramWithSource(context, 1, strings, lengths, &ret);
	CHECK_ERR(ret);
	
	RET_WRAPPER(p);
}

JS_METHOD(createProgramWithBinary) { NAPI_ENV;
	REQ_CL_ARG(0, context, cl_context);
	REQ_ARRAY_ARG(1, js_devices);
	REQ_ARRAY_ARG(2, js_binaries); // ArrayBuffer[]
	
	if (!js_binaries.Length()) {
		THROW_ERR(CL_INVALID_VALUE);
		RET_UNDEFINED;
	}
	
	std::vector<cl_device_id> cl_devices;
	if (Wrapper::fromJsArray(js_devices, &cl_devices)) {
		RET_UNDEFINED;
	}
	
	std::vector<size_t> cl_binary_lengths;
	std::vector<const unsigned char*> cl_binaries_str;
	for (size_t i = 0; i < js_binaries.Length(); i++) {
		void *host_ptr = nullptr;
		size_t len = 0;
		getPtrAndLen(js_binaries.Get(i).As<Napi::Object>(), &host_ptr, &len);
		cl_binary_lengths.push_back(len);
		cl_binaries_str.push_back(static_cast<const unsigned char*>(host_ptr));
	}
	
	cl_int ret = CL_SUCCESS;
	cl_program p = clCreateProgramWithBinary(
		context,
		(cl_uint) cl_devices.size(),
		&cl_devices.front(),
		&cl_binary_lengths[0],
		&cl_binaries_str[0],
		nullptr,
		&ret
	);
	CHECK_ERR(ret);
	
	RET_WRAPPER(p);
}

JS_METHOD(createProgramWithBuiltInKernels) { NAPI_ENV;
	REQ_CL_ARG(0, context, cl_context);
	REQ_ARRAY_ARG(1, js_devices);
	REQ_ARRAY_ARG(2, js_names);
	
	size_t namesLen = js_names.Length();
	if (namesLen == 0) {
		THROW_ERR(CL_INVALID_VALUE);
	}
	
	std::vector<std::string> strNames;
	std::vector<const char*> names;
	for (size_t i = 0; i < namesLen; i++) {
		if (!js_names.Get(i).IsString()) {
			THROW_ERR(CL_INVALID_VALUE);
			RET_UNDEFINED;
		}
		strNames.push_back(js_names.Get(i).ToString().Utf8Value());
		names.push_back(strNames[i].c_str());
	}
	
	std::vector<cl_device_id> cl_devices;
	if (Wrapper::fromJsArray(js_devices, &cl_devices)) {
		RET_UNDEFINED;
	}
	
	cl_int err = CL_SUCCESS;
	cl_program prg = clCreateProgramWithBuiltInKernels(
		context,
		(cl_uint) cl_devices.size(),
		&cl_devices.front(),
		names.front(),
		&err
	);
	
	CHECK_ERR(err);
	
	RET_WRAPPER(prg);
}

JS_METHOD(retainProgram) { NAPI_ENV;
	REQ_WRAP_ARG(0, p);
	
	cl_int err = p->acquire();
	CHECK_ERR(err);
	
	RET_NUM(CL_SUCCESS);
}

JS_METHOD(releaseProgram) { NAPI_ENV;
	REQ_WRAP_ARG(0, p);
	
	cl_int err = p->release();
	CHECK_ERR(err);
	
	RET_NUM(CL_SUCCESS);
}

JS_METHOD(buildProgram) { NAPI_ENV;
	REQ_CL_ARG(0, p, cl_program);
	
	std::vector<cl_device_id> cl_devices;
	if (!IS_ARG_EMPTY(1)) {
		REQ_ARRAY_ARG(1, js_devices);
		if (Wrapper::fromJsArray(js_devices, &cl_devices)) {
			RET_UNDEFINED;
		}
	}
	
	std::string options;
	if (!IS_ARG_EMPTY(2)) {
		REQ_STR_ARG(2, str);
		options = str;
	}
	
	int err;
	
	// callback + userdata
	if (!IS_ARG_EMPTY(3)) {
		REQ_FUN_ARG(3, callback);
		err = clBuildProgram(
			p,
			(cl_uint) cl_devices.size(),
			&cl_devices.front(),
			options.length() > 0 ? options.c_str() : nullptr,
			NotifyHelper<cl_program>::callNotify,
			new NotifyHelper<cl_program>(callback, info[4])
		);
	} else {
		err = clBuildProgram(
			p,
			(cl_uint) cl_devices.size(),
			cl_devices.size() ? &cl_devices.front() : nullptr,
			options.length() > 0 ? options.c_str() : nullptr,
			nullptr,
			nullptr
		);
	}
	
	CHECK_ERR(err);
	
	RET_NUM(CL_SUCCESS);
}

JS_METHOD(compileProgram) { NAPI_ENV;
	REQ_CL_ARG(0, p, cl_program);
	
	std::vector<cl_device_id> cl_devices;
	if (!IS_ARG_EMPTY(1)) {
		REQ_ARRAY_ARG(1, js_devices);
		if (Wrapper::fromJsArray(js_devices, &cl_devices)) {
			RET_UNDEFINED;
		}
	}
	
	std::string options;
	if (!IS_ARG_EMPTY(2)) {
		REQ_STR_ARG(2, str);
		options = str;
	}
	
	std::vector<cl_program> program_headers;
	if (!IS_ARG_EMPTY(3)) {
		REQ_ARRAY_ARG(3, js_programs);
		if (Wrapper::fromJsArray(js_programs, &program_headers)) {
			RET_UNDEFINED;
		}
	}
	
	std::vector<std::string> strNames;
	std::vector<const char*> names;
	if (!IS_ARG_EMPTY(4)) {
		REQ_ARRAY_ARG(4, js_names);
		size_t namesLen = js_names.Length();
		for (size_t i = 0; i < namesLen; i++) {
			if (!js_names.Get(i).IsString()) {
				THROW_ERR(CL_INVALID_VALUE);
				RET_UNDEFINED;
			}
			strNames.push_back(js_names.Get(i).ToString().Utf8Value());
			names.push_back(strNames[i].c_str());
		}
	}
	
	if (program_headers.size() != names.size()) {
		THROW_ERR(CL_INVALID_VALUE);
	}
	
	int err;
	
	if (!IS_ARG_EMPTY(5)) {
		REQ_FUN_ARG(5, callback);
		err = clCompileProgram(
			p,
			(cl_uint) cl_devices.size(),
			&cl_devices.front(),
			options.length() > 0 ? options.c_str() : nullptr,
			(cl_uint) program_headers.size(),
			&program_headers.front(),
			&names.front(),
			NotifyHelper<cl_program>::callNotify,
			new NotifyHelper<cl_program>(callback, info[6])
		);
	} else {
		err = clCompileProgram(
			p,
			(cl_uint) cl_devices.size(),
			&cl_devices.front(),
			options.length() > 0 ? options.c_str() : nullptr,
			(cl_uint) program_headers.size(),
			&program_headers.front(),
			&names.front(),
			nullptr,
			nullptr
		);
	}
	
	CHECK_ERR(err);
	
	RET_NUM(CL_SUCCESS);
}

JS_METHOD(linkProgram) { NAPI_ENV;
	REQ_CL_ARG(0, ctx, cl_context);
	
	std::vector<cl_device_id> cl_devices;
	if (!IS_ARG_EMPTY(1)) {
		REQ_ARRAY_ARG(1, js_devices);
		if (Wrapper::fromJsArray(js_devices, &cl_devices)) {
			RET_UNDEFINED;
		}
	}
	

	std::string options;
	if (!IS_ARG_EMPTY(2)) {
		REQ_STR_ARG(2, str);
		options = str;
	}
	
	std::vector<cl_program> cl_programs;
	if (!IS_ARG_EMPTY(3)) {
		REQ_ARRAY_ARG(3, js_programs);
		if (Wrapper::fromJsArray(js_programs, &cl_programs)) {
			RET_UNDEFINED;
		}
	}
	
	cl_int ret = CL_SUCCESS;
	
	cl_program prg;
	
	if (!IS_ARG_EMPTY(4)) {
		REQ_FUN_ARG(4, callback);
		prg = clLinkProgram(
			ctx,
			(cl_uint) cl_devices.size(),
			&cl_devices.front(),
			options.length() > 0 ? options.c_str() : nullptr,
			(cl_uint) cl_programs.size(),
			&cl_programs.front(),
			NotifyHelper<cl_program>::callNotify,
			new NotifyHelper<cl_program>(callback, info[5]),
			&ret
		);
	} else {
		prg = clLinkProgram(
			ctx,
			(cl_uint) cl_devices.size(),
			&cl_devices.front(),
			options.length() > 0 ? options.c_str() : nullptr,
			(cl_uint) cl_programs.size(),
			&cl_programs.front(),
			nullptr,
			nullptr,
			&ret
		);
	}
	
	CHECK_ERR(ret);
	
	RET_WRAPPER(prg);
}

JS_METHOD(unloadPlatformCompiler) { NAPI_ENV;
	REQ_CL_ARG(0, platform, cl_platform_id);
	
	CHECK_ERR(clUnloadPlatformCompiler(platform));
	
	RET_NUM(CL_SUCCESS);
}

JS_METHOD(getProgramInfo) { NAPI_ENV;
	REQ_CL_ARG(0, prog, cl_program);
	REQ_UINT32_ARG(1, param_name);
	
	switch(param_name) {
		case CL_PROGRAM_REFERENCE_COUNT:
		case CL_PROGRAM_NUM_DEVICES: {
			cl_uint val;
			CHECK_ERR(clGetProgramInfo(
				prog,
				param_name,
				sizeof(cl_uint),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
		case CL_PROGRAM_CONTEXT: {
			cl_context val;
			CHECK_ERR(clGetProgramInfo(
				prog,
				param_name,
				sizeof(cl_context),
				&val,
				nullptr
			));
			CHECK_ERR(clRetainContext(val))
			RET_WRAPPER(val);
		}
		case CL_PROGRAM_DEVICES: {
			size_t n = 0;
			CHECK_ERR(clGetProgramInfo(prog, param_name, 0, nullptr, &n));
			n /= sizeof(cl_device_id);
			
			std::unique_ptr<cl_device_id[]> devices(new cl_device_id[n]);
			CHECK_ERR(clGetProgramInfo(
				prog,
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
		// DRIVER ISSUE : Segfault if program has not been compiled
		case CL_PROGRAM_BINARY_SIZES: {
			cl_uint nsizes;
			CHECK_ERR(clGetProgramInfo(
				prog,
				CL_PROGRAM_NUM_DEVICES,
				sizeof(cl_uint),
				&nsizes,
				nullptr
			));
			
			std::unique_ptr<size_t[]> sizes(new size_t[nsizes]);
			CHECK_ERR(clGetProgramInfo(
				prog,
				param_name,
				nsizes * sizeof(size_t),
				sizes.get(),
				nullptr
			));
			
			Napi::Array arr = Napi::Array::New(env);
			for(cl_uint i = 0; i < nsizes; i++) {
				arr.Set(i, JS_NUM(sizes[i]));
			}
			RET_VALUE(arr);
		}
		
		case CL_PROGRAM_BINARIES: {
			cl_uint nsizes;
			CHECK_ERR(clGetProgramInfo(
				prog,
				CL_PROGRAM_NUM_DEVICES,
				sizeof(cl_uint),
				&nsizes,
				nullptr
			));
			
			std::unique_ptr<size_t[]> sizes(new size_t[nsizes]);
			CHECK_ERR(clGetProgramInfo(
				prog,
				CL_PROGRAM_BINARY_SIZES,
				nsizes * sizeof(size_t),
				sizes.get(),
				nullptr
			));
			
			size_t n_size_total = 0;
			unsigned char** bn = new unsigned char* [nsizes];
			for(size_t i = 0; i < nsizes; i++) {
				n_size_total += sizes[i];
				bn[i] = new unsigned char[sizes[i]];
			}
			
			size_t n_ret_size = 0;
			CHECK_ERR(clGetProgramInfo(
				prog,
				CL_PROGRAM_BINARIES,
				n_size_total,
				nullptr,
				&n_ret_size
			));
			
			CHECK_ERR(clGetProgramInfo(
				prog,
				CL_PROGRAM_BINARIES,
				n_ret_size,
				bn,
				nullptr
			));
			
			Napi::Array arr = Napi::Array::New(env);
			for (cl_uint i = 0; i < nsizes; i++) {
				void* data = reinterpret_cast<void*>(bn[i]);
				Napi::ArrayBuffer buf = Napi::ArrayBuffer::New(env, data, sizes[i]);
				arr.Set(i, buf);
			}
			
			for(size_t i = 0; i < nsizes; i++) {
				delete [] bn[i];
			}
			delete [] bn;
			
			RET_VALUE(arr);
		}
		case CL_PROGRAM_NUM_KERNELS: {
			size_t val;
			CHECK_ERR(clGetProgramInfo(prog, param_name, sizeof(size_t), &val, nullptr))
			RET_NUM(val);
		}
		case CL_PROGRAM_KERNEL_NAMES:
		case CL_PROGRAM_SOURCE: {
			size_t nchars;
			CHECK_ERR(clGetProgramInfo(prog, param_name, 0, nullptr, &nchars));
			std::unique_ptr<char[]> names(new char[nchars]);
			CHECK_ERR(clGetProgramInfo(
				prog,
				param_name,
				nchars * sizeof(char),
				names.get(),
				nullptr
			));
			RET_STR(names.get());
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
}

JS_METHOD(getProgramBuildInfo) { NAPI_ENV;
	REQ_CL_ARG(0, prog, cl_program);
	REQ_CL_ARG(1, device, cl_device_id);
	REQ_UINT32_ARG(2, param_name);
	
	switch(param_name) {
		case CL_PROGRAM_BUILD_STATUS: {
			cl_build_status val;
			CHECK_ERR(clGetProgramBuildInfo(
				prog,
				device,
				param_name,
				sizeof(cl_build_status),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
		case CL_PROGRAM_BUILD_OPTIONS:
		case CL_PROGRAM_BUILD_LOG: {
			size_t param_value_size_ret = 0;
			CHECK_ERR(clGetProgramBuildInfo(
				prog,
				device,
				param_name,
				0,
				nullptr,
				&param_value_size_ret
			));
			std::unique_ptr<char[]> param_value(new char[param_value_size_ret]);
			CHECK_ERR(clGetProgramBuildInfo(
				prog,
				device,
				param_name,
				param_value_size_ret,
				param_value.get(),
				nullptr
			));
			RET_STR(param_value.get());
		}
		case CL_PROGRAM_BINARY_TYPE: {
			cl_program_binary_type val;
			CHECK_ERR(clGetProgramBuildInfo(
				prog,
				device,
				param_name,
				sizeof(cl_program_binary_type),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
}

} // namespace opencl

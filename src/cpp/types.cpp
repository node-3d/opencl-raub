#include "types.hpp"


namespace opencl {

struct TypeInfo {
	const char *typeName;
	cl_func release;
	cl_func acquire;
};


int noop(void*) {
	return 0;
}

TypeInfo typeInfo[] = {
	{ "ERROR", noop, noop },
	{ "cl_platform_id", noop, noop },
	{ "cl_device_id", noop, noop },
	{ "cl_context", reinterpret_cast<cl_func>(clReleaseContext), reinterpret_cast<cl_func>(clRetainContext) },
	{ "cl_program", reinterpret_cast<cl_func>(clReleaseProgram), reinterpret_cast<cl_func>(clRetainProgram) },
	{ "cl_kernel", reinterpret_cast<cl_func>(clReleaseKernel), reinterpret_cast<cl_func>(clRetainKernel) },
	{ "cl_mem", reinterpret_cast<cl_func>(clReleaseMemObject), reinterpret_cast<cl_func>(clRetainMemObject) },
	{ "cl_sampler", reinterpret_cast<cl_func>(clReleaseSampler), reinterpret_cast<cl_func>(clRetainSampler) },
	{ "cl_command_queue", reinterpret_cast<cl_func>(clReleaseCommandQueue), reinterpret_cast<cl_func>(clRetainCommandQueue) },
	{ "cl_event", reinterpret_cast<cl_func>(clReleaseEvent), reinterpret_cast<cl_func>(clRetainEvent) },
	{ "cl_program_binary", noop, noop },
	{ "cl_mapped_ptr", noop, noop }
};


IMPLEMENT_ES5_CLASS(Wrapper);


void Wrapper::init(Napi::Env env, Napi::Object exports) {
	Napi::Function ctor = wrap(env);
	JS_ASSIGN_METHOD(toString);
	exports.Set("Wrapper", ctor);
}


Napi::Object Wrapper::fromRaw(Napi::Env env, cl_platform_id raw) {
	return _ctorEs5.Value().New({ JS_EXT(raw), JS_NUM(1) });
}
Napi::Object Wrapper::fromRaw(Napi::Env env, cl_device_id raw) {
	return _ctorEs5.New({ JS_EXT(raw), JS_NUM(2) });
}
Napi::Object Wrapper::fromRaw(Napi::Env env, cl_context raw) {
	return _ctorEs5.New({ JS_EXT(raw), JS_NUM(3) });
}
Napi::Object Wrapper::fromRaw(Napi::Env env, cl_program raw) {
	return _ctorEs5.New({ JS_EXT(raw), JS_NUM(4) });
}
Napi::Object Wrapper::fromRaw(Napi::Env env, cl_kernel raw) {
	return _ctorEs5.New({ JS_EXT(raw), JS_NUM(5) });
}
Napi::Object Wrapper::fromRaw(Napi::Env env, cl_mem raw) {
	return _ctorEs5.New({ JS_EXT(raw), JS_NUM(6) });
}
Napi::Object Wrapper::fromRaw(Napi::Env env, cl_sampler raw) {
	return _ctorEs5.New({ JS_EXT(raw), JS_NUM(7) });
}
Napi::Object Wrapper::fromRaw(Napi::Env env, cl_command_queue raw) {
	return _ctorEs5.New({ JS_EXT(raw), JS_NUM(8) });
}
Napi::Object Wrapper::fromRaw(Napi::Env env, cl_event raw) {
	return _ctorEs5.New({ JS_EXT(raw), JS_NUM(9) });
}
Napi::Object Wrapper::fromRaw(Napi::Env env, cl_program_binary raw) {
	return _ctorEs5.New({ JS_EXT(raw), JS_NUM(10) });
}
Napi::Object Wrapper::fromRaw(Napi::Env env, cl_mapped_ptr raw) {
	return _ctorEs5.New({ JS_EXT(raw), JS_NUM(11) });
}


Wrapper::Wrapper(const Napi::CallbackInfo& info) { NAPI_ENV;
	
	super(info);
	
	if (!info[0].IsExternal() || !info[1].IsNumber()) {
		_data = nullptr;
		_released = false;
		_acquire = typeInfo[0].acquire;
		_release = typeInfo[0].release;
		_typeName = typeInfo[0].typeName;
		JS_THROW("Failed to construct a Wrapper.");
		return;
	}
	
	Napi::External<void> extParam = info[0].As< Napi::External<void> >();
	int32_t infoIdx = info[1].ToNumber().Int32Value();
	
	_data = extParam.Data();
	_released = false;
	_acquire = typeInfo[infoIdx].acquire;
	_release = typeInfo[infoIdx].release;
	_typeName = typeInfo[infoIdx].typeName;
	
}


Wrapper::~Wrapper() {
	release();
}


JS_IMPLEMENT_METHOD(Wrapper, toString) { NAPI_ENV;
	std::stringstream ss;
	ss << "{ " << _typeName << " @" << _data << " }";
	RET_STR(ss.str());
}


int Wrapper::acquire() const {
	return _acquire(_data);
}


int Wrapper::release() {
	if (_released) {
		return CL_SUCCESS;
	}
	_released = true;
	return _release(_data);
}

}

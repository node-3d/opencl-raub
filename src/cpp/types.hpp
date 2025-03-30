#pragma once

#include <string>
#include <vector>
#include <sstream>

#include "common.hpp"


namespace opencl {

typedef void *cl_mapped_ptr;
typedef unsigned char *cl_program_binary;
typedef int (*cl_func)(void*);


class Wrapper {
DECLARE_ES5_CLASS(Wrapper, Wrapper);

public:
	static void init(Napi::Env env, Napi::Object exports);
	
	static Napi::Object fromRaw(Napi::Env env, cl_platform_id raw);
	static Napi::Object fromRaw(Napi::Env env, cl_device_id raw);
	static Napi::Object fromRaw(Napi::Env env, cl_context raw);
	static Napi::Object fromRaw(Napi::Env env, cl_program raw);
	static Napi::Object fromRaw(Napi::Env env, cl_kernel raw);
	static Napi::Object fromRaw(Napi::Env env, cl_mem raw);
	static Napi::Object fromRaw(Napi::Env env, cl_sampler raw);
	static Napi::Object fromRaw(Napi::Env env, cl_command_queue raw);
	static Napi::Object fromRaw(Napi::Env env, cl_event raw);
	static Napi::Object fromRaw(Napi::Env env, cl_program_binary raw);
	static Napi::Object fromRaw(Napi::Env env, cl_mapped_ptr raw);
	
	explicit Wrapper(const Napi::CallbackInfo& info);
	~Wrapper();
	
	JS_DECLARE_METHOD(Wrapper, toString);
	
	cl_int acquire();
	cl_int release();
	
	template <typename T> T as() { return reinterpret_cast<T>(_data); }
	
	static void throwArrayEx(Napi::Env env, int i, const char* msg);
	
	// return 0 === success
	template <typename T>
	static int fromJsArray(Napi::Array src, std::vector<T> *out) {
		for (size_t i = 0; i < src.Length(); i++) {
			Napi::Value value = src.Get(i);
			if (!value.IsObject()) {
				throwArrayEx(src.Env(), i, "is not an Object.");
				return -1;
			}
			Wrapper *wrapper = Wrapper::unwrap(value.As<Napi::Object>());
			if (!wrapper) {
				throwArrayEx(src.Env(), i, "is not a CL Wrapper.");
				return -1;
			}
			out->push_back(wrapper->as<T>());
		}
		return 0;
	}
	
private:
	void *_data;
	cl_func _acquire;
	cl_func _release;
	uint16_t _released;
	const char *_typeName;
	
};

#define GET_WAIT_LIST(n)                                                      \
	std::vector<cl_event> cl_events;                                          \
	if (!IS_ARG_EMPTY(n)) {                                                   \
		REQ_ARRAY_ARG(n, js_events);                                          \
		if (Wrapper::fromJsArray(js_events, &cl_events)) {                    \
			RET_UNDEFINED;                                                    \
		}                                                                     \
	}

#define RET_WRAPPER(W) RET_VALUE(Wrapper::fromRaw(env, W));

#define REQ_WRAP_ARG(I, VAR)                                                  \
	REQ_OBJ_ARG(I, _obj_##VAR);                                               \
	Wrapper *VAR = Wrapper::unwrap(_obj_##VAR);                               \
	if (!VAR) {                                                               \
		JS_THROW("Argument " #I " must be a CL Wrapper.");                    \
		RET_UNDEFINED;                                                        \
	}

#define REQ_CL_ARG(I, VAR, TYPE)                                              \
	REQ_WRAP_ARG(I, _wrap_##VAR);                                             \
	TYPE VAR = _wrap_##VAR->as<TYPE>();

} // namespace opencl

#ifndef OPENCL_TYPES_H
#define OPENCL_TYPES_H

#include <string>
#include <vector>
#include <iostream>
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
	
	int acquire() const;
	
	int release();
	
	template <typename T> T as() { return reinterpret_cast<T>(_data); }
	
	template <typename T>
	static std::vector<T> fromJsArray(Napi::Array &src) {
		std::vector<T> out;
		for (size_t i = 0; i < src.Length(); i++) {
			Wrapper *wrapper = Wrapper::unwrap(src.Get(i).As<Napi::Object>());
			out.push_back(wrapper->as<T>());
		}
		return out;
	}
	
private:
	void *_data;
	cl_func _acquire;
	cl_func _release;
	bool _released;
	const char *_typeName;
	
};

#define GET_WAIT_LIST(n)                                                      \
	std::vector<cl_event> cl_events;                                          \
	if (!IS_ARG_EMPTY(n)) {                                                   \
		REQ_ARRAY_ARG(n, js_events);                                          \
		cl_events = Wrapper::fromJsArray<cl_event>(js_events);                \
	}

#define RET_WRAPPER(W) RET_VALUE(Wrapper::fromRaw(env, W));

#define REQ_WRAP_ARG(I, VAR)                                                  \
	REQ_OBJ_ARG(I, _obj_##VAR);                                               \
	Wrapper *VAR = Wrapper::unwrap(_obj_##VAR);

#define REQ_CL_ARG(I, VAR, TYPE)                                              \
	REQ_WRAP_ARG(I, _wrap_##VAR);                                             \
	TYPE VAR = _wrap_##VAR->as<TYPE>();

}

#endif

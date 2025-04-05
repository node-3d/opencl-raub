#pragma once

#include "wrapper.hpp"

namespace opencl {

template<typename T>
class NotifyHelper {
public:
	NotifyHelper(Napi::Function callback, Napi::Value userData) {
		Napi::Env env = callback.Env();
		
		_ref.Reset(Napi::Object::New(env), 1);
		_ref.Set("cb", callback);
		_ref.Set("data", userData);
		
		void *context = nullptr;
		_tsfn = Napi::ThreadSafeFunction::New(
			env, callback, _ref.Value(), "NotifyHelper", 0LLU, 1LLU, context, _delete, this
		);
	}
	
	~NotifyHelper() {
		Napi::Env env = _ref.Env();
		_ref.Set("cb", JS_NULL);
		_ref.Set("data", JS_NULL);
		_ref.Reset();
	}
	
	static void CL_CALLBACK callNotify(T resource, void *ptr) {
		NotifyHelper<T> *notifier = reinterpret_cast<NotifyHelper<T>*>(ptr);
		notifier->_notify(resource);
	}
	static void CL_CALLBACK callNotifyStatus(T resource, cl_int status, void *ptr) {
		NotifyHelper<T> *notifier = reinterpret_cast<NotifyHelper<T>*>(ptr);
		notifier->_notifyStatus(resource, status);
	}
	
private:
	Napi::ObjectReference _ref;
	Napi::ThreadSafeFunction _tsfn;
	
	static void _delete(napi_env env, NotifyHelper<T>* that, void*) {
		delete that;
	}
	
	void _notify(T resource) {
		NotifyHelper<T> *that = this;
		napi_status result = _tsfn.NonBlockingCall(
			[that, resource](Napi::Env env, Napi::Function callback) {
				callback.Call(
					that->_ref.Value(),
					{ Wrapper::from(env, resource), that->_ref.Get("data") }
				);
			}
		);
		if (result != napi_ok) {
			fprintf(stderr, "Error: can't call TSFN (#%d).\n", result);
		}
		
		_tsfn.Release();
	}
	
	void _notifyStatus(T resource, cl_int status) {
		NotifyHelper<T> *that = this;
		napi_status result = _tsfn.NonBlockingCall(
			[that, resource, status](Napi::Env env, Napi::Function callback) {
				callback.Call(
					that->_ref.Value(),
					{ Wrapper::from(env, resource), JS_NUM(status), that->_ref.Get("data") }
				);
			}
		);
		if (result != napi_ok) {
			fprintf(stderr, "Error: can't call TSFN (#%d).\n", result);
		}
		
		_tsfn.Release();
	}
};

} // namespace opencl

#pragma once

#include "wrapper.hpp"

namespace opencl {

template<typename T>
class NotifyHelper {
public:
	NotifyHelper(Napi::Function callback, Napi::Value userData) {
		Napi::Env env = callback.Env();
		_tsfn = Napi::ThreadSafeFunction::New(
			env, callback, Napi::Object(), "NotifyHelper", 0, 1, _delete
		);
		
		_ref.Reset(Napi::Object::New(env), 1);
		_ref.Set("cb", callback);
		_ref.Set("data", userData);
	}
	
	~NotifyHelper() {
		Napi::Env env = _ref.Env();
		_ref.Set("cb", JS_NULL);
		_ref.Set("data", JS_NULL);
		_ref.Reset();
	}
	
	static void CL_CALLBACK callNotify(T resource, void *ptr) {
		NotifyHelper *notifier = reinterpret_cast<NotifyHelper*>(ptr);
		notifier->_notify(resource);
	}
	static void CL_CALLBACK callNotifyStatus(T resource, cl_int status, void *ptr) {
		NotifyHelper *notifier = reinterpret_cast<NotifyHelper*>(ptr);
		notifier->_notifyStatus(resource, status);
	}
	
private:
	Napi::ObjectReference _ref;
	Napi::ThreadSafeFunction _tsfn;
	
	static void _delete(napi_env env, void* data, void*) {
		if (data != nullptr) {
			NotifyHelper* that = static_cast<NotifyHelper*>(data);
			delete that;
		}
	}
	
	void _notify(T resource) {
		NotifyHelper *that = this;
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
		NotifyHelper *that = this;
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

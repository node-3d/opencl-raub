#include <uv.h>

#include "types.hpp"


namespace opencl {

// /* Event Object APIs */
// extern CL_API_ENTRY cl_int CL_API_CALL
// clWaitForEvents(cl_uint             /* num_events */,
//                 const cl_event *    /* event_list */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(waitForEvents) { NAPI_ENV;
	GET_WAIT_LIST(0);
	
	CHECK_ERR(clWaitForEvents(
		(cl_uint) cl_events.size(),
		&cl_events.front()
	));
	
	RET_NUM(CL_SUCCESS);
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clGetEventInfo(cl_event         /* event */,
//                cl_event_info    /* param_name */,
//                size_t           /* param_value_size */,
//                void *           /* param_value */,
//                size_t *         /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(getEventInfo) { NAPI_ENV;
	REQ_CL_ARG(0, ev, cl_event);
	REQ_UINT32_ARG(1, param_name);
	
	switch(param_name) {
		case CL_EVENT_COMMAND_QUEUE: {
			cl_command_queue val;
			CHECK_ERR(clGetEventInfo(
				ev,
				param_name,
				sizeof(cl_command_queue),
				&val,
				nullptr
			));
			CHECK_ERR(clRetainCommandQueue(val));
			RET_WRAPPER(val);
		}
		case CL_EVENT_CONTEXT: {
			cl_context val;
			CHECK_ERR(clGetEventInfo(
				ev,
				param_name,
				sizeof(cl_context),
				&val, nullptr
			));
			CHECK_ERR(clRetainContext(val));
			RET_WRAPPER(val);
		}
		case CL_EVENT_COMMAND_TYPE: {
			cl_command_type val;
			CHECK_ERR(clGetEventInfo(
				ev,
				param_name,
				sizeof(cl_command_type),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
		case CL_EVENT_COMMAND_EXECUTION_STATUS: {
			cl_int val;
			CHECK_ERR(clGetEventInfo(ev, param_name, sizeof(cl_int), &val, nullptr));
			RET_NUM(val);
		}
		case CL_EVENT_REFERENCE_COUNT: {
			cl_uint val;
			CHECK_ERR(clGetEventInfo(ev, param_name, sizeof(cl_uint), &val, nullptr));
			RET_NUM(val);
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
}

// extern CL_API_ENTRY cl_event CL_API_CALL
// clCreateUserEvent(cl_context    /* context */,
//                   cl_int *      /* errcode_ret */) CL_API_SUFFIX__VERSION_1_1;
JS_METHOD(createUserEvent) { NAPI_ENV;
	REQ_CL_ARG(0, context, cl_context);
	
	cl_int err;
	cl_event uev = clCreateUserEvent(context, &err);
	CHECK_ERR(err);
	
	RET_WRAPPER(uev);
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clRetainEvent(cl_event /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(retainEvent) { NAPI_ENV;
	REQ_WRAP_ARG(0, eventWrapper);
	
	cl_int err = eventWrapper->acquire();
	CHECK_ERR(err);
	
	RET_NUM(CL_SUCCESS);
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clReleaseEvent(cl_event /* event */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(releaseEvent) { NAPI_ENV;
	REQ_WRAP_ARG(0, eventWrapper);
	cl_int err = eventWrapper->release();
	CHECK_ERR(err);
	
	RET_NUM(CL_SUCCESS);
}

// extern CL_API_ENTRY cl_int CL_API_CALL
// clSetUserEventStatus(cl_event   /* event */,
//                      cl_int     /* execution_status */) CL_API_SUFFIX__VERSION_1_1;
JS_METHOD(setUserEventStatus) { NAPI_ENV;
	REQ_CL_ARG(0, ev, cl_event);
	REQ_UINT32_ARG(1, exec_status);
	
	CHECK_ERR(clSetUserEventStatus(ev, exec_status));
	
	RET_NUM(CL_SUCCESS);
}

// /* Profiling APIs */
// extern CL_API_ENTRY cl_int CL_API_CALL
// clGetEventProfilingInfo(cl_event            /* event */,
//                         cl_profiling_info   /* param_name */,
//                         size_t              /* param_value_size */,
//                         void *              /* param_value */,
//                         size_t *            /* param_value_size_ret */) CL_API_SUFFIX__VERSION_1_0;
JS_METHOD(getEventProfilingInfo) { NAPI_ENV;
	REQ_CL_ARG(0, ev, cl_event);
	REQ_UINT32_ARG(1, param_name);
	
	switch(param_name) {
		case CL_PROFILING_COMMAND_QUEUED:
		case CL_PROFILING_COMMAND_SUBMIT:
		case CL_PROFILING_COMMAND_START:
		case CL_PROFILING_COMMAND_END: {
			/**
				JS Compatibility
				
				As JS does not support 64 bits integer, we return a 2-integer array with
					output_values[0] = (input_value >> 32) & 0xffffffff;
					output_values[1] = input_value & 0xffffffff;
				
				and reconstruction as
					input_value = ((int64_t) output_values[0]) << 32) | output_values[1];
			*/
			cl_ulong val;
			CHECK_ERR(clGetEventProfilingInfo(
				ev,
				param_name,
				sizeof(cl_ulong),
				&val,
				nullptr
			));
			
			Napi::Array arr = Napi::Array::New(env);
			arr.Set(0u, JS_NUM(val>>32)); // hi
			arr.Set(1u, JS_NUM(val & 0xffffffff)); // lo
			RET_VALUE(arr);
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
}


class EventWorker : public Napi::AsyncWorker {
	
public:
	EventWorker(Napi::Function callback, Napi::Object userData, Napi::Object wrapper):
	Napi::AsyncWorker(callback, "CL::EventWorker") {
		_refEvent.Reset(wrapper, 1);
		_refData.Reset(userData, 1);
		this->async = new uv_async_t();
		this->async->data = reinterpret_cast<void*>(this);
		uv_async_init(
			uv_default_loop(),
			this->async,
			(uv_async_cb)
			dispatched_async_uv_callback
		);
	}
	
	~EventWorker() {
		uv_close(reinterpret_cast<uv_handle_t*>(this->async), &delete_async_handle);
	}
	
	uv_async_t *async;
	
	void setStatus(int status) {
		_status = status;
	}
	
	// Executed inside the worker-thread.
	void Execute() {
	}
	
	// Executed when the async work is complete
	// this function will be run inside the main event loop
	void OnOK () {
		Napi::Env env = Env();
		NAPI_HS;
		Callback().Call({
			_refData.Value(), // userdata
			JS_NUM(_status), // error status
			_refEvent.Value() // event
		});
	}
	
protected:
	static void delete_async_handle(uv_handle_t *handle);
	// The callback invoked by the call to uv_async_send() in notifyCB.
	// Invoked on the main thread, so it's safe to call AsyncQueueWorker.
	static void dispatched_async_uv_callback(uv_async_t*);
	
private:
	int _status = 0;
	Napi::ObjectReference _refEvent;
	Napi::ObjectReference _refData;
};

void EventWorker::delete_async_handle(uv_handle_t *handle) {
	delete reinterpret_cast<uv_async_t*>(handle);
}

void EventWorker::dispatched_async_uv_callback(uv_async_t *req) {
	EventWorker* asyncCB = static_cast<EventWorker*>(req->data);
	asyncCB->Queue();
}

// callback invoked off the main thread by clSetEventCallback
void CL_CALLBACK notifyCB (cl_event event, cl_int event_command_exec_status, void *user_data) {
	EventWorker* asyncCB = reinterpret_cast<EventWorker*>(user_data);
	asyncCB->setStatus(event_command_exec_status);
	// send a message to the main thread to safely invoke the JS callback
	uv_async_send(asyncCB->async);
}

JS_METHOD(setEventCallback) { NAPI_ENV;
	REQ_CL_ARG(0, ev, cl_event);
	REQ_UINT32_ARG(1, callbackStatusType);
	REQ_FUN_ARG(2, callback);
	LET_OBJ_ARG(3, userData);
	
	EventWorker* asyncCB = new EventWorker(
		callback,
		userData,
		info[0].As<Napi::Object>()
	);
	
	CHECK_ERR(clSetEventCallback(ev, callbackStatusType, notifyCB, asyncCB));
	
	RET_NUM(CL_SUCCESS);
}


} // namespace opencl

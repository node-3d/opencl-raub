#include <uv.h>

#include "wrapper.hpp"
#include "common.hpp"
#include "notify-helper.hpp"


namespace opencl {

JS_METHOD(waitForEvents) { NAPI_ENV;
	GET_WAIT_LIST(0);
	
	CHECK_ERR(clWaitForEvents(
		(cl_uint) cl_events.size(),
		&cl_events.front()
	));
	
	RET_UNDEFINED;
}

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

JS_METHOD(createUserEvent) { NAPI_ENV;
	REQ_CL_ARG(0, context, cl_context);
	
	cl_int err;
	cl_event uev = clCreateUserEvent(context, &err);
	CHECK_ERR(err);
	
	RET_WRAPPER(uev);
}

JS_METHOD(retainEvent) { NAPI_ENV;
	REQ_WRAP_ARG(0, eventWrapper);
	
	cl_int err = eventWrapper->acquire();
	CHECK_ERR(err);
	
	RET_UNDEFINED;
}

JS_METHOD(releaseEvent) { NAPI_ENV;
	REQ_WRAP_ARG(0, eventWrapper);
	cl_int err = eventWrapper->release();
	CHECK_ERR(err);
	
	RET_UNDEFINED;
}

JS_METHOD(setUserEventStatus) { NAPI_ENV;
	REQ_CL_ARG(0, ev, cl_event);
	REQ_UINT32_ARG(1, exec_status);
	
	CHECK_ERR(clSetUserEventStatus(ev, exec_status));
	
	RET_UNDEFINED;
}

JS_METHOD(getEventProfilingInfo) { NAPI_ENV;
	REQ_CL_ARG(0, ev, cl_event);
	REQ_UINT32_ARG(1, param_name);
	
	switch(param_name) {
		case CL_PROFILING_COMMAND_QUEUED:
		case CL_PROFILING_COMMAND_SUBMIT:
		case CL_PROFILING_COMMAND_START:
		case CL_PROFILING_COMMAND_END: {
			cl_ulong val;
			CHECK_ERR(clGetEventProfilingInfo(
				ev,
				param_name,
				sizeof(cl_ulong),
				&val,
				nullptr
			));
			
			RET_X64(val);
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
}

JS_METHOD(setEventCallback) { NAPI_ENV;
	REQ_CL_ARG(0, ev, cl_event);
	REQ_UINT32_ARG(1, callbackStatusType);
	REQ_FUN_ARG(2, callback);
	
	CHECK_ERR(clSetEventCallback(
		ev,
		callbackStatusType,
		NotifyHelper<cl_event>::callNotifyStatus,
		new NotifyHelper<cl_event>(callback, info[3])
	));
	
	RET_UNDEFINED;
}


} // namespace opencl

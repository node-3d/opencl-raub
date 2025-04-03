#include "types.hpp"


namespace opencl {

JS_METHOD(createSampler) { NAPI_ENV;
	REQ_CL_ARG(0, context, cl_context);
	
	SOFT_BOOL_ARG(1, normalized_coords);
	REQ_UINT32_ARG(2, addressing_mode);
	REQ_UINT32_ARG(3, filter_mode);
	
	cl_int ret = CL_SUCCESS;
	cl_sampler sw = clCreateSampler(
		context,
		normalized_coords,
		addressing_mode,
		filter_mode,
		&ret
	);
	CHECK_ERR(ret);
	
	RET_WRAPPER(sw);
}

JS_METHOD(retainSampler) { NAPI_ENV;
	REQ_WRAP_ARG(0, sampler);
	
	cl_int err = sampler->acquire();
	CHECK_ERR(err);
	
	RET_NUM(err);
}

JS_METHOD(releaseSampler) { NAPI_ENV;
	REQ_WRAP_ARG(0, sampler);
	
	cl_int err = sampler->release();
	CHECK_ERR(err);
	
	RET_NUM(err);
}

JS_METHOD(getSamplerInfo) { NAPI_ENV;
	REQ_CL_ARG(0, sampler, cl_sampler);
	REQ_UINT32_ARG(1, param_name);
	
	switch(param_name) {
		case CL_SAMPLER_REFERENCE_COUNT: {
			cl_uint val;
			CHECK_ERR(clGetSamplerInfo(
				sampler,
				param_name,
				sizeof(cl_uint),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
		case CL_SAMPLER_CONTEXT: {
			cl_context val;
			CHECK_ERR(clGetSamplerInfo(
				sampler,
				param_name,
				sizeof(cl_context),
				&val,
				nullptr
			));
			CHECK_ERR(clRetainContext(val))
			RET_WRAPPER(val);
		}
		case CL_SAMPLER_NORMALIZED_COORDS: {
			cl_bool val;
			CHECK_ERR(clGetSamplerInfo(
				sampler,
				param_name,
				sizeof(cl_bool),
				&val,
				nullptr
			));
			RET_BOOL(val == CL_TRUE);
		}
		case CL_SAMPLER_ADDRESSING_MODE: {
			cl_addressing_mode val;
			CHECK_ERR(clGetSamplerInfo(
				sampler,
				param_name,
				sizeof(cl_addressing_mode),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
		case CL_SAMPLER_FILTER_MODE: {
			cl_filter_mode val;
			CHECK_ERR(clGetSamplerInfo(
				sampler,
				param_name,
				sizeof(cl_filter_mode),
				&val,
				nullptr
			));
			RET_NUM(val);
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
	RET_UNDEFINED;
}

} // namespace opencl

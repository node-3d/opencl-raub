#include <unordered_map>
#include <functional>
#include <utility>
#include <tuple>

#include "types.hpp"


namespace opencl {

JS_METHOD(createKernel) { NAPI_ENV;
	REQ_CL_ARG(0, program, cl_program);
	REQ_STR_ARG(1, name);
	
	cl_int ret;
	cl_kernel k = clCreateKernel(program, name.c_str(), &ret);
	CHECK_ERR(ret);
	
	RET_WRAPPER(k);
}

JS_METHOD(createKernelsInProgram) { NAPI_ENV;
	REQ_CL_ARG(0, program, cl_program);
	
	cl_uint numkernels;
	CHECK_ERR(clCreateKernelsInProgram(program, 0, nullptr, &numkernels));
	if (numkernels == 0) {
		THROW_ERR(CL_INVALID_VALUE);
	}
	
	cl_kernel * kernels = new cl_kernel[numkernels];
	CHECK_ERR(clCreateKernelsInProgram(program, numkernels, kernels, nullptr));

	Napi::Array karr = Napi::Array::New(env);
	for(cl_uint i = 0; i < numkernels; i++) {
		karr.Set(i, Wrapper::fromRaw(env, kernels[i]));
	}
	delete[] kernels;
	
	RET_VALUE(karr);
}

JS_METHOD(retainKernel) { NAPI_ENV;
	REQ_WRAP_ARG(0, k);
	
	cl_int err = k->acquire();
	CHECK_ERR(err);
	
	RET_NUM(CL_SUCCESS);
}

JS_METHOD(releaseKernel) { NAPI_ENV;
	REQ_WRAP_ARG(0, k);
	
	cl_int err = k->release();
	CHECK_ERR(err);
	
	RET_NUM(CL_SUCCESS);
}

// Caches OpenCL type name to conversion function mapping in a hash table
// (unordered_map) for fast retrieval. This is much faster than the previous
// approach of checking each possible type with strcmp in a huge if-else
class PrimitiveTypeMapCache {
private:
	/// Type of the conversion function
	typedef std::function<std::tuple<size_t, void*, cl_int>(Napi::Value)> func_t;
	// map of conversion functions
	std::unordered_map<std::string, func_t> m_converters;
public:
	PrimitiveTypeMapCache() {
		// if we create the TypeMap as a static function member, the constructor
		// is guarantueed to be called by only one thread (see C++11 standard sec 6.7)
		// while all other threads wait for completion. Thus no manual synchronization
		// is needed for the initialization.
		
		// create all type mappers
		
		/* convert primitive types */
		
		#define CONVERT_NUMBER(NAME, TYPE, CONV) {                                    \
			func_t f = [](Napi::Value val) -> std::tuple<size_t, void*, cl_int> {     \
				if (!val.IsNumber()) {                                             \
					return std::tuple<size_t, void*, cl_int>(                         \
						0,                                                            \
						nullptr,                                                      \
						CL_INVALID_ARG_VALUE                                          \
					);                                                                \
				}                                                                     \
				TYPE* ptr_data = new TYPE;                                            \
				size_t ptr_size = sizeof(TYPE);                                       \
				*ptr_data = static_cast<TYPE>(val.ToNumber().DoubleValue());          \
				return std::tuple<size_t, void*, cl_int>(                             \
					ptr_size,                                                         \
					ptr_data,                                                         \
					0                                                                 \
				);                                                                    \
			};                                                                        \
			m_converters[NAME] = f;                                                   \
		}
		
		CONVERT_NUMBER("char", cl_char, int32_t);
		CONVERT_NUMBER("uchar", cl_uchar, uint32_t);
		CONVERT_NUMBER("short", cl_short, int32_t);
		CONVERT_NUMBER("ushort", cl_ushort, uint32_t);
		CONVERT_NUMBER("int", cl_int , int32_t);
		CONVERT_NUMBER("uint", cl_uint, uint32_t);
		CONVERT_NUMBER("long", cl_long, int64_t);
		CONVERT_NUMBER("ulong", cl_ulong, int64_t);
		CONVERT_NUMBER("float", cl_float, double);
		CONVERT_NUMBER("double", cl_double, double);
		CONVERT_NUMBER("half", cl_half, double);
		
		#undef CONVERT_NUMBER
		
		/* convert vector types (e.g. float4, int16, etc) */
		
		#define CONVERT_VECT(NAME, TYPE, I, COND) {                                   \
			func_t f = [](Napi::Value val) -> std::tuple<size_t, void*, cl_int> {     \
				if (!val.IsArray()) {                                              \
					/*THROW_ERR(CL_INVALID_ARG_VALUE);  */                            \
					return std::tuple<size_t, void*, cl_int>(                         \
						0,                                                            \
						nullptr,                                                      \
						CL_INVALID_ARG_VALUE                                          \
					);                                                                \
				}                                                                     \
				Napi::Array arr = val.As<Napi::Array>();                              \
				if (arr.Length() != I) {                                              \
					/*THROW_ERR(CL_INVALID_ARG_SIZE);*/                               \
					return std::tuple<size_t, void*, cl_int>(                         \
						0,                                                            \
						nullptr,                                                      \
						CL_INVALID_ARG_SIZE                                           \
					);                                                                \
				}                                                                     \
				TYPE * vvc = new TYPE[I];                                             \
				size_t ptr_size = sizeof(TYPE) * I;                                   \
				void* ptr_data = vvc;                                                 \
				for (unsigned int i = 0; i < I; ++ i) {                               \
					if (!arr.Get(i).IsNumber()) {                                  \
						/*THROW_ERR(CL_INVALID_ARG_VALUE);*/                          \
						/*THROW_ERR(CL_INVALID_ARG_VALUE);*/                          \
						return std::tuple<size_t, void*, cl_int>(                     \
							0,                                                        \
							nullptr,                                                  \
							CL_INVALID_ARG_VALUE                                      \
						);                                                            \
					}                                                                 \
					vvc[i] = (TYPE) arr.Get(i).ToNumber().DoubleValue();              \
				}                                                                     \
				return std::tuple<size_t, void*, cl_int>(ptr_size, ptr_data, 0);      \
			};                                                                        \
			m_converters[NAME #I ] = f;                                               \
		}
		
		#define CONVERT_VECTS(NAME, TYPE, COND)                                       \
			CONVERT_VECT(NAME, TYPE, 2, COND);                                        \
			CONVERT_VECT(NAME, TYPE, 3, COND);                                        \
			CONVERT_VECT(NAME, TYPE, 4, COND);                                        \
			CONVERT_VECT(NAME, TYPE, 8, COND);                                        \
			CONVERT_VECT(NAME, TYPE, 16, COND);
		
		CONVERT_VECTS("char", cl_char, int32_t);
		CONVERT_VECTS("uchar", cl_uchar, int32_t);
		CONVERT_VECTS("short", cl_short, int32_t);
		CONVERT_VECTS("ushort", cl_ushort, int32_t);
		CONVERT_VECTS("int", cl_int, int32_t);
		CONVERT_VECTS("uint", cl_uint, uint32_t);
		CONVERT_VECTS("long", cl_long, int64_t);
		CONVERT_VECTS("ulong", cl_ulong, int64_t);
		CONVERT_VECTS("float", cl_float, double);
		CONVERT_VECTS("double", cl_double, double);
		CONVERT_VECTS("half", cl_half, double);
		
		#undef CONVERT_VECT
		#undef CONVERT_VECTS
		
		// add boolean conversion
		m_converters["bool"] = [](Napi::Value val) {
			size_t ptr_size = sizeof(cl_bool);
			cl_bool* ptr_data = new cl_bool;
			*ptr_data = static_cast<cl_bool>(val.ToBoolean().Value() ? 1 : 0);
			return std::tuple<size_t, void*, cl_int>(ptr_size, ptr_data, 0);
		};
	}
	
	/// Returns wheather the type given is in the map, i.e. if it is a
	/// primitive type
	bool hasType(const std::string& name) {
		return m_converters.find(name) != m_converters.end();
	}
	
	// Converts the given JS value to the OpenCL type given by the `name`
	// parameter and returns the result as a pair of the size of the converted
	// value and the pointer as `void*`. The caller is responsible
	// for deleting the pointer after use.
	std::tuple<size_t, void*, cl_int> convert(const std::string& name, Napi::Value val) {
		// call conversion function and return size of argument and pointer
		return m_converters[name](val);
	}
};

JS_METHOD(setKernelArg) { NAPI_ENV;
	// static member of the function gets initialized by the first thread
	// which calls this function. This is thread-safe according to the C++11 standard.
	// All other threads arriving wait till the constructor initialization is
	// complete before executing the code below.
	static PrimitiveTypeMapCache type_converter;
	
	REQ_CL_ARG(0, kernel, cl_kernel);
	REQ_UINT32_ARG(1, arg_idx);
	
	// get type and qualifier of kernel parameter with this index
	// using OpenCL, and then try to convert arg[2] to the type the kernel
	// expects
	
	// check if we have kernel introspection available
	std::string type_name;
	bool local_arg = false;
	// get address qualifier of kernel (local, global, constant, private), one of:
	// - CL_KERNEL_ARG_ADDRESS_GLOBAL
	// - CL_KERNEL_ARG_ADDRESS_LOCAL
	// - CL_KERNEL_ARG_ADDRESS_CONSTANT
	// - CL_KERNEL_ARG_ADDRESS_PRIVATE
	if (IS_ARG_EMPTY(2)) {
		cl_kernel_arg_address_qualifier adrqual;
		CHECK_ERR(clGetKernelArgInfo(
			kernel,
			arg_idx,
			CL_KERNEL_ARG_ADDRESS_QUALIFIER,
			sizeof(cl_kernel_arg_address_qualifier),
			&adrqual,
			nullptr
		));
		// get typename (for conversion of the JS parameter)
		size_t nchars = 0;
		CHECK_ERR(clGetKernelArgInfo(
			kernel,
			arg_idx,
			CL_KERNEL_ARG_TYPE_NAME,
			0,
			nullptr,
			&nchars
		));
		char* tname = new char[nchars];
		CHECK_ERR(clGetKernelArgInfo(
			kernel,
			arg_idx,
			CL_KERNEL_ARG_TYPE_NAME,
			nchars,
			tname,
			nullptr
		));
		type_name = std::string(tname);
		delete [] tname;
		if (adrqual == CL_KERNEL_ARG_ADDRESS_LOCAL)
			local_arg = true;
	} else {
		REQ_STR_ARG(2, tname);
		const char* tname_c = tname.c_str();
		size_t len = tname.length();
		type_name.resize(len);
		std::copy(tname_c, tname_c + len, type_name.begin());
		if (type_name == "local" || type_name == "__local") {
			local_arg = true;
		}
	}
	
	cl_int err = 0;
	
	if (local_arg) {
		REQ_OFFS_ARG(3, local_size);
		err = clSetKernelArg(kernel, arg_idx, local_size, nullptr);
	} else if ('*' == type_name[type_name.length() - 1] || type_name == "cl_mem") {
		REQ_CL_ARG(3, clMem, cl_mem);
		err = clSetKernelArg(kernel, arg_idx, sizeof(cl_mem), &clMem);
	} else if (type_name == "sampler_t") {
		REQ_CL_ARG(3, clSampler, cl_sampler);
		err = clSetKernelArg(kernel, arg_idx, sizeof(cl_sampler), &clSampler);
	} else if (type_converter.hasType(type_name)) {
		// convert primitive types using the conversion
		// function map (indexed by OpenCL type name)
		void* data;
		size_t size;
		
		std::tie(size, data, err) = type_converter.convert(type_name, info[3]);
		
		CHECK_ERR(err);
		err = clSetKernelArg(kernel, arg_idx, size, data);
		free(data);
	} else {
		std::string errstr = std::string("Unsupported OpenCL argument type: ") + type_name;
		JS_THROW(errstr.c_str());
		RET_UNDEFINED;
	}
	// TODO: check for image_t types
	// TODO: support queue_t and clk_event_t, and others?
	// Otherwise it should be a native type
	
	CHECK_ERR(err);
	RET_NUM(err);
}

JS_METHOD(getKernelInfo) { NAPI_ENV;
	REQ_CL_ARG(0, kernel, cl_kernel);
	REQ_UINT32_ARG(1, param_name);
	
	switch(param_name) {
		case CL_KERNEL_ATTRIBUTES:
		case CL_KERNEL_FUNCTION_NAME: {
			size_t nchars = 0;
			CHECK_ERR(clGetKernelInfo(
				kernel,
				param_name,
				0,
				nullptr,
				&nchars
			));
			std::unique_ptr<char[]> name(new char[nchars]);
			CHECK_ERR(clGetKernelInfo(kernel, param_name, nchars, name.get(), nullptr));
			RET_STR(name.get());
		}
		case CL_KERNEL_NUM_ARGS:
		case CL_KERNEL_REFERENCE_COUNT: {
			cl_uint num = 0;
			CHECK_ERR(clGetKernelInfo(
				kernel,
				param_name,
				sizeof(cl_uint),
				&num,
				nullptr
			));
			RET_NUM(num);
		}
		case CL_KERNEL_CONTEXT: {
			cl_context ctx = 0;
			CHECK_ERR(clGetKernelInfo(
				kernel,
				param_name,
				sizeof(cl_context),
				&ctx,
				nullptr
			));
			CHECK_ERR(clRetainContext(ctx))
			RET_WRAPPER(ctx);
		}
		case CL_KERNEL_PROGRAM: {
			cl_program p = 0;
			CHECK_ERR(clGetKernelInfo(
				kernel,
				param_name,
				sizeof(cl_program),
				&p,
				nullptr
			));
			CHECK_ERR(clRetainProgram(p))
			RET_WRAPPER(p);
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
}

JS_METHOD(getKernelArgInfo) { NAPI_ENV;
	REQ_CL_ARG(0, kernel, cl_kernel);
	REQ_UINT32_ARG(1, arg_idx);
	REQ_UINT32_ARG(2, param_name);
	
	switch(param_name) {
		case CL_KERNEL_ARG_ADDRESS_QUALIFIER: {
			cl_kernel_arg_address_qualifier num = 0;
			CHECK_ERR(clGetKernelArgInfo(
				kernel,
				arg_idx,
				param_name,
				sizeof(cl_kernel_arg_address_qualifier),
				&num,
				nullptr
			));
			RET_NUM(num);
		}
		case CL_KERNEL_ARG_ACCESS_QUALIFIER: {
			cl_kernel_arg_access_qualifier num = 0;
			CHECK_ERR(clGetKernelArgInfo(
				kernel,
				arg_idx,
				param_name,
				sizeof(cl_kernel_arg_access_qualifier),
				&num,
				nullptr
			));
			RET_NUM(num);
		}
		case CL_KERNEL_ARG_TYPE_QUALIFIER: {
			cl_kernel_arg_type_qualifier num = 0;
			CHECK_ERR(clGetKernelArgInfo(
				kernel,
				arg_idx,
				param_name,
				sizeof(cl_kernel_arg_type_qualifier),
				&num,
				nullptr
			));
			RET_NUM(num);
		}
		case CL_KERNEL_ARG_TYPE_NAME:
		case CL_KERNEL_ARG_NAME: {
			size_t nchars = 0;
			CHECK_ERR(clGetKernelArgInfo(
				kernel,
				arg_idx,
				param_name,
				0,
				nullptr,
				&nchars
			));
			std::unique_ptr<char[]> name(new char[nchars]);
			CHECK_ERR(clGetKernelArgInfo(
				kernel,
				arg_idx,
				param_name,
				nchars,
				name.get(),
				nullptr
			));
			RET_STR(name.get());
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
}

JS_METHOD(getKernelWorkGroupInfo) { NAPI_ENV;
	REQ_CL_ARG(0, kernel, cl_kernel);
	REQ_CL_ARG(1, device, cl_device_id);
	REQ_UINT32_ARG(2, param_name);
	
	switch(param_name) {
		case CL_KERNEL_GLOBAL_WORK_SIZE:
		case CL_KERNEL_COMPILE_WORK_GROUP_SIZE: {
			size_t sz[3] = { 0, 0, 0 };
			CHECK_ERR(clGetKernelWorkGroupInfo(
				kernel,
				device,
				param_name,
				3 * sizeof(size_t),
				sz,
				nullptr
			));
			Napi::Array szarr = Napi::Array::New(env);
			szarr.Set(0u, JS_NUM(sz[0]));
			szarr.Set(1u, JS_NUM(sz[1]));
			szarr.Set(2u, JS_NUM(sz[2]));
			RET_VALUE(szarr);
		}
		case CL_KERNEL_PREFERRED_WORK_GROUP_SIZE_MULTIPLE:
		case CL_KERNEL_WORK_GROUP_SIZE: {
			size_t sz = 0;
			CHECK_ERR(clGetKernelWorkGroupInfo(
				kernel,
				device,
				param_name,
				sizeof(size_t),
				&sz,
				nullptr
			));
			RET_NUM(sz);
		}
		case CL_KERNEL_LOCAL_MEM_SIZE:
		case CL_KERNEL_PRIVATE_MEM_SIZE: {
			cl_ulong sz = 0;
			CHECK_ERR(clGetKernelWorkGroupInfo(
				kernel,
				device,
				param_name,
				sizeof(cl_ulong),
				&sz,
				nullptr
			));
			/**
				JS Compatibility

				As JS does not support 64 bits integer, we return a 2-integer array with
					output_values[0] = (input_value >> 32) & 0xffffffff;
					output_values[1] = input_value & 0xffffffff;

				and reconstruction as
					input_value = ((int64_t) output_values[0]) << 32) | output_values[1];
			*/
			Napi::Array arr = Napi::Array::New(env);
			arr.Set(0u, sz>>32); // hi
			arr.Set(1u, sz & 0xffffffff); // lo
			RET_VALUE(arr);
		}
	}
	
	THROW_ERR(CL_INVALID_VALUE);
}

} // namespace opencl

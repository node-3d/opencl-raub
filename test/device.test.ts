import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import cl from '../index.js';
import * as U from './utils.ts';


describe('Device', () => {
	const { platform, device } = cl.quickStart();
	
	describe('#getDeviceIDs()', () => {
		it('returns an array', () => {
			const ids = cl.getDeviceIDs(platform);
			U.assertType(ids, 'array');
			assert.notEqual(ids.length, 0);
		});
	});
	
	const testBoolean = (name: keyof typeof cl) => {
		it(name + ' returns a boolean', (_t, done) => {
			const val = cl.getDeviceInfo(device, cl[name] as number);
			U.assertType(val, 'boolean');
			done();
		});
	};
	const testInteger = (name: keyof typeof cl) => {
		it(name + ' returns an integer', (_t, done) => {
			const val = cl.getDeviceInfo(device, cl[name] as number);
			U.assertType(val, 'number');
			done();
		});
	};
	const testString = (name: keyof typeof cl) => {
		it(name + ' returns a string', (_t, done) => {
			const val = cl.getDeviceInfo(device, cl[name] as number);
			U.assertType(val, 'string');
			done();
		});
	};
	const testObject = (name: keyof typeof cl) => {
		it(name + ' returns an object', () => {
			const info = cl.getDeviceInfo(device, cl[name] as number);
			U.assertType(info, 'object');
		});
	};
	const testArray = (name: keyof typeof cl) => {
		it(name + ' returns an array', (_t, done) => {
			const val = cl.getDeviceInfo(device, cl[name] as number);
			U.assertType(val, 'array');
			done();
		});
	};
	
	describe('#getDeviceInfo()', () => {
		testString('DEVICE_NAME');
		testString('DEVICE_VENDOR');
		testString('DEVICE_PROFILE');
		testString('DEVICE_VERSION');
		testString('DEVICE_OPENCL_C_VERSION');
		testString('DRIVER_VERSION');
		testObject('DEVICE_PLATFORM');
		testInteger('DEVICE_TYPE');
		testInteger('DEVICE_LOCAL_MEM_TYPE');
		testInteger('DEVICE_GLOBAL_MEM_CACHE_TYPE');
		testInteger('DEVICE_EXECUTION_CAPABILITIES');
		testInteger('DEVICE_QUEUE_PROPERTIES');
		testInteger('DEVICE_SINGLE_FP_CONFIG');
		testArray('DEVICE_MAX_WORK_ITEM_SIZES');
		testBoolean('DEVICE_AVAILABLE');
		testBoolean('DEVICE_COMPILER_AVAILABLE');
		testBoolean('DEVICE_ENDIAN_LITTLE');
		testBoolean('DEVICE_ERROR_CORRECTION_SUPPORT');
		testBoolean('DEVICE_HOST_UNIFIED_MEMORY');
		testBoolean('DEVICE_IMAGE_SUPPORT');
		testInteger('DEVICE_ADDRESS_BITS');
		testInteger('DEVICE_GLOBAL_MEM_CACHELINE_SIZE');
		testInteger('DEVICE_MAX_CLOCK_FREQUENCY');
		testInteger('DEVICE_MAX_COMPUTE_UNITS');
		testInteger('DEVICE_MAX_CONSTANT_ARGS');
		testInteger('DEVICE_MAX_READ_IMAGE_ARGS');
		testInteger('DEVICE_MAX_SAMPLERS');
		testInteger('DEVICE_MAX_WORK_ITEM_DIMENSIONS');
		testInteger('DEVICE_MAX_WRITE_IMAGE_ARGS');
		testInteger('DEVICE_MEM_BASE_ADDR_ALIGN');
		testInteger('DEVICE_MIN_DATA_TYPE_ALIGN_SIZE');
		testInteger('DEVICE_NATIVE_VECTOR_WIDTH_CHAR');
		testInteger('DEVICE_NATIVE_VECTOR_WIDTH_SHORT');
		testInteger('DEVICE_NATIVE_VECTOR_WIDTH_INT');
		testInteger('DEVICE_NATIVE_VECTOR_WIDTH_LONG');
		testInteger('DEVICE_NATIVE_VECTOR_WIDTH_FLOAT');
		testInteger('DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE');
		testInteger('DEVICE_NATIVE_VECTOR_WIDTH_HALF');
		testInteger('DEVICE_PREFERRED_VECTOR_WIDTH_CHAR');
		testInteger('DEVICE_PREFERRED_VECTOR_WIDTH_SHORT');
		testInteger('DEVICE_PREFERRED_VECTOR_WIDTH_INT');
		testInteger('DEVICE_PREFERRED_VECTOR_WIDTH_LONG');
		testInteger('DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT');
		testInteger('DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE');
		testInteger('DEVICE_PREFERRED_VECTOR_WIDTH_HALF');
		testInteger('DEVICE_VENDOR_ID');
		
		testInteger('DEVICE_REFERENCE_COUNT');
		testInteger('DEVICE_PARTITION_MAX_SUB_DEVICES');
		
		testInteger('DEVICE_GLOBAL_MEM_CACHE_SIZE');
		testInteger('DEVICE_GLOBAL_MEM_SIZE');
		testInteger('DEVICE_LOCAL_MEM_SIZE');
		testInteger('DEVICE_MAX_CONSTANT_BUFFER_SIZE');
		testInteger('DEVICE_MAX_MEM_ALLOC_SIZE');
		testInteger('DEVICE_IMAGE2D_MAX_HEIGHT');
		testInteger('DEVICE_IMAGE2D_MAX_WIDTH');
		testInteger('DEVICE_IMAGE3D_MAX_DEPTH');
		testInteger('DEVICE_IMAGE3D_MAX_HEIGHT');
		testInteger('DEVICE_IMAGE3D_MAX_WIDTH');
		testInteger('DEVICE_MAX_PARAMETER_SIZE');
		testInteger('DEVICE_MAX_WORK_GROUP_SIZE');
		testInteger('DEVICE_PROFILING_TIMER_RESOLUTION');
		
		testInteger('DEVICE_IMAGE_MAX_BUFFER_SIZE');
		testInteger('DEVICE_IMAGE_MAX_ARRAY_SIZE');
		
		// negative test cases
		it('throws cl.INVALID_VALUE with name=-123.56', () => {
			assert.throws(
				() => cl.getDeviceInfo(device, -123.56),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_VALUE with name=\'a string\'', () => {
			assert.throws(
				() => cl.getDeviceInfo(device, 'a string' as unknown as number),
				new Error('Argument 1 must be of type `Uint32`'),
			);
		});
		
		it('throws cl.INVALID_VALUE with name=123456', () => {
			assert.throws(
				() => cl.getDeviceInfo(device, 123456),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_DEVICE with device = null', () => {
			assert.throws(
				() => cl.getDeviceInfo(null as unknown as cl.TClDevice, 123),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_DEVICE with device = \'a string\'', () => {
			assert.throws(
				() => cl.getDeviceInfo('a string' as unknown as cl.TClDevice, 123),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_DEVICE with device = 123', () => {
			assert.throws(
				() => cl.getDeviceInfo(123 as unknown as cl.TClDevice, 123),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_DEVICE with device = [1, 2, 3]', () => {
			assert.throws(
				() => cl.getDeviceInfo([1, 2, 3] as unknown as cl.TClDevice, 123),
				new Error('Argument 0 must be a CL Wrapper.'),
			);
		});
		
		it('throws cl.INVALID_DEVICE with device = new Array()', () => {
			assert.throws(
				() => cl.getDeviceInfo([] as unknown as cl.TClDevice, 123),
				new Error('Argument 0 must be a CL Wrapper.'),
			);
		});
	});
	
	// Support for "sub-devices" seems to be retarded, anyway
	describe('#createSubDevices()', () => {
		it('throws cl.INVALID_DEVICE with device = null', () => {
			assert.throws(
				() => cl.createSubDevices(
					null as unknown as cl.TClDevice,
					[cl.DEVICE_PARTITION_EQUALLY, 8, 0],
				),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_VALUE with properties = null', () => {
			assert.throws(
				() => cl.createSubDevices(device, null as unknown as number[]),
				new Error('Argument 1 must be of type `Array`'),
			);
		});
	});
	
	describe('#retainDevice()', () => {
		it('throws cl.INVALID_DEVICE if device is not a subdevice', () => {
			assert.throws(
				() => cl.retainDevice(device),
				cl.INVALID_DEVICE,
			);
		});
	});
	
	describe('#releaseDevice()', () => {
		it('throws cl.INVALID_DEVICE if device is not a subdevice', () => {
			assert.throws(
				() => cl.releaseDevice(device),
				cl.INVALID_DEVICE,
			);
		});
	});
});

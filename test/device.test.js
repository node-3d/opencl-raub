'use strict';

const assert = require('node:assert').strict;
const { describe, it } = require('node:test');

const cl = require('../');
const U = require('./utils');
require('./utils/device_selection');


describe('Device', () => {
	const platform = global.MAIN_PLATFORM;
	
	describe('#getDeviceIDs()', () => {
		it('returns an array', () => {
			const ids = cl.getDeviceIDs(platform);
			U.assertType(ids, 'array');
			assert.notEqual(ids.length, 0);
		});
	});
	
	const testBoolean = (device, name) => {
		it(name + ' returns a boolean', (t, done) => {
			const val = cl.getDeviceInfo(device, cl[name.toUpperCase()]);
			U.assertType(val, 'boolean');
			done();
		});
	};
	const testInteger = (device, name) => {
		it(name + ' returns an integer', (t, done) => {
			const val = cl.getDeviceInfo(device, cl[name.toUpperCase()]);
			U.assertType(val, 'number');
			done();
		});
	};
	const testString = (device, name) => {
		it(name + ' returns a string', (t, done) => {
			const val = cl.getDeviceInfo(device, cl[name.toUpperCase()]);
			U.assertType(val, 'string');
			done();
		});
	};
	const testObject = (device, name) => {
		it(name + ' returns an object', () => {
			const info = cl.getDeviceInfo(device, cl[name.toUpperCase()]);
			U.assertType(info, 'object');
		});
	};
	const testArray = (device, name) => {
		it(name + ' returns an array', (t, done) => {
			const val = cl.getDeviceInfo(device, cl[name.toUpperCase()]);
			U.assertType(val, 'array');
			done();
		});
	};
	
	const test64Array = (device, name) => {
		it(name + ' returns a 2 integers array', (t, done) => {
			const val = cl.getDeviceInfo(device, cl[name.toUpperCase()]);
			U.assertType(val, 'array');
			U.assertType(val[0], 'number');
			U.assertType(val[1], 'number');
			done();
		});
	};
	
	const testDevice = (device) => {
		const deviceVendor = cl.getDeviceInfo(device, cl.DEVICE_VENDOR);
		const deviceName = cl.getDeviceInfo(device, cl.DEVICE_NAME);
		
		describe('#getDeviceInfo() for ' + deviceVendor + ' ' + deviceName, () => {
			testString(device, 'DEVICE_NAME');
			testString(device, 'DEVICE_VENDOR');
			testString(device, 'DEVICE_PROFILE');
			testString(device, 'DEVICE_VERSION');
			testString(device, 'DEVICE_OPENCL_C_VERSION');
			testString(device, 'DRIVER_VERSION');
			testObject(device, 'DEVICE_PLATFORM');
			testInteger(device, 'DEVICE_TYPE');
			testInteger(device, 'DEVICE_LOCAL_MEM_TYPE');
			testInteger(device, 'DEVICE_GLOBAL_MEM_CACHE_TYPE');
			testInteger(device, 'DEVICE_EXECUTION_CAPABILITIES');
			testInteger(device, 'DEVICE_QUEUE_PROPERTIES');
			testInteger(device, 'DEVICE_SINGLE_FP_CONFIG');
			testArray(device, 'DEVICE_MAX_WORK_ITEM_SIZES');
			testBoolean(device, 'DEVICE_AVAILABLE');
			testBoolean(device, 'DEVICE_COMPILER_AVAILABLE');
			testBoolean(device, 'DEVICE_ENDIAN_LITTLE');
			testBoolean(device, 'DEVICE_ERROR_CORRECTION_SUPPORT');
			testBoolean(device, 'DEVICE_HOST_UNIFIED_MEMORY');
			testBoolean(device, 'DEVICE_IMAGE_SUPPORT');
			testInteger(device, 'DEVICE_ADDRESS_BITS');
			testInteger(device, 'DEVICE_GLOBAL_MEM_CACHELINE_SIZE');
			testInteger(device, 'DEVICE_MAX_CLOCK_FREQUENCY');
			testInteger(device, 'DEVICE_MAX_COMPUTE_UNITS');
			testInteger(device, 'DEVICE_MAX_CONSTANT_ARGS');
			testInteger(device, 'DEVICE_MAX_READ_IMAGE_ARGS');
			testInteger(device, 'DEVICE_MAX_SAMPLERS');
			testInteger(device, 'DEVICE_MAX_WORK_ITEM_DIMENSIONS');
			testInteger(device, 'DEVICE_MAX_WRITE_IMAGE_ARGS');
			testInteger(device, 'DEVICE_MEM_BASE_ADDR_ALIGN');
			testInteger(device, 'DEVICE_MIN_DATA_TYPE_ALIGN_SIZE');
			testInteger(device, 'DEVICE_NATIVE_VECTOR_WIDTH_CHAR');
			testInteger(device, 'DEVICE_NATIVE_VECTOR_WIDTH_SHORT');
			testInteger(device, 'DEVICE_NATIVE_VECTOR_WIDTH_INT');
			testInteger(device, 'DEVICE_NATIVE_VECTOR_WIDTH_LONG');
			testInteger(device, 'DEVICE_NATIVE_VECTOR_WIDTH_FLOAT');
			testInteger(device, 'DEVICE_NATIVE_VECTOR_WIDTH_DOUBLE');
			testInteger(device, 'DEVICE_NATIVE_VECTOR_WIDTH_HALF');
			testInteger(device, 'DEVICE_PREFERRED_VECTOR_WIDTH_CHAR');
			testInteger(device, 'DEVICE_PREFERRED_VECTOR_WIDTH_SHORT');
			testInteger(device, 'DEVICE_PREFERRED_VECTOR_WIDTH_INT');
			testInteger(device, 'DEVICE_PREFERRED_VECTOR_WIDTH_LONG');
			testInteger(device, 'DEVICE_PREFERRED_VECTOR_WIDTH_FLOAT');
			testInteger(device, 'DEVICE_PREFERRED_VECTOR_WIDTH_DOUBLE');
			testInteger(device, 'DEVICE_PREFERRED_VECTOR_WIDTH_HALF');
			testInteger(device, 'DEVICE_VENDOR_ID');
			
			testInteger(device, 'DEVICE_REFERENCE_COUNT');
			testInteger(device, 'DEVICE_PARTITION_MAX_SUB_DEVICES');
			
			test64Array(device, 'DEVICE_GLOBAL_MEM_CACHE_SIZE');
			test64Array(device, 'DEVICE_GLOBAL_MEM_SIZE');
			test64Array(device, 'DEVICE_LOCAL_MEM_SIZE');
			test64Array(device, 'DEVICE_MAX_CONSTANT_BUFFER_SIZE');
			test64Array(device, 'DEVICE_MAX_MEM_ALLOC_SIZE');
			testInteger(device, 'DEVICE_IMAGE2D_MAX_HEIGHT');
			testInteger(device, 'DEVICE_IMAGE2D_MAX_WIDTH');
			testInteger(device, 'DEVICE_IMAGE3D_MAX_DEPTH');
			testInteger(device, 'DEVICE_IMAGE3D_MAX_HEIGHT');
			testInteger(device, 'DEVICE_IMAGE3D_MAX_WIDTH');
			testInteger(device, 'DEVICE_MAX_PARAMETER_SIZE');
			testInteger(device, 'DEVICE_MAX_WORK_GROUP_SIZE');
			testInteger(device, 'DEVICE_PROFILING_TIMER_RESOLUTION');
			
			testInteger(device, 'DEVICE_IMAGE_MAX_BUFFER_SIZE');
			testInteger(device, 'DEVICE_IMAGE_MAX_ARRAY_SIZE');
			
			// negative test cases
			it('throws cl.INVALID_VALUE with name=-123.56', () => {
				assert.throws(
					() => cl.getDeviceInfo(device, -123.56),
					cl.INVALID_VALUE,
				);
			});
			
			it('throws cl.INVALID_VALUE with name=\'a string\'', () => {
				assert.throws(
					() => cl.getDeviceInfo(device, 'a string'),
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
					() => cl.getDeviceInfo(null, 123),
					new Error('Argument 0 must be of type `Object`'),
				);
			});
			
			it('throws cl.INVALID_DEVICE with device = \'a string\'', () => {
				assert.throws(
					() => cl.getDeviceInfo('a string', 123),
					new Error('Argument 0 must be of type `Object`'),
				);
			});
			
			it('throws cl.INVALID_DEVICE with device = 123', () => {
				assert.throws(
					() => cl.getDeviceInfo(123, 123),
					new Error('Argument 0 must be of type `Object`'),
				);
			});
			
			it('throws cl.INVALID_DEVICE with device = [1, 2, 3]', () => {
				assert.throws(
					() => cl.getDeviceInfo([1, 2, 3], 123),
					new Error('Argument 0 must be a CL Wrapper.'),
				);
			});
			
			it('throws cl.INVALID_DEVICE with device = new Array()', () => {
				assert.throws(
					() => cl.getDeviceInfo([], 123),
					new Error('Argument 0 must be a CL Wrapper.'),
				);
			});
		});
		
		describe('#createSubDevices() for ' + deviceVendor + ' ' + deviceName, () => {
			const num = cl.getDeviceInfo(device, cl.DEVICE_PARTITION_MAX_SUB_DEVICES);
			cl.getDeviceInfo(device, cl.DEVICE_VENDOR);
			
			if (num > 0) {
				it('returns an array of sub-devices', () => {
					
					let subDevices;
					try {
						cl.createSubDevices(
							device,
							[
								cl.DEVICE_PARTITION_BY_COUNTS,
								3,
								1,
								cl.DEVICE_PARTITION_BY_COUNTS_LIST_END,
								0
							],
							2
						);
						U.assertType(subDevices, 'array');
						assert.notEqual(subDevices.length, 0);
					} catch (error) {
						if (error.message === cl.DEVICE_PARTITION_FAILED.message) {
							console.warn(error.message);
						}
					}
				});
			}

			if (num > 0) {
				it('returns an array of sub-devices', () => {
					let subDevices;
					try {
						cl.createSubDevices(device, [cl.DEVICE_PARTITION_EQUALLY, 8, 0], 2);
						U.assertType(subDevices, 'array');
						assert.notEqual(subDevices.length, 0);
					} catch (error) {
						if (error.message === cl.DEVICE_PARTITION_FAILED.message) {
							console.warn(error.message);
						}
					}
				});
			}
			
			if (num > 0) {
				it('returns an array of sub-devices', () => {
					let subDevices;
					try {
						cl.createSubDevices(
							device,
							[
								cl.DEVICE_PARTITION_BY_AFFINITY_DOMAIN,
								cl.DEVICE_AFFINITY_DOMAIN_NEXT_PARTITIONABLE,
								0
							],
							2
						);
						U.assertType(subDevices, 'array');
						assert.notEqual(subDevices.length, 0);
					} catch (error) {
						if (error.message === cl.DEVICE_PARTITION_FAILED.message) {
							console.warn(error.message);
						}
					}
				});
			}
			
			it('throws cl.INVALID_DEVICE with device = null', () => {
				assert.throws(
					() => cl.createSubDevices(
						null,
						[cl.DEVICE_PARTITION_EQUALLY, 8, 0],
						2
					),
					new Error('Argument 0 must be of type `Object`'),
				);
			});
			
			it('throws cl.INVALID_VALUE with properties = null', () => {
				assert.throws(
					() => cl.createSubDevices(device, null, 2),
					new Error('Argument 1 must be of type `Array`'),
				);
			});
		});
		
		describe('#retainDevice() for ' + deviceVendor + ' ' + deviceName, () => {
			it('throws cl.INVALID_DEVICE if device is not a subdevice', () => {
				assert.throws(
					() => cl.retainDevice(device),
					cl.INVALID_DEVICE,
				);
			});
			
			it('increases device reference count', () => {
				try {
					const subDevice = cl.createSubDevices(device, cl.DEVICE_PARTITION_BY_COUNTS, 2);
					cl.retainDevice(subDevice);
					const count = cl.getDeviceInfo(subDevice, cl.DEVICE_REFERENCE_COUNT);
					assert.strictEqual(count, 2);
					cl.releaseDevice(subDevice);
				} catch (error) {
					if (error.message === cl.DEVICE_PARTITION_FAILED.message) {
						console.warn(error.message);
					}
				}
			});
		});
		
		describe('#releaseDevice() for ' + deviceVendor + ' ' + deviceName, () => {
			it('throws cl.INVALID_DEVICE if device is not a subdevice', () => {
				assert.throws(
					() => cl.releaseDevice(device),
					cl.INVALID_DEVICE,
				);
			});
			
			it('decreases device reference count', () => {
				try {
					const subDevice = cl.createSubDevices(device, cl.DEVICE_PARTITION_BY_COUNTS, 2);
					cl.retainDevice(subDevice);
					let count = cl.getDeviceInfo(subDevice, cl.DEVICE_REFERENCE_COUNT);
					assert.strictEqual(count, 2);
					cl.releaseDevice(subDevice);
					count = cl.getDeviceInfo(subDevice, cl.DEVICE_REFERENCE_COUNT);
					assert.strictEqual(count, 1);
				} catch (error) {
					if (error.message === cl.DEVICE_PARTITION_FAILED.message) {
						console.warn(error.message);
					}
				}
			});
		});
	};

	testDevice(global.MAIN_DEVICE);
});

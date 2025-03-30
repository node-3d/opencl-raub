'use strict';

const assert = require('node:assert').strict;
const { describe, it } = require('node:test');

const cl = require('../');
const U = require('./utils');


describe('Platform', () => {
	const platform = global.MAIN_PLATFORM;
	
	describe('#getPlatformIDs()', () => {
		it('returns an array', () => {
			const platforms = cl.getPlatformIDs();
			U.assertType(platforms, 'array');
			assert.notEqual(platforms.length, 0);
		});
	});
	
	const testString = (platform, name) => {
		it(name + ' returns a string', (t, done) => {
			const val = cl.getPlatformInfo(platform, eval('cl.' + name));
			U.assertType(val, 'string');
			done();
		});
	};
	
	describe('#getPlatformInfo()', () => {
		testString(platform, 'PLATFORM_VERSION');
		testString(platform, 'PLATFORM_PROFILE');
		testString(platform, 'PLATFORM_NAME');
		testString(platform, 'PLATFORM_VENDOR');
		
		// negative test cases
		it('throws cl.INVALID_VALUE with name=cl.DEVICE_TYPE_CPU', () => {
			assert.throws(
				() => cl.getPlatformInfo(platform, cl.DEVICE_TYPE_CPU),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_VALUE with name=0x2000', () => {
			assert.throws(
				() => cl.getPlatformInfo(platform, 0x2000),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_VALUE with name=\'a string\'', () => {
			assert.throws(
				() => cl.getPlatformInfo(platform, 'a string'),
				new Error('Argument 1 must be of type `Number`'),
			);
		});
		
		it('throws cl.INVALID_VALUE with name=-123.56', () => {
			assert.throws(
				() => cl.getPlatformInfo(platform, -123.56),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws cl.INVALID_PLATFORM with platform = null', () => {
			assert.throws(
				() => cl.getPlatformInfo(null, 123),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_PLATFORM with platform = \'a string\'', () => {
			assert.throws(
				() => cl.getPlatformInfo('a string', 123),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_PLATFORM with platform = 123', () => {
			assert.throws(
				() => cl.getPlatformInfo(123, 123),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws cl.INVALID_PLATFORM with platform = [1, 2, 3]', () => {
			assert.throws(
				() => cl.getPlatformInfo([1, 2, 3], 123),
				new Error('Argument 0 must be a CL Wrapper.'),
			);
		});
		
		it('throws cl.INVALID_PLATFORM with platform = new Array()', () => {
			assert.throws(
				() => cl.getPlatformInfo([], 123),
				new Error('Argument 0 must be a CL Wrapper.'),
			);
		});
	});
});

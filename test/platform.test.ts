import { strict as assert } from 'node:assert';
import { describe, it, after } from 'node:test';
import cl from '../index.js';
import * as U from './utils.ts';


describe('Platform', () => {
	const { platform, device } = cl.quickStart();
	
	describe('#getPlatformIDs()', () => {
		it('returns an array', () => {
			const platforms = cl.getPlatformIDs();
			U.assertType(platforms, 'array');
			assert.notEqual(platforms.length, 0);
		});
	});
	
	const testString = (name: keyof typeof cl) => {
		it(name + ' returns a string', (t, done) => {
			const val = cl.getPlatformInfo(platform, cl[name] as number);
			U.assertType(val, 'string');
			done();
		});
	};
	
	describe('#getPlatformInfo()', () => {
		testString('PLATFORM_VERSION');
		testString('PLATFORM_PROFILE');
		testString('PLATFORM_NAME');
		testString('PLATFORM_VENDOR');
		
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
				() => cl.getPlatformInfo(platform, 'a string' as unknown as number),
				new Error('Argument 1 must be of type `Number`'),
			);
		});
		
		it('throws cl.INVALID_VALUE with name=-123.56', () => {
			assert.throws(
				() => cl.getPlatformInfo(platform, -123.56),
				cl.INVALID_VALUE,
			);
		});
		
		it('throws with platform = null', () => {
			assert.throws(
				() => cl.getPlatformInfo(null as unknown as cl.TClPlatform, 123),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws with platform = \'a string\'', () => {
			assert.throws(
				() => cl.getPlatformInfo('a string' as unknown as cl.TClPlatform, 123),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws with platform = 123', () => {
			assert.throws(
				() => cl.getPlatformInfo(123 as unknown as cl.TClPlatform, 123),
				new Error('Argument 0 must be of type `Object`'),
			);
		});
		
		it('throws with platform = [1, 2, 3]', () => {
			assert.throws(
				() => cl.getPlatformInfo([1, 2, 3] as unknown as cl.TClPlatform, 123),
				new Error('Argument 0 must be a CL Wrapper.'),
			);
		});
		
		it('throws cl.INVALID_PLATFORM', () => {
			assert.throws(
				() => cl.getPlatformInfo(device as unknown as cl.TClPlatform, 123),
				cl.INVALID_PLATFORM,
			);
		});
	});
});

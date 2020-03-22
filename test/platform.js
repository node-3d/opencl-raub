'use strict';

const { assert, expect } = require('chai');

const cl = require('../');
require('./utils');


describe('Platform', function () {

	// let platforms = cl.getPlatformIDs();
	let platforms = [global.MAIN_PLATFORM];

	describe('#getPlatformIDs()',function () {
		it('should return an array',function () {
			let platforms = cl.getPlatformIDs();
			assert.isArray(platforms);
			assert.isAbove(platforms.length, 0);
		});
	});

	function testString(platform, name) {
		it(name + ' should return a string',function (done) {
			let val = cl.getPlatformInfo(platform, eval('cl.' + name));
			assert.isString(val);
			done();
		});
	}

	function testPlatform(p) {
		describe(
			(
				'#getPlatformInfo() for ' +
				cl.getPlatformInfo(p,cl.PLATFORM_VENDOR) +
				' ' +
				cl.getPlatformInfo(p,cl.PLATFORM_NAME)
			),
			function () {
				testString(p, 'PLATFORM_VERSION');
				testString(p, 'PLATFORM_PROFILE');
				testString(p, 'PLATFORM_NAME');
				testString(p, 'PLATFORM_VENDOR');
				testString(p, 'PLATFORM_EXTENSIONS');

				// negative test cases
				it('should throw cl.INVALID_VALUE with name=cl.DEVICE_TYPE_CPU',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						p,
						cl.DEVICE_TYPE_CPU
					);
					expect(getInfoBound).to.throw(cl.INVALID_VALUE.message);
				});
				it('should throw cl.INVALID_VALUE with name=0x2000',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						p,
						0x2000
					);
					expect(getInfoBound).to.throw(cl.INVALID_VALUE.message);
				});
				it('should throw cl.INVALID_VALUE with name=\'a string\'',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						p,
						'a string'
					);
					expect(getInfoBound).to.throw('Argument 1 must be of type `Number`');
				});
				it('should throw cl.INVALID_VALUE with name=-123.56',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						p,
						-123.56
					);
					expect(getInfoBound).to.throw(cl.INVALID_VALUE.message);
				});
				it('should throw cl.INVALID_PLATFORM with platform = null',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						null,
						123
					);
					expect(getInfoBound).to.throw('Argument 0 must be of type `Object`');
				});
				it(
					'should throw cl.INVALID_PLATFORM with platform = \'a string\'',
					function () {
						const getInfoBound = cl.getPlatformInfo.bind(
							cl.getPlatformInfo,
							'a string',
							123
						);
						expect(getInfoBound).to.throw('Argument 0 must be of type `Object`');
					}
				);
				it('should throw cl.INVALID_PLATFORM with platform = 123',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						123,
						123
					);
					expect(getInfoBound).to.throw('Argument 0 must be of type `Object`');
				});
				it('should throw cl.INVALID_PLATFORM with platform = [1,2,3]',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						[1, 2, 3],
						123
					);
					expect(getInfoBound).to.throw('Argument 0 must be a CL Wrapper.');
				});
				it('should throw cl.INVALID_PLATFORM with platform = new Array()',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						[],
						123
					);
					expect(getInfoBound).to.throw('Argument 0 must be a CL Wrapper.');
				});
			}
		);
	}

	for (let i = 0; i < platforms.length; i++) {
		testPlatform(platforms[i]);
	}
});

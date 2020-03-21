'use strict';

const { assert, expect } = require('chai');

const cl = require('../');


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
			let val = cl.getPlatformInfo(platform,eval('cl.' + name));
			assert.isString(val);
			done(console.log(name + ' = ' + val));
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
					getInfoBound.should.throw(cl.INVALID_VALUE.message);
				});
				it('should throw cl.INVALID_VALUE with name=0x2000',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						p,
						0x2000
					);
					getInfoBound.should.throw(cl.INVALID_VALUE.message);
				});
				it('should throw cl.INVALID_VALUE with name=\'a string\'',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						p,
						'a string'
					);
					getInfoBound.should.throw(cl.INVALID_VALUE.message);
				});
				it('should throw cl.INVALID_VALUE with name=-123.56',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						p,
						-123.56
					);
					getInfoBound.should.throw(cl.INVALID_VALUE.message);
				});
				it('should throw cl.INVALID_PLATFORM with platform = null',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						null,
						123
					);
					getInfoBound.should.throw(cl.INVALID_PLATFORM.message);
				});
				it(
					'should throw cl.INVALID_PLATFORM with platform = \'a string\'',
					function () {
						const getInfoBound = cl.getPlatformInfo.bind(
							cl.getPlatformInfo,
							'a string',
							123
						);
						getInfoBound.should.throw(cl.INVALID_PLATFORM.message);
					}
				);
				it('should throw cl.INVALID_PLATFORM with platform = 123',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						123,
						123
					);
					getInfoBound.should.throw(cl.INVALID_PLATFORM.message);
				});
				it('should throw cl.INVALID_PLATFORM with platform = [1,2,3]',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						[1, 2, 3],
						123
					);
					getInfoBound.should.throw(cl.INVALID_PLATFORM.message);
				});
				it('should throw cl.INVALID_PLATFORM with platform = new Array()',function () {
					const getInfoBound = cl.getPlatformInfo.bind(
						cl.getPlatformInfo,
						[],
						123
					);
					getInfoBound.should.throw(cl.INVALID_PLATFORM.message);
				});
			}
		);
	}

	for (let i = 0; i < platforms.length; i++) {
		testPlatform(platforms[i]);
	}
});

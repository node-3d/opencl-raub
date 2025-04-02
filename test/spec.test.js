'use strict';

const assert = require('node:assert').strict;
const { describe, it } = require('node:test');

const { parseSpec } = require('./specs/parse-spec');
const webgl = require('..');


const parsedWebcl = parseSpec('webcl');

const exclude = [
	'build', 'enableExtension', 'getArgInfo', 'getBuildInfo', 'getDevices',
	'getGLContext', 'getGLObjectInfo', 'getInfo', 'getPlatforms',
	'getProfilingInfo', 'getSupportedExtensions', 'getWorkGroupInfo',
	'release', 'releaseAll', 'setArg', 'setCallback', 'setStatus', 'createProgram',
];

describe('WebCL Spec Coverage (not conformance)', () => {
	parsedWebcl.constants.forEach((constant) => {
		it(`\`${constant}\` constant exposed`, () => {
			assert.ok(webgl[constant] !== undefined);
		});
	});
	
	parsedWebcl.methods.filter((x) => !exclude.includes(x)).forEach((method) => {
		it(`\`${method}()\` method exposed`, () => {
			assert.strictEqual(typeof webgl[method], 'function');
		});
	});
});

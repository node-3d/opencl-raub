import { strict as assert } from 'node:assert';
import { describe, it, after } from 'node:test';
import cl from '../index.js';
import { parseSpec } from './specs/parse-spec.js';


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
			assert.ok(cl[constant as keyof typeof cl] !== undefined);
		});
	});
	
	parsedWebcl.methods.filter((x) => !exclude.includes(x)).forEach((method) => {
		it(`\`${method}()\` method exposed`, () => {
			assert.strictEqual(typeof cl[method as keyof typeof cl], 'function');
		});
	});
});

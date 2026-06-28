import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import * as cl from './index.ts';
import { parseSpec } from './specs/parse-spec.ts';


const parsedWebcl = parseSpec('webcl');

const exclude = new Set<string>([
	'build', 'enableExtension', 'getArgInfo', 'getBuildInfo', 'getDevices',
	'getGLContext', 'getGLObjectInfo', 'getInfo', 'getPlatforms',
	'getProfilingInfo', 'getSupportedExtensions', 'getWorkGroupInfo',
	'release', 'releaseAll', 'setArg', 'setCallback', 'setStatus', 'createProgram',
]);

describe('WebCL Spec Coverage (not conformance)', () => {
	for (const constant of parsedWebcl.constants) {
		it(`\`${constant}\` constant exposed`, () => {
			assert.ok(cl[constant as keyof typeof cl] !== undefined);
		});
	}
	
	for (const method of parsedWebcl.methods.filter((x) => !exclude.has(x))) {
		it(`\`${method}()\` method exposed`, () => {
			assert.strictEqual(typeof cl[method as keyof typeof cl], 'function');
		});
	}
});

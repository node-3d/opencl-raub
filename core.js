'use strict';

require('segfault-raub');

// Add deps dll dirs
// require('deps-opengl-raub');

const { bin } = require('addon-tools-raub');

const core = require(`./${bin}/opencl`);

const { inspect } = require('util');

core.Wrapper.prototype[inspect.custom] = core.Wrapper.prototype.toString;

module.exports = core;

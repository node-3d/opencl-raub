'use strict';

require('segfault-raub');

const { bin } = require('addon-tools-raub');

const core = require(`./${bin}/opencl`);

module.exports = core;

'use strict';

require('segfault-raub');

const { getBin } = require('addon-tools-raub');

const core = require(`./${getBin()}/opencl.node`);

module.exports = core;

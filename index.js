'use strict';

const opencl = require('./core');


global.WebCLPlatform = opencl.WebCLPlatform = function (_) { this._ = _; };
global.WebCLDevice = opencl.WebCLDevice = function (_) { this._ = _; };
global.WebCLContext = opencl.WebCLContext = function (_) { this._ = _; };
global.WebCLCommandQueue = opencl.WebCLCommandQueue = function (_) { this._ = _; };
global.WebCLMemObject = opencl.WebCLMemObject = function (_) { this._ = _; };
global.WebCLEvent = opencl.WebCLEvent = function (_) { this._ = _; };
global.WebCLProgram = opencl.WebCLProgram = function (_) { this._ = _; };
global.WebCLKernel = opencl.WebCLKernel = function (_) { this._ = _; };
global.WebCLSampler = opencl.WebCLSampler = function (_) { this._ = _; };


module.exports = opencl;

# OpenCL for Node.js

This is a part of [Node3D](https://github.com/node-3d) project.

[![NPM](https://nodei.co/npm/opencl-raub.png?compact=true)](https://www.npmjs.com/package/opencl-raub)

[![Build Status](https://api.travis-ci.com/node-3d/opencl-raub.svg?branch=master)](https://travis-ci.com/node-3d/opencl-raub)
[![CodeFactor](https://www.codefactor.io/repository/github/node-3d/opencl-raub/badge)](https://www.codefactor.io/repository/github/node-3d/opencl-raub)

> npm i opencl-raub


## Synopsis

**Node.js** addon with **OpenCL** bindings.

> Note: this **addon uses N-API**, and therefore is ABI-compatible across different
Node.js versions. Addon binaries are precompiled and **there is no compilation**
step during the `npm i` command.

* Exposes low-level **OpenCL** interface, native-like functions.

The API is very close to the low-level one, although there are minor changes
when it comes to lengths and, of course, pointers.


## Usage

This is a rather low level interface, where most of the stuff is directly reflecting
OpenCL interfaces.

By adding `true` to any `enqueueXXX()` methods, the `enqueueXXX()` returns
a `cl.Event` that can be used to coordinate calls, profiling etc...

See `examples` for more details.

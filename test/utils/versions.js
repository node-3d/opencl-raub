'use strict';

let { expect } = require('chai');

let U = require('./utils');


module.exports = function (lst) {
	let concerned = lst.some(function (v) {return U.checkVersion(v);});
	return {
		it : function () {
			if (! concerned) return;
			it.apply(it, arguments);
		},
		describe : function () {
			if (! concerned) return;
			describe.apply(describe, arguments);
		},
		hasUndefined: function (f) {
			if (! concerned) return;
			it('should be undefined as function does not exist in this version of OpenCL', function () {
				expect(f).to.be.undefined;
			});
		}
	};
};

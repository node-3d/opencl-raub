'use strict';

let assert = require('chai').assert;

const cl = require('../');
let U = require('./utils/utils');
let skip = require('./utils/diagnostic');


let isValid = function (e) {
	assert.isNotNull(e);
	assert.isDefined(e);
};


describe('Event', function () {

	describe('#createUserEvent',function () {
		skip().vendor('nVidia').it('should create user Event',function () {
			U.withContext(function (ctx) {
				let uEvent = cl.createUserEvent(ctx);
				isValid(uEvent);
				cl.releaseEvent(uEvent);
			});
		});
	});

	describe('#getEventInfo',function () {
		function testNumber(info,name,expected) {
			skip().vendor('nVidia').it('should return the good value for ' + name, function () {
				U.withContext(function (ctx) {
					let uEvent = cl.createUserEvent(ctx);
					let val = cl.getEventInfo(uEvent, cl[name]);
					assert.isNumber(val);
					assert.strictEqual(expected, val);
					console.console.log(name + ' = ' + val);
					cl.releaseEvent(uEvent);
				});
			});
		}

		function testObject(info,name) {
			skip().vendor('nVidia').it('should return the good value for ' + name, function () {
				U.withContext(function (ctx, device) {
					U.withCQ(ctx, device, function () {
						let uEvent = cl.createUserEvent(ctx);
            
						let val = cl.getEventInfo(uEvent, cl[name]);
						assert.isObject(val);
						console.console.log(name + ' = ' + val);
						cl.releaseEvent(uEvent);
					});
				});
			});
		}
    
		testNumber('event status to cl.SUBMITTED','EVENT_COMMAND_EXECUTION_STATUS',cl.SUBMITTED);

		// AMD It returns 2
		skip().vendor('AMD').vendor('nVidia').it(
			'should return the good value for EVENT_REFERENCE_COUNT',
			function () {
				U.withContext(function (ctx) {
					let uEvent = cl.createUserEvent(ctx);
					let val = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
					assert.isNumber(val);
					assert.strictEqual(1, val);
					console.console.log('EVENT_REFERENCE_COUNT' + ' = ' + val);
					cl.releaseEvent(uEvent);
				});
			}
		);

		testNumber('event type to UserEvent','EVENT_COMMAND_TYPE',cl.COMMAND_USER);
		testObject('the context','EVENT_CONTEXT');
		// testObject("the command queue","EVENT_COMMAND_QUEUE");

	});

	describe('#setUserEventStatus',function () {

		skip().vendor('nVidia').it('should set the status to the good value',function () {
			U.withContext(function (ctx) {
				let uEvent = cl.createUserEvent(ctx);
				cl.setUserEventStatus(uEvent,cl.COMPLETE);
				let result = cl.getEventInfo(uEvent,cl.EVENT_COMMAND_EXECUTION_STATUS);
				assert.strictEqual(result,cl.COMPLETE);
				cl.releaseEvent(uEvent);
			});
		});
    
		//bug in amd driver?
		skip().it('should throw an error for invalid value',function () {
			U.withContext(function (ctx) {
				let uEvent = cl.createUserEvent(ctx);
				cl.setUserEventStatus.bind(cl.setUserEvent,uEvent,-1).should.throw(cl.INVALID_VALUE.message);
				cl.releaseEvent(uEvent);
			});
		});

		skip().it('should throw an error because 2 change of the values for the same user event',function () {
			U.withContext(function (ctx) {
				let uEvent = cl.createUserEvent(ctx);
				cl.setUserEventStatus(uEvent,cl.COMPLETE);
				const setStatusBound = cl.setUserEventStatus.bind(
					cl.setUserEvent,
					uEvent,
					cl.COMPLETE
				);
				setStatusBound.should.throw(cl.INVALID_VALUE.message);
				cl.releaseEvent(uEvent);
			});
		});
	});

	describe('#retainEvent', function () {

		skip().vendor('nVidia').it('should have incremented ref count after call', function () {
			U.withContext(function (ctx) {
				let uEvent = cl.createUserEvent(ctx);
				let before = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
				cl.retainEvent(uEvent);
				let after = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
				assert(before + 1 == after);
				cl.releaseEvent(uEvent);
				cl.releaseEvent(uEvent);
			});
		});
	});

	describe('#releaseEvent', function () {

		skip().vendor('nVidia').it('should have decremented ref count after call', function () {
			U.withContext(function (ctx) {
				let uEvent = cl.createUserEvent(ctx);
				let before = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
				cl.retainEvent(uEvent);
				cl.releaseEvent(uEvent);
				let after = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
				assert.equal(before, after, 'refcount before == refcount after');
			});
		});

	});

	describe('#setEventCallback',function () {
		skip().vendor('nVidia').it('callback should be called',function (done) {
			U.withAsyncContext(function (ctx, device, platform, ctxDone) {
				let myCallback = function (userData, status, mEvent) {
					// assert(ctx === cl.getEventInfo(mEvent, cl.EVENT_CONTEXT), 'ctx === event ctx');
					cl.releaseEvent(mEvent);
					ctxDone();
					userData.done();
				};
				let mEvent = cl.createUserEvent(ctx);
				cl.setEventCallback(mEvent,cl.COMPLETE,myCallback,{done:done});
				cl.setUserEventStatus(mEvent,cl.COMPLETE);
			});
		});
	});
});

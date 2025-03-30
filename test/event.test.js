'use strict';

const assert = require('node:assert').strict;
const { describe, it, after } = require('node:test');

const cl = require('../');
const U = require('./utils');


describe('Event', () => {
	const context = U.newContext();
	
	after(() => {
		cl.releaseContext(context);
	});
	
	describe('#createUserEvent', () => {
		it('creates a user Event', () => {
			const uEvent = cl.createUserEvent(context);
			assert.ok(uEvent);
			
			cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(uEvent);
		});
	});
	
	describe('#getEventInfo', () => {
		const testNumber = (info, name, expected) => {
			it('returns the good value for ' + name, () => {
				const uEvent = cl.createUserEvent(context);
				const val = cl.getEventInfo(uEvent, cl[name]);
				U.assertType(val, 'number');
				assert.strictEqual(expected, val);
				
				cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
				cl.releaseEvent(uEvent);
			});
		};
		
		const testObject = (info, name) => {
			it('returns the good value for ' + name, () => {
				const uEvent = cl.createUserEvent(context);
				
				const val = cl.getEventInfo(uEvent, cl[name]);
				U.assertType(val, 'object');
				
				cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
				cl.releaseEvent(uEvent);
			});
		};
		
		testNumber('event status to cl.SUBMITTED','EVENT_COMMAND_EXECUTION_STATUS', cl.SUBMITTED);
		
		it('returns the good value for EVENT_REFERENCE_COUNT', () => {
			const uEvent = cl.createUserEvent(context);
			const val = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
			U.assertType(val, 'number');
			assert.strictEqual(1, val);
			
			cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(uEvent);
		});
		
		testNumber('event type to UserEvent','EVENT_COMMAND_TYPE', cl.COMMAND_USER);
		testObject('the context','EVENT_CONTEXT');
		// testObject("the command queue","EVENT_COMMAND_QUEUE");
	});
	
	describe('#setUserEventStatus', () => {
		it('sets the status CL_COMPLETE', () => {
			const uEvent = cl.createUserEvent(context);
			cl.setUserEventStatus(uEvent, cl.COMPLETE);
			const result = cl.getEventInfo(uEvent, cl.EVENT_COMMAND_EXECUTION_STATUS);
			assert.strictEqual(result, cl.COMPLETE);
			cl.releaseEvent(uEvent);
		});
		
		it('throws an error for invalid status', () => {
			const uEvent = cl.createUserEvent(context);
			assert.throws(
				() => cl.setUserEventStatus(uEvent, 123),
				cl.INVALID_VALUE,
			);
				
			cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(uEvent);
		});
	});
	
	describe('#retainEvent', () => {
		it('increments ref count after call', () => {
			const uEvent = cl.createUserEvent(context);
			const before = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
			cl.retainEvent(uEvent);
			const after = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
			assert(before + 1 == after);
				
			cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(uEvent);
			cl.releaseEvent(uEvent);
		});
	});
	
	describe('#releaseEvent', () => {
		it('decrements ref count after call', () => {
			const uEvent = cl.createUserEvent(context);
			const before = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
			cl.retainEvent(uEvent);
			cl.releaseEvent(uEvent);
			const after = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
			assert.equal(before, after, 'refcount before == refcount after');
				
			cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(uEvent);
		});
	});
	
	describe('#setEventCallback', () => {
		it('calls cb', (t, done) => {
			const uEvent = cl.createUserEvent(context);
			cl.setEventCallback(
				uEvent,
				cl.COMPLETE,
				(userData, status, e) => {
					assert.strictEqual(e, uEvent);
					cl.releaseEvent(e);
					userData.done();
				},
				{ done },
			);
			cl.setUserEventStatus(uEvent, cl.COMPLETE);
		});
	});
});

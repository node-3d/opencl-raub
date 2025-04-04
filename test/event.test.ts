import { strict as assert } from 'node:assert';
import { describe, it, after } from 'node:test';
import cl from '../index.js';
import * as U from './utils.ts';


describe('Event', () => {
	const { context } = cl.quickStart();
	
	describe('#createUserEvent', () => {
		it('creates a user Event', () => {
			const uEvent = cl.createUserEvent(context);
			assert.ok(uEvent);
			
			cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(uEvent);
		});
	});
	
	describe('#getEventInfo', () => {
		const testNumber = (name: keyof typeof cl, expected: number) => {
			it('returns value for ' + name, () => {
				const uEvent = cl.createUserEvent(context);
				const val = cl.getEventInfo(uEvent, cl[name] as number);
				U.assertType(val, 'number');
				assert.strictEqual(expected, val);
				
				cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
				cl.releaseEvent(uEvent);
			});
		};
		
		const testObject = (name: keyof typeof cl) => {
			it('returns the good value for ' + name, () => {
				const uEvent = cl.createUserEvent(context);
				
				const val = cl.getEventInfo(uEvent, cl[name] as number);
				U.assertType(val, 'object');
				
				cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
				cl.releaseEvent(uEvent);
			});
		};
		
		testNumber('EVENT_COMMAND_EXECUTION_STATUS', cl.SUBMITTED);
		
		it('returns the good value for EVENT_REFERENCE_COUNT', () => {
			const uEvent = cl.createUserEvent(context);
			const val = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
			U.assertType(val, 'number');
			assert.strictEqual(1, val);
			
			cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(uEvent);
		});
		
		testNumber('EVENT_COMMAND_TYPE', cl.COMMAND_USER);
		testObject('EVENT_CONTEXT');
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
			cl.retainEvent(uEvent);
			const after = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
			assert.strictEqual(after, 2);
				
			cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(uEvent);
			cl.releaseEvent(uEvent);
		});
	});
	
	describe('#releaseEvent', () => {
		it('decrements ref count after call', () => {
			const uEvent = cl.createUserEvent(context);
			cl.retainEvent(uEvent);
			cl.releaseEvent(uEvent);
			const after = cl.getEventInfo(uEvent, cl.EVENT_REFERENCE_COUNT);
			assert.strictEqual(after, 1);
				
			cl.setUserEventStatus(uEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(uEvent);
		});
	});
	
	describe('#setEventCallback', () => {
		it('calls cb', (_t, done) => {
			const uEvent = cl.createUserEvent(context);
			cl.setEventCallback(
				uEvent,
				cl.COMPLETE,
				(userData: Object, status: number, e: cl.TClEvent): void => {
					assert.strictEqual(e, uEvent);
					cl.releaseEvent(e);
					(userData as { done: () => void }).done();
				},
				{ done },
			);
			cl.setUserEventStatus(uEvent, cl.COMPLETE);
		});
	});
});

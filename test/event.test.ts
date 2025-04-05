import { strict as assert } from 'node:assert';
import { describe, it, type TestContext } from 'node:test';
import cl from '../index.js';
import * as U from './utils.ts';


describe('Event', () => {
	const { context } = cl.quickStart();
	
	describe('#createUserEvent', () => {
		it('creates a user Event', () => {
			const userEvent = cl.createUserEvent(context);
			assert.ok(userEvent);
			
			cl.setUserEventStatus(userEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(userEvent);
		});
	});
	
	describe('#getEventInfo', () => {
		const testNumber = (name: keyof typeof cl, expected: number) => {
			it('returns value for ' + name, () => {
				const userEvent = cl.createUserEvent(context);
				const val = cl.getEventInfo(userEvent, cl[name] as number);
				U.assertType(val, 'number');
				assert.strictEqual(expected, val);
				
				cl.setUserEventStatus(userEvent, cl.COMPLETE); // on NVIDIA hangs if not set
				cl.releaseEvent(userEvent);
			});
		};
		
		const testObject = (name: keyof typeof cl) => {
			it('returns the good value for ' + name, () => {
				const userEvent = cl.createUserEvent(context);
				
				const val = cl.getEventInfo(userEvent, cl[name] as number);
				U.assertType(val, 'object');
				
				cl.setUserEventStatus(userEvent, cl.COMPLETE); // on NVIDIA hangs if not set
				cl.releaseEvent(userEvent);
			});
		};
		
		testNumber('EVENT_COMMAND_EXECUTION_STATUS', cl.SUBMITTED);
		
		it('returns the good value for EVENT_REFERENCE_COUNT', () => {
			const userEvent = cl.createUserEvent(context);
			const val = cl.getEventInfo(userEvent, cl.EVENT_REFERENCE_COUNT);
			U.assertType(val, 'number');
			assert.strictEqual(1, val);
			
			cl.setUserEventStatus(userEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(userEvent);
		});
		
		testNumber('EVENT_COMMAND_TYPE', cl.COMMAND_USER);
		testObject('EVENT_CONTEXT');
	});
	
	describe('#setUserEventStatus', () => {
		it('sets the status CL_COMPLETE', () => {
			const userEvent = cl.createUserEvent(context);
			cl.setUserEventStatus(userEvent, cl.COMPLETE);
			const result = cl.getEventInfo(userEvent, cl.EVENT_COMMAND_EXECUTION_STATUS);
			assert.strictEqual(result, cl.COMPLETE);
			cl.releaseEvent(userEvent);
		});
		
		it('throws an error for invalid status', () => {
			const userEvent = cl.createUserEvent(context);
			assert.throws(
				() => cl.setUserEventStatus(userEvent, 123),
				cl.INVALID_VALUE,
			);
				
			cl.setUserEventStatus(userEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(userEvent);
		});
	});
	
	describe('#retainEvent', () => {
		it('increments ref count after call', () => {
			const userEvent = cl.createUserEvent(context);
			cl.retainEvent(userEvent);
			const after = cl.getEventInfo(userEvent, cl.EVENT_REFERENCE_COUNT);
			assert.strictEqual(after, 2);
				
			cl.setUserEventStatus(userEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(userEvent);
			cl.releaseEvent(userEvent);
		});
	});
	
	describe('#releaseEvent', () => {
		it('decrements ref count after call', () => {
			const userEvent = cl.createUserEvent(context);
			cl.retainEvent(userEvent);
			cl.releaseEvent(userEvent);
			const after = cl.getEventInfo(userEvent, cl.EVENT_REFERENCE_COUNT);
			assert.strictEqual(after, 1);
				
			cl.setUserEventStatus(userEvent, cl.COMPLETE); // on NVIDIA hangs if not set
			cl.releaseEvent(userEvent);
		});
	});
	
	describe('#setEventCallback', () => {
		it('calls cb', (t: TestContext, done: () => void) => {
			t.plan(2); // plan for 2 assertions in event callback
			
			const userEvent = cl.createUserEvent(context);
			
			cl.setEventCallback(
				userEvent,
				cl.COMPLETE,
				(e: cl.TClEvent, _status: number, userData: unknown): void => {
					t.assert.strictEqual(e._, userEvent._);
					t.assert.strictEqual(userData, 'hello');
					cl.releaseEvent(e);
					done();
				},
				'hello',
			);
			
			cl.setUserEventStatus(userEvent, cl.COMPLETE);
		});
	});
});

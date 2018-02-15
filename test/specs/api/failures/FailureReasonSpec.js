var FailureReason = require('./../../../../api/failures/FailureReason'),
	FailureType = require('./../../../../api/failures/FailureType');

describe('When a FailureReason is created', function() {
	'use strict';

	var reason;
	var itemOne;
	var itemTwo;

	beforeEach(function() {
		reason = FailureReason.forRequest({ endpoint: { description: 'mock' }})
			.addItem(FailureType.REQUEST_CONSTRUCTION_FAILURE, { }, true)
			.addItem(FailureType.REQUEST_PARAMETER_MISSING_FAILURE, { name: 'First' })
			.addItem(FailureType.REQUEST_PARAMETER_MISSING_FAILURE, { name: 'Second' });
	});

	describe('and the FailureReason is converted to a human-readable form', function() {
		var human;

		beforeEach(function() {
			human = reason.formatTree();
		});

		it('should have one primary reason', function() {
			expect(human.length).toEqual(1);
		});

		it('should have two secondary reasons', function() {
			expect(human[0].children.length).toEqual(2);
		});

		it('should have the correct primary reason value', function() {
			expect(human[0].value).toEqual('Mock operation cannot be executed, some required information is missing.');
		});

		it('should have the correct secondary reason value (1)', function() {
			expect(human[0].children[0].value).toEqual('The first field is required.');
		});

		it('should have the correct secondary reason value (2)', function() {
			expect(human[0].children[1].value).toEqual('The second field is required.');
		});
	});
});

const assert = require('./../../../lang/assert'),
	attributes = require('./../../../lang/attributes'),
	is = require('./../../../lang/is');

const Parameter = require('./../definitions/Parameter'),
	Parameters = require('./../definitions/Parameters');

module.exports = (() => {
	'use strict';

	/**
	 * Fluent interface for building a {@link Parameters} collection.
	 *
	 * @public
	 */
	class ParametersBuilder {
		constructor() {
			this._parameters = new Parameters();
		}

		/**
		 * The {@link Parameters} collection, given all the information provided thus far.
		 *
		 * @public
		 * @returns {Parameters}
		 */
		get parameters() {
			return this._parameters;
		}

		/**
		 * Adds a new parameter that extracts its value from a delegate.
		 *
		 * @param {String} key
		 * @param {Function} delegate
		 * @param (Boolean=} optional
		 * @param {Function=} serializer
		 * @returns {ParametersBuilder}
		 */
		withDelegateParameter(key, delegate, optional, serializer) {
			addParameter.call(this, new Parameter(key, buildDelegateExtractor(delegate, buildSerializer(serializer)), optional));

			return this;
		}

		/**
		 * Adds a new parameter with a literal value.
		 *
		 * @param {String} key
		 * @param {Function} delegate
		 * @param (Boolean=} optional
		 * @returns {ParametersBuilder}
		 */
		withLiteralParameter(key, value, optional) {
			addParameter.call(this, new Parameter(key, buildLiteralExtractor(value || key), optional));

			return this;
		}

		/**
		 * Adds a new parameter that reads its value from the a variable
		 * on the request payload.
		 *
		 * @param {String} key
		 * @param {Function} delegate
		 * @param (Boolean=} optional
		 * @param {Function=} serializer
		 * @returns {ParametersBuilder}
		 */
		withVariableParameter(key, variable, optional, serializer) {
			addParameter.call(this, new Parameter(key, buildVariableExtractor(variable, buildSerializer(serializer)), optional));

			return this;
		}

		toString() {
			return '[ParametersBuilder]';
		}
	}

	function addParameter(parameter) {
		const items = this._parameters.parameters.slice(0);

		items.push(parameter);

		this._parameters = new Parameters(items);
	}

	function buildSerializer(serializer) {
		let returnRef;

		if (is.fn(serializer)) {
			returnRef = serializer;
		} else {
			returnRef = (x) => x;
		}

		return returnRef;
	}

	function buildDelegateExtractor(fn, serializer) {
		assert.argumentIsRequired(fn, 'fn', Function);

		return (payload) => {
			return Promise.resolve()
				.then(() => {
					return serializer(fn(payload));
				});
		};
	}

	function buildLiteralExtractor(value) {
		assert.argumentIsRequired(value, 'value', String);

		return (payload) => Promise.resolve(value);
	}

	function buildVariableExtractor(variable, serializer) {
		assert.argumentIsRequired(variable, 'variable', String);

		return buildDelegateExtractor((payload) => {
			if (is.object(payload) && attributes.has(payload, variable)) {
				return attributes.read(payload, variable);
			} else {
				return null;
			}
		}, serializer);
	}

	return ParametersBuilder;
})();
const assert = require('./assert'),
	is = require('./is');

const moment = require('moment-timezone');

module.exports = (() => {
	'use strict';

	const MILLISECONDS_PER_SECOND = 1000;

	/**
	 * An immutable data structure that encapsulates (and lazy loads)
	 * a moment (see https://momentjs.com/).
	 *
	 * @public
	 * @param {Number} timestamp
	 * @param {String=} timezone
	 */
	class Timestamp {
		constructor(timestamp, timezone) {
			assert.argumentIsValid(timestamp, 'timestamp', is.large, 'is an integer');
			assert.argumentIsOptional(timezone, 'timezone', String);

			this._timestamp = timestamp;
			this._timezone = timezone || null;

			this._moment = null;
		}

		/**
		 * The timestamp (milliseconds since epoch).
		 *
		 * @public
		 * @returns {Number}
		 */
		get timestamp() {
			return this._timestamp;
		}

		/**
		 * The moment instance.
		 *
		 * @public
		 * @returns {moment}
		 */
		get moment() {
			if (this._moment === null) {
				this._moment = moment(this._timestamp);

				if (this._timezone !== null) {
					this.moment.tz(this._timezone);
				}
			}

			return this._moment;
		}

		/**
		 * Returns a new {@link Timestamp} instance shifted forward (or backward)
		 * by a specific number of seconds.
		 *
		 * @public
		 * @param {Number} milliseconds
		 * @returns {Timestamp}
		 */
		add(milliseconds) {
			assert.argumentIsRequired(milliseconds, 'seconds', Number);

			return new Timestamp(this._timestamp + milliseconds, this._timezone);
		}

		/**
		 * Returns a new {@link Timestamp} instance shifted forward (or backward)
		 * by a specific number of seconds.
		 *
		 * @public
		 * @param {Number} seconds
		 * @returns {Timestamp}
		 */
		addSeconds(seconds) {
			assert.argumentIsRequired(seconds, 'seconds', Number);

			return this.add(seconds * MILLISECONDS_PER_SECOND);
		}

		/**
		 * Returns the JSON representation.
		 *
		 * @public
		 * @returns {Number}
		 */
		toJSON() {
			return this.timestamp;
		}

		/**
		 * Clones a {@link Timestamp} instance.
		 *
		 * @public
		 * @static
		 * @param {Timestamp} value
		 * @returns {Timestamp}
		 */
		static clone(value) {
			assert.argumentIsRequired(value, 'value', Timestamp, 'Timestamp');

			return new Timestamp(value._timestamp, value._timezone);
		}

		/**
		 * Parses the value emitted by {@link Timestamp#toJSON}.
		 *
		 * @public
		 * @param {Number} value
		 * @returns {Timestamp}
		 */
		static parse(value) {
			return new Timestamp(value);
		}

		/**
		 * Returns a new {@link Timestamp} instance, representing the current moment.
		 *
		 * @public
		 * @returns {Timestamp}
		 */
		static now() {
			return new Timestamp((new Date()).getTime());
		}

		toString() {
			return '[Timestamp]';
		}
	}

	return Timestamp;
})();

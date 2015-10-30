angular.module('starter.services', [])

.factory(
    'Scans',
    [
        '$window',
        function ($window) {
            var Scans = function () {
                this.init();
            };

            Scans.prototype = {
                /**
                 * Initialize Scans object
                 */
                init: function () {
                    this._setMixed('current', this._getMixed('current') || []);
                    this._setMixed('sent', this._getMixed('sent') || []);
                },
                _setMixed: function (index, value) {
                    $window.localStorage[index] = JSON.stringify(value);
                },
                _getMixed: function (index) {
                    return JSON.parse($window.localStorage[index]);
                },
                /**
                 * Add an url to the list of entries
                 *
                 * @param {String} url
                 */
                add: function (url) {
                    this._setMixed(
                        'current',
                        this.getCurrent().concat([this.format(url)])
                    );
                },
                /**
                 * Get all entries not already sent, normalized
                 *
                 * @returns {Object[]}
                 */
                getCurrent: function () {
                    return this._getMixed('current');
                },
                /**
                 * Get all entries, normalized
                 *
                 * @returns {String[]}
                 */
                getAll: function () {
                    return this._getMixed('sent').concat(this.getCurrent());
                },
                /**
                 * Mark all current entries as sent
                 */
                markAsSent: function () {
                    this._setMixed('sent', this.getAll());
                    this._setMixed('current', []);
                },
                /**
                 * Normalize an url, ie convert string to string JSON with date of scan
                 *
                 * @param {String} url
                 *
                 * @returns {Object}
                 */
                format: function (url) {
                    return {
                        "date": new Date(),
                        "url": url
                    };
                },
                /**
                 * Get number of current scans not already sent
                 *
                 * @returns {Number}
                 */
                getCurrentCount: function () {
                    return this.getCurrent().length;
                },
                /**
                 * Get total number of scans
                 *
                 * @returns {Number}
                 */
                getAllCount: function () {
                    return this.getAll().length;
                }
            };

            return new Scans();
        }
    ]
);

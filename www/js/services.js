angular.module('starter.services', [ 'ngMd5', 'ngResource' ])

.factory(
    'AfupConfig',
    [
        '$window',
        '$http',
        'md5',
        function ($window, $http, md5) {
            var AfupConfig = function () {
                this.init();
            };

            AfupConfig.prototype = {
                API     : 'api',
                TOKEN   : 'token',
                MD5_SALT: 'md5_salt',
    
                get: function (name) {
                    return $window.localStorage[name];
                },
                set: function (name, value) {
                    return $window.localStorage[name] = value;
                },
                init: function () {
                    $window.localStorage['api'] = $window.localStorage['api'] || 'http://afup.org/forumphp/register.php'
                },
                validateUrl: function (url) {
                    var matches = (new RegExp('^http://m\.afup\.org/#(\d+):([\da-f]){6}', 'i')).match(url);
                    if (null === matches) {
                        return false;
                    }

                    var id = matches[1];
                    var hash = matches[2];

                    return hash === this._getHashForId(id);
                },
                _getHashForId: function (id) {
                    return md5.createHash(AfupConfig.MD5_SALT + id).substr(2, 6);
                },
                // Send data
                send: function (urls, success, failure) {
                    $http({
                        method: 'POST',
                        url: this.get(this.API),
                        headers: {
                            'content-type': 'application/json',
                            'x-afup-token': this.get(this.TOKEN)
                        },
                        data: urls
                    }).then(function (response) {
                        if (success) {
                            success(response.data);
                        }
                    });
                }
            };

            return new AfupConfig();
        }
    ]
)

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
                    return JSON.parse($window.localStorage[index] || 'null');
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

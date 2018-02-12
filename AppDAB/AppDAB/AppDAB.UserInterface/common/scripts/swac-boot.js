/* Version 1.3.0, Boot version 1.3.0, copyright (C) 2017, Siemens AG. All Rights Reserved. */


/**
 * Class that manages the boot of the component.
 *
 * @class SWACBoot
 * @constructor
 * 
 */
var SWACBoot = (SWACBoot || (function () {


    //////////////
    // PRIVATE  //
    //////////////

    var
        // Current bootloader phase.
        _state = 'pending',

        // Timer for bootloader timeout.
        _bootTimer = -1,

        // parent window of the iframe component is hosted in.
        _p = window.parent,

        // Handler for incoming messages.
        _msgHandler = null,

        // Handler for TLS messages. If set, after successfull bootstrap phase handshake will start.
        _tlsHandler = null,

        // Content with type, name and authentication info
        _content = null,

        // raw content received from container
        _containerInfo = {},

        _injectionQueue = [],

        /**
       * Clear timer and remove event listener
       *
       * @private
       * @method _clear
       */
        _clear = function () {
            window.clearTimeout(_bootTimer);
            if (window.removeEventListener) {
                window.removeEventListener('message', _msgHandler);
            }
            else {
                window.detachEvent('onmessage', _msgHandler);
            }
        },

       /**
       * Load a Javascript
       *
       * @private
       * @method _jsLoadUtil
       * @param {string} url url for the script to load
       * @param {function} success function to call when success
       * @param {function} failure function to call when fail
       */
        _jsLoadUtil = function (url, success, failure) {
            var baselib = document.createElement('script');
            baselib.setAttribute('type', 'text/javascript');
            baselib.setAttribute('src', url);

            if (success || failure) {
                if (baselib.addEventListener) {
                    if (success) {
                        baselib.addEventListener('load', success);
                    }
                    if (failure) {
                        baselib.addEventListener('error', failure);
                    }
                }
                else {
                    if (success) {
                        baselib.onreadystatechange = function () {
                            if (this.readyState === 'loaded' || this.readyState === 'complete') {
                                success();
                            }
                            else {
                                if (failure) {
                                    failure();
                                }
                            }
                        };
                    }
                }
            }

            document.getElementsByTagName('head')[0].appendChild(baselib);
        },

       /**
       * Creates a message
       *
       * @private
       * @method _createMessage
       * @param {object} content content of the message
       * @return {object} a JSON object containing the content of the message
       */
        _createMessage = function (content) {
            return JSON.stringify({ t: 'boot', c: content });
        },

       /**
       * Receives reply from container
       *
       * @private
       * @method _receiveMessage
       * @param {object} event Event object
       * @param {function} success success callback
       * @param {function} failure failure callback
       */
        _receiveMessage = function (event, success, failure) {
            var data = {},
                succCallback,
                failedCb,
                done,
                p,
                regex = null,
                aggregator,
                extension;

            if (_state === 'waiting' || _state === 'ok') {
                if ((typeof (event.data) === 'string') && (event.data.length > 0)) {
                    try {
                        // Check for URL in response and start loading script
                        data = JSON.parse(event.data);
                        if (!data || !data.t || !data.c) {
                            throw new Error('Incompatible message received');
                        }
                        else if (data.t !== 'boot') {
                            throw new Error('Unknown message received: ' + data.t);
                        }
                    }
                    catch (e) {
                        return;
                    }

                    failedCb = function () {
                        _state = 'failed';
                        _clear();
                        failure({ message: 'Failed to load SWAC.Config.Container.URLs library' });
                        _p.postMessage(_createMessage({ message: 'failed' }), '*');
                    };

                    if ((data.t === 'boot') && (data.c.message === 'pong')) {
                        done = function () {
                            SWAC.isContainer = false;
                            _state = 'ok';
                            _content = data.c;
                            _content.containerVersion = _content.containerVersion || '1.0.0';
                            _p.postMessage(_createMessage({ message: 'ok' }), '*');
                        };

                        aggregator = function () {
                            var _script,
                              injectionQueueCount = _injectionQueue.length;

                            if (injectionQueueCount === 0) {
                                done();
                            } else {
                                _script = _injectionQueue.pop();
                                if (typeof defineExtension === 'undefined') {
                                    regex = /^\s+|\s+$/g;

                                    // WebCC base needs to be injected
                                    if ((_script === undefined) || (_script === null) || (_script.replace(regex, '') === '')) {
                                        failedCb();
                                    }
                                    else {
                                        succCallback = function () {
                                            if (typeof defineExtension !== 'undefined') {
                                                aggregator();
                                            } else {
                                                failedCb();
                                            }
                                        };

                                        _jsLoadUtil(_script, succCallback, failedCb);
                                    }

                                    regex = null;
                                }
                                else {
                                    // WebCC base is already loaded in control
                                    if (data.c.extensions.length === injectionQueueCount) {
                                        // First item is base, proceed to the next
                                        aggregator();
                                    }
                                    else {
                                        // Load the extension
                                        _jsLoadUtil(_script, aggregator, failedCb);
                                    }
                                }
                            }
                        };

                        if (data.c.extensions) {
                            for (extension in data.c.extensions) {
                                if (data.c.extensions.hasOwnProperty(extension)) {
                                    _injectionQueue.unshift(data.c.extensions[extension]);
                                }
                            }
                        }

                        if (typeof SWAC !== 'undefined') {
                            aggregator();
                        }
                        else {
                            regex = /^\s+|\s+$/g;

                            if ((data.c.url === undefined) || (data.c.url === null) || (data.c.url.replace(regex, '') === '')) {
                                failedCb();
                            }
                            else {
                                succCallback = function () {
                                    if ((typeof SWAC !== 'undefined') || ((typeof data.c.namespace !== 'undefined') && (typeof window[data.c.namespace] !== 'undefined'))) {
                                        aggregator();
                                    }
                                    else {
                                        failedCb();
                                    }
                                };

                                _state = 'upgrading';

                                _jsLoadUtil(data.c.url, succCallback, failedCb);
                            }
                            regex = null;
                        }

                    }
                    else if ((data.t === 'boot') && (data.c.message === 'ok2')) {
                        // Container object has been created and is ready to be accepted
                        _state = 'done';

                        _clear();
                        for (p in _content) {
                            if (_content.hasOwnProperty(p)) {
                                _containerInfo[p] = _content[p];
                            }
                        }

                        _content.message = 'SWAC successfully loaded';
                        _content.auth = _content.authentication;
                        delete _content.authentication;
                        delete _content.url;
                        delete _content.extensions;
                        delete _content.namespace;
                        delete _content._internal;

                        SWAC.Hub.prototype.containerVersion = _content.containerVersion;

                        success(_content);
                    }
                    else if ((data.t === 'boot') && (data.c.message === 'peng')) {
                        _clear();
                        failure({ message: data.c.reason });
                    }
                }
            } else {
                _clear();
            }
        },

        // Iniates the bootstrap mechanism with pre-checks and time-out.
        _bootstrap = function (success, failure, version, auth, timeout) {
            version = version || '*';                     // default is container's current
            timeout = timeout || 1000;                    // default timeout is 1s
            failure = failure || function (event) { };    // do nothing, if no onfailure callback was specified
            auth = auth || 'no';                          // default is no authentication

            if (_p === self) {
                _state = 'failed';
                window.setTimeout(function () {
                    failure({ message: 'Component is not embedded into an iframe' });
                }, 0);
            }
            else {
                _msgHandler = function (event) {
                    _receiveMessage(event, success, failure);
                };

                _state = 'waiting';
                if (window.addEventListener) {
                    window.addEventListener('message', _msgHandler, false);
                } else {
                    window.attachEvent('onmessage', _msgHandler);
                }

                _bootTimer = window.setTimeout(function () {
                    if (_state !== 'done') {
                        _state = 'timedout';
                        _clear();
                        failure({ message: 'Bootload sequence timed out' });
                    }
                }, timeout);

                _p.postMessage(_createMessage({ message: 'ping', version: version, authentication: auth, attributes: arguments[5], extensions: arguments[6] }), '*'); // targetOrigin is application-specific, use * here.
            }
        };

    //////////////
    // PUBLIC   //
    //////////////

    return {
        /**
        * Initialize the SWAC component boot phase
        *
        * @method start
        * @param {function} success success callback.
        * @param {function} failure failure callback.
        * @param {string} version SWAC version used to develop the component.
        * @param {string} auth Specify if component require authentication.
        * @param {number} timeout SWACBoot.start timeout in milliseconds.
        */
        start: _bootstrap,

        _internal: {
            /**
            * Container informations.
            *
            * @protected
            * @property _internal.containerInfo
            * @return {object} returns an object containing informations received from the container
            */
            containerInfo: _containerInfo
        }
    };

}()));

/**
* Provide the version of the object.
*
* @property version
* @type String
*/
SWACBoot.version = '1.3.0';

/* Version 1.3.0, copyright (C) 2017, Siemens AG. All Rights Reserved. */


///////////////////////////////////////////
// lib/base/_.js

/**
 * @class SWAC
 */
var SWAC = (SWAC || {});

/**
* Value will be changed by bootstrapper code for components.
*
* @property isContainer
* @type boolean
* @default true
*/
SWAC.isContainer = true;

/**
* Identify the current SWAC base engine version. 
*
* Important Note: the property value must not be changed because it's used by SWAC to perform cross compatibility checks
* @property version
* @type string
* @since SWAC 1.0.2
* @final
*/
SWAC.version = '1.3.0';


///////////////////////////////////////////
// lib/base/misc/config.js

/**
 * Class that manages all the configuration settings. 
 *
 * @class SWAC.Config
 * @constructor
 * 
 */
SWAC.Config = (function () {

  //////////////
  // PUBLIC   //
  //////////////

  return {

    /**
     * Timeout settings
     *
     * @method TimeOuts
     * @type Object
     * @param [Enabled] {Boolean} Enable the TimeOuts settings (default: true)
     * @param [Create] {Numeric} Timeout for component creation (default: 1000)
     * @param [Remove] {Numeric} Timeout for component removal (default: 2000)
     * @param [CleanUp] {Numeric} Timeout for components clean up (default: 60000)
     * @param [Internal] {Numeric} Timeout for internal calls (default: 1000)
     * @param [Close] {Numeric} Timeout for components closing (default: 120000)
     * @param [Proxy] {Object}
     * @param [Proxy.Functions] {Numeric} Timeout for function callback in proxy (default: 2000)
     * @param [Proxy.Events] {Numeric} Timeout for an event in proxy (default: 1000)
     * @param [Authentication] {Object}
     * @param [Authentication.Handshake] {Numeric} Timeout for authentication handshake (default: 10000)
     */
    TimeOuts: {
      Create: 1000,
      Remove: 2000,
      CleanUp: 20000,
      Internal: 1000,
      Close: 60000,
      Proxy: {
        Functions: 2000,
        Events: 1000
      },
      Authentication: {
        Handshake: 10000
      }
    },

    /**
     * Container settings
     *
     * @method Container
     * @type Object
     * @param [URLs] {Object}
     * @param [URLs.BaseLibrary] {String} SWAC-base library path (default: '')
     * @param [URLs.ControlLibrary] {String} WebCC-base library path (default: '')
     * @param [Authentication] {Object}
     * @param [Authentication.Request] {Boolean} Specify if an authentication is required (default: false)
     * @param [Authentication.TlsHandler] {Object} Transport Layer Security handler (default: null)
     * @param [Behaviors] {Object}
     * @param [Behaviors.CloseOnCleanUpTimeOut] {Boolean} Specify if all components will be closed after timeout (default: true)
    */
    Container: {
      URLs: {
        BaseLibrary: '',
        ControlLibrary: ''
      },
      Authentication: {
        Request: false,
        TlsHandler: null  // no handler set is equal to "no authentication supported"
      },
      Behaviors: {
        CloseOnCleanUpTimeOut: true
      }
    }
  };

}());


///////////////////////////////////////////
// lib/base/misc/exception.js

/**
 * Class that manages Exception message. 
 *
 * @class SWAC.Exception
 * @constructor
 * @param {Numeric} errorCode
 */
SWAC.Exception = function (errorCode) {
  var codeMsg;

/**
 * Exception code.
 *
 * @property errorCode
 * @type Numeric
 */
    if (isNaN(errorCode)) {
      this.errorCode = -1;
      this.message = errorCode;
    }
    else {
      this.errorCode = errorCode;

      codeMsg = SWAC.Exception.prototype.exceptionCodes[errorCode];
      /**
       * Exception message.
       *
       * @property message
       * @type String
       */
      this.message = 'Internal Error';
      if (codeMsg !== null && codeMsg !== undefined) {
        this.message = codeMsg;
      }
    }
};

SWAC.Exception.prototype = new Error();
SWAC.Exception.prototype = {
  /**
 * Object that manages exception codes. 
 *
 * @private
 * @property exceptionCodes
 * @type Object 
 */
  exceptionCodes: {
    /**
     * Only one instance of SWAC.Hub is allowed.
     *
     * @private
     * @property exceptionCodes.1000
     * @type Numeric
     */
    1000: 'Only one instance of SWAC.Hub is allowed.',
    /**
     * Component not found.
     *
     * @private
     * @property exceptionCodes.1001
     * @type Numeric
     */
    1001: 'Component not found.',
    /**
    * Corresponding node does no longer exist.
    *
    * @private
    * @property exceptionCodes.1002
    * @type Numeric
    */
    1002: 'Corresponding node does no longer exist.',
    /**
    * No compatible node for the given key.
    *
    * @private
    * @property exceptionCodes.1003
    * @type Numeric
    */
    1003: 'No compatible node for the given key.',
    /**
    * No node for the given key.
    *
    * @private
    * @property exceptionCodes.1004
    * @type Numeric
    */
    1004: 'No node for the given key.',
    /**
    * Data node with different flags already exist.
    *
    * @private
    * @property exceptionCodes.1005
    * @type Numeric
    */
    1005: 'Data node with different flags already exist.',
    /**
    * Unable to set value on a structural node.
    *
    * @private
    * @property exceptionCodes.1006
    * @type Numeric
    */
    1006: 'Unable to set value on a structural node.',
    /**
    * Handshake cannot be restarted.
    *
    * @private
    * @property exceptionCodes.1007
    * @type Numeric
    */
    1007: 'Handshake cannot be restarted.',
    /**
    * Authorization handshake not active.
    *
    * @private
    * @property exceptionCodes.1008
    * @type Numeric
    */
    1008: 'Authorization handshake not active.',
    /**
    * Handshake no longer active.
    *
    * @private
    * @property exceptionCodes.1009
    * @type Numeric
    */
    1009: 'Handshake no longer active.',
    /**
    * Unable to add and set a sub-key for a data node.
    *
    * @private
    * @property exceptionCodes.1010
    * @type Numeric
    */
    1010: 'Unable to add and set a sub-key for a data node.',
    /**
    * Permission denied.
    *
    * @private
    * @property exceptionCodes.2001
    * @type Numeric
    */
    2001: 'Permission denied.',
    /**
    * Flags cannot be both Proxy and Stub'
    *
    * @private
    * @property exceptionCodes.3001
    * @type Numeric
    */
    3001: 'Flags cannot be both Proxy and Stub.',
    /**
    * Invalid Key, key not nullable.'
    *
    * @private
    * @property exceptionCodes.3002
    * @type Numeric
    */
    3002: 'Invalid Key, key not nullable.',
    /**
    * Invalid Key, key must be a string.
    *
    * @private
    * @property exceptionCodes.3003
    * @type Numeric
    */
    3003: 'Invalid Key, key must be a string.',
    /**
    *Invalid Key. Not multiple key accepted.
    *
    * @private
    * @property exceptionCodes.3004
    * @type Numeric
    */
    3004: 'Invalid Key. Not multiple key accepted.',
    /**
    * Invalid Key. Key cannot start/end with dot.
    *
    * @private
    * @property exceptionCodes.3005
    * @type Numeric
    */
    3005: 'Invalid Key. Key cannot start/end with a dot.',
    /**
    * Invalid Key, key cannot be an empty string.
    *
    * @private
    * @property exceptionCodes.3006
    * @type Numeric
    */
    3006: 'Invalid Key, key cannot be an empty string.',
    /**
    * Invalid flags.
    *
    * @private
    * @property exceptionCodes.3007
    * @type Numeric
    */
    3007: 'Invalid flags.',
    /**
      * Value not validated
      *
      * @private
      * @property exceptionCodes.3008
      * @type Numeric
      */
    3008: 'Value not validated.',
    /**
    * Flags of parent node is 'none', child node must have the same flags value
    *
    * @private
    * @property exceptionCodes.3009
    * @type Numeric
    */
    3009: 'Flags of parent node is \'none\', child node must have the same flags value.',
    /**
      * Converter function exception.
      *
      * @private
      * @property exceptionCodes.4001
      * @type Numeric
      */
    4001: 'Converter function exception.'
  }
};
SWAC.Exception.prototype.constructor = SWAC.Exception;

/**
   * Returns a string message for the exception
   *
   * @method toString
   * @return {string} Exception message
   */
SWAC.Exception.prototype.toString = function () {
    return this.message;
};

/**
 * Class that manages AccessViolationException message. 
 *
 * @class SWAC.AccessViolationException
 * @constructor
 * @param {Numeric} errorCode
 */
SWAC.AccessViolationException = function (errorCode) {
    SWAC.Exception.call(this, errorCode);
};

SWAC.AccessViolationException.prototype = new SWAC.Exception();

/**
 * Class that manages InvalidArgumentException message. 
 *
 * @class SWAC.InvalidArgumentException
 * @constructor
 * @param {Numeric} errorCode
 */
SWAC.InvalidArgumentException = function (errorCode) {
    SWAC.Exception.call(this, errorCode);
};

SWAC.InvalidArgumentException.prototype = new SWAC.Exception();

/**
 * Class that manages InternalException message. 
 *
 * @class SWAC.InternalException
 * @constructor
 * @param {Numeric} errorCode
 */
SWAC.InternalException = function (errorCode) {
  SWAC.Exception.call(this, errorCode);
};

SWAC.InternalException.prototype = new SWAC.Exception();


///////////////////////////////////////////
// lib/base/misc/extensions.js

SWAC._internal = {};

/**
* Class that provides IE8 compatibility functions
*
* @class SWAC._internal.Utils
* @constructor
* 
*/
SWAC._internal.Utils = (function () {
  /**
    * Get the array of property names of an object
    *
    * @private
    * @method getOwnPropertyNames
    * @param {Object} object The object to parse
    * @return {Array} array of property names of the object
    */
  var _getOwnPropertyNames = null;
  if (Object.getOwnPropertyNames) {
    _getOwnPropertyNames = function (obj) {
      return Object.getOwnPropertyNames(obj);
    };
  }
  else {
    _getOwnPropertyNames = function (obj) {
      var prop, result = [];
      if (typeof obj === 'object' || typeof obj === 'function') {
        for (prop in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }
      }
      return result;
    };
  }
  /**
    * Check if object is an array
    *
    * @private
    * @method isArray
    * @param {Object} arg The object to check
    * @return {Boolean} true if object is an array, false otherwise
    */
  var _isArray = null;
  if (Array.isArray) {
    _isArray = function (arg) {
      return Array.isArray(arg);
    };
  }
  else {
    _isArray = function (arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }
  /**
    * Get the index of the item inside the array
    *
    * @private
    * @method indexOf
    * @param {Array} that Array to check
    * @param {Object} obj Object to find
    * @param {Number} start Start index of research
    * @return {Number} Index of item found inside the array
    */
  var _indexOf = null;
  if (Array.indexOf) {
    _indexOf = function (that, obj, start) {
      return that.indexOf(obj, start);
    };
  }
  else {
    _indexOf = function (that, obj, start) {
      if (_isArray(that)) {
        for (var i = (start || 0), j = that.length; i < j; i++) {
          if (that[i] === obj) {
            return i;
          }
        }
      }
      return -1;
    };
  }
  /**
    * Regular Expression for trimming spaces 
    *
    * @private
    * @property trimRegex
    * @type RegEx
    */
  var _trimRegex = /^\s+|\s+$/g;
  return {
    getOwnPropertyNames: _getOwnPropertyNames,
    isArray: _isArray,
    indexOf: _indexOf,
    trimRegex: _trimRegex
  };
})();


///////////////////////////////////////////
// lib/base/misc/guid.js

/**
 * Class that generates a random GUID. 
 *
 * @class SWAC.Guid
 * @constructor
 * 
 */
SWAC.Guid = ( function () {

    //////////////
    // PRIVATE  //
    //////////////

    var
        /**
        * Generates a random 4-digit number. 
        *
        * @private
        * @method _s4
        * @return {String} Returns a 4-digit number
        */
        _s4 = function () {
            return ( ( ( 1 + Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 );
        },
        
        /**
        * Creates a valid GUID.
        *
        * @method guid
        * @return {String} Returns a valid GUID
        */
        _guid = function () {
            return ( _s4() + _s4() + '-' + _s4() + '-4' + _s4().substr( 0, 3 ) + '-' + _s4() + '-' + _s4() + _s4() + _s4() ).toLowerCase();
        };

    //////////////
    // PUBLIC   //
    //////////////

    return {
        generate: _guid
    };

}() );


///////////////////////////////////////////
// lib/base/event/eventing.js

SWAC.Eventing = (function () {
 
  /**
  * Class that manages event
  *
  * @class SWAC.Eventing.EventProxy
  * @constructor
  */
  var _eventProxy = function (subscribed) {
    var _subscribed = subscribed;
    return {
      /**
       * Method to subscribe to an event
       *
       * @method subscribe
       * @param {Function} callback Function to call when event is raised
       */
      subscribe: function (callBack) {
        _subscribed.push(callBack);
      },

      /**
      * Method to unsubscribe to an event
      *
      * @method unsubscribe
      * @param {Function} callback Function to remove from subscribe events list
      */
      unsubscribe: function (callBack) {
        var idCallB = SWAC._internal.Utils.indexOf(_subscribed, callBack);
        if (idCallB !== -1) {
          _subscribed.splice(idCallB, 1);
        }
      }
    };
  };

  /**
  * Class that manages event
  *
  * @class SWAC.Eventing.Publisher
  * @constructor
  * @param {String} eventName Event name
  */
  var _publisher = function (eventName) {
    var _subscribed = [];
    return {
      /**
      * Method to notify an event
      *
      * @method notify 
      * @param {Object} value Event data
      * @param {Boolean} async callback execution in sync/async mode
      */
      notify: function (value, async) {
        var localSub = _subscribed.slice(), i,
          caller = function (counter) {
            if (!value || value.type !== eventName || !value.data) {
              localSub[counter].call(null, { type: eventName, data: value });
            }
            else {
              localSub[counter].call(null, value);
            }
          },
          asyncCaller = function (counter) {
            setTimeout(function () { caller(counter); }, 0);
          };

        for (i = 0; i < localSub.length; i++) {
          try {
            if (async) {
              asyncCaller(i);
            }
            else {
              caller(i);
            }
          }
          catch (e) {
          }
        }
        return localSub.length;
      },

      /**
      * Object for managing eventProxy
      *
      * @property event
      */
      event: new SWAC.Eventing.EventProxy(_subscribed)
    };
  };

  // OBSOLETE

/**
* OBSOLETE Class that manages event
*
* @class SWAC.Eventing.EventEx
* @constructor
* 
*/
  var EventTarget = function () {
    this._listeners = {};
  };

  EventTarget.prototype = {

    constructor: EventTarget,

    /**
    * Adds a listener on event
    *
    * @method addListener
    * @param {String} type Name of event
    * @param {Function} listener Callback to add
    */
    addListener: function (type, listener) {
      if (typeof this._listeners[type] === 'undefined') {
        this._listeners[type] = [];
      }

      this._listeners[type].push(listener);
    },

    /**
    * Fires event
    *
    * @method fire
    * @param {Object|String} event Event object or event name
    * @param {Bool} async to execute callback in async or sync mode
    */
    fire: function (event, async) {
      var listeners,
      i = 0,
      len = 0;

      if (typeof event === 'string') {
        event = { type: event };
      }

      if (!event.type) {
        throw new Error('Event object missing \'type\' property.');
      }

      if (this._listeners[event.type] instanceof Array) {
        // Executes callbacks asyncronous
        listeners = this._listeners[event.type].slice();
        if (async) {

          var c = function (l) { l.call(this, event); };
          len = listeners.length;
          for (i = 0; i < len; i++) {
            setTimeout(c(listeners[i]), 0);
          }

        }
          // Execute callbacks syncronous
        else {
          len = listeners.length;
          for (i = 0; i < len; i++) {
            listeners[i].call(this, event);
          }
        }
      }

    },

    /**
    * Removes listener on event
    *
    * @method removeListener
    * @param {String} type Name of event
    * @param {Function} listener Callback to remove
    */
    removeListener: function (type, listener) {
      var listeners,
     i = 0,
      len = 0;

      if (this._listeners[type] instanceof Array) {
        listeners = this._listeners[type];
        len = listeners.length;
        for (i = 0; i < len; i++) {
          if (listeners[i] === listener) {
            listeners.splice(i, 1);
            break;
          }
        }
      }
    }
  };

  /**
  * OBSOLETE Class that manages event
  *
  * @class SWAC.Eventing.Event
  * @constructor
  * @param {String} name Event name
  */
  var SimpleEvent = function (name) {
    var _target = new EventTarget(),
        _name = name;

    return {
      /**
      * Fires the event
      *
      * @method fire
      * @param {Object} someData Event data
      * @param {Boolean} async to execute relative callback in async or sync mode
      */
      fire: function (someData, async) {
        var event = { type: _name, data: someData };
        _target.fire(event, async);
      },

      /**
      * Method to subscribe to an event
      *
      * @method subscribe
      * @param {Function} callback Function to call when event is raised
      */
      subscribe: function (callback) {
        _target.addListener(_name, callback);
      },

      /**
      * Method to unsubscribe to an event
      *
      * @method unsubscribe
      * @param {Function} callback Function to remove
      */
      unsubscribe: function (callback) {
        _target.removeListener(_name, callback);
      }
    };
  };

  return {
    Event: SimpleEvent,
    EventEx: EventTarget,
    Publisher: _publisher,
    EventProxy: _eventProxy
  };
}());


///////////////////////////////////////////
// lib/base/promise/defer.js

/**
* Create a SWAC Defer object 
*
* @class SWAC.Defer
* @constructor
* 
*/
SWAC.Defer = function () {
    this.promise = new SWAC.Promise();
};

SWAC.Defer.prototype = {
    /**
     * Invoking fulfill method of defer object causes execution of success callback function associated to its promise
     *
     * @method fulfill
     * @param {Object} value The object is passed like input parameter to success callback function of promise
     */
    fulfill: function ( value ) {
        var p = this.promise, bucket;
        if (p.status === 'pending') { //fixed state
            p.value = value;
            p.status = 'fulfilled';
            for (bucket = 0; bucket < p._internal.fulfilled.length; bucket++) {
                p._internal.executeCallback(p._internal.fulfilled[bucket].func, p._internal.fulfilled[bucket].defer, value, p.status);
            }
        }
    },

    /**
     * Invoking reject method of defer object causes execution of fail callback function associated to its promise
     *
     * @method reject
     * @param {Object} reason The object is passed like input parameter to fail callback function of promise
     */
    reject: function ( reason ) {
      var p = this.promise, bucket;
      if (p.status === 'pending') { //fixed state
          p.reason = reason;
          p.status = 'rejected';
          for (bucket = 0; bucket < p._internal.rejected.length; bucket++) {
              p._internal.executeCallback(p._internal.rejected[bucket].func, p._internal.rejected[bucket].defer, reason, p.status);
          }
      }
    },

    /**
     * Invoking bind method of defer object permits to chain the defer object with a promise
     *
     * @method bind
     * @param {Object} promise When success/fail callbacks of promise will be executed, defer will be fulfilled/rejected
     */
    bind: function (promise) {
      var _that = this;
      if ((promise) && (promise.then)) {
        promise.then(function (value) {
          _that.fulfill(value);
        }, function (reason) {
          _that.reject(reason);
        });
        return true;
      }
      else {
        return false;
      }
    }
};


///////////////////////////////////////////
// lib/base/promise/promise.js

/**
* Promise class
*
* @class SWAC.Promise
* @constructor
* 
*/
SWAC.Promise = function () {
  this._internal = {
    /**
   * Executes the callback function in case of fulfilling or rejecting the promise
   *
   * @protected
   * @method executeCallback
   * @param {Object} callback Callback function parameter
   * @param {Object} defer defer object
   * @param {Object} data Callback function data
   * @param {Object} status promise status
   */
    executeCallback: function (callback, defer, data, status) {
      var result = data;
      if (typeof callback === 'function') {
        setTimeout(function () {
          try {
            result = callback(data);
            if (status === 'fulfilled') {
              defer.fulfill(result);
            } else {
              defer.reject(result);
            }
          }
          catch (e) {
            defer.reject(e);
            return;  // reject chaining defer with exception
          }
        }, 0);
      }
      else {
        if (defer) {
          if (status === 'fulfilled') {
            defer.fulfill(result);
          } else {
            defer.reject(result);
          }
        }
      }
    },
    fulfilled: [],
    rejected: []
  };
};

/**
 * SWAC.Promise.all method accept an array of promise and return a promise rejected when one of the input promise is rejected or fufilled when all promise are fulfilled.
 *
 * @method all
 * @param {array} promises list of promise to be 'observed'
 * @return {object} an object defer.promise: success provide an array of all values of the input promises fulfilled, failure provide the first reason
 */
SWAC.Promise.all = function (promises) {
  var retDef = new SWAC.Defer(),
    i = 0,
    solver = null,
    counter = 0,
    retValues = [];

  if (SWAC._internal.Utils.isArray(promises) && promises.length > 0) {
    for (i = 0; i < promises.length ; i++) { // check content
      if (!(typeof promises[i] === 'object' || typeof promises[i] === 'function') && typeof promises[i].then !== 'function') {
        retDef.promise.reject(new SWAC.Reason(18000));
        return retDef.promise;
      }
    }

    solver = function (index) {
      var solved = false; // multiple call check

      promises[index].then(
          function (value) {
            if (retDef.promise.status !== 'pending' || solved) {
              return;
            }
            solved = true;
            counter++;
            retValues[index] = value;
            if (counter === promises.length) {
              retDef.fulfill(retValues);
            }
          },
          function (reason) {
            if (retDef.promise.status !== 'pending' || solved) {
              return;
            }
            solved = true;
            retDef.reject(reason);
          }
      );
    };

    for (i = 0; i < promises.length ; i++) { //check content
      solver(i);
    }
  }
  else {
    retDef.promise.reject(new SWAC.Reason(18001));
  }

  return retDef.promise;
};

SWAC.Promise.prototype = {

  /**
  * Get the status of a promise object.
  *
  * @property status
  * @type string
  */
  status: 'pending',

  /**
  * Reason of last rejected promise.
  *
  * @property reason
  * @type object
  */
  reason: null,

  /**
  * Last fulfilled value for the current promise.
  *
  * @property value
  * @type object
  */
  value: null,

  /**
   * Permits to execute async code when promise will be fulfilled or rejected
   *
   * @method then
   * @param {Function} onSuccess Called when the promise is fulfilled by defer.fulfill(value) invocation
   * @param {Function} onFailure Called when the promise is rejected by defer.reject(reason) invocation
   */
  then: function (onSuccess, onFailure) {
    var defer = new SWAC.Defer();

    // Add callbacks to the arrays with the defer binded to these callbacks
    this._internal.fulfilled.push({
      func: onSuccess,
      defer: defer
    });

    this._internal.rejected.push({
      func: onFailure,
      defer: defer
    });

    // Check if the promise is pending, otherwise execute callbacks.
    if (this.status === 'fulfilled') {
      this._internal.executeCallback(onSuccess, defer, this.value, this.status);
    } else if (this.status === 'rejected') {
      this._internal.executeCallback(onFailure, defer, this.reason, this.status);
    }

    return defer.promise;
  }
};


///////////////////////////////////////////
// lib/base/promise/reason.js

/**
 * Create a SWAC Reason object with a specific reason code. 
 *
 * @class SWAC.Reason
 * @constructor
 * 
 */
SWAC.Reason = function (errorCode) {
  var codeMsg = null;
  /**
 * Error code.
 *
 * @property errorCode
 * @type Numeric
 */
  if (isNaN(errorCode)) {
    this.errorCode = -1;
    this.message = errorCode;
  }
  else {
    this.reasonCode = errorCode;

    codeMsg = SWAC.Reason.prototype.errorCodes[errorCode];
    /**
     * Reason message.
     *
     * @property message
     * @type String
     */
    this.message = '';
    if (codeMsg !== null && codeMsg !== undefined) {
      this.message = codeMsg;
    }
  }
};

SWAC.Reason.prototype = {

  /**
* Object that manages reason codes. 
*
* @private
* @property errorCodes
* @type Object 
*/
  errorCodes : {
    /**
     * Handshake time-out expired. (SWAC.Config.TimeOuts.Authentication.Handshake)
     *
     * @private
     * @property _errorCode.10001
     * @type Numeric
     */
    10001: 'Handshake time-out expired. (SWAC.Config.TimeOuts.Authentication.Handshake)',
    /**
     * Time-out expired. (SWAC.Config.TimeOuts.Internal)
     *
     * @private
     * @property errorCodes.11001
     * @type Numeric
     */
    11001: 'Time-out expired. (SWAC.Config.TimeOuts.Internal)',
    /**
     * Time-out expired. (SWAC.Config.TimeOuts.Proxy.Functions)
     *
     * @private
     * @property errorCodes.11002
     * @type Numeric
     */
    11002: 'Time-out expired. (SWAC.Config.TimeOuts.Proxy.Functions)',
    /**
     * Time-out expired. (SWAC.Config.TimeOuts.Remove)
     *
     * @private
     * @property errorCodes.11004
     * @type Numeric
     */
    11004: 'Time-out expired. (SWAC.Config.TimeOuts.Remove)',
    /**
     * Time-out expired. (SWAC.Config.TimeOuts.CleanUp)
     *
     * @private
     * @property errorCodes.11005
     * @type Numeric
     */
    11005: 'Time-out expired. (SWAC.Config.TimeOuts.CleanUp)',
    /**
     * Unhandled time-out expired.
     *
     * @private
     * @property errorCodes.11006
     * @type Numeric
     */
    11006: 'Unhandled time-out expired.',
    /**
     * Invalid target.
     *
     * @private
     * @property errorCodes.11007
     * @type Numeric
     */
    11007: 'Invalid target.',
    /**
     * Result message rejected.
     *
     * @private
     * @property errorCodes.11008
     * @type Numeric
     */
    11008: 'Result message rejected.',
    /**
    * Container unreachable.
    *
    * @private
    * @property errorCodes.11011
    * @type Numeric
    */
    11011: 'Container unreachable.',
    /**
    * Component not found.
    *
    * @private
    * @property errorCodes.11013
    * @type Numeric
    */
    11013: 'Component not found.',
    /**
      * Error creating Iframe.
      *
      * @private
      * @property errorCodes.11014
      * @type Numeric
      */
    11014: 'Error creating Iframe.',
    /**
    * Service not found.
    *
    * @private
    * @property errorCodes.12001
    * @type Numeric
    */
    12001: 'Service not found.',
    /**
     * Invalid Component.
     *
     * @private
     * @property errorCodes.13001
     * @type Numeric
     */
    13001: 'Invalid Component.',
    /**
     * Component needs to be UI.
     *
     * @private
     * @property errorCodes.13002
     * @type Numeric
     */
    13002: 'Component needs to be UI.',
    /**
    * Error creating Iframe.
    *
    * @private
    * @property errorCodes.13005
    * @type Numeric
    */
    13005: 'Error creating Iframe.',
    /**
    * Error during component/s creation.
    *
    * @private
    * @property errorCodes.13006
    * @type Numeric
    */
    13006: 'Error during component/s creation.',
    /**
    * Time-out expired during IFrame creation. (SWAC.Config.TimeOuts.Create)
    *
    * @private
    * @property errorCodes.13007
    * @type Numeric
    */
    13007: 'Time-out expired during IFrame creation. (SWAC.Config.TimeOuts.Create)',
    /**
    * Container.create: Wrong argument(s).
    *
    * @private
    * @property errorCodes.13008
    * @type Numeric
    */
    13008: 'Container.create: Wrong argument(s).',
    /**
    * Aborted by the user.
    *
    * @private
    * @property errorCodes.13009
    * @type Numeric
    */
    13009: 'Aborted by the user.',
    /**
   * Component has been discarded.
   *
   * @private
   * @property errorCodes.13010
   * @type Numeric
   */
    13010: 'Component has been discarded.',
    /**
   * Time-out expired. (beginClose Time-out)
   *
   * @private
   * @property errorCodes.13011
   * @type Numeric
   */
    13011: 'Time-out expired. (beginClose Time-out)',
    /**
      * method not supported.
      *
      * @private
      * @property errorCodes.13014
      * @type Numeric
      */
    13014: 'Method not supported.',
    /**
      * Specified component/s does/do not exist.
      *
      * @private
      * @property errorCodes.13015
      * @type Numeric
      */
    13015: 'Specified component/s does/do not exist.',
    /**
   * Interface not found.
   *
   * @private
   * @property errorCodes.14001
   * @type Numeric
   */
    14001: 'Interface not found.',
    /**
     * Parameter timeout is not a number.
     *
     * @private
     * @property errorCodes.15001
     * @type Numeric
     */
    15001: 'Parameter timeout is not a number.',
    /**
     * Dual boot detected. Component has been removed.
     *
     * @private
     * @property errorCodes.15004
     * @type Numeric
     */
    15004: 'Dual boot detected. Component has been removed.',
    /**
     * Component integrity is compromised. Component has been removed.
     *
     * @private
     * @property errorCodes.15005
     * @type Numeric
     */
    15005: 'Component integrity is compromised. Component has been removed.',
    /**
     * Event management is not supported.
     *
     * @private
     * @property errorCodes.16001
     * @type Numeric
     */
    16001: 'Event management is not supported.',
    /**
     * Event is not supported.
     *
     * @private
     * @property errorCodes.16002
     * @type Numeric
     */
    16002: 'Event is not supported.',
    /**
        * Value not validated
        *
        * @private
        * @property errorCodes.17000
        * @type Numeric
        */
    17000: 'Value not validated.',
    /**
        * Permission denied.
        *
        * @private
        * @property errorCodes.17001
        * @type Numeric
        */
    17001: 'Permission denied.',
    /**
        * Corresponding node does no longer exist.
        *
        * @private
        * @property errorCodes.17002
        * @type Numeric
        */
    17002: 'Corresponding node does no longer exist.',
    /**
        * Unable to add and set a sub-key for a data node.
        *
        * @private
        * @property errorCodes.17003
        * @type Numeric
        */
    17003: 'Unable to add and set a sub-key for a data node.',
    /**
        * Unable to set value on a structural node.
        *
        * @private
        * @property errorCodes.17004
        * @type Numeric
        */
    17004: 'Unable to set value on a structural node.',
    /**
        * Internal error.
        *
        * @private
        * @property errorCodes.17005
        * @type Numeric
        */
    17005: 'Internal error.',
    /**
        * Corresponding node does not exist.
        *
        * @private
        * @property errorCodes.17006
        * @type Numeric
        */
    17006: 'Corresponding node does not exist.',
    /**
        * Wrong parameter, all array elements should be thenable.
        *
        * @private
        * @property errorCodes.18000
        * @type Numeric
        */
    18000: 'Wrong parameter, all array elements should be thenable.',
    /**
        * Wrong parameter, method parameter must be an array with at least one thenable.
        *
        * @private
        * @property errorCodes.18001
        * @type Numeric
        */
    18001: 'Wrong parameter, method parameter must be an array with at least one thenable.'
  }
};

/**
   * Return reason message
   *
   * @method toString
   * @return {string} Reason message
   */
SWAC.Reason.prototype.toString = function () {
  return this.message;
};


///////////////////////////////////////////
// lib/base/communication/authentication.js

/**
 * SWAC.Authentication permits to write custom authentication method that'll be used when container creates component
 *
 * @class SWAC.Authentication
 * @constructor
 * @param {String} peer component's name
 */
SWAC.Authentication = function (peer) {

  //////////////
  // PRIVATE  //
  //////////////

  var
      _onFailure = new SWAC.Eventing.Publisher('onFailure'),
      _onSuccess = new SWAC.Eventing.Publisher('onSuccess'),

      _that = this,

      /**
       * Get generated Guid for session
       *
       * @protected
       * @method session
       * @return {string} session Guid
       */
      _session = SWAC.Guid.generate(),

      // in container: component's name
      // otherwise null
      _peer = peer,
      _containerDomain = '',

      _defer = null,

      _tlsMessageHandler = null,

      /**
       * Check if it is authenticated
       *
       * @method isAuthenticated
       * @return {boolean} true or false
       */
      _isAuthenticated = function () {
        return (_defer !== null && _defer.promise.status === 'fulfilled') ? true : false;
      },

      /**
       * Checks if handshake is possible, if it is not possible a SWAC.Exception is throw
       *
       * @private 
       * @method _ensureHandshake
       */
      _ensureHandshake = function () {
        if (_defer === null || _tlsMessageHandler === null) {
          throw new SWAC.Exception(1008);
        } else if (_defer && (_defer.promise.status !== 'pending' && _defer.promise.status !== 'fulfilled')) {
          throw new SWAC.Exception(1009);
        }
      },

       /**
       * Send a message
       *
       * @method sendMessage
       * @param {Object} message message to send
       */
      _sendMessage = function (message) {
        _ensureHandshake();
        SWAC.Communication._internal.call(_peer, 'tlsMessage', [message]);
      },

      /**
       * Begins the handshake between container and component
       *
       * @protected
       * @method _beginHandshake
       * @param {Function} tlsHandler callback with two param: message and authentication instance
       * @param {String} tlsMessage message 
       * @param {Number} timeout timeout of handshaking
       * @return {object} returns a promise.
       */
      _beginHandshake = function (tlsHandler, tlsMessage, timeout) {
        if (_defer) {
          throw new SWAC.Exception(1007);
        }
        _defer = new SWAC.Defer();

        window.setTimeout(
            function () {
              if (_defer && _defer.promise.status === 'pending') {
                _defer.reject(new SWAC.Reason(10001));
              }
            },
            timeout || SWAC.Config.TimeOuts.Authentication.Handshake);

        _tlsMessageHandler = tlsHandler;
        if (tlsMessage) { // hub initiated authentication
          _sendMessage(tlsMessage);
        }

        return _defer.promise;
      },

      /**
       * Authentication is accepted
       * Note: Accept should be called by component/container implementation before TLS end-handshake message is sent
       *
       * @method accept
       */
      _accept = function () {
        _ensureHandshake();
        _defer.fulfill();
        _onSuccess.notify({});
      },

      /**
       * Authentication is rejected. Event onFailure is fired.
       *
       * @method reject
       * @param {Object} reason reason of authentication failure
       */
      _reject = function (reason) {
        _ensureHandshake();
        _defer.reject(reason);
        _onFailure.notify({});
      },

       /**
       * Receive a message
       *
       * @protected
       * @method _receiveMessage
       * @param {Object} message message to receive
       */
      _receiveMessage = function (message) {
        try {
          _ensureHandshake();
          _tlsMessageHandler(message, _that);
        } catch (ex) {
        }
      },
      /**
       * Return domain of container or component
       *
       * @method getDomain
       * @return {string} returns domain
       */
      _getDomain = function () {
        var res = '',
        comp,
        regExpr,
        protocol,
        host,
        port;

        if (_peer === null) {
          //component side
          res = _containerDomain; //document.referrer;
        }
        else {
          //container side
          comp = SWAC.Container.get({ name: _peer });
          if (comp && !comp.promise) {
            res = comp._internal.getCurrentUrl();
          }
        }
        if ((res !== '') && (res !== null) && (res !== undefined)) {
          regExpr = new RegExp(/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/);
          res = regExpr.exec(res);
          regExpr = null;
          protocol = res[1];

          if (protocol === 'file') {
            res = res[10];
          }
          else {
            host = res[6];
            port = res[7];
            if ((port === '') || (port === null) || (port === undefined)) {
              res = host;
            } else {
              res = host + ':' + port;
            }
          }
        }
        return res;
      },
      /**
       * set domain of container or component
       *
       * @protected
       * @method setDomain
       * @param {string} containerDomain domain
       */
      _setDomain = function (containerDomain) {
        _containerDomain = containerDomain;
      };

  //////////////
  // PUBLIC   //
  //////////////

  // API
  this.accept = _accept;
  this.reject = _reject;
  this.sendMessage = _sendMessage;
  this.isAuthenticated = _isAuthenticated;
  this.getDomain = _getDomain;

  // EVENTS
  //See comments on _accept and _reject above

  /**
   * Fired when authentication is failed
   *
   * @event onFailure
   */
  this.onFailure = _onFailure.event;

  /**
   * Fired when authentication is succeeded
   *
   * @event onSuccess
   */
  this.onSuccess = _onSuccess.event;

  // INTERNAL, DO NOT USE
  this._internal = {
    receiveMessage: _receiveMessage,
    beginHandshake: _beginHandshake,
    setDomain: _setDomain,
    session: _session
  };
};


///////////////////////////////////////////
// lib/base/communication/communication.js

/**
 * Communication object for SWAC components
 *
 * @class SWAC.Communication
 * @constructor
 */
SWAC.Communication = (function () {

  //////////////
  // PRIVATE  //
  //////////////

  var
      // List of all callbacks (as promises), to be identified by generated GUID.
      _callbacks = {},

      _exposedHub = null,

       /**
       * Checks if the source (a window object) is a component otherwise it is the container.
       *
       * @private
       * @method _isSourceComponent
       * @param {Object} source a window object
       * @return {boolean} true if it is a window otherwise false
       */
      _isSourceComponent = function (source) {
        // If the source was the parent object, it must have been a container.
        if (source === window.parent) {
          return false;
        }
        return true;
      },

       /**
       * Return if object is a window
       *
       * @private
       * @method _isWindow
       * @param {object} obj object to analyze if it is a window
       * @return {boolean} true if it is a window otherwise false
       */
      _isWindow = function (obj) {
        if (typeof (window.constructor) === 'undefined') {
          return obj instanceof window.constructor;
        } else {
          return obj.window === obj;
        }
      },

      /**
       * Creates a boot message
       *
       * @private
       * @method _createMessage
       * @param {string} msgType type of the message
       * @param {object} content content of the message
       * @return {string} a string in JSON format containig messagetype and content. 
       */
      _createMessage = function (msgType, content) {
        return JSON.stringify({ t: msgType, c: content });
      },

       /**
      * SWAC Communication postMessage
      *
      * @private
      * @method _postMessage
      * @param {object} wnd Required. Win target
      * @param {string} message Required. String that specifies the message. 
      * @param {string} targetOrigin Required. String that specifies the URI (scheme, hostname and port) of the target document's location 
      */
        _postMessage = function (wnd, message, targetOrigin) {
          if (!wnd.closed) {
            wnd.postMessage(message, targetOrigin);
          }
        },

       /**
       * Handles the handshake and bootstrapping messages.
       *
       * @private
       * @method _handleBootMessage
       * @param {object} source source window of the message
       * @param {object} content content of the message
       * @param {String} origin origin of the message
       */
      _handleBootMessage = function (source, content, origin) {
        var component,
          libconfig,
          liburl,
          auth,
          cmpnt,
          iframe,
          theMsg,
          i;

        switch (content.message) {
          case 'ping':
            component = SWAC.Container._internal.identify(source);
            if (!component) {   // component has been removed
              break;
            }
            libconfig = SWAC.Config.Container.URLs.BaseLibrary;
            liburl = typeof libconfig === 'function' ? libconfig(content.version) : libconfig;
            liburl = liburl.replace(SWAC._internal.Utils.trimRegex, '');
            auth = SWAC.Config.Container.Authentication.TlsHandler ? SWAC.Config.Container.Authentication.Request ? 'req' : 'can' : 'no';
            component.lastUrl = origin;

            if (content.attributes) {
              component.attributes = content.attributes;
            }

            if ((content.authentication === 'req' && auth === 'no') || (typeof liburl !== 'string')) {
              theMsg = {
                message: 'peng',
                reason: (auth === 'no') ? 'Authentication not supported' : 'No appropriate SWAC library'
              };
              _postMessage(source, _createMessage('boot', theMsg), '*');
              SWAC.Container._internal.discard(source);
            } else {
              component.authentication = content.authentication === 'req';
              theMsg = {
                message: 'pong',
                url: liburl,
                name: component.name,
                type: component.type,
                authentication: (content.authentication === 'req') ? 'can' : auth,
                containerVersion: SWAC.version,
                namespace: 'SWAC',
                _internal: {}
              };

              if (content.extensions && SWAC.Config.Extensions) {
                for (i = 0; i < content.extensions.length; i++) {
                  theMsg.extensions = theMsg.extensions || [];
                  if (SWAC.Config.Extensions[content.extensions[i]]) {
                    theMsg.extensions.push(SWAC.Config.Extensions[content.extensions[i]]);
                  }
                }
              }

              if (content.attributes && content.attributes.control) {
                liburl = SWAC.Config.Container.URLs.ControlLibrary;
                liburl = liburl.replace(SWAC._internal.Utils.trimRegex, '');
                theMsg.extensions = theMsg.extensions || [];
                theMsg.extensions.unshift(liburl);
              }

              _postMessage(source, _createMessage('boot', theMsg), '*');
            }
            break;

          case 'ok':
            if (SWAC.Container._internal.accept(source)) {
              // Call is synchronous, public component will be created afterwards
              theMsg = { 
                message: 'ok2', 
                name: SWAC.Container._internal.identify(source).name() 
              };
              _postMessage(source, _createMessage('boot', theMsg), '*');
            }
            else {
              cmpnt = SWAC.Container._internal.identify(source);
              iframe = (cmpnt instanceof SWAC.Component) ? cmpnt._internal.iframe : cmpnt.iframe;
              SWAC.Container._internal.remove(SWAC.Container._internal.identify(source).name(), iframe, new SWAC.Reason(15004));
              iframe = null;
            }
            break;
          case 'failed':
            SWAC.Container._internal.discard(source);
            break;
          case 'pong':
            break;
          case 'ok2':
            break;
          default:
        }
      },

       /**
       * Sends a postmessage to the target window for notifying the result of a call
       *
       * @private
       * @method _acknowledgeCall
       * @param {object} targetWnd Window to send the post message of acknowledge
       * @param {string} guid guid of the message
       * @param {Boolean} hasError boolean that indicates if the call was success or not
       * @param {object} value value of the message
       */
      _acknowledgeCall = function (targetWnd, guid, hasError, value) {
        if (hasError) {
          if (targetWnd) {
            try {
              if ((value instanceof SWAC.Reason) && (value.reasonCode === 17000)) {   // DPC new value has been rejected
                _postMessage(targetWnd, _createMessage('msg', { t: 'result', g: guid, v: value, s: 1, e: 0 }), '*');
              }
              else {
                _postMessage(targetWnd, _createMessage('msg', { t: 'result', g: guid, e: 1 }), '*');
              }
            }
            catch (e) {
            }
          }
          return;
        }
        if ((value !== null) && (typeof value === 'object') && (typeof value['then'] === 'function')) {
          // This is a promise, do not return a result, but prolong call
          if (targetWnd) {
            if (!value.noProlong) {
              _postMessage(targetWnd, _createMessage('msg', { t: 'prolong', g: guid }), '*');
            }
          }
          value.then(
              function (value) {
                if (targetWnd) {
                  _postMessage(targetWnd, _createMessage('msg', { t: 'result', g: guid, v: value, s: 0, e: 0 }), '*'); // s=0 -> fulfilled
                }
              },
              function (reason) {
                if (targetWnd) {
                  _postMessage(targetWnd, _createMessage('msg', { t: 'result', g: guid, v: reason, s: 1, e: 0 }), '*'); // s=1 -> rejected
                }
              });
        }
        else // Plain Old JavaScript Object
        {
          if (targetWnd) {
            _postMessage(targetWnd, _createMessage('msg', { t: 'result', g: guid, v: value, e: 0 }), '*');
          }
        }
      },

       /**
       * Handles internal messages (between container and components), no proxy calls.
       *
       * @private
       * @method _handleInternalMessage
       * @param {String} source source of the message
       * @param {object} content content of the message
       * @param {String} origin orgin of the message
       */
      _handleInternalMessage = function (source, content, origin) {
        var guid = content.g,
            mybag = null,
            bag = null,
            value = null,
            com = null,
            createHandler = function (hasError) {
              return function (valReason) {
                if (typeof guid === 'string') {
                  _acknowledgeCall(source, guid, hasError, valReason);
                }
              };
            };
        if (_isSourceComponent(source)) {
          com = SWAC.Container._internal.identify(source);
          if ((com) && (!com.promise)) {
            com._internal.setCurrentUrl(origin);
          }
        }
        else {
          if (_exposedHub) {
            _exposedHub._internal.setDomain(origin);
          }
        }

        switch (content.t) {
          case 'call':
            if (_isSourceComponent(source)) {
              com = SWAC.Container._internal.identify(source);
              if (com && com._internal[content.m]) {
                value = com._internal[content.m].apply(com, content.a);
                createHandler(false)(value);
              } else {
                createHandler(true)(null);
              }
            }
            else {
              if (_exposedHub && _exposedHub._internal[content.m]) {
                value = _exposedHub._internal[content.m].apply(_exposedHub, content.a);
                createHandler(false)(value);
              } else {
                createHandler(true)(null);
              }
            }
            break;
          case 'begin':
            if (_isSourceComponent(source)) {
              com = SWAC.Container._internal.identify(source);
              if (com && com._internal[content.m]) {
                com._internal[content.m].apply(com, content.a).then(
                    createHandler(false), createHandler(true));
              } else {
                createHandler(true)(null);
              }
            }
            else {
              if (_exposedHub && _exposedHub._internal[content.m]) {
                _exposedHub._internal[content.m].apply(_exposedHub, content.a).then(
                     createHandler(false), createHandler(true));
              } else {
                createHandler(true)(null);
              }
            }
            break;
          case 'prolong':
            // The method on the other side returned a promise instead of a value; kill timer, because value/reason will be handled async and is not limited by the time-out.
            mybag = _callbacks[guid];
            if (mybag) {
              mybag.prolonged = true; // is not subject to time-out
              window.clearTimeout(mybag.timer);
            }
            break;
          case 'result':
            // Resolve callback (promise) from array and fire it.
            bag = _callbacks[guid];
            if (bag) {
              bag.handled = true;
              window.clearTimeout(bag.timer);
              if (content.e) {
                bag.promise.reject(new SWAC.Reason(11008));
              } else if (content.s) {
                bag.promise.reject(content.v);
              } else {
                bag.promise.fulfill(content.v);
              }
            }
            delete _callbacks[guid];
            break;
          default:
        }
      },

       /**
       * Maps incoming messages to corresponding handlers.
       *
       * @private
       * @method _receiveMessage
       * @param {object} event received event to manage
       */
       _receiveMessage = function (event) {
         if ((typeof (event.data) === 'string') && (event.data.length > 0)) {
           var data = {};
           try {
             data = JSON.parse(event.data);
             if (!data || !data.t || !data.c) {
               throw new Error('Incompatible message received');
             }
             else if (data.t !== 'boot' && data.t !== 'msg') {
               throw new Error('Unknown message received: ' + data.t);
             }
           }
           catch (e) {
             return;
           }
           switch (data.t) {
             case 'boot': // INITIAL HAND-SHAKE
               _handleBootMessage(event.source, data.c, event.origin);
               break;
             case 'msg': // INTERNAL MESSAGES
               _handleInternalMessage(event.source, data.c, event.origin);
               break;
           }
         }
       },

      /**
       * Method for identifying the target
       *
       * @private
       * @method _identifyTarget
       * @param {Object} to Identification target. Can be a window or a component's name
       * @return {object} the window of the target 
       */
      _identifyTarget = function (to) {
        var target, iFrame;

        if (to === null || to === '' || to === undefined) {
          return window.parent;
        } else if (_isWindow(to)) {
          return to;
        } else if (SWAC.Container) {
          iFrame = document.getElementsByName(to)[0];
          if (iFrame) {
            target = SWAC.Container.get({ name: to });
            if (target instanceof SWAC.Component) {
              return target._internal.iframe.contentWindow;
            }
          }
          else {
            SWAC.Container._internal.fireOnFailure(to, 'integrityCheck', 'Component integrity is compromised', false);
            SWAC.Container._internal.remove(to, null, new SWAC.Reason(15005));
            return null;
          }
        }
        return null;
      },

       /**
       * Method for creating postmessage
       *
       * @protected
       * @method call
       * @param {object} to Identification target
       * @param {String} method Method to call
       * @param {object} args Arguments of the call
       */
      _callAndForget = function (to, method, args) {
        var targetWnd = _identifyTarget(to),
        msg;
        // Only start postMessage and timer if there is an apropriate target component.
        if (targetWnd) {
          msg = _createMessage('msg', { t: 'call', m: method, a: args });
          _postMessage(targetWnd, msg, '*');
        }
      },

       /**
       *Auxiliary method that manages calls.
       *
       * @protected
       * @method beginCall
       * @param {Object} to Identification target
       * @param {Number} timeout Timeout of the request
       * @param {string} method Method to call
       * @param {object} args Arguments of the call
       * @param {Boolean} async Async call or not
       * @return {object} an object defer.promise
       */
      _beginCall = function (to, timeout, method, args, async) { // async = returns a promise
        var guid = SWAC.Guid.generate(),
            defer = new SWAC.Defer(),
            targetWnd = _identifyTarget(to),
            t,
            res = 0,
            bag = {},
            msg;

        // Ensure (probably not set) async argument gets turned into a real boolean.
        async = async === true;

        // Only start postMessage and timer if there is an apropriate target component.
        if (targetWnd) {
          // Handles the time-out only (rejecting the promise)
          t = function () {
            res = setTimeout(function () {
              if (!bag.handled && !bag.prolonged) {
                switch (method) {
                  case 'beginExpose':
                  case 'show':
                  case 'position':
                  case 'ready':
                  case 'bind':
                  case 'beginRequestService':
                  case 'beginRequestInterface':
                  case 'dpcGet':
                  case 'dpcSet':
                    defer.reject(new SWAC.Reason(11001));
                    break;
                  case 'callService':
                  case 'call':
                    defer.reject(new SWAC.Reason(11002));
                    break;
                  case 'remove':
                    defer.reject(new SWAC.Reason(11004));
                    break;
                  case 'cleanUp':
                    defer.reject(new SWAC.Reason(11005));
                    break;
                  default:
                    defer.reject(new SWAC.Reason(11006));
                    break;
                }
              }
              delete _callbacks[guid];
            }, timeout);
            return res;
          };
          bag = {
            guid: guid,
            promise: defer,
            handled: false,
            prolonged: false,
            timer: t()
          };

          // Adds the callback information with the timer within the object.
          _callbacks[guid] = bag;

          msg = _createMessage('msg', { t: async ? 'begin' : 'call', g: guid, m: method, a: args });
          _postMessage(targetWnd, msg, '*');
        }
        else {
          defer.reject(new SWAC.Reason(11007));
        }

        return defer.promise;
      },

       // Fire and forget
       /**
       * Method that fires an event
       *
       * @protected
       * @method fire
       * @param {object} target Event receiver
       * @param {Number} evtname name of the event
       * @param {Number} evtobject object contained in the event
       * @param {object} inf interface object)
       */
      _fireEvent = function (target, evtname, evtobject, inf) {
        _callAndForget(target, 'fire', [evtname, evtobject, inf]);
      },

      // Fire and forget
      /**
       * Method that fires changing of dpc value
       *
       * @protected
       * @method dpcChanged
       * @param {String} to Identification target
       * @param {String} key name of the dpc key
       * @param {String} type dpc type
       * @param {Object} content content of the event
       */
      _dpcChanged = function (to, key, type, content) {
        _callAndForget(to, 'dpcChanged', [key, type, content]);
      },

      /**
       * Asyncronous method of get dpc value
       *
       * @protected
       * @method beginDpcGet
       * @param {Object} to Identification target
       * @param {String} key name of the dpc key
       * @return {object} promise object
       */
      _beginDpcGet = function (to, key) {
        return _beginCall(to, SWAC.Config.TimeOuts.Internal, 'dpcGet', [key]);
      },

      /**
       * Asyncronous method of set dpc value
       *
       * @protected
       * @method beginDpcSet
       * @param {Object} to Identification target
       * @param {String} key name of the dpc key
       * @param {String} type type of the dpc key
       * @param {Object} content value of the dpc key
       * @return {object} promise object
       */
      _beginDpcSet = function (to, key, type, content) {
        return _beginCall(to, SWAC.Config.TimeOuts.Internal, 'dpcSet', [key, type, content], true);
      },

      /**
       * Components have to associate a hub during exposure
       *
       * @protected
       * @method associateHub
       * @param {object} hub hub to associate
       */
      _associateHub = function (hub) {
        _exposedHub = hub;
      },

       /**
       * Always listen for messages in case of the container. For components the bootloader explicitely switchs communication to this modules.
       *
       * @protected
       * @method activate
       */
      _activate = function () {
        if (window.addEventListener) {
          window.addEventListener('message', _receiveMessage, false);
          window.addEventListener('unload', function () {
            window.removeEventListener('message', _receiveMessage);
          });
        }
        else {
          window.attachEvent('onmessage', _receiveMessage);
          window.attachEvent('onunload', function () {
            window.detachEvent('onmessage', _receiveMessage);
          });
        }
      };

  //////////////
  // INIT     //
  //////////////

  (function () {
    // Always listen for messages in case of the container. For components the bootloader explicitely switchs communication to this modules.
    _activate();
  }());

  //////////////
  // PUBLIC   //
  //////////////

  return {

    // API

    // No public API, this module must be used by SWAC framework only.

    // INTERNAL, DO NOT USE
    _internal: {
      beginCall: _beginCall,
      call: _callAndForget,
      fire: _fireEvent,
      dpcChanged: _dpcChanged,
      beginDpcGet: _beginDpcGet,
      beginDpcSet: _beginDpcSet,
      associateHub: _associateHub,
      activate: _activate
    }
  };
}());


///////////////////////////////////////////
// lib/base/communication/hub.js

/**
 * Hub object for SWAC components
 *
 * @class SWAC.Hub
 * @constructor
 * @param {object} original public interface of component that exposes methods and events
 */
SWAC.Hub = function (original) {

  //////////////
  // PRIVATE  //
  //////////////

  if (typeof SWAC.Hub.instance === 'object') {
    // Only one instance of SWAC.Hub is allowed
    throw new SWAC.Exception(1000);
  }

  var
      _onInterfaceActivated = new SWAC.Eventing.Publisher('onInterfaceActivated'),
      _onReady = new SWAC.Eventing.Publisher('onReady'),
      _onRemove = new SWAC.Eventing.Publisher('onRemove'),
      _onVisible = new SWAC.Eventing.Publisher('onVisible'),
      _onPosition = new SWAC.Eventing.Publisher('onPosition'),
      _onCleanUp = new SWAC.Eventing.Publisher('onCleanUp'),

      _api = {},

      _events = [],

      // this is the DPC accessor the hub is working on. (Won't result in forwarding towards container, avoiding loop)
      _privateDpc = null,

      _rootNode = null,
      _publicNode = null,

      _id = SWAC.Guid.generate(),

      _innerComponent = original,

      _activeInterfaces = [],

      _containerServices = [],

      // list of event requested by the parent when the component is a mixed one
      _requestedEvents = [],

      _cachedServices = {},
      _cachedEventPublisher = {},

      _authentication = new SWAC.Authentication(null),

      /**
       * Extracts Methods with params from the object
       *
       * @private
       * @method _reflectArguments
       * @param {Object} fn object containig function of the component
       * @return {Object} object containing the list of Methods 
       */
      _reflectArguments = function (fn) {
        // This method is based on Angular's Injector
        // See: https://github.com/angular/angular.js/blob/master/src/auto/injector.js
        // License: MIT
        var regExArgs = /^function\s*[^\(]*\(\s*([^\)]*)\)/m,
          regExSplitter = /,/,
          regExArg = /^\s*(_?)(\S+?)\1\s*$/,
          regExStripComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
          args = [],
          fnText = fn.toString().replace(regExStripComments, ''),
          argDecl = fnText.match(regExArgs),
          a = 0,
          arg = [],
          r = argDecl[1].split(regExSplitter),
          repl = function (all, underscore, name) {
            args.push(name);
          };

        for (a = 0; a < r.length; a++) {
          arg = r[a];
          arg.replace(regExArg, repl);
        }

        regExArgs = null;
        regExSplitter = null;
        regExArg = null;
        regExStripComments = null;

        return args;
      },

       /**
       * Handler of event
       *
       * @private
       * @method _handler
       * @param {String} eventName Name of the event
       * @param {object} inf interface object
       * @return {function} Returns a function that fires the event
       */
      _handler = function (eventName, inf) {
        return function (event) {
          if (inf && (SWAC._internal.Utils.indexOf(_activeInterfaces, inf) < 0)) {
            return;
          }
          SWAC.Communication._internal.fire(null, eventName, event, inf);
        };
      },

      /**
       * Check if DPC structure is valid
       *
       * @private
       * @method _checkDpcStructure
       * @param {Object} element item in DPC structure
       * @return {Boolean} true if DPC structure is valid otherwise false
       */
      _checkDpcStructure = function (element) {
        var blnRetVal = false;

        if (typeof element === 'object') {
          if (typeof element.key === 'string') {
            blnRetVal = true;
          }
        }

        return blnRetVal;
      },

       /**
       * Bind of DPC: creation of node.
       *
       * @protected
       * @method _bind
       */
      _bind = function () {
        var def = _innerComponent.dpc, // dpc-property is used by convention
            structure,
            element,
            i = 0,
            flags;
        _privateDpc.root.add('private', SWAC.DPC.Permissions.Read);
        _publicNode = new SWAC.DPC.Node(_rootNode, _id, SWAC.DPC.Permissions.Read | SWAC.DPC.Permissions.Write | SWAC.DPC._internal.Flags.Stub, 'public', true);

        this.DPC = _rootNode.open('public').access(_id);
        this.status = _rootNode.open('private').access();

        if (def) {
          structure = def.structure;

          if (structure && SWAC._internal.Utils.isArray(structure)) { // Initial structure is optional
            for (i = 0; i < structure.length; i++) {
              element = structure[i];
              if (_checkDpcStructure(element)) {
                flags = SWAC.DPC.Permissions.Read | SWAC.DPC.Permissions.Write;
                if (typeof element.flags === 'string') {
                  if (element.flags.toLowerCase() === 'none') {
                    flags = SWAC.DPC.Permissions.None;
                  }
                  else if ((element.flags.toLowerCase().indexOf('rw') === -1) && (element.flags.toLowerCase().indexOf('wr') === -1)) {
                    if (element.flags.toLowerCase().indexOf('r') !== -1) {
                      flags = SWAC.DPC.Permissions.Read;
                    }
                    if (element.flags.toLowerCase().indexOf('w') !== -1) {
                      flags = SWAC.DPC.Permissions.Write;
                    }
                  }
                }

                try {
                  if (element.value !== undefined) {
                    // Create a data node
                    _privateDpc.root.open('public').set(element.key, element.value, element.type, flags);
                  }
                  else {
                    // Create a node
                    _privateDpc.root.open('public').add(element.key, flags);
                  }
                }
                catch (e) {
                }
              }
            }
          }
        }

        // internal DCP for dirtyStatus
        _privateDpc.root.open('private').set('isDirty', false, 'boolean', SWAC.DPC.Permissions.Read | SWAC.DPC.Permissions.Write);

        // Deregister event listener
        _privateDpc.root.onAdded.unsubscribe(_privateDpc.addHandler);
        _privateDpc.root.onRemoved.unsubscribe(_privateDpc.remHandler);
        _privateDpc.root.onValueChanged.unsubscribe(_privateDpc.setHandler);

        if (def) {
          if (typeof def.bind === 'function') {
            def.bind(_privateDpc.root.open('public'));
          }
        }
      },

       /**
       * Creates a forwarder message
       *
       * @private
       * @method _createForwarder
       * @return {function} Returns a forwarder function
       */
      _createForwarder = function () {
        return function (key, type, content) {
          if (type === 'add' || type === 'set' || type === 'remove') {
            if (content.flags !== SWAC.DPC._internal.Flags.Stub) {  //Stub + 0 (permission.None) -> node is not created proxy side
              SWAC.Communication._internal.dpcChanged(null, key, type, content); // null addresses the container
            }
          }
        };
      },

       /**
       * Creates  Dpc handler
       *
       * @private
       * @method _createDpcHandler
       * @param {String} type type of the handler of DPC (onAdd, onRemove,onValueChanged)
       * @return {function} Returns Dpc Handler function
       */
      _createDpcHandler = function (type) {
        return function (event) {
          // Convert pre-bind events to Forwarder messages
          var handler = _createForwarder();
          if (type === 'onAdded') {
            // add
            if (event.data.node === 'node') {
              handler(event.data.key, 'add', { isEvent: true, flags: event.data.flags });
            } else {
              handler(event.data.key, 'set', { isEvent: true, flags: event.data.flags });
            }
            // set
          } else if (type === 'onRemoved') {
            // remove
            handler(event.data.key, 'remove', { isEvent: true });
          } else if (type === 'onValueChanged') {
          }
        };
      },

      /**
       * Fires the event of onVisible
       *
       * @protected
       * @method _show
       * @param {Boolean} visible Component visible or not
       */
      _show = function (visible) {
        _onVisible.notify({ visible: visible });
      },

      /**
       * Remove the specified event from internal list of requested events
       *
       * @private
       * @method _removeFromRequestedEventList
       * @param {String} event event name
       */
      _removeFromRequestedEventList = function (event) {
        var i;

        for (i = _requestedEvents.length - 1; i >= 0; i--) {
          if (_requestedEvents[i] === event) {
            _requestedEvents.splice(i, 1);
          }
        }
      },

      /**
       * Function called when an event is fired inside the component
       *
       * @private
       * @method _eventCallback
       * @param {Object} eventArgs event arguments
       */
      _eventCallback = function (eventArgs) {
        var safeEventArgs = {},
          property;

        // safe copy of event arguments for postMessage
        for (property in eventArgs) {
          if (typeof eventArgs[property] !== 'object') {
            safeEventArgs[property] = eventArgs[property];
          }
        }
        property = null;

        SWAC.Communication._internal.call(null, 'manageEvent', [safeEventArgs]);

        safeEventArgs = null;
      },

      /**
       * Function called when a new component is ready
       *
       * @private
       * @method _onComponentReady
       * @param {Object} arg event arguments
       */
      _onComponentReady = function (arg) {
        if (_requestedEvents.length > 0) {
          SWAC.Container.get({ name: arg.data.name }).onMouseEvents.subscribe(null, _requestedEvents, true);
        }
      },

      /**
       * Add an event listener to the component, the action is propagated in case of mixed component
       *
       * @protected
       * @method enableComponentEvent
       * @param {Object} eventName one or more event name, can be a string or a string array
       * @param {String} level level of event registration
       */
      _enableComponentEvent = function (eventName, level) {
        var componentList = null,
          componentObj = null,
          evt = null, i, j,
          arrayEventName,
          eventToRegister = [];

        // array copy to always work with an array parameter
        if (SWAC._internal.Utils.isArray(eventName)) {
          arrayEventName = eventName;
        }
        else {
          arrayEventName = [eventName];
        }

        // all requested events are attached to the component
        for (i = 0; i < arrayEventName.length; i++) {
          window.addEventListener(arrayEventName[i], _eventCallback, true);
        }

        // in case of mixed component check if a propagation is needed
        if (SWAC.Container && (level === '_nested')) {
          componentList = SWAC.Container.get();
          if (componentList.length > 0) {
            // cycle every child component
            for (i = 0; i < componentList.length; i++) {
              componentObj = componentList[i];
              // cycle every requested event
              for (j = 0; j < arrayEventName.length; j++) {
                // get the event details record
                evt = componentObj._internal.getRegisteredEvent(arrayEventName[j]);
                if (evt !== null) {
                  // event already present, it now became an inherited event
                  evt.inherited = true;
                }
                else {
                  // event never requested, added to register list
                  eventToRegister.push(arrayEventName[j]);
                }
              }
              evt = null;
              // single subscribe call with register list
              componentObj.onMouseEvents.subscribe(null, eventToRegister, true);
              eventToRegister = [];
            }
            componentObj = null;
          }

          // create component onReady callback only the first time to avoid multiple callback
          if (_requestedEvents.length === 0) {
            SWAC.Container.onReady.subscribe(_onComponentReady);
          }

          // event list added to _requestedEvents array
          for (i = 0; i < arrayEventName.length; i++) {
            _requestedEvents.push(arrayEventName[i]);
          }

          componentList = null;
        }
      },

      /**
       * Remove the event listener from the component, the action is propagated in case of mixed component
       *
       * @protected
       * @method disableComponentEvent
       * @param {Object} eventName one or more event name, can be a string or a string array
       * @param {String} level level of event registration
       */
      _disableComponentEvent = function (eventName, level) {
        var componentList = null,
          componentObj = null,
          evt = null, i, j,
          arrayEventName;

        // array copy to always work with an array parameter
        if (SWAC._internal.Utils.isArray(eventName)) {
          arrayEventName = eventName;
        }
        else {
          arrayEventName = [eventName];
        }

        // all specified events are detached from the component
        for (i = 0; i < arrayEventName.length; i++) {
          window.removeEventListener(arrayEventName[i], _eventCallback, true);
        }

        // in case of mixed component check if a propagation is needed
        if (SWAC.Container && (level === '_nested')) {
          componentList = SWAC.Container.get();
          if (componentList.length > 0) {
            // cycle every child component
            for (i = 0; i < componentList.length; i++) {
              componentObj = componentList[i];
              // cycle every requested event
              for (j = 0; j < arrayEventName.length; j++) {
                // get the event details record
                evt = componentObj._internal.getRegisteredEvent(arrayEventName[j]);
                if (evt !== null) {
                  // event already present, it is no longer an inherited event
                  evt.inherited = false;
                }
                evt = null;
              }
              // single unsubscribe call with unregister list
              componentObj.onMouseEvents.unsubscribe();
              componentObj = null;
            }
          }

          // events removed from _requestedEvents array
          for (i = 0; i < arrayEventName.length; i++) {
            _removeFromRequestedEventList(arrayEventName[i]);
          }

          // component onReady callback removed if no more events are requested
          if (_requestedEvents.length === 0) {
            SWAC.Container.onReady.unsubscribe(_onComponentReady);
          }

          componentList = null;
        }
      },

      /**
       * Fire the event of onReady
       *
       * @protected
       * @method _ready
       * @param {Array} services list of names of available services
       */
      _ready = function (services) {
        _containerServices = services;
        _onReady.notify({});
      },

      /**
       * Fires the event of onPosition
       *
       * @protected
       * @method _position
       * @param {String} left left position.
       * @param {String} top top position.
       * @param {String} width width position.
       * @param {String} height height position.
       */
      _position = function (left, top, width, height) {
        _onPosition.notify({ left: left, top: top, width: width, height: height });
      },

      /**
       * Fires the event of onRemove
       *
       * @protected
       * @method _remove
       * @param {SWAC.Reason} reason reason object of removing the component
       */
      _remove = function (reason) {
        var def = new SWAC.Defer();
        var callbacksNum = _onRemove.notify({ reason: reason, defer: def });
        if (!callbacksNum) {
          def.fulfill();
        }

        def.promise.noProlong = true;
        return def.promise;
      },

      /**
       * Calls the method indicated in the parameter
       *
       * @protected
       * @method _call
       * @param {String} method name of method to call
       * @param {Object} args arguments of the called function
       * @param {String} inf interface name 
       */
      _call = function (method, args, inf) {
        var context = (typeof inf === 'string') ? _innerComponent.interfaces[inf] : _innerComponent;
        return context[method].apply(context, args);
      },

       /**
       * Notification that DPC has been changed.
       *
       * @protected
       * @method _dpcChanged
       * @param {string} key modified key
       * @param {string} type type of the change
       * @param {Object} content content of the dpc
       */
      _dpcChanged = function (key, type, content) {
        if (type === 'remove') {
          _privateDpc.root.remove(key);
        } else if (type === 'add') {
          _privateDpc.root.add(key, content.flags);
        } else if (type === 'set') {
          _privateDpc.root.set(key, content.value, content.type, content.flags, false);
        }
      },

      /**
       * Gets the requested dpc
       *
       * @protected
       * @method dpcGet
       * @param {string} key dpc key
       * @return {Object} the requested dpc
       */
      _dpcGet = function (key) {
        return _privateDpc.root.get(key);
      },

      /**
       * Sets the specified dpc with content and value
       *
       * @protected
       * @method dpcSet
       * @param {string} key dpc key
       * @param {string} type dpc type
       * @param {string} content value to set
       * @return {Object} the modified dpc
       */
      _dpcSet = function (key, type, content) {
        return _privateDpc.root.beginSet(key, content.value, content.type, content.flags).then(
          function (value) {
            if (!value.modified) {
              delete value.data;  // communication optimization
            }
            return value;
          },
          function (reason) {
            throw reason;
          });
      },

      /**
       * Asynchronously exposition of the component
       *
       * @method beginExpose
       * @return {Object} an object defer.promise
       */
      _beginExpose = function () {
        var remHandler = {},
          addHandler = {},
          setHandler = {},
          defer = new SWAC.Defer(),
          flags = SWAC.DPC._internal.Flags.Stub | SWAC.DPC.Permissions.Read | SWAC.DPC.Permissions.Write,
          hasPublicDpc,
          interfaces,
          property;

        hasPublicDpc = (_innerComponent.dpc) ? true : false;
        interfaces = _innerComponent.interfaces ? SWAC._internal.Utils.getOwnPropertyNames(_innerComponent.interfaces) : [];

        for (property in _innerComponent) {
          if (_innerComponent.hasOwnProperty(property)) {
            // Parse available Methods
            if (typeof _innerComponent[property] === 'function') {
              _api[property] = _reflectArguments(_innerComponent[property]);
            }
              // Parse available Events
            else if ((typeof _innerComponent[property] === 'object') &&
                      (_innerComponent[property].subscribe) &&
                      (_innerComponent[property].subscribe.length === 1)) {
              // Subscribe to event and let handler call aproporate call towards container.
              _innerComponent[property].subscribe(_handler(property));
              _events.push(property);
            }
          }
        }
        /// DPC always created (isDirty dataNode always present)
        {
          // Create local DPC on hub.
          _rootNode = new SWAC.DPC.Node(_createForwarder(), _id, flags, null, true);
          remHandler = _createDpcHandler('onRemoved');
          addHandler = _createDpcHandler('onAdded');
          setHandler = _createDpcHandler('onValueChanged');

          _privateDpc = {};
          _privateDpc.root = _rootNode.access(_id);
          _privateDpc.remHandler = remHandler;
          _privateDpc.root.onRemoved.subscribe(remHandler);
          _privateDpc.addHandler = addHandler;
          _privateDpc.root.onAdded.subscribe(addHandler);
          _privateDpc.setHandler = setHandler;
          _privateDpc.root.onValueChanged.subscribe(setHandler);
        }

        // Expose data (register hub for communication and tell container about interface)
        SWAC.Communication._internal.beginCall(null, SWAC.Config.TimeOuts.Internal, 'beginExpose', [_api, _events, hasPublicDpc, interfaces, SWAC.version], true).then(
                function (value) {
                  defer.fulfill(value);
                },
                function (reason) {
                  SWAC.Communication._internal.associateHub(null);
                  defer.reject(reason);
                }
            );
        return defer.promise;
      },

     /**
       * Request of the interface of the component
       *
       * @protected
       * @method beginRequestInterface
       * @param {String} name interface name
       * @return {Object} an object containing the name of the interface, its methods and its events
       */
      _beginRequestInterface = function (name) {
        var api = {}, events = [], expose = {},
          interfaces = _innerComponent.interfaces ? SWAC._internal.Utils.getOwnPropertyNames(_innerComponent.interfaces) : [],
          res = null,
          property;
        if (SWAC._internal.Utils.indexOf(interfaces, name) >= 0) {
          expose = _innerComponent.interfaces[name];
          for (property in expose) {
            if (expose.hasOwnProperty(property)) {
              // Parse available Methods
              if (typeof expose[property] === 'function') {
                api[property] = _reflectArguments(expose[property]);
              }
                // Parse available Events
              else if ((typeof expose[property] === 'object') &&
                        (expose[property].subscribe) &&
                        (expose[property].subscribe.length === 1)) {
                // Subscribe to event and let handler call aproporate call towards container.
                expose[property].subscribe(_handler(property, name));
                events.push(property);
              }
            }
          }

          res = { name: name, api: api, events: events };
        }

        return res;
      },

       /**
       * Returns if the interface indicated is activated or not.
       *
       * @method isInterfaceActivated
       * @param {String} name name of the interface.
       * @return {Boolean} true if interface is activated otherwise false.
       */
      _isInterfaceActivated = function (name) {
        if (SWAC._internal.Utils.indexOf(_activeInterfaces, name) < 0) {
          return false;
        }
        return true;
      },

      /**
       * Notifies that intarface is ready.
       *
       * @protected
       * @method interfaceReady
       * @param {String} name name of the interface.
       */
      _interfaceReady = function (name) {
        if (SWAC._internal.Utils.indexOf(_activeInterfaces, name) < 0) { // Only fire event if interface was not activated before.
          _activeInterfaces.push(name);
          _onInterfaceActivated.notify(name);
        }
      },

      /**
       * Asynchronously method of closing the hub: fire&forget, otherwise component might be removed before this function ends.
       *
       * @method close
       * @param {Object} reason reason of closure.
       */
      _close = function (reason) {
        SWAC.Communication._internal.call(null, 'close', [reason]); // fire&forget, otherwise component might be removed before this function ends.
      },

      /**
       * Calls the method of authentication for transport layer security
       *
       * @protected
       * @method _tlsMessage
       * @param {String} message message to send to the authentication 
       */
      _tlsMessage = function (message) {
        _authentication._internal.receiveMessage(message);
      },

      /**
       * Manages the authentication handshake
       *
       * @method beginAuthenticationHandshake
       * @param {object} tlsHandler transport layer security handler
       * @param {string} tlsMessage transport layer security message 
       * @param {object} timeout one or more components to create
       * @return {Object} an object defer.promise
       */
      _beginAuthenticationHandshake = function (tlsHandler, tlsMessage, timeout) {
        return _authentication._internal.beginHandshake(tlsHandler, tlsMessage, timeout);
      };

  SWAC.Communication._internal.associateHub(this);

  /**
   * Method for setting the dirty state of the component
   *
   * @protected
   * @method cleanUp 
   * @return {Object} an object defer.promise
   */
  var _cleanUp = function () {
    var defer = new SWAC.Defer();
    var callbacksNum = _onCleanUp.notify({ defer: defer });
    if (!callbacksNum) {
      defer.fulfill();
    }
    return defer.promise;
  };

  /**
   * Method for retrieving the list of services
   *
   * @method services.list
   * @return {Array} list of services of the container
   */
  var _list = function () {
    return _containerServices;
  },

/**
* Method for searching a service.
*
* @method services.has
* @param {String} name name of the service.
* @return {Boolean} true or false if the service exists.
*/
  _has = function (name) {
    return (SWAC._internal.Utils.indexOf(_containerServices, name) >= 0);
  },
   /**
  * Method for calling a service
  *
  * @private
  * @method _beginCallService
  * @param {String} method name of method to call.
  * @param {String} args arguments of the call.
  * @param {String} service service name of the call.
  * @return {Object} an object defer.promise
  */
  _beginCallService = function (method, args, service) {
    var defer = new SWAC.Defer();

    SWAC.Communication._internal.beginCall(null, SWAC.Config.TimeOuts.Proxy.Functions, 'callService', [method, args, service]).then(
        function (value) { defer.fulfill(value); },
        function (reason) { defer.reject(reason); }
        );
    return defer.promise;
  },

   /**
  * Function for exposing methods and event of the service
  *
  * @private
  * @method _exposeService
  * @param {String} name name of the service.
  * @param {Object} api Methods of the service.
  * @param {Object} events events of the service.
  * @return {Object} an object defer.promise
  */
  _exposeService = function (name, api, events) {
    var inf = {},
      method,
      args,
      fn,
      i = 0,
      event,
      evPub;

    if (!_cachedServices[name]) {
      //// Methods
      for (method in api) {
        if (api.hasOwnProperty(method)) {
          args = api[method].join(', ');
          fn = 'return function (' + args + ') { var myargs = Array.prototype.slice.call(arguments, 0); var args = ["' + method + '", myargs, "' + name + '" ]; return fn.apply( ctx, args ); };';
          /* jshint -W054 */
          inf[method] = (new Function('ctx', 'fn', fn))(this, _beginCallService);
          /* jshint +W054 */
        }
      }

      //// EVENTS
      for (i = 0; i < events.length; i++) {
        event = events[i];
        evPub = new SWAC.Eventing.Publisher(event);
        _cachedEventPublisher[name] = _cachedEventPublisher[name] || {};
        _cachedEventPublisher[name][event] = evPub;
        inf[event] = evPub.event;
      }

      _cachedServices[name] = inf;
    }
  },

  /**
  * Method for getting the service
  *
  * @method service.beginGet
  * @param {String} name name of the service.
  * @return {Object} an object defer.promise
  */
  _beginGet = function (name) {
    var defer = new SWAC.Defer(),
      inf = {};

    if (_cachedServices[name]) {
      defer.fulfill(_cachedServices[name]);
    }
    else if (_has(name)) {

      SWAC.Communication._internal.beginCall(null, SWAC.Config.TimeOuts.Internal, 'beginRequestService', [name]).then(
          function (value) {
            inf = value;
            if (inf) {
              _exposeService(inf.name, inf.api, inf.events);
              defer.fulfill(_cachedServices[name]);
            }
            else {
              defer.reject(new SWAC.Reason(12001));
            }
          },
          function (reason) {
            defer.reject(reason);
          }
          );
    }
    else {
      defer.reject(new SWAC.Reason(12001));
    }

    return defer.promise;
  },

   /**
  * Method for firing event from the cached services
  *
  * @private
  * @method _fireEvent
  * @param {String} evtname name of the event.
  * @param {Object} evtobject object of the event.
  * @param {string} service service name.
  */
  _fireEvent = function (evtname, evtobject, service) {
    if (_cachedEventPublisher[service] && _cachedEventPublisher[service][evtname]) {
      _cachedEventPublisher[service][evtname].notify(evtobject.data);
    }
  },

  /**
  * Return the authentication domain
  *
  * @method getDomain
  * @return {string} authentication domain.
  */
  _getDomain = function () {
    return _authentication.getDomain();
  },

  /**
  * set authentication domain
  * 
  * @protected
  * @method setDomain
  * @param {string} authentication domain.
  */
  _setDomain = function (domain) {
    _authentication._internal.setDomain(domain);
  };

  //////////////
  // PUBLIC   //
  //////////////

  // No return-block here to keep object type SWAC.Component (otherwise untyped <object>)

  // API
  this.beginExpose = _beginExpose;
  this.beginAuthenticationHandshake = _beginAuthenticationHandshake;
  this.close = _close;
  this.getDomain = _getDomain;

  this.isInterfaceActivated = _isInterfaceActivated;

  /**
  * Services Object
  *
  * @property services
  * @type Object
   */
  this.services = {
    list: _list,
    beginGet: _beginGet,
    has: _has
  };

  // EVENTS

  /**
  * Fired whenever an Interface is activated.
  *
  * @event onInterfaceActivated
  */
  this.onInterfaceActivated = _onInterfaceActivated.event;

  /**
  * Fired whenever Hub is fully established.
  *
  * @event onReady
  */
  this.onReady = _onReady.event; // After Hub is fully established (e.g. DPCs bound) -> necessary especially for headless components

  /**
  * Fired whenever the container wants to remove the component (triggered by container).
  *
  * @event onRemove
  */
  this.onRemove = _onRemove.event;

  /**
  * Fired whenever the component is shown or hidden (triggered by container).
  *
  * @event onVisible
  */
  this.onVisible = _onVisible.event;

  /**
  * Fired whenever the component gets repositioned.
  *
  * @event onPosition
  */
  this.onPosition = _onPosition.event;

  /**
 * Fired whenever needs to be clean up.
 *
 * @event onCleanUp
 */
  this.onCleanUp = _onCleanUp.event;

  // INTERNAL, DO NOT USE
  this._internal = {
    bind: _bind,
    remove: _remove,
    ready: _ready,
    show: _show,
    enableComponentEvent: _enableComponentEvent,
    disableComponentEvent: _disableComponentEvent,
    position: _position,
    call: _call,
    fire: _fireEvent,
    dpcChanged: _dpcChanged,
    dpcGet: _dpcGet,
    dpcSet: _dpcSet,
    tlsMessage: _tlsMessage,
    cleanUp: _cleanUp,
    beginRequestInterface: _beginRequestInterface,
    interfaceReady: _interfaceReady,
    setDomain: _setDomain
  };

  SWAC.Hub.instance = this;
};


///////////////////////////////////////////
// lib/base/dpc/data.js

SWAC.DPC = (SWAC.DPC || {});

/**
 * Data class manager for DPC Data Node
 *
 * @class SWAC.DPC.Data
 * @constructor
 * @param {object} parent parent of the current node.
 * @param {String} uuid User ID for accessing data node.
 * @param {number} flags flags of the node.
 * @param {String} key key of the node.
 * @param {object} value value of the node.
 * @param {String} type type of the node.
 * 
 */
SWAC.DPC.Data = function (parent, uuid, flags, key, value, type) {

  //////////////
  // PRIVATE  //
  //////////////

  var _that = this,
      _uuid = uuid,
      _forceForward = (arguments.length === 7) ? arguments[6] : false;

  /**
  * Checks the input key
  *
  * @private
  * @method _checkKey
  * @param {String} key Key to check
  * @param {Boolean} nullable express if the key is nullable or not
  * @param {Boolean} multipleKey if the key is multiple or not
  * @param {Boolean} emptyStringKey if an empty string is allowed as key
  */
  var _checkKey = function (key, nullable, multipleKey, emptyStringKey) {

    if ((nullable === false) && ((key === null) || (key === undefined))) {
      throw new SWAC.InvalidArgumentException(3002);
    }
    if ((key !== null) && (key !== undefined)) {
      if (typeof (key) !== 'string') {
        throw new SWAC.InvalidArgumentException(3003);
      }
      if ((multipleKey === false) && (key.indexOf('.') !== -1)) {
        throw new SWAC.InvalidArgumentException(3004);
      }
      if ((emptyStringKey === false) && (key.replace(SWAC._internal.Utils.trimRegex, '') === '')) {
        throw new SWAC.InvalidArgumentException(3006);
      }
    }
  };

  _checkKey(key, false, false, false);

  var _parent;

  /**
 * Normalize input flags
 *
 * @private
 * @method _normalizeFlags
 * @param {Number} flags flags to normalize
 * @return {Number} a normalized flag or an exception if flag is invalid
 */
  var _normalizeFlags = function (flags) {
    var res = SWAC.DPC._internal.Flags.None;
    if ((typeof (flags) === 'string') ||
        (typeof (flags) === 'boolean') ||
        (typeof (flags) === 'function') ||
        ((typeof (flags) === 'object') && (flags !== null))
        ) {
      throw new SWAC.InvalidArgumentException(3007);
    }
    if ((flags === null) || (flags === undefined)) {
      return (SWAC.DPC.Permissions.Read | SWAC.DPC.Permissions.Write);
    }
    if (flags < 0) {
      throw new SWAC.InvalidArgumentException(3007);
    }

    if ((flags & SWAC.DPC._internal.Flags.Stub) === SWAC.DPC._internal.Flags.Stub) { res |= SWAC.DPC._internal.Flags.Stub; }
    if ((flags & SWAC.DPC._internal.Flags.Proxy) === SWAC.DPC._internal.Flags.Proxy) { res |= SWAC.DPC._internal.Flags.Proxy; }
    if ((flags & SWAC.DPC.Permissions.Read) === SWAC.DPC.Permissions.Read) { res |= SWAC.DPC.Permissions.Read; }
    if ((flags & SWAC.DPC.Permissions.Write) === SWAC.DPC.Permissions.Write) { res |= SWAC.DPC.Permissions.Write; }
    if (((res & SWAC.DPC._internal.Flags.Stub) === SWAC.DPC._internal.Flags.Stub) && ((res & SWAC.DPC._internal.Flags.Proxy) === SWAC.DPC._internal.Flags.Proxy)) {
      throw new SWAC.InvalidArgumentException(3001);
    }
    return res;
  };

  var _flags = _normalizeFlags(flags);

  var _dirtyflag = false,
      _key = key,
      _value = value,
      _type = type,
      _isProxy = ((_flags & SWAC.DPC._internal.Flags.Proxy) === SWAC.DPC._internal.Flags.Proxy),
      _isStub = ((_flags & SWAC.DPC._internal.Flags.Stub) === SWAC.DPC._internal.Flags.Stub),

      /**
       * Returns if the user accessing data node is owner
       *
       * @method mine
       * @param {String} uuid User ID
       * @return {Boolean} True if the user accessing data node is owner, false otherwise
       */
      _mine = function (uuid) {
        if (_uuid === uuid) {
          return true;
        }
        return false;
      },

       /**
       * Returns if a forward is necessary or not
       *
       * @private
       * @method _mustForward
       * @param  {String} uuid User ID
       * @return {Boolean} Return if it necessary to do a forward or not.
       */
      _mustForward = function (uuid) {
        // Created by current accessor and on proxy side.
        return ((!_mine(uuid) && (_isProxy || _isStub)) || _forceForward);
      },

      /**
       * Forwards action to parent node
       *
       * @private
       * @method _forward
       * @param {String} key Key of node
       * @param {String} action Action to forward
       * @param {Object} content Data of action to forward
       */
      _forward = function (key, action, content) {
        if (_parent && _parent['_internal'] && _parent['_internal']['forward']) {
          return _parent._internal.forward(key, action, content);
        }
      },

       /**
       * Gets permissions flags of data value into data node
       *
       * @method flags
       * @return {Number} Return permissions flags value present in data node
       */
      _getflags = function () {
        return _flags;
      },

      /**
       * Gets data value of data node
       *
       * @method get
       * @param  {String} uuid User ID
       * @return {Object} Return object value present in data node or an exception if Permission is denied.
       */
      _get = function (uuid) {
        if ((_mine(uuid)) || ((_getflags() & SWAC.DPC.Permissions.Read) === SWAC.DPC.Permissions.Read)) {
          if (_isProxy && _mustForward(uuid)) {
            return _forward(_key, 'get', {});
          }
          return _value;
        }
        else {
          throw new SWAC.AccessViolationException(2001);
        }
      },

       /**
       * Get public root node
       *
       * @private
       * @method _getPublicNode
       * @return {Object} Return public root node
       */
      _getPublicNode = function () {
        var res = null;
        if (_parent && _parent['_internal'] && _parent['_internal']['getPublicNode']) {
          res = _parent._internal.getPublicNode();
        }
        return res;
      },

      /**
      * Fired when data node is going to be changed
      *
      * @event onBeforeValueChanged
      * @param {Object} validateObj  validatedObj Object containing the following properties: key, currentValue, value and reject
      * <br/>key is the key of data node 
      * <br/>currentValue is the current value of data node before updating
      * <br/>value is the new value to set into data node
      * <br/>reject is a boolean that specifies if value can be accepted or not
      */
      _onBeforeValueChanged = new SWAC.Eventing.Publisher('onBeforeValueChanged'),

      /**
       * Fires onBeforeValueChanged event
       *
       * @method fireOnBeforeValueChanged
       */
      _fireOnBeforeValueChanged = function (validateObj) {
        var currentValue = validateObj.currentValue,
          currentKey = validateObj.key,
          value = validateObj.value;

        _onBeforeValueChanged.notify(validateObj);
        if ((validateObj.reject === null) || (validateObj.reject === undefined)) {
          validateObj.reject = false;
        }
        if ((validateObj.value === null) || (validateObj.value === undefined)) {
          validateObj.value = value;
        }
        if (!validateObj.reject) {
          if (_parent && _parent['_internal'] && _parent['_internal']['fireOnBeforeValueChanged']) {
            validateObj.currentValue = currentValue;
            validateObj.key = currentKey;
            _parent._internal.fireOnBeforeValueChanged(validateObj);
          }
        }
      },

      /**
      * Fired when value of data node is changed
      *
      * @event onValueChanged
      * @param {Object} data Object with 'key', 'value' and 'oldValue' properties related to the modified data node
      */
      _onValueChanged = new SWAC.Eventing.Publisher('onValueChanged'),

      /**
       * Fires onValueChanged event
       *
       * @private
       * @method _fireOnValueChanged
       * @param {Object} value New value of data node
       * @param {Object} oldValue Old value of data node
       */
       _fireOnValueChanged = function (value, oldValue) {
         _onValueChanged.notify({ key: _key, value: value, oldValue: oldValue });
         if (_parent && _parent['_internal'] && _parent['_internal']['fireOnValueChanged']) {
           _parent._internal.fireOnValueChanged(_key, value, oldValue);
         }
       },

      /**
       * Sets data value of data node
       *
       * @method set
       * @param  {String} uuid User ID
       * @param  {Object} value Object to insert in data node
       */
      _set = function (uuid, value) {
        var forward,
          oldValue,
          publicNode = null,
          validatedObj = {
            key: _key,
            value: value,
            currentValue: _value,
            reject: false
          };

        if (!_isProxy) {
          _fireOnBeforeValueChanged(validatedObj);
        }

        if (!validatedObj.reject) {
          forward = (arguments.length === 3) ? arguments[2] : true;

          if (_mine(uuid) || ((_getflags() & SWAC.DPC.Permissions.Write) === SWAC.DPC.Permissions.Write)) {
            if (_mustForward(uuid) && forward) {
              if (!((!_isProxy) && (_flags === SWAC.DPC._internal.Flags.Stub))) {
                _forward(_key, 'set', { value: (_isProxy ? validatedObj.value : null) });
              }
            }
            else if (!_isProxy) {
              if (SWAC.Hub && SWAC.Hub.prototype.containerVersion && (SWAC.Hub.prototype.containerVersion === '1.0.0')) {
                if (!((!_isProxy) && (_flags === SWAC.DPC._internal.Flags.Stub))) {
                  _forward(_key, 'set', { value: validatedObj.value });
                }
              }
              else {
                if (!((!_isProxy) && (_flags === SWAC.DPC._internal.Flags.Stub))) {
                  _forward(_key, 'set', { value: null });
                }
              }
            }

            if (_isProxy) {
              publicNode = _getPublicNode();
              if (_mine(uuid) || (publicNode && publicNode.componentVersion && (publicNode.componentVersion === '1.0.0'))) {
                _fireOnValueChanged();
              }
            }
            else {
              oldValue = _value;
              _value = validatedObj.value;
              _fireOnValueChanged(_value, oldValue);
            }
          }
          else {
            throw new SWAC.AccessViolationException(2001);
          }
        }
      },

      /**
        * Try to set a data node value
        *
        * @method beginSet
        * @param {String} uuid User ID
        * @param {Object} value dpc value
        * @return {Object} promise object
       */
      _beginSet = function (uuid, value) {
        var oldValue,
          res = new SWAC.Defer(),
          validatedObj = {
            key: _key,
            value: value,
            currentValue: _value,
            reject: false
          },
          locPromise = null;

        if (_mine(uuid) || ((_getflags() & SWAC.DPC.Permissions.Write) === SWAC.DPC.Permissions.Write)) {
          if (_isProxy) {
              locPromise = _forward(_key, 'beginset', { value: validatedObj.value });
              return locPromise.then(function (data) {
                  var obj = data;
                  if (!obj.modified) {
                      obj['data'] = value;
                  }
                  return obj;
              }, function (reason) {
                  throw reason;
              });
          }
          else {
            _fireOnBeforeValueChanged(validatedObj);
            if (!validatedObj.reject) {
              oldValue = _value;
              _value = validatedObj.value;
              _fireOnValueChanged(_value, oldValue);
              if (!((!_isProxy) && (_flags === SWAC.DPC._internal.Flags.Stub))) {
                _forward(_key, 'set', { value: null });
              }
              res.fulfill({ modified: !SWAC.DPC.Node.prototype._equals(_value, value), data: _value });
            }
            else {
              res.reject(new SWAC.Reason(17000));
            }
          }
        }
        else {
          res.reject(new SWAC.Reason(17001));
        }
        return res.promise;
      },

      /**
       * Gets type of data value into data node
       *
       * @method type
       * @return {String} Return type of object value present in data node
       */
      _gettype = function () {
        return _type;
      },

       /**
       * Gets RW permissions flags of data value into data node
       *
       * @private
       * @method _getPermissions
       * @return {Number} Return permissions flags value present in data node
       */
      _getPermissions = function () {
        var flags = _flags;
        if ((flags & SWAC.DPC._internal.Flags.Stub) === SWAC.DPC._internal.Flags.Stub) {
          flags = flags ^ SWAC.DPC._internal.Flags.Stub;
        }

        if ((flags & SWAC.DPC._internal.Flags.Proxy) === SWAC.DPC._internal.Flags.Proxy) {
          flags = flags ^ SWAC.DPC._internal.Flags.Proxy;
        }

        return flags;
      },

      /**
       * Checks if data value into data node is valid
       *
       * @method dirty
       * @param {Object} mark object to indicate that value is dirty
       * @return {Boolean} True if data is valid, false otherwise
       */
      _dirty = function (mark) {
        if (mark !== undefined) {
          _dirtyflag = true;
        }
        return _dirtyflag;
      },

      /**
      * Fired when data node is removed
      *
      * @event onRemoved
      * @param {Object} data Object with 'key' property related to the removed data node
      */
      _onRemoved = new SWAC.Eventing.Publisher('onRemoved'),

      /**
       * Fires onRemoved event
       *
       * @method fireOnRemoved
       */
      _fireOnRemoved = function () {
        _onRemoved.notify({ key: _key });
        if (_parent && _parent['_internal'] && _parent['_internal']['fireOnRemoved']) {
          _parent._internal.fireOnRemoved(_key);
        }
      };

  //////////////
  // PUBLIC   //
  //////////////

  this.get = _get;
  this.set = _set;
  this.beginSet = _beginSet;
  this.type = _gettype;
  this.flags = _getPermissions;
  this.onRemoved = _onRemoved.event;
  this.onBeforeValueChanged = _onBeforeValueChanged.event;

  this._internal = {
    fireOnRemoved: _fireOnRemoved,
    fireOnBeforeValueChanged: _fireOnBeforeValueChanged,
    dirty: _dirty,
    mine: _mine
  };
  /**
  * Return public/private accessor of data node
  *
  * @method access
  * @param {String} uuid ID of user who get accessor. If user ID is owner user ID, private accessor is returned with all permissions, 
  * otherwise public accessor is returned with read and write permissions conditioned by the flags
  * @return {Object} Return accessor object of dataNode
  */
  this.access = function (uuid) {
    var _isDirty = function () {
      if (_dirty()) {
        throw new SWAC.Exception(1002);
      }
    },
        accessor = {
          type: function () {
            _isDirty();
            return _gettype();
          },
          flags: function () {
            _isDirty();
            return _getPermissions();
          },
          onRemoved: _onRemoved.event
        };

    // Requires permission: read
    if (_mine(uuid) || ((_getflags() & SWAC.DPC.Permissions.Read) === SWAC.DPC.Permissions.Read)) {
      var getter = function () {
        _isDirty();
        return _get(uuid);
      };

      if (_isProxy && _mustForward(uuid)) {
        accessor.beginGet = getter;
      } else {
        accessor.get = getter;
        accessor.onBeforeValueChanged = _onBeforeValueChanged.event;
      }
      accessor.onValueChanged = _onValueChanged.event;
    }

    // Requires permission: write
    if (_mine(uuid) || ((_getflags() & SWAC.DPC.Permissions.Write) === SWAC.DPC.Permissions.Write)) {
      accessor.set = function (value) {
        var forward = (arguments.length === 2) ? arguments[1] : true;

        _isDirty();
        _set(uuid, value, forward);
      };
      accessor.beginSet = function (value) {
        var forward = (arguments.length === 2) ? arguments[1] : true;

        if (_dirty()) {
          var res = new SWAC.Defer();
          res.reject(new SWAC.Reason(17002));
          return res.promise;
        } else {
          return _beginSet(uuid, value, forward);
        }
      };
    }

    return accessor;
  };

  if (parent instanceof SWAC.DPC.Node) {
    if ((parent._internal.mine(uuid))) {
      _parent = parent;
      parent.add(uuid, key, flags, _that, value);
    }
    else {
      throw new SWAC.AccessViolationException(2001);
    }
  }
  else {
    _parent = undefined;
  }
};


///////////////////////////////////////////
// lib/base/dpc/flags.js

SWAC.DPC._internal = (SWAC.DPC._internal || {});

/**
 * Flag for dpc type
 *
 * @protected
 * @class SWAC.DPC._internal.Flags
 * @constructor
 */
SWAC.DPC._internal.Flags = {
    /**
     * No type
     *
     * @property None
     * @type Numeric
     * @default 0
     */
    None: 0,
    /**
     * Is a Proxy
     *
     * @property Proxy
     * @type Numeric
     * @default 128
     */
    Proxy: 128,
    /**
     * Is a Stub
     *
     * @property Stub
     * @type Numeric
     * @default 256
     */
    Stub: 256
};

///////////////////////////////////////////
// lib/base/dpc/node.js

/**
 * Data class manager for DPC Node
 *
 * @class SWAC.DPC.Node
 * @constructor
 * @param {object} parent parent of the current node.
 * @param {String} uuid User ID for accessing data node.
 * @param {Number} flags flags of the node.
 * @param {String} key key of the node.
 * 
 */
SWAC.DPC.Node = function (parent, uuid, flags, key) {

  //////////////
  // PRIVATE  //
  //////////////

  /**
 * Checks the input key
 *
 * @private
 * @method _checkKey
 * @param {String} key Key to check
 * @param {Boolean} nullable express if the key is nullable or not
 * @param {Boolean} multipleKey if the key is multiple or not
 * @param {Boolean} emptyStringKey if an empty string is allowed as key
 */
  var _checkKey = function (key, nullable, multipleKey, emptyStringKey) {

    if ((nullable === false) && ((key === null) || (key === undefined))) {
      throw new SWAC.InvalidArgumentException(3002);
    }
    if ((key !== null) && (key !== undefined)) {
      if (typeof (key) !== 'string') {
        throw new SWAC.InvalidArgumentException(3003);
      }
      if ((multipleKey === false) && (key.indexOf('.') !== -1)) {
        throw new SWAC.InvalidArgumentException(3004);
      }
      if ((key.indexOf('.') === 0) || ((key.length > 0) && (key.lastIndexOf('.') === (key.length - 1)))) {
        throw new SWAC.InvalidArgumentException(3005);
      }
      if ((emptyStringKey === false) && (key.replace(SWAC._internal.Utils.trimRegex, '') === '')) {
        throw new SWAC.InvalidArgumentException(3006);
      }
    }
  };

  _checkKey(key, true, false, false);

  var _that = this,
      _forceForward = (arguments.length === 5) ? arguments[4] : false,
      _key = key;

  var _parent;

  /**
  * Normalize input flags
  *
  * @private
  * @method _normalizeFlags
  * @param {Number} flags flags to normalize
  * @return {Number} a normalized flag or an exception if flag is invalid
  */
  var _normalizeFlags = function (flags) {
    var res = SWAC.DPC._internal.Flags.None;
    if ((typeof (flags) === 'string') ||
        (typeof (flags) === 'boolean') ||
        (typeof (flags) === 'function') ||
        ((typeof (flags) === 'object') && (flags !== null))
        ) {
      throw new SWAC.InvalidArgumentException(3007);
    }
    if ((flags === null) || (flags === undefined)) {
      return (SWAC.DPC.Permissions.Read | SWAC.DPC.Permissions.Write);
    }
    if (flags < 0) {
      throw new SWAC.InvalidArgumentException(3007);
    }

    if ((flags & SWAC.DPC._internal.Flags.Stub) === SWAC.DPC._internal.Flags.Stub) { res |= SWAC.DPC._internal.Flags.Stub; }
    if ((flags & SWAC.DPC._internal.Flags.Proxy) === SWAC.DPC._internal.Flags.Proxy) { res |= SWAC.DPC._internal.Flags.Proxy; }
    if ((flags & SWAC.DPC.Permissions.Read) === SWAC.DPC.Permissions.Read) { res |= SWAC.DPC.Permissions.Read; }
    if ((flags & SWAC.DPC.Permissions.Write) === SWAC.DPC.Permissions.Write) { res |= SWAC.DPC.Permissions.Write; }
    if (((res & SWAC.DPC._internal.Flags.Stub) === SWAC.DPC._internal.Flags.Stub) && ((res & SWAC.DPC._internal.Flags.Proxy) === SWAC.DPC._internal.Flags.Proxy)) {
      throw new SWAC.InvalidArgumentException(3001);
    }
    return res;
  };

  var _forwarder = (typeof (parent) === 'function') ? parent : undefined, // forwards proxy's calls to the original
      _uuid = uuid,
      _flags = _normalizeFlags(flags);


  var _dirtyflag = false,
      _children = {}, // contained namespace and data nodes.

      /**
       * Checks if content node is valid
       *
       * @method dirty
       * @return {Boolean} True if content is valid, false otherwise
       */
       _dirty = function (mark) {
         if (mark !== undefined) {
           _dirtyflag = true;
         }
         return _dirtyflag;
       },

      _isProxy = ((_flags & SWAC.DPC._internal.Flags.Proxy) === SWAC.DPC._internal.Flags.Proxy),

      _isStub = ((_flags & SWAC.DPC._internal.Flags.Stub) === SWAC.DPC._internal.Flags.Stub),

      /**
       * Checks if user is the owner
       *
       * @method mine
       * @param {String} uuid User ID
       * @return {Boolean} Returns true is user is owner, false otherwise
       */
      _mine = function (uuid) {
        if (_uuid === uuid) {
          return true;
        }
        return false;
      },

      /**
       * Checks if user can add node
       *
       * @private
       * @method _canAdd
       * @param {String} uuid User ID
       * @return {Boolean} Returns true is user can add node, false otherwise
       */
       _canAdd = function (uuid) { return (_mine(uuid)); },

      /**
       * Checks if user can remove node
       *
       * @private
       * @method _canRemove
       * @param {String} uuid User ID
       * @return {Boolean} Returns true is user can remove node, false otherwise
       */
       _canRemove = _canAdd,

       /**
       * Checks if action on node must be forwarded
       *
       * @private
       * @method _mustForward
       * @param {String} uuid User ID
       * @return {Boolean} Return true is action on node must be forwarded, false otherwise
       */
      _mustForward = function (uuid) {
        // Created by current accessor and on proxy side.
        return ((!_mine(uuid) && (_isProxy || _isStub)) || _forceForward);
      },

      /**
       * Gets names list of children node
       *
       * @method list
       * @return {Array} Returns array of names of children nodes alphabetically sorted
       */
      _list = function () {
        return SWAC._internal.Utils.getOwnPropertyNames(_children).sort();

      },

       /**
       * Opens a node
       *
       * @method open
       * @param {String} key Node key
       * @return {Object} Returns the node
       */
      _open = function (key) {
        var namespaces,
          current,
          i = 1;

        // Currently no permissions required for opening, thus no up-front check.
        _checkKey(key, false, true, false);

        // No key returns the node itself.
        if ((key === '') || (key === null)) {
          return _that;
        }

        // Dots within the key specify nested namespaces.
        if (key.indexOf('.') > -1) {
          namespaces = key.split('.');
          current = _open(namespaces[0]);
          if (current === undefined) {
            return undefined;
          }
          for (i = 1; i < namespaces.length; i++) {
            if (current !== undefined) {
              current = current.open(namespaces[i]);
            }
            else {
              return undefined;
            }
          }
          return current;
        }

        // Request for a single node.
        if (_children[key] !== undefined && (_children[key] instanceof SWAC.DPC.Node || _children[key] instanceof SWAC.DPC.Data)) {
          return _children[key];
        }

        return undefined;
      },

       /**
       * Returns node's flags
       *
       * @method flags
       * @return {Number} Returns the flags of the node.
       */
      _getflags = function () {
        return _flags;
      },

      /**
       * Gets node
       *
       * @method get
       * @param  {String} uuid User ID
       * @param  {String} key Key Node
       * @return {Object} Returns object value present in data node
       */
      _get = function (uuid, key) {
        var namespaces,
         current,
         i = 1;
        var p = new SWAC.Defer();
        // No key, no data.
        _checkKey(key, false, true, true);

        if ((_mine(uuid)) || ((_getflags() & SWAC.DPC.Permissions.Read) === SWAC.DPC.Permissions.Read)) {
          if ((key === '') || (key === null)) {
            if (_isProxy) {
              p.reject(new SWAC.Reason(17006));
              return p.promise;
            } else {
              return undefined;
            }
          }

          // Dots within the key specify nested namespaces.
          if (key.indexOf('.') > -1) {
            namespaces = key.split('.');
            current = _open(namespaces[0]);
            if (current === undefined) {
              if (_isProxy) {
                p.reject(new SWAC.Reason(17006));
                return p.promise;
              } else {
                return undefined;
              }
            }
            if ((current instanceof SWAC.DPC.Data) && (namespaces.length > 1)) {
              if (_isProxy && _mustForward(uuid)) {
                p.reject(new SWAC.Reason(17006));
                return p.promise;
              } else {
                return undefined;
              }
            }
            for (i = 1; i < namespaces.length - 1; i++) {
              if (current !== undefined) {
                current = current.open(namespaces[i]);
              }
              else {
                if (_isProxy && _mustForward(uuid)) {
                  p.reject(new SWAC.Reason(17006));
                  return p.promise;
                } else {
                  return undefined;
                }
              }
            }

            if (current === undefined) {
              if (_isProxy) {
                p.reject(new SWAC.Reason(17006));
                return p.promise;
              } else {
                return undefined;
              }
            }
            return current.get(uuid, namespaces[namespaces.length - 1]);
          }

          // Request for a single node.
          if (_children[key] !== undefined && // has child-node
               _children[key] instanceof SWAC.DPC.Data && // is data-node
               _children[key]['get']) { // can be read
            return _children[key].get(uuid);
          } else if (_children[key] !== undefined) {
            throw new SWAC.Exception(1003);
          }

          throw new SWAC.Exception(1004);

        }
        else {
          throw new SWAC.AccessViolationException(2001);
        }
      },

      /**
       * Beautifies flag proxy/stub affiliation
       *
       * @private
       * @method _beautifyFlags
       * @param {Number} flags Flags to beautify
       * @return {Number} Returns beautified flags
       */
      _beautifyFlags = function (flags) {
        flags = (flags === undefined || flags === null) ? _flags : flags; // Inherit from this node if not set explicitely.

        if ((_flags === SWAC.DPC._internal.Flags.Stub) && (flags !== _flags)) {
          throw new SWAC.InvalidArgumentException(3009);
        }
        // ensure that new flags do not change proxy/stub affiliation.
        if ((_flags & SWAC.DPC._internal.Flags.Stub) === SWAC.DPC._internal.Flags.Stub) {
          if ((flags & SWAC.DPC._internal.Flags.Proxy) === SWAC.DPC._internal.Flags.Proxy) {
            flags = flags ^ SWAC.DPC._internal.Flags.Proxy;
          }
          flags = flags | SWAC.DPC._internal.Flags.Stub;
        } else if ((_flags & SWAC.DPC._internal.Flags.Proxy) === SWAC.DPC._internal.Flags.Proxy) {
          if ((flags & SWAC.DPC._internal.Flags.Stub) === SWAC.DPC._internal.Flags.Stub) {
            flags = flags ^ SWAC.DPC._internal.Flags.Stub;
          }
          flags = flags | SWAC.DPC._internal.Flags.Proxy;
        }

        return flags;
      },

       /**
       * Returns nested node key
       *
       * @method nestedKey
       * @param {String} key Node key
       * @return {String} Returns nested key value
       */
      _nestedKey = function (key) {
        var nKey = key;
        if (_key && _parent) {
          nKey = _key + '.' + nKey;
        }
        return nKey;
      },

       /**
       * Forwards parameters to parent node, if it is a function. 
       *
       * @private
       * @method _forward
       * @param {String} key Key of node
       * @param {String} action Action to forward
       * @param {Object} content Data of action to forward
       */
      _forward = function (key, action, content) {
        var nKey = _nestedKey(key);
        if (_forwarder && typeof (_forwarder) === 'function') { // Root node!
          return _forwarder(nKey, action, content);
        } else if (_parent && _parent['_internal'] && _parent['_internal']['forward']) {
          return _parent._internal.forward(nKey, action, content);
        }
      },

      /**
       * Sets node content
       *
       * @method set
       * @param {String} uuid User ID
       * @param {String} key Node key
       * @param {Object} value Node Content
       * @param {String} type Node type
       * @param {Number} flags Node Flags
       * @return {Object} Returns modified node
       */
      _set = function (uuid, key, value, type, flags) {
        var forward = (arguments.length >= 6) ? arguments[5] : true,
          namespaces,
          current = _that,
          i = 0;

        _checkKey(key, false, true, false);

        if ((_mine(uuid)) || ((_getflags() & SWAC.DPC.Permissions.Write) === SWAC.DPC.Permissions.Write)) {
          flags = _beautifyFlags(flags);

          // Dots within the key specify nested namespaces.
          if (key.indexOf('.') > -1) {
            namespaces = key.split('.');
            for (i = 0; i < namespaces.length - 1; i++) {
              if (current instanceof SWAC.DPC.Node) {
                if (SWAC._internal.Utils.indexOf(current.list(), namespaces[i]) >= 0) {
                  current = current.open(namespaces[i]);
                } else {
                  if (!_mine(uuid)) {
                    throw new SWAC.Exception(2001);
                  }
                  else {
                    current = current.add(uuid, namespaces[i], flags);
                  }
                }
              } else {
                throw new SWAC.Exception(1010);
              }
            }
            if (current instanceof SWAC.DPC.Node) {
              return current.set(uuid, namespaces[namespaces.length - 1], value, type, flags, forward);
            } else {
              throw new SWAC.Exception(1010);
            }
          }

          // Request for a single node
          if (_children[key] === undefined) {
            if (!_mine(uuid)) {
              throw new SWAC.Exception(2001);
            }
            else {
              // Fire to component (if not initiated by base-library itself)
              if (_mustForward(uuid) && forward) {
                if (!((!_isProxy) && (_flags === SWAC.DPC._internal.Flags.Stub))) {
                  _forward(key, 'set', { value: value, type: type, flags: flags });
                }
              }
              _children[key] = new SWAC.DPC.Data(_that, _uuid, flags, key, value, type, _forceForward); // Create with original owner UUID
            }
          }
          else {
            // Firing to component (if not initiated by base-library itself) is handled in data-node's set!
            if (_children[key] instanceof SWAC.DPC.Data) {
              _children[key].set(uuid, value, forward);
            }
            else {
              throw new SWAC.Exception(1006);
            }
          }

          return _children[key];
        }
        else {
          throw new SWAC.AccessViolationException(2001);
        }
      },

      /**
       * Try to set a structural node value
       *
       * @method beginSet
       * @param {String} uuid User ID
       * @param {String} key dpc key
       * @param {Object} value dpc value
       * @param {String} type dpc node type
       * @param {Number} flags dpc flags
       * @return {Object} promise object
       */
      _beginSet = function (uuid, key, value, type, flags) {
        var res = new SWAC.Defer();

        try {
          var forward = (arguments.length >= 6) ? arguments[5] : true,
            namespaces,
            current = _that,
            i = 0, p = null,
            _beginSetSuccCallback = null;

          _checkKey(key, false, true, false);

          if ((_mine(uuid)) || ((_getflags() & SWAC.DPC.Permissions.Write) === SWAC.DPC.Permissions.Write)) {
            flags = _beautifyFlags(flags);

            // Dots within the key specify nested namespaces.
            if (key.indexOf('.') > -1) {
              namespaces = key.split('.');
              for (i = 0; i < namespaces.length - 1; i++) {
                if (current instanceof SWAC.DPC.Node) {
                  if (SWAC._internal.Utils.indexOf(current.list(), namespaces[i]) >= 0) {
                    current = current.open(namespaces[i]);
                  } else {
                    if (!_mine(uuid)) {
                      res.reject(new SWAC.Reason(17001));
                      return res.promise;
                    } else {
                      current = current.add(uuid, namespaces[i], flags);
                    }

                  }
                } else {
                  res.reject(new SWAC.Reason(17003));
                  return res.promise;
                }
              }
              if (current instanceof SWAC.DPC.Node) {
                p = current.beginSet(uuid, namespaces[namespaces.length - 1], value, type, flags, forward);
                return p;
              } else {
                res.reject(new SWAC.Reason(17003));
                return res.promise;
              }
            }

            _beginSetSuccCallback = function (value, newValue) {
              var retVal = null,
                objRet = null;

              if (!_isProxy) {
                // Component side
                if (newValue && (typeof newValue === 'object') && (typeof newValue.modified === 'boolean')) {
                  retVal = newValue;
                }
                else {
                  objRet = { modified: false };
                  if (!SWAC.DPC.Node.prototype._equals(newValue, value)) {
                    objRet.modified = true;
                    objRet['data'] = newValue;
                  }
                  retVal = objRet;
                }
              }
              else {
                // Container side
                if (!newValue.modified) {
                  newValue['data'] = value;
                }
                retVal = newValue;
              }

              return retVal;
            };

            // Request for a single node
            if (_children[key] === undefined) {
              // Fire to component (if not initiated by base-library itself)
              if (!_mine(uuid)) {
                res.reject(new SWAC.Reason(17001));
                return res.promise;
              } else {
                if (_isProxy) {
                  return _forward(key, 'beginset', { value: value, type: type, flags: flags });
                } else {
                  _children[key] = new SWAC.DPC.Data(_that, _uuid, flags, key, undefined, type, _forceForward); // Create with original owner UUID
                  _children[key].beginSet(uuid, value, forward).then(
                      function (newValue) {
                        res.fulfill(_beginSetSuccCallback(value, newValue));
                      },
                      function (reason) {
                        res.reject(reason);
                      }
                  );
                  return res.promise;
                }
              }
            }
            else {
              // Firing to component (if not initiated by base-library itself) is handled in data-node's set!
              if (_children[key] instanceof SWAC.DPC.Data) {
                _children[key].beginSet(uuid, value, forward).then(
                    function (newValue) {
                      res.fulfill(_beginSetSuccCallback(value, newValue));
                    },
                    function (reason) {
                      res.reject(reason);
                    });
                return res.promise;
              }
              else {
                res.reject(new SWAC.Reason(17004));
              }
            }
          }
          else {
            res.reject(new SWAC.Reason(17001));
          }
        }
        catch (e) {
          res.reject(new SWAC.Reason(17005));
        }
        return res.promise;
      },

      /**
      * Fired when node is added
      *
      * @event onAdded
      * @param {Object} data Object with 'key', 'node', 'flags' properties related to the added node
      * <br/>'value' additional property is present for data node
      */
      _onAdded = new SWAC.Eventing.Publisher('onAdded'),

      /**
       * Fires onAdded event
       *
       * @method fireOnAdded
       * @param {String} key Key of added node
       * @param {String} node 'node' for node, 'data' for dataNode
       * @param {Object} value Value of dataNode added
       * @param {Number} flags flags of the added node
       */
       _fireOnAdded = function (key, node, value, flags) {
         var nKey = _nestedKey(key);
         if (((nKey.indexOf('public.') !== -1) || (nKey.indexOf('private.') !== -1))) {
           nKey = nKey.substr(nKey.indexOf('.') + 1);
         }
         _onAdded.notify(node === 'node' ? { key: nKey, node: node, flags: flags } : { key: nKey, node: node, value: value, flags: flags });
         if (_parent && _parent['_internal'] && _parent['_internal']['fireOnAdded']) {
           _parent._internal.fireOnAdded(nKey, node, value, flags);
         }
       },

      /**
       * Adds a node
       *
       * @method add
       * @param {String} uuid User ID
       * @param {String} key Node key
       * @param {Number} flags Node Flags
       * @param {Object} childNode Istance of node to add. If null, node is created
       * @param {Object} Value of node to add
       * @return {Object} Returns added node
       */
      _add = function (uuid, key, flags, childNode, value) {
        var namespaces,
          current,
          i = 1;
        _checkKey(key, false, true, false);

        // Up-front permission check.
        if (!_canAdd(uuid)) {
          throw new SWAC.AccessViolationException(2001);
        }

        flags = _beautifyFlags(flags);

        // Dots within the key specify nested namespaces.
        if (key.indexOf('.') > -1) {
          namespaces = key.split('.');
          current = _add(uuid, namespaces[0], flags);

          for (i = 1; i < namespaces.length; i++) {
            current = current.add(uuid, namespaces[i], flags);
          }
          return current;
        }

        // Add a single node.
        if (_children[key] === undefined) {

          if ((childNode === null) || (childNode === undefined)) {
            // Fire to component (if not initiated by base-library itself)
            if (_mustForward(uuid)) {
              if (!((!_isProxy) && (_flags === SWAC.DPC._internal.Flags.Stub))) {
                _forward(key, 'add', { flags: flags });
              }
            }
            _children[key] = new SWAC.DPC.Node(_that, _uuid, flags, key, _forceForward);
          }
          else {
            _children[key] = childNode; // // Create with original owner UUID
            if (childNode instanceof SWAC.DPC.Node) {
              _fireOnAdded(key, 'node', null, flags);
            }
            else {
              _fireOnAdded(key, 'data', value, flags);
            }
          }
        }
        return _children[key];
      },

      /**
       * Removes a node
       *
       * @method remove
       * @param {String} uuid User ID
       * @param {String} key Node key
       * @return {Boolean} Returns true if node is successfully removed, false otherwise
       */
      _remove = function (uuid, key) {
        var namespaces,
         current,
         i = 1,
         node,
         children,
         it;
        _checkKey(key, false, true, false);

        // Up-front permission check.
        if (!_canRemove(uuid)) { throw new SWAC.AccessViolationException(2001); }

        // Dots within the key specify nested namespaces.
        if (key.indexOf('.') > -1) {
          namespaces = key.split('.');
          current = _open(namespaces[0]);

          for (i = 1; i < namespaces.length - 1; i++) {
            if (current !== undefined) {
              current = current.open(namespaces[i]);
            }
            else {
              return false;
            }
          }
          if (current === undefined) {
            return false;
          }
          return current.remove(uuid, namespaces[namespaces.length - 1]);
        }

        // Remove a dedicated node.
        if (_children[key] !== undefined) {

          // Deep remove, iterate through all children and children's children...
          if (_children[key] instanceof SWAC.DPC.Node) {
            children = _children[key].list();
            for (it = children.length - 1; it > -1; it--) {
              _children[key].remove(uuid, children[it]);
            }
          }
          node = _children[key];
          node._internal.dirty(true);

          // Fire to component (if not initiated by base-library itself)
          if (_mustForward(uuid)) {
            if (!((!_isProxy) && (_flags === SWAC.DPC._internal.Flags.Stub))) {
              _forward(key, 'remove', {});
            }
          }
          _children[key] = null;
          delete _children[key];

          if ((node instanceof SWAC.DPC.Data) || (_isProxy)) {
            node._internal.fireOnRemoved();
          }

          return true;
        }
        return false;
      },

        /**
       * Gets RW permissions flags of data value into data node
       *
       * @private
       * @method _getPermissions
       * @return {Number} Return permissions flags value present in data node
       */
      _getPermissions = function () {
        var flags = _flags;
        if ((flags & SWAC.DPC._internal.Flags.Stub) === SWAC.DPC._internal.Flags.Stub) {
          flags = flags ^ SWAC.DPC._internal.Flags.Stub;
        }

        if ((flags & SWAC.DPC._internal.Flags.Proxy) === SWAC.DPC._internal.Flags.Proxy) {
          flags = flags ^ SWAC.DPC._internal.Flags.Proxy;
        }

        return flags;
      },

      /**
      * Fired when content of node is changed
      *
      * @event onValueChanged
      * @param {Object} data Object with 'key', 'value' and 'oldValue' properties related to the modified node
      */
      _onValueChanged = new SWAC.Eventing.Publisher('onValueChanged'),

      /**
       * Fires onValueChanged event
       *
       * @method fireOnValueChanged
       * @param {String} key Node key
       * @param {Object} value New value of data node
       * @param {Object} oldValue Old value of data node
       */
       _fireOnValueChanged = function (key, value, oldValue) {
         var nKey = _nestedKey(key);
         if (((nKey.indexOf('public.') !== -1) || (nKey.indexOf('private.') !== -1))) {
           nKey = nKey.substr(nKey.indexOf('.') + 1);
         }
         _onValueChanged.notify({ key: nKey, value: value, oldValue: oldValue });
         if (_parent && _parent['_internal'] && _parent['_internal']['fireOnValueChanged']) {
           _parent._internal.fireOnValueChanged(nKey, value, oldValue);
         }
       },

       /**
      * Fired when node is removed
      *
      * @event onRemoved
      * @param {Object} data Object with 'key' property related to the removed node
      */
      _onRemoved = new SWAC.Eventing.Publisher('onRemoved'),

      /**
       * Fires onRemoved event
       *
       * @method fireOnRemoved
       * @param {String} key Key of removed node
       */
       _fireOnRemoved = function (key) {
         var nKey = key ? _nestedKey(key) : _key;
         if (((nKey.indexOf('public.') !== -1) || (nKey.indexOf('private.') !== -1))) {
           nKey = nKey.substr(nKey.indexOf('.') + 1);
         }
         _onRemoved.notify({ key: nKey });
         if (_parent && _parent['_internal'] && _parent['_internal']['fireOnRemoved']) {
           _parent._internal.fireOnRemoved(nKey);
         }
       },

       /**
      * Fired when data node is going to be changed
      *
      * @event onBeforeValueChanged
      * @param {Object} validateObj  validatedObj Object containing the following properties: key, currentValue, value and reject
      * <br/>key is the key of data node 
      * <br/>currentValue is the current value of data node before updating
      * <br/>value is the new value to set into data node
      * <br/>reject is a boolean that specifies if value can be accepted or not
      */
      _onBeforeValueChanged = new SWAC.Eventing.Publisher('onBeforeValueChanged'),

      /**
       * Fires onBeforeValueChanged event
       *
       * @method fireOnBeforeValueChanged
       */
      _fireOnBeforeValueChanged = function (validateObj) {
        var currentValue = validateObj.currentValue,
          currentKey = _nestedKey(validateObj.key),
          value = validateObj.value;

        _onBeforeValueChanged.notify(validateObj);
        if ((validateObj.reject === null) || (validateObj.reject === undefined)) {
          validateObj.reject = false;
        }
        if ((validateObj.value === null) || (validateObj.value === undefined)) {
          validateObj.value = value;
        }
        if (!validateObj.reject) {
          if (_parent && _parent['_internal'] && _parent['_internal']['fireOnBeforeValueChanged']) {
            validateObj.currentValue = currentValue;
            validateObj.key = currentKey;
            _parent._internal.fireOnBeforeValueChanged(validateObj);
          }
        }
      },

      /**
       * Get public root node
       *
       * @method _getPublicNode
       * @return {Object} Return public root node
       */
      _getPublicNode = function () {
        var res = null;
        if (_key === 'public') {
          return _that;
        }
        if (_parent && _parent['_internal'] && _parent['_internal']['getPublicNode']) {
          res = _parent._internal.getPublicNode();
        }
        else {
          res = _children['public'];
        }
        return res;
      };

  //////////////
  // PUBLIC   //
  //////////////

  this.get = _get;
  this.set = _set;
  this.beginSet = _beginSet;
  this.open = _open;
  this.add = _add;
  this.remove = _remove;
  this.list = _list;
  this.flags = _getPermissions;
  this.nestedKey = _nestedKey;
  this.onBeforeValueChanged = _onBeforeValueChanged.event;

  this._internal = {
    forward: _forward,
    getPublicNode: _getPublicNode,
    fireOnAdded: _fireOnAdded,
    fireOnRemoved: _fireOnRemoved,
    fireOnValueChanged: _fireOnValueChanged,
    fireOnBeforeValueChanged: _fireOnBeforeValueChanged,
    dirty: _dirty,
    mine: _mine

  };
  /**
     * Returns public/private accessor of data node
     *
     * @method access
     * @param {String} uuid ID of user who get accessor. If user ID is owner user ID, private accessor is returned with all permissions, 
     * otherwise public accessor is returned with read and write permissions conditioned by the flags
     * @return {Object} Returns accessor object of node
     */
  this.access = function (uuid) {
    var _isDirty = function () {
      if (_dirty()) {
        throw new SWAC.Exception(1002);
      }
    },
        accessor = { // Default public accessor, additional methods are added only when sufficent permissions are set.
          list: function () {
            _isDirty();
            return _list();
          },
          open: function (key) { // required read-permissions in an older version.
            var r = {};
            _isDirty();
            r = _open(key);
            return ((r instanceof SWAC.DPC.Node || r instanceof SWAC.DPC.Data) ? r.access(uuid) : undefined);
          },
          flags: function () {
            _isDirty();
            return _getPermissions();
          },
          onRemoved: _onRemoved.event,
          onAdded: _onAdded.event
        };

    // Requires permission: read
    if (_mine(uuid) || ((_getflags() & SWAC.DPC.Permissions.Read) === SWAC.DPC.Permissions.Read)) {
      var getter = function (key) {
        _isDirty();
        return _get(uuid, key);
      };
      if (_isProxy && _mustForward(uuid)) {
        accessor.beginGet = getter;
      } else {
        accessor.get = getter;
        accessor.onBeforeValueChanged = _onBeforeValueChanged.event;
      }
      accessor.onValueChanged = _onValueChanged.event;
    }

    // Requires permission: write
    if (_mine(uuid) || ((_getflags() & SWAC.DPC.Permissions.Write) === SWAC.DPC.Permissions.Write)) {
      accessor.set = function (key, value, type, flags) {
        var forward = (arguments.length >= 5) ? arguments[4] : true;
        var r = {};
        _isDirty();
        r = _set(uuid, key, value, type, flags, forward);
        return (r instanceof SWAC.DPC.Data ? r.access(uuid) : undefined);

      };
      accessor.beginSet = function (key, value, type, flags) {
        var forward = (arguments.length >= 5) ? arguments[4] : true;
        var res = new SWAC.Defer();
        if (_dirty()) {
          res.reject(new SWAC.Reason(17002));
          return res.promise;
        }
        return _beginSet(uuid, key, value, type, flags, forward);
      };
    }

    // Only available on stubs (that is usually the original component within the iframe)
    if (_canAdd(uuid)) { // Currently Add and Remove require same permissions
      accessor.remove = function (key) {

        _isDirty();
        return _remove(uuid, key);
      };
      accessor.add = function (key, flags) {
        var r = {};
        _isDirty();
        r = _add(uuid, key, flags);
        return (r instanceof SWAC.DPC.Node ? r.access(uuid) : undefined);
      };
    }

    return accessor;
  };

  if (parent instanceof SWAC.DPC.Node) {
    if ((parent._internal.mine(uuid))) {
      _parent = parent;
      parent.add(uuid, key, flags, _that);
    }
    else {
      throw new SWAC.AccessViolationException(2001);
    }
  }
  else {
    _parent = undefined;
  }
};

/**
* Compare two objects
*
* @private
* @method _equals
* @param {Object} object1 first object to compare
* @param {Object} object2 second object to compare
* @return {Bool} returns true if objects are equals, otherwise false
*/
SWAC.DPC.Node.prototype._equals = function (object1, object2) {
  var retVal = true,
    object1Type = typeof (object1),
    object2Type = typeof (object2),
    i,
    object1PropList = null,
    object2PropList = null;

  if (object1Type !== object2Type) {
    // different types
    retVal = false;
  }
  else {
    if (object1Type === 'object') {
      if (SWAC._internal.Utils.isArray(object1) && SWAC._internal.Utils.isArray(object2)) {
        // check for arrays
        if (object1.length !== (object2.length)) {
          // different array lengths
          retVal = false;
        }
        else {
          for (i = 0; i < object1.length; i++) {
            if (!SWAC.DPC.Node.prototype._equals(object1[i], object2[i])) {
              // different array items found
              retVal = false;
              break;
            }
          }
        }
      }
      else {
        if (SWAC._internal.Utils.isArray(object1) || SWAC._internal.Utils.isArray(object2)) {
          // different objects
          retVal = false;
        }
        else {
          //check first null
          if (object1 === null && object2 === null) {
            retVal = true;
          }
          else if (object1 === null || object2 === null) {
            retVal = false;
          }
          else {
            // check for objects               
            object1PropList = SWAC._internal.Utils.getOwnPropertyNames(object1);
            object2PropList = SWAC._internal.Utils.getOwnPropertyNames(object2);
            if (object1PropList.length !== object2PropList.length) {
              // different property counts
              retVal = false;
            }
            else {
              for (i = 0; i < object1PropList.length; i++) {
                // check for property
                if (object2PropList.indexOf(object1PropList[i]) === -1) {
                  // property not found
                  retVal = false;
                  break;
                }
                else {
                  // check for property value
                  if (!SWAC.DPC.Node.prototype._equals(object1[object1PropList[i]], object2[object1PropList[i]])) {
                    // different property value found
                    retVal = false;
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
    else {
      retVal = (object1 === object2);
    }
  }

  return retVal;
};


///////////////////////////////////////////
// lib/base/dpc/permissions.js

/**
 * Permissions flag for a dpc
 *
 * @class SWAC.DPC.Permissions
 * @constructor
 */
SWAC.DPC.Permissions = {
    /**
     * No permission
     *
     * @property None
     * @type Numeric
     * @default 0
     */
    None: 0,
    /**
     * Read permission
     *
     * @property Read
     * @type Numeric
     * @default 1
     */
    Read: 1,
    /**
     * Write permission
     *
     * @property Write
     * @type Numeric
     * @default 2
     */
    Write: 2
};


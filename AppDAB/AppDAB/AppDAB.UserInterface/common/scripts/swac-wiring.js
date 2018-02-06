/* Version 1.3.0, copyright (C) 2017, Siemens AG. All Rights Reserved. */


///////////////////////////////////////////
// lib/container/wire.js

/**
 * Object that manage wiring between inputs object (SWAC Component / Custom Javascript Object/ Other wire) and output object (SWAC Componet / Custom Javascript Object)
 *
 * @class SWAC.Wire
 * @constructor
 * @parameter {String} name Name of the wire
 * @parameter {Object} inputDescription input object of wire
 * @parameter {Object} outputDescription output object of wire
 * @parameter {Object} converter converter for the wiring
 * @parameter {Object} parameter additional parameter
 * @parameter {Object} options options for the wire
 * @parameter {Object} store object used by converter. Same instance used every time converter is called
 * 
 */
SWAC.Wire = function (name, inputDescription, outputDescription, converter, parameter, options, store) {

    //////////////
    // PRIVATE   //
    //////////////

    var _that = this,

        _name = name,

        _converter = converter,

        _parameter = parameter,

        _options = options || {},

        _input = inputDescription,

        _output = outputDescription,

        _state = 'unwired',

        _subscriptions = [],
        _valueCache = [],
        _converterStore = store || {},

        _setOutput = null,

        _onWired = new SWAC.Eventing.Publisher('onWired'),
        _onUnwired = new SWAC.Eventing.Publisher('onUnWired'),
        _onValueChanged = new SWAC.Eventing.Publisher('onValueChanged'),

          /**
         * Remove subscription to all input sources
         *
         * @protected
         * @method unwire
         * @param {boolean} clean if true wire is mantained 
         * @return {object} returns if unwire has been successfully executed
         */
        _unwire = function (clean) {
            var dep, obj, hdl, i = 0;

            clean = clean || false;

            for (i = _subscriptions.length - 1; i >= 0; i--) {
                dep = _subscriptions[i][0];
                obj = _subscriptions[i][1];
                hdl = _subscriptions[i][2];
                try {
                    dep[obj].unsubscribe(hdl);
                } catch (ex) {
                    return false;
                }
            }

            // Remove subscriptions
            _subscriptions = [];

            // Remove cache
            _valueCache = [];
            _setOutput = null;

            if (!clean) {
                _state = 'unwired';
                if (_options.removeOnUnwired) {
                    SWAC.Wiring._internal.remove(_that);
                }
                _onUnwired.notify({ name: _name });
                SWAC.Wiring._internal.toUnwired(_that);
            }
            return true;
        },

        /**
         * Remove the wire
         *
         * @method remove
         * @return {Boolean} returns True if wire deletion succeeded, false otherwise
         */
        _remove = function () {
            var retVal = true;
            if (_state !== 'unwired') {
                retVal = _unwire();
            }
            retVal = SWAC.Wiring._internal.remove(_that);
            return retVal;
        },

        /**
        * Executes the wire
        *
        * @private
        * @method _executeWire
        * @param {Numeric} inputIdx Index of input that triggers the wiring
        */
        _executeWire = function (inputIdx) {
            var output = null;

            try {
                output = _converter ? _converter(_valueCache, _parameter, inputIdx, _converterStore) : _valueCache; // Direct pass through of no converter is set.
            }
            catch (err) {
                if (err instanceof SWAC.Wiring.CancelExecutionException) {
                    if (_options.removeOnFailure) {
                        _remove();
                    } // does unwire internally
                    else { _unwire(); } // Remove subscriptions made so far.
                    return;
                }
                else {
                    if (_options.removeOnFailure) {
                        _remove();
                    } // does unwire internally
                    else { _unwire(); } // Remove subscriptions made so far.
                    throw err;
                }
            }
            try {
                if (_state === 'loose') {
                    _onValueChanged.notify(output);
                } else if (_setOutput) {
                    // Output can be either a DPC or a method call
                    _setOutput(output);
                }
            }
            catch (e) {
                if (_options.removeOnFailure) {
                    _remove();
                } // does unwire internally
                else { _unwire(); } // Remove subscriptions made so far.
            }
        },

        /**
        * Puts the entry in cache
        *
        * @private
        * @method _setCacheEntry
        * @param {String} index position in the cache of the entry
        */
        _setCacheEntry = function (index) {
            return function (value) {
                _valueCache[index] = value;
            };
        },

        _visitedWires = [],

        /**
         * Calculate initial value for a consumer component depending on intial value of its providers
         *
         * @private
         * @method initialValue
         * @param {Object} wire wire to analyze
         * @return {Object} initial value of wire
        */
        _initialValue = function (wire) {
            var res = null,
                comp, source, node, values = [],
                succCallback = function () { return function (value) { res = value; }; },
                succCallback2 = function () { return function (value) { values.push(value); }; },
                i = 0;

            // if no input, no initial value
            if ((wire.description.input.length === 0) || (wire.description.input === null) || (wire.description.input === undefined)) {
                return null;
            }
            if (wire.description.converter) {
                for (i = 0; i < wire.description.input.length; i++) {

                    if (wire.description.input[i].wire) {
                        if (SWAC._internal.Utils.indexOf(_visitedWires, wire.description.input[i].wire) === -1) {
                            _visitedWires.push(wire.description.input[i].wire);
                            values.push(_initialValue(SWAC.Wiring.get({ name: wire.description.input[i].wire })));
                        }
                        else {
                            // There's a cyclic wiring... no initial value
                            return null;
                        }

                    }
                    else {
                        if (wire.description.input[i].component && wire.description.input[i].dpc) {
                            comp = SWAC.Container.get({ name: wire.description.input[i].component });
                            node = comp.dpc.open(wire.description.input[i].dpc);
                            if (node) {
                                node.beginGet().then(succCallback2());
                            }
                        }
                        else if (wire.description.input[i].custom) {
                            source = typeof (wire.description.input[i].custom) === 'object' ? wire.description.input[i].custom : window[wire.description.input[i].custom];
                            node = source.dpc.open(wire.description.input[i].dpc);
                            if (node) {
                                values.push(node.get());
                            }
                        }
                    }
                }
                res = wire.description.converter(values, wire.description.parameter);
            }
            else {
                // if no convert, intial value of first input
                if (wire.description.input[0].wire) {
                    if (SWAC._internal.Utils.indexOf(_visitedWires, wire.description.input[0].wire) === -1) {
                        _visitedWires.push(wire.description.input[0].wire);
                        res = _initialValue(SWAC.Wiring.get({ name: wire.description.input[0].wire }));
                    }
                    else { // There's a cyclic wiring... no initial value
                        return null;
                    }
                }
                else {
                    if (wire.description.input[0].component) {
                        comp = SWAC.Container.get({ name: wire.description.input[0].component });
                        node = comp.dpc.open(wire.description.input[0].dpc);
                        if (node) {
                            node.beginGet().then(succCallback());
                        }
                    }
                    else if (wire.description.input[0].custom) {
                        source = typeof (wire.description.input[0].custom) === 'object' ? wire.description.input[0].custom : window[wire.description.input[0].custom];
                        node = source.dpc.open(wire.description.input[0].dpc);
                        if (node) {
                            res = node.get();
                        }
                    }
                }
            }
            return res;
        },

        /**
         * Subscribe to all input sources and connect the components
         *
         * @protected
         * @method wire
         * @return {Boolean} returns if wire has been successfully executed
         */
        _wire = function () {
            var eventHandler,
              node,
              dpcHandler,
              entry,
              i = 0,
              comp,
              wire,
              wireHandler,
              apiout,
              dpcout,
              apiInterface, intfItem, interfaceName,
              source, target,
              createHandler = function (index, dpc) {
                  return function (event) {
                      if (!dpc) {
                          _valueCache[index] = event.data;
                          try {
                              _executeWire(index);
                          }
                          catch (ex) {
                          }
                      }
                      else {
                          if (dpc.beginGet) {
                              dpc.beginGet().then(function (value) {
                                  _valueCache[index] = value;
                                  try {
                                      _executeWire(index);
                                  }
                                  catch (ex) {
                                  }
                              });
                          }
                          else {
                              _valueCache[index] = dpc.get();
                              try {
                                  _executeWire(index);
                              }
                              catch (ex) {
                              }
                          }
                      }
                  };
              };

            try {
                // Subscribe to all input sources
                var succCallback = function (idx) {
                    return function (value) {
                        _setCacheEntry(idx)(value);
                        dpcHandler();
                    };
                };
                for (i = 0; i < _input.length; i++) {
                    entry = _input[i];
                    if (entry.component) {
                        comp = SWAC.Container.get({ name: entry.component });
                        if (entry.event) {
                            if ((entry.event.indexOf('.') === -1) && comp.proxy[entry.event]) {
                                eventHandler = createHandler(i);
                                comp.proxy[entry.event].subscribe(eventHandler);
                                _subscriptions.push([comp.proxy, entry.event, eventHandler]);
                                _valueCache.push(null);
                            } else if (entry.event.indexOf('.') !== -1) {

                                apiInterface = entry.event.substr(entry.event.lastIndexOf('.') + 1);
                                interfaceName = entry.event.substr(0, entry.event.lastIndexOf('.'));

                                intfItem = SWAC.Wiring._internal.getInterfaceItem(entry.component, interfaceName);
                                if (intfItem !== null) {
                                    if (intfItem.intf[apiInterface]) {
                                        eventHandler = createHandler(i);
                                        intfItem.intf[apiInterface].subscribe(eventHandler);
                                        _subscriptions.push([intfItem.intf, apiInterface, eventHandler]);
                                        _valueCache.push(null);
                                    }
                                }
                            }
                        } else if (entry.dpc && comp.dpc) {
                            node = comp.dpc.open(entry.dpc);
                            if (node) {
                                dpcHandler = createHandler(i, node);
                                node.onValueChanged.subscribe(dpcHandler);
                                _subscriptions.push([node, 'onValueChanged', dpcHandler]);
                                _valueCache.push(null);
                                node.beginGet().then(
                                    succCallback(i)
                                    );
                            }
                        }
                    }
                    else if (entry.custom) {
                        source = typeof (entry.custom) === 'object' ? entry.custom : window[entry.custom];
                        if (entry.event && source[entry.event]) {
                            eventHandler = createHandler(i);
                            source[entry.event].subscribe(eventHandler);
                            _subscriptions.push([source, entry.event, eventHandler]);
                            _valueCache.push(null);
                        } else if (entry.dpc && source.dpc) {
                            node = source.dpc.open(entry.dpc);
                            if (node) {
                                dpcHandler = createHandler(i, node);
                                node.onValueChanged.subscribe(dpcHandler);
                                _subscriptions.push([node, 'onValueChanged', dpcHandler]);
                                _valueCache.push(null);
                                _valueCache[i] = node.get();
                                dpcHandler();
                            }
                        }
                    } else if (entry.wire) {
                        wire = SWAC.Wiring.get({ name: entry.wire });
                        wireHandler = createHandler(i);
                        wire.onValueChanged.subscribe(wireHandler);
                        _subscriptions.push([wire, 'onValueChanged', wireHandler]);
                        _valueCache.push(_initialValue(wire));
                    }
                }
            } catch (ex) {
                if (_options.removeOnFailure) {
                    _remove();
                } // does unwire internally
                else { _unwire(); } // Remove subscriptions made so far.
                return false;
            }

            if (_output) {
                try {
                    if (_output.component && _output.method) {
                        if (_output.method.indexOf('.') === -1) {
                            apiout = SWAC.Container.get({ name: _output.component });
                            _setOutput = function (value) {
                                if (!(value instanceof Array)) {
                                    value = [value];
                                }
                                apiout.proxy[_output.method].apply(apiout, value);
                            };
                        }
                        else {
                            // Method from an Interface
                            apiInterface = _output.method.substr(_output.method.lastIndexOf('.') + 1);
                            interfaceName = _output.method.substr(0, _output.method.lastIndexOf('.'));
                            intfItem = SWAC.Wiring._internal.getInterfaceItem(_output.component, interfaceName);
                            if (intfItem !== null) {
                                _setOutput = function (value) {
                                    if (!(value instanceof Array)) {
                                        value = [value];
                                    }
                                    intfItem.intf[apiInterface].apply(intfItem.intf, value);
                                };
                            }
                        }
                    }
                    else if (_output.component && _output.dpc) {
                        dpcout = SWAC.Container.get({ name: _output.component });
                        if (dpcout.dpc) {
                            _setOutput = function (value) {
                                dpcout.dpc.open(_output.dpc).set(value);
                            };
                        } else {
                            _setOutput = null;
                        }
                    } else if (_output.custom) {
                        target = typeof (_output.custom) === 'object' ? _output.custom : window[_output.custom];
                        if (_output.method) {
                            _setOutput = function (value) {
                                if (!(value instanceof Array)) {
                                    value = [value];
                                }
                                target[_output.method].apply(target, value);
                            };
                        } else if (_output.dpc) {
                            _setOutput = function (value) {
                                target.dpc.open(_output.dpc).set(value);
                            };
                        }
                    }
                    _state = 'wired';
                    _onWired.notify({ name: _name });
                    SWAC.Wiring._internal.toWired(_that);
                }
                catch (ex) {
                    if (_options.removeOnFailure) {
                        _remove();
                    } // does unwire internally
                    else { _unwire(); } // Remove subscriptions made so far.
                    return false;
                }

            }
            else {
                _state = 'loose';
                _onWired.notify({ name: _name, loose: true });
                SWAC.Wiring._internal.toLoose(_that);
            }
            return true;
        };


    //////////////
    // PUBLIC   //
    //////////////

    // No return-block here to keep object type SWAC.Wire (otherwise untyped <object>)

    // API
    this.remove = _remove;

    // EVENTS

    /**
     * Fired when components are present and wire is activated
     *
     * @event onWired
     * @param {Object} data Object with 'name' string property related to the activated wire
     * <br/>'loose' additional boolean property is present for wire in loose status
     */
    this.onWired = _onWired.event;

    /**
     * Fired when one or more components is missing and wire is not activated
     *
     * @event onUnwired
     * @param {Object} data Object with 'name' string property related to the non-activated wire
     */
    this.onUnwired = _onUnwired.event;

    /**
     * Fired when a value of data node is changed 
     *
     * @event onValueChanged
     * @param {Object} output wire output
     */
    this.onValueChanged = _onValueChanged.event;

    // INTERNAL
    this._internal = {
        wire: _wire,
        unwire: _unwire
    };

    /**
    * Description property is a struct that groups parameters of wire
    *
    * @property description
    * @type object
    */
    this.description = {
        /**
        * Input info
        *
        * @property description.input
        * @type object
        */
        input: _input,
        /**
         * Output info. If not specified, wire is created and can be use like input for another wire creation
         *
         * @property description.output
         * @type object
         */
        output: _output,
        /**
        * Wire name assigned by SWAC container
        *
        * @property description.name
        * @type string
        */
        name: _name,
        /**
         * State of the wire object
         *
         * @property description.state
         * @type string
         */
        state: function () { return (_state === 'loose' ? 'wired' : _state); },
        /**
         * Function that will be called when processing input data
         *
         * @property description.converter
         * @type function
         */
        converter: _converter,
        /**
         * Extra parameter used by converter
         *
         * @property description.parameter
         * @type object
         */
        parameter: _parameter,
        /**
         * Object used by converter. Same instance used every time converter is called
         *
         * @property description.store
         * @type object
         */
        store: _converterStore
    };
};


///////////////////////////////////////////
// lib/container/wiring.js

/**
 * SWAC.Wiring is an single instance object that permits to create/destroy links between SWAC components. 
 *
 * @class SWAC.Wiring
 * @constructor
 * 
 */
SWAC.Wiring = (function () {

    //////////////
    // PRIVATE  //
    //////////////

    var
        _canWire,

        _checkOutputWirePreconditions,

        _checkWirePreconditions,

        _wiredWires = {}, // Fully-established wires.

        _looseWires = {}, // established wires with dangling end. (Remain dangling for further wires even when already some wire got connected)

        _unwiredWires = {}, // Wires that cannot be set up for the moment (due to missing preconditions, such as input/output)

        _componentInterfaces = [], // Interface list to avoid multiple request of the same interface

              /**
         * Retrieve an interface item from internal collection.
         *
         * @protected
         * @method getInterfaceItem
         * @param {String} componentName Name of the component.
         * @param {String} interfaceName Name of the interface.
         * @return {object} the required interface item
         */
        _getInterfaceItem = function (componentName, interfaceName) {
            var item;
            for (item in _componentInterfaces) {
                if ((_componentInterfaces[item].componentName === componentName) && (_componentInterfaces[item].interfaceName === interfaceName)) {
                    return _componentInterfaces[item];
                }
            }
            return null;
        },

         /**
         * Remove all component's interface items from internal collection.
         *
         * @private
         * @method _removeFromInterfaceList
         * @param {String} componentName Name of the component.
         * @param {String} interfaceName Name of the interface.
         */
        _removeFromInterfaceList = function (componentName, interfaceName) {
            var i;

            for (i = _componentInterfaces.length - 1; i >= 0; i--) {
                if (interfaceName) {
                    if ((_componentInterfaces[i].componentName === componentName) && (_componentInterfaces[i].interfaceName === interfaceName)) {
                        _componentInterfaces.splice(i, 1);
                    }
                }
                else {
                    if (_componentInterfaces[i].componentName === componentName) {
                        _componentInterfaces.splice(i, 1);
                    }
                }
            }
        },

         /**
         * Get and insert a component interface into the internal collection.
         *
         * @private
         * @method _beginGetInterface
         * @param {Object} component Component object.
         * @param {Object} interfaceName Name of the interface.
         */
        _beginGetInterface = function (component, interfaceName) {
            var componentInterfacesItem = {};

            component.interfaces.beginGet(interfaceName).then(
              function (inf) {
                  componentInterfacesItem = _getInterfaceItem(component.name(), interfaceName);
                  if (componentInterfacesItem !== null) {
                      componentInterfacesItem.intf = inf;
                  }
                  _canWire();
              },
              function (reason) {
                  _removeFromInterfaceList(component.name(), interfaceName);
              });
        },
        /**
         * Checks preconditions (input) before create wiring
         *
         * @private
         * @method _checkInputWirePreconditions
         * @param {object} wire wire to check
         * @return {object} if input is valid for wiring
         */
        _checkInputWirePreconditions = function (wire) {
            var i = 0, incoming,
                entry, comp, node, source,
                eventName, interfaceName, intfItem, componentInterfacesItem = {};

            incoming = wire.description.input;

            for (i = 0; i < incoming.length; i++) {
                entry = incoming[i];
                if (entry.component) {
                    comp = SWAC.Container.get({ name: entry.component });

                    if (!comp) {
                        return false;
                    }

                    if (entry.event) {
                        if (entry.event.indexOf('.') === -1) {
                            if (!comp.proxy[entry.event]) {
                                return false;
                            }
                        } else {
                            eventName = entry.event.substr(entry.event.lastIndexOf('.') + 1);
                            interfaceName = entry.event.substr(0, entry.event.lastIndexOf('.'));

                            intfItem = _getInterfaceItem(entry.component, interfaceName);
                            if (intfItem !== null) {
                                if (intfItem.intf !== null) {
                                    if (!intfItem.intf[eventName]) {
                                        return false;
                                    }
                                }
                                else {
                                    return false;
                                }
                            }
                            else {
                                if (comp.interfaces) {
                                    if (comp.interfaces.has(interfaceName)) {
                                        componentInterfacesItem = {
                                            componentName: entry.component,
                                            interfaceName: interfaceName,
                                            intf: null
                                        };
                                        _componentInterfaces.push(componentInterfacesItem);
                                        // Retrieve interface from component
                                        _beginGetInterface(comp, interfaceName);
                                    }
                                }
                                return false;
                            }
                        }
                    } else if (entry.dpc) {
                        if (!comp.dpc) {
                            return false;
                        } else {
                            node = comp.dpc.open(entry.dpc);
                            if (!node) {
                                return false;
                            }
                        }
                    } else {
                        return false;
                    }
                } else if (entry.custom) {
                    source = typeof (entry.custom) === 'object' ? entry.custom : window[entry.custom];
                    if (!source) {
                        return false;
                    }
                    if (entry.method) {
                        if ((!source[entry.method]) || (typeof (source[entry.method]) !== 'function')) {
                            return false;
                        }
                    }
                    else if (entry.event) {
                        if ((!source[entry.event]) || (typeof (source[entry.event]) !== 'object') || (!(source[entry.event])['subscribe'])) {
                            return false;
                        }
                    }
                    else if (entry.dpc) {
                        if (!source.dpc) {
                            return false;
                        } else {
                            node = source.dpc.open(entry.dpc);
                            if (!node) {
                                return false;
                            }
                        }
                    }
                    else {
                        return false;
                    }
                } else if (entry.wire) {
                    if (!_looseWires[entry.wire]) {
                        return false;
                    }
                } else {
                    return false;
                }
            }

            return true;
        },

        _onWired = new SWAC.Eventing.Publisher('onWired'),
        _onUnwired = new SWAC.Eventing.Publisher('onUnwired'),
        _onFailure = new SWAC.Eventing.Publisher('onFailure'),

         /**
         * Wire the specified wire object, if it is successful it fires onWire event, otherwise fires onFailure event
         *
         * @private
         * @method _wire
         * @param {object} wire wire object to wire
         */
        _wire = function (wire) {
            if (wire._internal.wire()) {
                _onWired.notify({ name: wire.description.name });
            } else {
                _onFailure.notify({ name: wire.description.name, message: 'Wiring system detected a potential wire, but wiring failed.' });
            }
        },

         /**
         * Unwire the specified wire object, if it is successful it fires onUnwired event, otherwise fires onFailure event
         *
         * @private
         * @method _unwire
         * @param {object} wire wire object to unwire
         */
        _unwire = function (wire) {
            if (wire) {
                if (wire._internal.unwire()) {
                    _onUnwired.notify({ name: wire.description.name });
                } else {
                    _onFailure.notify({ name: wire.description.name, message: 'Wiring system detected a invalid wire, but unwiring failed.' });
                }
            } else {
                _onFailure.notify({ name: wire.description.name, message: 'Wiring system detected a null wire, unwiring failed.' });
            }
        },

        /**
         * Checks all wires. If check on preconditions fail existing wires will be unwired
         *
         * @private
         * @method _checkWires
         * @return {Boolean} returns if precondition fails or not.
         */
        _checkWires = function () {
            var a, b,
              wired,
              loose;

            var check = function (wire, remove) {
                var result;
                if (!wire) {
                    return false;
                }
                result = _checkWirePreconditions(wire);
                if (!result) {
                    _unwire(wire);
                }
                return result;
            };

            for (a in _wiredWires) {
                if (_wiredWires.hasOwnProperty(a)) {
                    wired = _wiredWires[a];
                    // Look through all sources and the target, if still valid.
                    check(wired);
                }
            }

            for (b in _looseWires) {
                if (_looseWires.hasOwnProperty(b)) {
                    loose = _looseWires[b];
                    // Look through all sources and the target, if still valid.
                    check(loose);
                }
            }
        },

        /**
          * Checks DPCs on the container and corresponding wires
          *
          * @private
          * @method _observeContainerDpcs
          * @param {object} wire wire to check
          */
        _observeContainerDpcs = function (wire) {
            var obj, i,
              custom,
              createHandler = function (add) {
                  return add ? function (event) {
                      _canWire();
                  } : function (event) {
                      _checkWires();
                  };
              };

            if (wire.description.input) {
                for (i = 0; i < wire.description.input.length; i++) {
                    custom = wire.description.input[i].custom;
                    if (custom) {
                        obj = typeof (custom) === 'object' ? custom : window[custom];
                        if (obj && obj.dpc) {
                            obj.dpc.onAdded.subscribe(createHandler(true));
                            obj.dpc.onRemoved.subscribe(createHandler(false));
                        }
                    }
                }
            }
            if (wire.description.output !== undefined) {
                if (wire.description.output.custom) {
                    obj = typeof (wire.description.output.custom) === 'object' ? wire.description.output.custom : window[wire.description.output.custom];
                    if (obj && obj.dpc) {
                        obj.dpc.onAdded.subscribe(createHandler(true));
                        obj.dpc.onRemoved.subscribe(createHandler(false));
                    }
                }
            }
        },

              /**
        * Find wires that have a specific item as input or output
        *
        * @private
        * @method _findWiresIO
        * @param {Array} wireList array to scan for required wires
        * @param {String} entityValue item fo find
        * @param {String} context item type
        * @param {String} direction search for input or output
        * @return {Array} list of filtered wires. 
        */
        _findWiresIO = function (wireList, entityValue, context, direction) {
            var wire, wireIn,
                foundList = [];

            for (wire in wireList) {
                if (wireList[wire].description[direction]) {
                    if (SWAC._internal.Utils.isArray(wireList[wire].description[direction])) {
                        for (wireIn in wireList[wire].description[direction]) {
                            if (wireList[wire].description[direction][wireIn][context] === entityValue) {
                                foundList.push(wireList[wire]);
                            }
                        }
                    }
                    else if (wireList[wire].description[direction][context] === entityValue) {
                        foundList.push(wireList[wire]);
                    }
                }
            }

            return foundList;
        },

        /**
        * Remove duplicate elements from the given array
        *
        * @private
        * @method _removeDuplicateItemsFromArray
        * @param {Array} array array to clean
        * @return {Array} list without duplicate elements. 
        */
        _removeDuplicateItemsFromArray = function (array) {
            var i, j,
              foundList = array.concat();

            for (i = 0; i < foundList.length; i++) {
                for (j = i + 1; j < foundList.length; j++) {
                    if (foundList[i] === foundList[j]) {
                        foundList.splice(j--, 1);
                    }
                }
            }

            return foundList;
        },

              /**
        * Find wires by name
        *
        * @private
        * @method _findWiresName
        * @param {Array} wireList array to scan for required wires
        * @param {String} name name fo find
        * @return {Array} list of filtered wires. 
        */
        _findWiresName = function (wireList, name) {
            var wire, foundList = [];

            for (wire in wireList) {
                if (wireList[wire]) {
                    if (wireList[wire].description.name === name) {
                        foundList.push(wireList[wire]);
                    }
                }
            }

            return foundList;
        },

         /**
         * Return wire(s) instance(s), if filter is null or undefined, result contains all SWAC wires.
         * Otherwise the result can be filter by filter properties:
         * - name: wire name to search. If found, the result will be the wire (string)
         * - wired: return all wires that are linked and ready for execution (boolean)
         * - unwired: return all wires that are unlinked and not working (boolean)
         * - loose: return all wires without output (boolean)
         * - inputComponents: return all wires that have at least one component (specified by name) as input (string array)
         * - outputComponents: return all wires that have the method (specified by name) as output (string array)
         * - inputs: search in input parameters (string or object array)
         * - output: search in output parameter (string or object)
         * @method get
         * @param {Object} filter filter object. 
         * @return {Object} a SWAC.Wire or an array of SWAC.Wire. 
         */
        _get = function (filter) {
            var arr = [],
              tempArr,
              _input = null,
              _output = null;

            filter = filter || { wired: true, unwired: true, loose: true };

            if ((filter.wired === undefined || filter.wired === null) &&
              (filter.loose === undefined || filter.loose === null) &&
              (filter.unwired === undefined || filter.unwired === null)) {
                filter.wired = filter.loose = filter.unwired = true;
            }

            if (filter.wired) {
                for (var a in _wiredWires) {
                    if (_wiredWires.hasOwnProperty(a)) {
                        arr.push(_wiredWires[a]);
                    }
                }
            }
            if (filter.loose) {
                for (var b in _looseWires) {
                    if (_looseWires.hasOwnProperty(b)) {
                        arr.push(_looseWires[b]);
                    }
                }
            }
            if (filter.unwired) {
                for (var c in _unwiredWires) {
                    if (_unwiredWires.hasOwnProperty(c)) {
                        arr.push(_unwiredWires[c]);
                    }
                }
            }

            if (filter.name) {
                arr = _findWiresName(arr, filter.name);
            }

            if (filter.inputComponents) {
                if (SWAC._internal.Utils.isArray(filter.inputComponents)) {
                    for (_input in filter.inputComponents) {
                        if (filter.inputComponents.hasOwnProperty(_input)) {

                            arr = _findWiresIO(arr, filter.inputComponents[_input], 'component', 'input');
                        }
                    }
                }
            }

            if (filter.outputComponents) {
                if (SWAC._internal.Utils.isArray(filter.outputComponents)) {
                    for (_output in filter.outputComponents) {
                        if (filter.outputComponents.hasOwnProperty(_output)) {

                            arr = _findWiresIO(arr, filter.outputComponents[_output], 'component', 'output');
                        }
                    }
                }
            }

            if (filter.inputs) {
                if (SWAC._internal.Utils.isArray(filter.inputs)) {
                    for (_input in filter.inputs) {
                        if (filter.inputs.hasOwnProperty(_input)) {

                            tempArr = [];
                            if (typeof filter.inputs[_input] === 'string') {
                                tempArr = tempArr.concat(_findWiresIO(arr, filter.inputs[_input], 'component', 'input'));
                                tempArr = tempArr.concat(_findWiresIO(arr, filter.inputs[_input], 'wire', 'input'));
                                arr = _removeDuplicateItemsFromArray(tempArr);
                            }
                            else {
                                if (typeof filter.inputs[_input] === 'object') {
                                    if (filter.inputs[_input] instanceof SWAC.Component) {
                                        arr = _findWiresIO(arr, filter.inputs[_input].name(), 'component', 'input');
                                    }
                                    else {
                                        if (filter.inputs[_input] instanceof SWAC.Wire) {
                                            arr = _findWiresIO(arr, filter.inputs[_input].description.name, 'wire', 'input');
                                        }
                                        else {
                                            arr = _findWiresIO(arr, filter.inputs[_input], 'custom', 'input');
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }

            if (filter.output) {
                if (typeof filter.output === 'string') {
                    arr = _findWiresIO(arr, filter.output, 'component', 'output');
                }
                else {
                    if (typeof filter.output === 'object') {
                        if (filter.output instanceof SWAC.Component) {
                            arr = _findWiresIO(arr, filter.output.name(), 'component', 'output');
                        }
                        else {
                            arr = _findWiresIO(arr, filter.output, 'custom', 'output');
                        }
                    }
                }
            }

            if (arr.length === 1) {
                return arr[0];
            }
            else {
                return arr;
            }
        },

        /**
         * Check wire params
         *
         * @private
         * @method _checkForWireMembers
         * @param {Object} arg it should be a simple object containing information about wire.
         * @return {Boolean} returns true if wire members are ready for wiring, false otherwise
         */
        _checkForWireMembers = function (arg) {
            var i = 0,
              entryCustomOutput,
              entryCustom;

            if (!arg.name || !arg.input) {
                _onFailure.notify({ name: arg.name, message: 'Invalid argument(s)' });
                return false;
            }

            if (_get({ name: arg.name }) instanceof SWAC.Wire) {
                _onFailure.notify({ name: arg.name, message: 'Wire with this name already exists' });
                return false;
            }

            for (i = 0; i < arg.input.length; i++) {
                if (!arg.input[i].component && !arg.input[i].wire && !arg.input[i].custom) {
                    _onFailure.notify({ name: arg.name, message: 'Input component does not exist' });
                    return false;
                }

                if (!arg.input[i].wire && !arg.input[i].event && !arg.input[i].dpc) {
                    _onFailure.notify({ name: arg.name, message: 'Invalid argument(s)' });
                    return false;
                }

                if (arg.input[i].custom) {
                    if (typeof (arg.input[i].custom) === 'object') {
                        entryCustom = arg.input[i].custom;
                    } else {
                        entryCustom = window[arg.input[i].custom];
                    }

                }
                if (entryCustom && arg.input[i].event && (!entryCustom[arg.input[i].event] || (typeof (entryCustom[arg.input[i].event].subscribe) !== 'function'))) {
                    _onFailure.notify({ name: arg.name, message: 'Invalid event for javascript object' });
                    return false;
                }
            }

            if (arg.output && arg.output.custom) {
                if (typeof (arg.output.custom) === 'object') {
                    entryCustomOutput = arg.output.custom;
                }
                else {
                    entryCustomOutput = window[arg.output.custom];
                }
            }
            if (arg.output && entryCustomOutput && arg.output.method && (!entryCustomOutput[arg.output.method] || (typeof (entryCustomOutput[arg.output.method]) !== 'function'))) {
                _onFailure.notify({ name: arg.name, message: 'Invalid method for javascript object' });
                return false;
            }

            if (arg.converter && typeof (arg.converter) !== 'function') {
                _onFailure.notify({ name: arg.name, message: 'Invalid converter type' });
                return false;
            }

            if (!arg.options || arg.options.removeOnFailure === null || arg.options.removeOnFailure === undefined) {
                if (!arg.options) {
                    arg.options = {};
                }
                arg.options.removeOnFailure = true;
            }

            return true;
        },

     _onCreated = new SWAC.Eventing.Publisher('onCreated'),
        /**
         * Creates wiring between SWAC components or other wires.
         *
         * @method create
         * @param {Object} arg it should be a simple object or an array of object containing information about wire.
         * @return {object} returns true if wiring creation succeeded, false otherwise
         */
        _create = function (arg) {
            var sumRetVal = true,
                retVal, i = 0;

            // In case of array, start simple recursion.
            if (SWAC._internal.Utils.isArray(arg)) {
                retVal = new Array(arg.length);
                for (i = 0; i < arg.length; i++) {
                    retVal[i] = SWAC.Wiring.create(arg[i]);
                    sumRetVal = sumRetVal && retVal[i];
                }
                return sumRetVal;
            }
            else {
                // In case of object, start ducktyping.
                if ((typeof arg === 'object') && (arg !== null)) {

                    if (!_checkForWireMembers(arg)) {
                        return false;
                    }

                    _unwiredWires[arg.name] = new SWAC.Wire(arg.name, arg.input, arg.output, arg.converter, arg.parameter, arg.options, arg.store);
                    _observeContainerDpcs(_unwiredWires[arg.name]);
                    _onCreated.notify({ name: arg.name });
                    _canWire();
                    return true;
                }
                else {
                    return false;
                }
            }
        },

        _onRemoved = new SWAC.Eventing.Publisher('onRemoved'),

         /**
         * Removes the wire and fires onRemoved event
         *
         * @protected
         * @method remove
         * @param {object} wire wire to remove
         * @return {Boolean} returns if wire has been removed successfully or not
         */
        _remove = function (wire) {
            var name = wire.description.name,
              retVal = true,
              _itemFound = false;

            if (wire.description.state() !== 'unwired') {
                _unwire(wire);
            }
            if (_wiredWires[name] !== undefined) {
                delete _wiredWires[name];
                _itemFound = true;
            }
            if (_looseWires[name] !== undefined) {
                delete _looseWires[name];
                _itemFound = true;
            }
            if (_unwiredWires[name] !== undefined) {
                delete _unwiredWires[name];
                _itemFound = true;
            }
            if (_itemFound) {
                _onRemoved.notify({ name: name });
            }

            retVal = _itemFound;

            return retVal;
        },

         /**
         * Checks if dpc changes
         *
         * @private
         * @method _observeDpc
         * @param {object} comp name of the component
         */
        _observeDpc = function (comp) {
            var cur = SWAC.Container.get({ name: comp }),
                createHandler = function (add) {
                    return add ? function (event) {
                        _canWire();
                    } : function (event) {
                        _checkWires();
                    };
                };

            if (cur && cur.dpc) {
                cur.dpc.onAdded.subscribe(createHandler(true));
                cur.dpc.onRemoved.subscribe(createHandler(false));
            }
        },

         /**
         * Checks if a new component appears
         *
         * @private
         * @method _compAppears
         * @param {object} event data of the appeared component
         */
        _compAppears = function (event) {
            _observeDpc(event.data.name);
            _canWire();
        },

        /**
         * Checks if a component disappears
         *
         * @private
         * @method _compDisappears
         * @param {object} event data of the disappeared component
         */
        _compDisappears = function (event) {
            _removeFromInterfaceList(event.data.name);

            _checkWires();
        },

        /**
         * Moves the object from unwired list to wired list
         *
         * @protected
         * @method toWired
         * @param {object} wire wire to move
         */
        _toWired = function (wire) {
            var name = wire.description.name;
            _wiredWires[name] = _unwiredWires[name];
            delete _unwiredWires[name];
        },

         /**
         * Moves the object from unwired list to loose list
         *
         * @protected
         * @method toLoose
         * @param {object} wire wire to move
         */
        _toLoose = function (wire) {
            var name = wire.description.name;
            _looseWires[name] = _unwiredWires[name];
            delete _unwiredWires[name];
            // Creating a dangling wire -> canWire again, a dangling glue point could be available now!
            _canWire();
        },

         /**
         * Moves the object from wired or loose list to unwired list
         *
         * @protected
         * @method toUnwired
         * @param {object} wire wire to move
         */
        _toUnwired = function (wire) {
            var name = wire.description.name;
            if (_wiredWires[name]) {
                _unwiredWires[name] = _wiredWires[name];
                delete _wiredWires[name];
            } else if (_looseWires[name]) {
                _unwiredWires[name] = _looseWires[name];
                delete _looseWires[name];
            }
            // Unwiring a loose wire -> checkWires again, a dangling glue point could be missing now!
            _checkWires();
        };

    //////////////
    // INIT     //
    //////////////

    (function () {

        // Always listen for components showing up and disappearing. (SWAC.Container is also part of SWAC's container-part, so no check for existence required!)
        SWAC.Container.onReady.subscribe(_compAppears);
        SWAC.Container.onRemoved.subscribe(_compDisappears);
    }());

    var _cancelExecutionException = function (errorCode) {
        SWAC.Exception.call(this, errorCode);
    };

    _cancelExecutionException.prototype = new SWAC.Exception();

    /**
  * Checks if it is possible to make a wire and perfom it in case
  *
  * @private
  * @method _canWire
  */
    _canWire = function () {
        var name = '';
        for (name in _unwiredWires) {
            if (_unwiredWires.hasOwnProperty(name)) {
                var wire = _unwiredWires[name];
                // Look through all sources and the target, maybe those can be wired now.
                if (_checkWirePreconditions(wire)) {
                    _wire(wire);
                }
            }
        }
    };

    /**
    * Checks preconditions (output) before create wiring
    *
    * @private
    * @method _checkOutputWirePreconditions
    * @param {object} wire wire to check
    * @return {object} if output is valid for wiring
    */
    _checkOutputWirePreconditions = function (wire) {
        var outgoing, target, data, methodInterface, interfaceName,
          intfItem, componentInterfacesItem = {};

        outgoing = wire.description.output;

        if (outgoing) {
            if (outgoing.component) {
                target = SWAC.Container.get({ name: outgoing.component });
                if (!target) {
                    return false;
                }

                if (outgoing.method) {
                    if (outgoing.method.indexOf('.') === -1) {
                        if (!target.proxy[outgoing.method]) {
                            return false;
                        }
                    } else {

                        methodInterface = outgoing.method.substr(outgoing.method.lastIndexOf('.') + 1);
                        interfaceName = outgoing.method.substr(0, outgoing.method.lastIndexOf('.'));

                        //  methodInterface = outgoing.method.split('.');
                        intfItem = _getInterfaceItem(outgoing.component, interfaceName);
                        if (intfItem !== null) {
                            if (intfItem.intf !== null) {
                                if (!intfItem.intf[methodInterface]) {
                                    return false;
                                }
                            }
                            else {
                                return false;
                            }
                        }
                        else {
                            if (target.interfaces) {
                                if (target.interfaces.has(interfaceName)) {
                                    componentInterfacesItem = {
                                        componentName: outgoing.component,
                                        interfaceName: interfaceName,
                                        intf: null
                                    };
                                    _componentInterfaces.push(componentInterfacesItem);
                                    // Retrieve interface from component
                                    target.interfaces.beginGet(interfaceName).then(
                                      function (inf) {
                                          componentInterfacesItem = _getInterfaceItem(outgoing.component, interfaceName);
                                          if (componentInterfacesItem !== null) {
                                              componentInterfacesItem.intf = inf;
                                          }
                                          _canWire();
                                      },
                                      function (reason) {
                                          _removeFromInterfaceList(outgoing.component, interfaceName);
                                      });
                                }
                            }
                            return false;
                        }
                    }
                } else if (outgoing.dpc) {
                    if (!target.dpc) {
                        return false;
                    } else {
                        data = target.dpc.open(outgoing.dpc);
                        if (!data) {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            } else if (outgoing.custom) {
                target = typeof (outgoing.custom) === 'object' ? outgoing.custom : window[outgoing.custom];
                if (!target) {
                    return false;
                }
                if (outgoing.method) {
                    if ((!target[outgoing.method]) || (typeof (target[outgoing.method]) !== 'function')) {
                        return false;
                    }
                }
                else if (outgoing.dpc) {
                    if (!target.dpc) {
                        return false;
                    } else {
                        data = target.dpc.open(outgoing.dpc);
                        if (!data) {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            }
        }

        return true;
    };

    /**
     * Checks preconditions before create wiring
     *
     * @private
     * @method _checkWirePreconditions
     * @param {object} wire wire to check
     * @return {object} if wire is valid for wiring
     */
    _checkWirePreconditions = function (wire) {

        if (!wire) {
            return false;
        }

        if (!wire.description.input) { // outgoing is optional (loose then), but incoming is required!
            return false;
        }

        if (_checkInputWirePreconditions(wire)) {
            if (wire.description.output) {
                return _checkOutputWirePreconditions(wire);
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    };

    //////////////
    // PUBLIC   //
    //////////////

    return {

        // API
        create: _create,
        get: _get, // There is no dedicated remove-function on the wiring system. Get the wire and call remove explicitely.

        // EVENTS

        /**
        * Fired whenever a new wire got added to the wiring system
        *
        * @event onCreated
        * @param {Object} data Object with 'name' string property related to the created wire
        */
        onCreated: _onCreated.event,

        /**
        * Fired whenever a wire is fully-established or loose
        *
        * @event onWired
        * @param {Object} data Object with 'name' string property related to the activated wire
        */
        onWired: _onWired.event,

        /**
        * Fired whenever a wire is pinched off
        *
        * @event onUnwired
        * @param {Object} data Object with 'name' string property related to the non-activated wire
        */
        onUnwired: _onUnwired.event,

        /**
        * Fired whenever a wire is completely removed from the wiring system
        *
        * @event onRemoved
        * @param {Object} data Object with 'name' string property related to the removed wire
        */
        onRemoved: _onRemoved.event,

        /**
        * Fired whenever something goes wrong
        *
        * @event onFailure
        * @param {Object} message Object with 'message' string property related to the failure
        */
        onFailure: _onFailure.event,

        // INTERNAL, DO NOT USE
        _internal: {
            remove: _remove,
            toWired: _toWired,
            toUnwired: _toUnwired,
            toLoose: _toLoose,
            getInterfaceItem: _getInterfaceItem
        },

        /**
       * Class that manages SecurityException message. 
       *
       * @protected
       * @class SWAC.Wiring.CancelExecutionException
       * @constructor
       * @param {Numeric} errorCode
       */
        CancelExecutionException: _cancelExecutionException
    };
}());
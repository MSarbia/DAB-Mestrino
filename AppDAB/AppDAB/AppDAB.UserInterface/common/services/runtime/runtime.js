/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name siemens.simaticit.common.services.runtime
     * @module siemens.simaticit.common
     *
     * @description
     * This module provides objects and services related to retrieving runtime data.
     *
     */
    angular.module('siemens.simaticit.common.services.runtime', []);

})();
(function () {
    'use strict';

   //angular.module('siemens.simaticit.common.services.runtime',[]);

})();

'use strict';
var siemens;
(function (siemens) {
    var simaticit;
    (function (simaticit) {
        var common;
        (function (common_1) {
            var services;
            (function (services) {
                var runtime;
                (function (runtime) {
                    var BackendConfigModel = (function () {
                        function BackendConfigModel(enableBusyIndicator, enableMessageOverlay) {
                            this.enableBusyIndicator = enableBusyIndicator;
                            this.enableMessageOverlay = enableMessageOverlay;
                        }
                        return BackendConfigModel;
                    }());
                    runtime.BackendConfigModel = BackendConfigModel;
                    /**
                    *  @ngdoc provider
                    *  @name common.services.runtime.backendConfigProvider
                    *  @module siemens.simaticit.common.services.runtime
                    *  @description Specifies whether or not the BackendService must show the busy indicator and overlay when requesting data.
                    *
                    *  @property {Object} config An object with an **enableBusyIndicator** property, which specifies whether to use the busy indicator or not,
                    *  and an **enableMessageOverlay** property, which specifies whether to use message overlay or not.
                    *
                    */
                    var BackendConfig = (function () {
                        function BackendConfig() {
                            this.config = new BackendConfigModel(true, true);
                        }
                        /**
                        *  @ngdoc service
                        *  @name common.services.runtime.backendConfig
                        *  @module siemens.simaticit.common.services.runtime
                        *  @description Specifies whether the BackendService must show the busy indicator and overlay when requesting data.
                        *
                        *  @property {Object} config An object with an **enableBusyIndicator** property, which specifies whether to use the busy indicator or not,
                        *  and an **enableMessageOverlay** property, which specifies whether to use the message overlay or not.
                        *
                        */
                        BackendConfig.prototype.$get = function () {
                            return {
                                config: this.config
                            };
                        };
                        return BackendConfig;
                    }());
                    runtime.BackendConfig = BackendConfig;
                    var CommandModel = (function () {
                        function CommandModel(appName, commandName, params) {
                            this.appName = appName;
                            this.commandName = commandName;
                            this.params = params;
                        }
                        return CommandModel;
                    }());
                    runtime.CommandModel = CommandModel;
                    /**
                    *  @ngdoc service
                    *  @name common.services.runtime.backendService
                    *  @module siemens.simaticit.common.services.runtime
                    *  @description A high-level service that provides common functionalities on top of the {@link common.services.runtime.commandService} and
                    *  {@link common.services.runtime.dataService}.
                    *
                    * @example
                    * In a controller, the **common.services.runtime.backendService** is used as follows:
                    *
                    * ```
                    * (function () {
                    * 'use strict';
                    *
                    *angular.module('siemens.simaticit.common').run(['$rootScope', 'common.services.runtime.backendService', function ($rootScope,backendService) {
                    *
                    *    // Websocket for an App can be opened by calling the 'connectSignals' method.
                    *
                    *	var appName = 'EvtMgrApp';
                    *	backendService.connectSignals(appName).then(function () {
                    *		console.log(appName + ": WebSocket Opened Successfully");
                    *	}, function (error) {
                    *		 // On socket connection error you can try to connect to the socket again
                    *        console.log("Error in socket connection...");q
                    *        setTimeout(function(){
                    *           console.log("Reconnecting...");
                    *           backendService.reconnectSignals(appName).then(function () {
                    *		    console.log(appName + ": WebSocket Opened Successfully");
                    *	        }, function (error) {
                    *		        console.log("Error in opening a web socket \n" + angular.toJson(error, true));
                    *	        });
                    *       }, 5000);
                    *   });
                    *
                    *   // You may choose to close the web-socket according to the business case
                    *   $rootScope.$on('appCleanup',function () {
                    *       backendService.disconnectSignals(appName).then(function () {
                    *           console.log(appName + ": WebSocket Closed Successfully");
                    *       }, function (error) {
                    *          console.log("Error in closing the web socket \n" + angular.toJson(error, true));
                    *       });
                    *   });
                    * }]);
                    *
                    * BackendExampleController.$inject = ['common.services.runtime.backendService' ];
                    * function BackendExampleController(backendService) {
                    *    var vm = this;
                    *
                    *    activate();
                    *
                    *    function activate() {
                    *
                    *       vm.invokeBackendError = invokeBackendError;
                    *
                    *       vm.query = {appName: "DemoApp", entityName: "Container"}
                    *       vm.result = '';
                    *       vm.retrieveData = retrieveData;
                    *       vm.getReadData = getReadData;
                    *
                    *       vm.errorMessage = '';
                    *       vm.errorTitle = '';
                    *       vm.invokeGenericError = invokeGenericError;
                    *
                    *       vm.command = {appName: "DemoApp", commandName: "editContainer", params: {Id: "AAA1", Name: "Test #2"}};
                    *       vm.title = '';
                    *       vm.operation = '';
                    *       vm.invokeConfirmation = invokeConfirmation;
                    *
                    *       vm.signalNameBS = "Signal1";
                    *       vm.filterBS = "";
                    *       vm.appNameBS = "App1";
                    *       vm.connectionId;
                    *   }
                    *
                    *   function invokeBackendError() {
                    *       backendService.invoke(vm.command).then(function (data) {
                    *           vm.result = data;
                    *       }, backendService.backendError);
                    *   }
                    *
                    *   function retrieveData() {
                    *       vm.result = null;
                    *       backendService.findAll(vm.querys).then(function (data) {
                    *           vm.result = data;
                    *       }, function (error) {
                    *           vm.result = error.data;
                    *       });
                    *   };
                    *
                    *   function getReadData() {
                    *       backendService.read({
                    *           appName: "DemoApp",
                    *           functionName: "myFunc",
                    *           params: {id: 1234} ,
                    *           options: "$select=Name,Quantity"
                    *       }).then(function (data) {
                    *           vm.result = data;
                    *       }, function (error) {
                    *           vm.result = error.data;
                    *       });
                    *   }
                    *
                    *   function invokeGenericError() {
                    *       backendService.genericError(vm.errorMessage, vm.errorTitle);
                    *   }
                    *
                    *   function invokeConfirmation() {
                    *       backendService.confirm(vm.operation, function () {
                    *           console.log('confirmed....');
                    *       }, vm.title);
                    *   }
                    *
                    *   function subscribeSignalBS() {
                    *        var signalName = ('' + (conCounter++) + '_' + vm.signalNameBS)
                    *        var connectionObj = {
                    *            appName: vm.appNameBS,
                    *            signalName: vm.signalNameBS,
                    *            options: vm.filterBS,
                    *            onMessage: onMessageBS,
                    *            onComplete: onCompleteBS
                    *        }
                    *        backendService.subscribe(connectionObj).then(function (id) {
                    *            vm.connectionId = id;
                    *            console.log("Subscribed to signal");
                    *        }, function (error) {
                    *            console.log("Subscription error");
                    *            setTimeout(function(){
                    *               // Try to subscribe to the signal again after 5 seconds.
                    *               subscribeSignalBS();
                    *            }, 5000);
                    *        });
                    *    }
                    *
                    *    function onMessageBS(data) {
                    *      console.log("Received data from signal: "+ data);
                    *    }
                    *
                    *    function onSubscriptionError(errReason) {
                    *       console.log("Error occured "+ errReason);
                    *    }
                    *
                    *   function onCompleteBS(){
                    *       // Unsubscibe from signal on completion of message transfer
                    *       unsubscribeSignalBS();
                    *   }
                    *
                    *
                    *   function unsubscribeSignalBS() {
                    *       // When the second argument is passed as true, the websocket for the App will be closed after the last active subscription closes.
                    *        backendService.unsubscribe(vm.connectionId, true).then(function (id) {
                    *            console.log("unsubscribe successfull");
                    *        }, function (error) {
                    *            console.log("unsubscribe error");
                    *        });
                    *   }
                    *
                    *   function reconnectAppBS() {
                    *      backendService.reconnectSignals(vm.appNameBS).then(function (reconnIds) {
                    *           console.log("re-connection successful;");
                    *      }, function (error) {
                    *           console.log("re-connection failed");
                    *      });
                    *   }
                    * }
                    * angular.module('siemens.simaticit.common').controller('backendExampleController', BackendExampleController);
                    * })();
                    *
                    *
                    * ```
                    */
                    var BackendService = (function () {
                        function BackendService($q, $translate, common, commandService, dataService, busyIndicator, messageOverlay, logger, backendConfig, signalManager, CommandResponse, ExecutionError) {
                            var _this = this;
                            this.$q = $q;
                            this.$translate = $translate;
                            this.common = common;
                            this.commandService = commandService;
                            this.dataService = dataService;
                            this.busyIndicator = busyIndicator;
                            this.messageOverlay = messageOverlay;
                            this.logger = logger;
                            this.backendConfig = backendConfig;
                            this.signalManager = signalManager;
                            this.CommandResponse = CommandResponse;
                            this.ExecutionError = ExecutionError;
                            /**
                            * @ngdoc method
                            * @name common.services.runtime.backendService#backendError
                            * @module siemens.simaticit.common.services.runtime
                            * @param {Object} reject Rejects object provided by the promise object.
                            * @description Displays an error message using an overlay.
                            *
                            */
                            this.backendError = function (reject) {
                                if (!reject) {
                                    _this.logger.logError('reject is missing', {}, 'common.services.runtime.backendService::backendError');
                                    return;
                                }
                                _this.showErrorMessage(_this.$translate.instant('common.error'), _this.common.formatErrorMessage(reject));
                            };
                            this.signalConnections = [];
                        }
                        /**
                        * @ngdoc method
                        * @name common.services.runtime.backendService#execute
                        * @module siemens.simaticit.common.services.runtime
                        * @deprecated Use the {@link common.services.runtime.backendService#invoke invoke} method instead.
                        * @description
                        * See the same method exposed by {@link common.services.runtime.commandService#execute}.
                        *
                        *
                        */
                        BackendService.prototype.execute = function () {
                            var _this = this;
                            var deferred = this.$q.defer();
                            var inputObject = this.commandService.processArguments(arguments);
                            if (null === inputObject || undefined === inputObject) {
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, 'Command Error : cannot execute runtime command with wrong input')) });
                                return deferred.promise;
                            }
                            this.showBusyIndicator();
                            this.commandService.execute(inputObject).then(function (data) {
                                _this.hideBusyIndicator();
                                deferred.resolve(data);
                            }, function (reject) {
                                _this.hideBusyIndicator();
                                _this.showBackendErrorMessage(reject);
                                deferred.reject(reject);
                            });
                            return deferred.promise;
                        };
                        /**
                         * @ngdoc method
                         * @name common.services.runtime.backendService#invoke
                         * @module siemens.simaticit.common.services.runtime
                         * @description
                         * See the same method exposed by {@link common.services.runtime.commandService#invoke}.
                         */
                        BackendService.prototype.invoke = function (inputObject) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            if (!inputObject) {
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.businessCommand.executeInvalidInput'))) });
                                return deferred.promise;
                            }
                            this.showBusyIndicator();
                            this.commandService.invoke(inputObject).then(function (data) {
                                _this.hideBusyIndicator();
                                deferred.resolve(data);
                            }, function (reject) {
                                _this.hideBusyIndicator();
                                _this.showBackendErrorMessage(reject);
                                deferred.reject(reject);
                            });
                            return deferred.promise;
                        };
                        /**
                        * @ngdoc method
                        * @name common.services.runtime.backendService#getAll
                        * @module siemens.simaticit.common.services.runtime
                        * @deprecated Use the {@link common.services.runtime.backendService#findAll findAll} method instead.
                        * @description
                        * See the same method exposed by {@link common.services.runtime.dataService#getAll}.
                        */
                        BackendService.prototype.getAll = function (entityName, options) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            this.showBusyIndicator();
                            this.dataService.getAll(entityName, options).then(function (data) {
                                _this.hideBusyIndicator();
                                deferred.resolve(data);
                            }, function (reject) {
                                _this.hideBusyIndicator();
                                _this.showBackendErrorMessage(reject);
                                deferred.reject(reject);
                            });
                            return deferred.promise;
                        };
                        /**
                       * @ngdoc method
                       * @name common.services.runtime.backendService#findAll
                       * @module siemens.simaticit.common.services.runtime
                       * @description
                       * See the same method exposed by {@link common.services.runtime.dataService#findAll}.
                      */
                        BackendService.prototype.findAll = function (object) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            this.showBusyIndicator();
                            this.dataService.findAll(object).then(function (data) {
                                _this.hideBusyIndicator();
                                deferred.resolve(data);
                            }, function (reject) {
                                _this.hideBusyIndicator();
                                _this.showBackendErrorMessage(reject);
                                deferred.reject(reject);
                            });
                            return deferred.promise;
                        };
                        /**
                      * @ngdoc method
                      * @name common.services.runtime.backendService#read
                      * @module siemens.simaticit.common.services.runtime
                      * @description
                      * See the same method exposed by {@link common.services.runtime.dataService#read}.
                     */
                        BackendService.prototype.read = function (object) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            this.showBusyIndicator();
                            this.dataService.read(object).then(function (data) {
                                _this.hideBusyIndicator();
                                deferred.resolve(data);
                            }, function (reject) {
                                _this.hideBusyIndicator();
                                _this.showBackendErrorMessage(reject);
                                deferred.reject(reject);
                            });
                            return deferred.promise;
                        };
                        /**
                        * @ngdoc type
                        * @name SignalConfigObject
                        * @module siemens.simaticit.common.services.runtime
                        * @description
                        * Represents an object that holds data needed to subscribe to the signal.
                        *
                        * @property {string} appName The name of the App to connect to.
                        * @property {string} signalName The name of the signal to subscribe to.
                        * @property {string} [options] An OData query string.
                        * @property {Function} onMessage A callback that is invoked every time a new message is received from the signal.
                        * @property {Function} onSubscriptionError A callback (optional) that is invoked whenever an error occurs.
                        * @property {Function} onComplete A callback (optional) that is invoked when the server notifies the client that it has finished sending messages for the currently active subscription.
                        */
                        /**
                        * @ngdoc method
                        * @name common.services.runtime.backendService#subscribe
                        * @module siemens.simaticit.common.services.runtime
                        * @param {SignalConfigObject} configObject  See {@link SignalConfigObject}.
                        * @returns {Promise} A promise object containing the ID of the new subscription.
                        * @description
                        * Subscribes to a signal using the {@link common.services.signalManager#createConnection} and {@link SignalConnection#subscribe} methods.
                        * <br>**Note:**This method should not be used with any methods provided by the {@link siemens.simaticit.common.services.signalManager} service as it will result in incorrect behavior.
                        */
                        BackendService.prototype.subscribe = function (configObject) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            if (!configObject.appName) {
                                deferred.reject("Paramter 'appName' is missing in the config object");
                                return deferred.promise;
                            }
                            if (!configObject.signalName) {
                                configObject.signalName = configObject.appName;
                            }
                            this.signalManager.createConnection(configObject.appName, configObject.signalName, configObject.onConnectionError).then(function (signalConnObj) {
                                signalConnObj.subscribe(configObject.options, configObject.onMessage, configObject.onSubscriptionError, configObject.onComplete)
                                    .then(function (signalConnObj) {
                                    _this.signalConnections.push(signalConnObj);
                                    deferred.resolve(signalConnObj.id);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }, function (error) {
                                deferred.reject(error);
                            });
                            return deferred.promise;
                        };
                        /**
                         * @ngdoc method
                         * @name common.services.runtime.backendService#unsubscribe
                         * @param {string} id Id of the connection to unsubscribe from.
                         * @param {boolean} closeWebSocket Boolean value to indicate if the websocket has to be closed after unsubscribing from the signal or not.
                         * @returns {Promise} A promise object containing the Id of the unsubscribed signal connection and an error response object if there is one.
                         * @description Unsubscribes from a signal using the {@link common.services.signalManager#deleteConnection deleteConnection} method.
                         * If the closeWebSocket value is set to true, it closes the corresponding websocket for the App after the last subscription closes.
                         * <br>**Note:**This method should not be used with any methods provided by the {@link siemens.simaticit.common.services.signalManager} service as it will result in incorrect behavior.
                         */
                        BackendService.prototype.unsubscribe = function (connId, closeWebsocket) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            if (!connId) {
                                deferred.reject("Input paramter 'connId' is missing");
                                return deferred.promise;
                            }
                            var signalConnObj = _.findWhere(this.signalConnections, { id: connId });
                            if (!signalConnObj) {
                                deferred.reject("Invalid 'connId' passed");
                                return deferred.promise;
                            }
                            this.signalManager.deleteConnection(connId).then(function () {
                                _this.deleteConnection(signalConnObj.id);
                                if (closeWebsocket) {
                                    _this.signalManager.disconnect(signalConnObj.appName).then(function () {
                                        deferred.resolve(signalConnObj.id);
                                    }, function (error) {
                                        deferred.reject(error);
                                    });
                                }
                                else {
                                    deferred.resolve(signalConnObj.id);
                                }
                            }, function (error) {
                                deferred.resolve(error);
                            });
                            return deferred.promise;
                        };
                        /**
                       * @ngdoc method
                       * @name common.services.runtime.backendService#reconnectSignals
                       * @param {string} app Name of the App to reconnect to.
                       * @returns {Promise} A promise object containing a hash of the old connection Ids to new ones, and an error response object if there is one.
                       * @description
                       * Reconnects to a signal using the {@link SignalConnection#reconnect} method.
                       * <br>**Note:**This method should not be used with any methods provided by the {@link siemens.simaticit.common.services.signalManager} service as it will result in incorrect behavior.
                       */
                        BackendService.prototype.reconnectSignals = function (app) {
                            var deferred = this.$q.defer();
                            var reconnectPromises = {};
                            var signalConnArray = _.where(this.signalConnections, { appName: app });
                            if (!signalConnArray.length) {
                                deferred.reject("Signal Connection with the supplied app name is not present");
                                return deferred.promise;
                            }
                            _.each(signalConnArray, function (signalConn) {
                                reconnectPromises[signalConn.id] = signalConn.reconnect();
                            });
                            this.$q.all(reconnectPromises).then(function (reconnections) {
                                var oldIds = Object.keys(reconnections);
                                var i = 0, length = oldIds.length;
                                for (i; i < length; i++) {
                                    reconnections[oldIds[i]] = reconnections[oldIds[i]].id;
                                }
                                deferred.resolve(reconnections);
                            });
                            return deferred.promise;
                        };
                        BackendService.prototype.deleteConnection = function (id) {
                            var i = 0, length = this.signalConnections.length;
                            for (i; i < length; i++) {
                                if (this.signalConnections[i].id === id) {
                                    this.signalConnections.splice(i, 1);
                                    break;
                                }
                            }
                        };
                        /**
                        * @ngdoc method
                        * @name common.services.runtime.backendService#genericError
                        * @module siemens.simaticit.common.services.runtime
                        * @param {String} message Error message to be displayed.
                        * @param {String} title Title to be displayed.
                        * @description Displays an error message using an overlay.
                        *
                        */
                        BackendService.prototype.genericError = function (message, title) {
                            if (!message) {
                                this.logger.logError('message is missing', {}, 'common.services.runtime.backendService::genericError');
                                return;
                            }
                            if (!title) {
                                title = this.$translate.instant('common.error');
                            }
                            this.showErrorMessage(title, message);
                        };
                        /**
                       * @ngdoc method
                       * @name common.services.runtime.backendService#connectSignals
                       * @module siemens.simaticit.common.services.runtime
                       * @param {String} appName Name of the App for which the web socket has to be opened.
                       * @return {Promise} A promise that is resolved if the connection is successful and rejected otherwise.
                       * @description Opens the websocket for the mentioned App.
                       *
                       */
                        BackendService.prototype.connectSignals = function (appName, onConnectionError) {
                            var deferred = this.$q.defer();
                            if (!appName) {
                                deferred.reject("Input paramter 'app name' is missing");
                            }
                            else {
                                this.signalManager.connect(appName, onConnectionError).then(function () {
                                    deferred.resolve();
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            return deferred.promise;
                        };
                        /**
                       * @ngdoc method
                       * @name common.services.runtime.backendService#disconnectSignals
                       * @module siemens.simaticit.common.services.runtime
                       * @param {String} appName Name of the App for which the web socket has to be closed.
                       * @return {Promise} A promise that is resolved if the disconnection is successful and rejected otherwise.
                       * @description Closes the websocket for the mentioned App.
                       *
                       */
                        BackendService.prototype.disconnectSignals = function (appName) {
                            var deferred = this.$q.defer();
                            if (!appName) {
                                deferred.reject("Input paramter 'app name' is missing");
                            }
                            else {
                                this.signalManager.disconnect(appName).then(function () {
                                    deferred.resolve();
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            return deferred.promise;
                        };
                        /**
                        * @ngdoc method
                        * @name common.services.runtime.backendService#confirm
                        * @module siemens.simaticit.common.services.runtime
                        * @param {String} message Error message to be displayed.
                        * @param {Callback} callback Callback to be called on confirmation.
                        * @param {String} title Title to be displayed.
                        * @description Displays a confirmation message.
                        *
                        */
                        BackendService.prototype.confirm = function (message, callback, title) {
                            var _this = this;
                            if (!message) {
                                this.logger.logError('message is missing', {}, 'common.services.runtime.backendService::confirm');
                                return;
                            }
                            if (!callback) {
                                this.logger.logError('callback is missing', {}, 'common.services.runtime.backendService::callback');
                                return;
                            }
                            if (!title) {
                                title = this.$translate.instant('common.confirmation');
                            }
                            this.messageOverlay.set({
                                buttons: [{
                                        id: 'yes',
                                        displayName: this.$translate.instant('common.yes'),
                                        onClickCallback: function () {
                                            _this.messageOverlay.hide();
                                            callback();
                                        }
                                    }, {
                                        id: 'no',
                                        displayName: this.$translate.instant('common.no'),
                                        onClickCallback: this.messageOverlay.hide
                                    }],
                                title: title,
                                text: message
                            });
                            this.messageOverlay.show();
                        };
                        BackendService.prototype.showBusyIndicator = function () {
                            if (!this.backendConfig.config.enableBusyIndicator) {
                                return;
                            }
                            this.busyIndicator.show();
                        };
                        BackendService.prototype.hideBusyIndicator = function () {
                            if (!this.backendConfig.config.enableBusyIndicator) {
                                return;
                            }
                            this.busyIndicator.hide();
                        };
                        BackendService.prototype.showBackendErrorMessage = function (reject) {
                            if (!this.backendConfig.config.enableMessageOverlay) {
                                return;
                            }
                            this.backendError(reject);
                        };
                        BackendService.prototype.showErrorMessage = function (title, message) {
                            var _this = this;
                            this.messageOverlay.set({
                                buttons: [{
                                        id: 'ok',
                                        displayName: this.$translate.instant('common.ok'),
                                        onClickCallback: function () {
                                            _this.hideErrorMessage();
                                        }
                                    }],
                                title: title,
                                text: message
                            });
                            this.messageOverlay.show();
                        };
                        BackendService.prototype.hideErrorMessage = function () {
                            this.messageOverlay.hide();
                        };
                        return BackendService;
                    }());
                    BackendService.$inject = ['$q', '$translate', 'common', 'common.services.runtime.commandService', 'common.services.runtime.dataService',
                        'common.widgets.busyIndicator.service', 'common.widgets.messageOverlay.service', 'common.services.logger.service', 'common.services.runtime.backendConfig', 'common.services.signalManager', 'CommandResponse', 'ExecutionError'];
                    runtime.BackendService = BackendService;
                    angular.module('siemens.simaticit.common.services.runtime')
                        .provider('common.services.runtime.backendConfig', BackendConfig)
                        .service('common.services.runtime.backendService', BackendService);
                })(runtime = services.runtime || (services.runtime = {}));
            })(services = common_1.services || (common_1.services = {}));
        })(common = simaticit.common || (simaticit.common = {}));
    })(simaticit = siemens.simaticit || (siemens.simaticit = {}));
})(siemens || (siemens = {}));
//# sourceMappingURL=backend-svc.js.map
(function () {
    'use strict';
   
    /**
     * @ngdoc type
     * @name common.services.runtime.dataModel
     * @module siemens.simaticit.common.services.runtime 
     * @access internal
     *
     * @description
     * This module provides information on a business entity.
     *
     * @property {String} entityName The entity name.
     * @property {String} properties The property list of an entity.
     * @property {String} orderBy The order-by property of an entity.
     * @property {String} filter The filter-by property of an entity.
     */
    angular.module('siemens.simaticit.common.services.runtime').factory('common.services.runtime.dataModel', [function () {
        function DataModel(EntityName, Properties, OrderBy, Filter) {
            this.entityName = EntityName;
            this.properties = Properties;
            this.orderBy = OrderBy;
            this.filter  = Filter;
        }
        return DataModel;
    }]);


})();

/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
'use strict';
var siemens;
(function (siemens) {
    var simaticit;
    (function (simaticit) {
        var common;
        (function (common_1) {
            var services;
            (function (services) {
                var runtime;
                (function (runtime) {
                    /**
                      * @ngdoc provider
                      * @name common.services.runtime.DataConfigProvider
                      * @module siemens.simaticit.common.services.runtime
                      * @description
                      * Configures the endpoint for the runtime service layer where data will be retrieved. This property is automatically set when the UI Application starts.
                      *
                      * @property {Object} config An object with an **oDataServiceURI** property, identifying the URI of the runtime service layer.
                      */
                    var DataConfigProvider = (function () {
                        function DataConfigProvider() {
                            this.config = {
                                // These are the properties we need to set
                                oDataServiceURI: '',
                                applicationServiceUrls: {}
                            };
                        }
                        /**
                          * @ngdoc service
                          * @name common.services.runtime.DataConfig
                          * @module siemens.simaticit.common.services.runtime
                          * @description
                          * Configures the endpoint for the runtime service layer where data will be retrieved. This property is automatically set when the UI Application starts.
                          *
                          * @property {Object} config An object with an **oDataServiceURI** property, identifying the URI of the runtime service layer.
                          */
                        DataConfigProvider.prototype.$get = function () {
                            return {
                                config: this.config
                            };
                        };
                        return DataConfigProvider;
                    }());
                    runtime.DataConfigProvider = DataConfigProvider;
                    angular.module('siemens.simaticit.common.services.runtime').provider('common.services.runtime.DataConfig', [DataConfigProvider]);
                    /**
                     * @ngdoc service
                     * @name common.services.runtime.dataService
                     * @module siemens.simaticit.common.services.runtime
                     * @requires $q
                     * @requires $resource
                     * @requires $http
                     * @requires service:CommandResponse
                     * @requires service:ExecutionError
                     * @requires common.services.runtime.DataConfig
                     *
                     * @description
                     * Exposes a set of methods that can be used to retrieve runtime entities.
                     *
                     * @example
                     * In a controller, the **common.services.runtime.dataService** can be used as follows:
                     *
                     * ```
                     *      busyIndicatorService.show();
                     *      result =null;
                     *      dataService.findAll({appName: "DemoApp", entityName: "Container", options: "$select=Name,Quantity"}).then(function (data) {
                     *          result = data;
                     *          busyIndicatorService.hide();
                     *      }, function (error) {
                     *          busyIndicatorService.hide();
                     *          messageOverlayService.setOverlayData({
                     *                   buttons: [{
                     *                   id: 'ok',
                     *                   displayName: 'OK',
                     *                   onClickCallback: function () {
                     *                      // some logic goes here
                     *                      messageOverlayService.hideOverlayModal();
                     *                   }
                     *              }],
                     *              title: "Backend Data Error",
                     *              text: error.data.error.errorCode + ' - ' + error.data.error.errorMessage
                     *          });
                     *         messageOverlayService.showOverlayModal();
                     *      });
                     *
                     *      busyIndicatorService.show();
                     *      dataService.read({appName: "DemoApp", functionName: "myFunc", params: {id: 1234} ,options: "$select=Name,Quantity"}).then(function (data) {
                     *          result = data;
                     *          busyIndicatorService.hide();
                     *      }, function (error) {
                     *          busyIndicatorService.hide();
                     *          messageOverlayService.setOverlayData({
                     *                   buttons: [{
                     *                   id: 'ok',
                     *                   displayName: 'OK',
                     *                   onClickCallback: function () {
                     *                      // some logic goes here
                     *                      messageOverlayService.hideOverlayModal();
                     *                   }
                     *              }],
                     *              title: "Backend Data Error",
                     *              text: error.data.error.errorCode + ' - ' + error.data.error.errorMessage
                     *          });
                     *         messageOverlayService.showOverlayModal();
                     *      });
                     *
                     *```
                     * In this case, the Name and Quantity of all Container entities within the "DemoApp" App are retrieved.
                     */
                    var BusinessData = (function () {
                        function BusinessData($q, $resource, $http, $translate, common, CommandResponse, ExecutionError, businessDataConfig) {
                            var _this = this;
                            this.$q = $q;
                            this.$resource = $resource;
                            this.$http = $http;
                            this.$translate = $translate;
                            this.common = common;
                            this.CommandResponse = CommandResponse;
                            this.ExecutionError = ExecutionError;
                            this.ERRORS = function (statusCode) {
                                switch (statusCode) {
                                    case 404: return _this.$translate.instant('ERRORS.404');
                                    case 503: return _this.$translate.instant('ERRORS.503');
                                    case 400: return _this.$translate.instant('ERRORS.400');
                                    case 403: return _this.$translate.instant('ERRORS.403');
                                    case 500: return _this.$translate.instant('ERRORS.500');
                                    case '4XX': return _this.$translate.instant('ERRORS.4XX');
                                    case '5XX': return _this.$translate.instant('ERRORS.5XX');
                                }
                            };
                            this.transformResObj = function (data, headersGetter, statusCode) {
                                var res = null;
                                if (data) {
                                    try {
                                        var Jsondata = JSON.parse(data);
                                        //odata Response Error
                                        if (Jsondata['odata.error']) {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(Jsondata['odata.error'].code, Jsondata['odata.error'].message.value));
                                            _this.common.logger.logError(Jsondata['odata.error'].code + ' : ' + Jsondata['odata.error'].message.value, '', 'Business Data Service');
                                        }
                                        //odata Response with data
                                        if (Jsondata['@odata.context']) {
                                            res = new _this.CommandResponse(true, new _this.ExecutionError(0, ''));
                                            var suffix = '$entity';
                                            if (Jsondata['@odata.context'].indexOf(suffix, Jsondata['@odata.context'].length - suffix.length) !== -1) {
                                                delete Jsondata['@odata.context'];
                                                res.value = [Jsondata];
                                            }
                                            else {
                                                res.value = Jsondata.value;
                                            }
                                            // parse count from response
                                            if (Jsondata['@odata.count']) {
                                                res.count = Jsondata['@odata.count'];
                                            }
                                        }
                                        //http error
                                        if (Jsondata.error) {
                                            res = new _this.CommandResponse('false', new _this.ExecutionError(Jsondata.error.code, Jsondata.error.message));
                                            _this.common.logger.logError(Jsondata.error.code + ' : ' + Jsondata.error.message, '', 'Business Data Service');
                                        }
                                    }
                                    catch (ex) {
                                        var errorSeries = Math.floor(statusCode / 100);
                                        if (_this.ERRORS(statusCode)) {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(statusCode, 'Error: ' + _this.ERRORS(statusCode)));
                                            _this.common.logger.logError(statusCode + 'Error: ' + _this.ERRORS(statusCode) + '', 'Business Data Service');
                                        }
                                        else if (_this.ERRORS(errorSeries + 'XX')) {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(statusCode, 'Error: ' + _this.ERRORS(errorSeries + 'XX')));
                                            _this.common.logger.logError(statusCode + 'Error: ' + _this.ERRORS(errorSeries + 'XX') + '', 'Business Data Service');
                                        }
                                        else {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(-1, "Error: " + ex.message));
                                            _this.common.logger.logError('-1: Error: ' + ex.message, '', 'Business Data Service');
                                        }
                                    }
                                }
                                else {
                                    res = new _this.CommandResponse(false, new _this.ExecutionError(-1, 'Generic Error'));
                                    _this.common.logger.logError('-1: Error: Generic Error', '', 'Business Data Service');
                                }
                                return res;
                            };
                            this.oDataPath = businessDataConfig.config.oDataServiceURI;
                            this.applicationServiceUrls = businessDataConfig.config.applicationServiceUrls;
                        }
                        BusinessData.prototype.getCmd = function (path) {
                            return this.$resource('', {}, {
                                getAll: {
                                    method: 'Get',
                                    url: path,
                                    transformResponse: [this.transformResObj].concat(this.$http.defaults.transformResponse)
                                }
                            });
                        };
                        /**
                         * @ngdoc method
                         * @name common.services.runtime.dataService#getAll
                         * @param {String} entityName Name of the runtime entity to be queried.
                         * @param {String} [options] An OData query string.
                         * @returns {Promise} A promise containing a {@link type:CommandResponse} object.
                         * @deprecated Use the {@link common.services.runtime.dataService#findAll findAll} method instead.
                         *
                         * @description
                         * Retrieves data from an entity exposed by an App on the Runtime Service Layer.
                         */
                        BusinessData.prototype.getAll = function (entityName, options) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            var path = this.oDataPath + entityName;
                            if (!this.oDataPath || this.oDataPath.trim() === '') {
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.business.noConfig'))) });
                            }
                            else if (!entityName || entityName === '') {
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.business.noEntityName'))) });
                            }
                            else {
                                try {
                                    if (options) {
                                        path += '?' + options;
                                    }
                                    var fnc = this.getCmd(path);
                                    return fnc.getAll(function (data) {
                                        deferred.resolve(data);
                                    }, function (err) {
                                        var exeError = _this.common.setExecutionError(err);
                                        deferred.reject({ data: new _this.CommandResponse(false, new _this.ExecutionError(exeError.data.error.errorCode, exeError.data.error.errorMessage)) });
                                    }).$promise;
                                }
                                catch (jse) {
                                    deferred.reject({ data: { Error: { ErrorCode: -1, ErrorMessage: jse.message } } });
                                }
                            }
                            return deferred.promise;
                        };
                        /**
                         * @ngdoc type
                         * @name QueryModel
                         * @module siemens.simaticit.common.services.runtime
                         * @description
                         * Represents an OData query to execute on an entity within an App.
                         *
                         * @property {string} appName The name of the App conaining the entity to query.
                         * @property {string} entityName The name of the runtime entity to query.
                         * @property {string} [options] An OData query string.
                         */
                        /**
                        * @ngdoc method
                        * @name common.services.runtime.dataService#findAll
                        * @module siemens.simaticit.common.services.runtime
                        * @param {QueryModel} object See {@link QueryModel}.
                        * @returns {Promise} A promise containing a {@link type:CommandResponse} object.
                        *
                        * @description
                        * Retrieves data from an entity exposed by an App on the Runtime Service Layer.
                        *
                        */
                        BusinessData.prototype.findAll = function (object) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            var applicationServiceUrls = this.applicationServiceUrls;
                            if (!object) {
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.business.executeNoInput'))) });
                                return deferred.promise;
                            }
                            var appName = object.appName;
                            var appPath = applicationServiceUrls[appName];
                            if (!appPath || appPath.trim() === '') {
                                if (!this.oDataPath || this.oDataPath.trim() === '') {
                                    deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.business.noConfig'))) });
                                    return deferred.promise;
                                }
                                else {
                                    appPath = this.oDataPath;
                                }
                            }
                            var path = '';
                            if (!object.entityName) {
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.business.noEntityName'))) });
                            }
                            else {
                                try {
                                    if (appPath.slice(-1) !== "/") {
                                        appPath = appPath + '/';
                                    }
                                    path = appPath + object.entityName;
                                    if (object.options) {
                                        path += '?' + object.options;
                                    }
                                    var fnc = this.getCmd(path);
                                    return fnc.getAll(function (data) {
                                        deferred.resolve(data);
                                    }, function (err) {
                                        var exeError = _this.common.setExecutionError(err);
                                        deferred.reject({ data: new _this.CommandResponse(false, new _this.ExecutionError(exeError.data.error.errorCode, exeError.data.error.errorMessage)) });
                                    }).$promise;
                                }
                                catch (jse) {
                                    deferred.reject({ data: { Error: { ErrorCode: -1, ErrorMessage: jse.message } } });
                                }
                            }
                            return deferred.promise;
                        };
                        /**
                       * @ngdoc type
                       * @name FunctionModel
                       * @module siemens.simaticit.common.services.runtime
                       * @description
                       * Represents an input object used to execute a reading function on a runtime App.
                       *
                       * @property {string} appName The name of the App containing the function to execute.
                       * @property {string} functionName The name of the function to execute on the App.
                       * @property {Object} params An object containing the function parameters.
                       * @property {string} options An OData-compliant query string.
                       */
                        /**
                        * @ngdoc method
                        * @name common.services.runtime.dataService#read
                        * @module siemens.simaticit.common.services.runtime
                        * @param {FunctionModel} object See {@link type:FunctionModel}.
                        * @returns {Promise} A promise containing a {@link type:CommandResponse} object.
                        *
                        * @description
                        * Execute a reading API exposed by an App and returns the response.
                        *
                        */
                        BusinessData.prototype.read = function (object) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            var applicationServiceUrls = this.applicationServiceUrls;
                            if (!object) {
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.business.executeNoInput'))) });
                                return deferred.promise;
                            }
                            var appName = object.appName;
                            var appPath = applicationServiceUrls[appName];
                            if (!appPath || appPath.trim() === '') {
                                if (!this.oDataPath || this.oDataPath.trim() === '') {
                                    deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.business.noConfig'))) });
                                    return deferred.promise;
                                }
                                else {
                                    appPath = this.oDataPath;
                                }
                            }
                            var path = '';
                            if (!object.functionName) {
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.business.noFunctionName'))) });
                            }
                            else {
                                try {
                                    if (appPath.slice(-1) !== "/") {
                                        appPath = appPath + '/';
                                    }
                                    path = appPath + object.functionName;
                                    path += '(function=@x)';
                                    if (object.params) {
                                        path += '?@x=' + JSON.stringify(object.params);
                                    }
                                    if (object.options && object.params) {
                                        path += '&' + object.options;
                                    }
                                    else if (object.options) {
                                        path += '?' + object.options;
                                    }
                                    var fnc = this.getCmd(path);
                                    return fnc.getAll(function (data) {
                                        deferred.resolve(data);
                                    }, function (err) {
                                        var exeError = _this.common.setExecutionError(err);
                                        deferred.reject({ data: new _this.CommandResponse(false, new _this.ExecutionError(exeError.data.error.errorCode, exeError.data.error.errorMessage)) });
                                    }).$promise;
                                }
                                catch (jse) {
                                    deferred.reject({ data: { Error: { ErrorCode: -1, ErrorMessage: jse.message } } });
                                }
                            }
                            return deferred.promise;
                        };
                        return BusinessData;
                    }());
                    BusinessData.$inject = ['$q', '$resource', '$http', '$translate', 'common', 'CommandResponse', 'ExecutionError', 'common.services.runtime.DataConfig'];
                    runtime.BusinessData = BusinessData;
                    angular.module('siemens.simaticit.common.services.runtime').service('common.services.runtime.dataService', BusinessData);
                })(runtime = services.runtime || (services.runtime = {}));
            })(services = common_1.services || (common_1.services = {}));
        })(common = simaticit.common || (simaticit.common = {}));
    })(simaticit = siemens.simaticit || (siemens.simaticit = {}));
})(siemens || (siemens = {}));
//# sourceMappingURL=business.svc.js.map
(function () {
    'use strict';
   
    /**
     * @ngdoc type
     * @name CommandModel
     * @module siemens.simaticit.common.services.runtime
     *
     * @description
     * Represents a runtime command.
     *
     * @property {String} appName The name of the App.
     * @property {String} commandName The name of the runtime command.
     * @property {String} params The JSON payload of the runtime command.
     */

    /**
     * @ngdoc service
     * @name common.services.runtime.commandModel
     * @module siemens.simaticit.common.services.runtime
     * @description Factory used to create {@link type:CommandModel} objects.
     *
     * @param {String} appName The name of the app.     
     * @param {String} commandName The name of the runtime command.
     * @param {String} params The JSON payload of the runtime command.
     *
     * @returns {CommandModel} A {@link type:CommandModel} objects.
     */
    angular.module('siemens.simaticit.common.services.runtime').factory('common.services.runtime.commandModel', function () {
        function CommandModel(appName, commandName, params) {
            this.appName = appName;
            this.commandName = commandName;
            this.params = params;
        }
        return CommandModel;
    });


    /**
     * @ngdoc service
     * @name CommandResponse
     * @module siemens.simaticit.common.services.runtime
     * @requires service:CommandResponse
     *
     * @description
     * Factory used to create {@link siemens.simaticit.common.type:CommandResponse} objects representing responses of runtime commands.
     * @returns {CommandResponse} A {@link siemens.simaticit.common.type:CommandResponse} object.
     */
    angular.module('siemens.simaticit.common.services.runtime').factory('common.services.runtime.commandResponse', ['CommandResponse', function (Response) {
        function CommandResponse() { }
        CommandResponse.prototype = new Response();
        return CommandResponse;
    }]);



})();

/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
'use strict';
var siemens;
(function (siemens) {
    var simaticit;
    (function (simaticit) {
        var common;
        (function (common_1) {
            var services;
            (function (services) {
                var runtime;
                (function (runtime) {
                    /**
                     * @ngdoc provider
                     * @name common.services.runtime.ConfigProvider
                     * @module siemens.simaticit.common.services.runtime
                     * @description
                     * Configures the endpoint for the runtime service layer where commands will be executed. This property is automatically set when the UI Application starts.
                     *
                     * @property {Object} config An object with an **oDataServiceURI** property, identifying the URI of the runtime service layer.
                     */
                    var RuntimeConfigProvider = (function () {
                        function RuntimeConfigProvider() {
                            this.config = {
                                oDataServiceURI: '',
                                applicationServiceUrls: {}
                            };
                        }
                        /**
                        * @ngdoc service
                        * @name common.services.runtime.Config
                        * @module siemens.simaticit.common.services.runtime
                        * @description
                        * Configures the endpoint for the runtime service layer where commands will be executed. This property is automatically set when the UI Application starts.
                        *
                        * @property {Object} config An object with an **oDataServiceURI** property, identifying the URI of the runtime service layer.
                        */
                        RuntimeConfigProvider.prototype.$get = function () {
                            return {
                                config: this.config
                            };
                        };
                        return RuntimeConfigProvider;
                    }());
                    runtime.RuntimeConfigProvider = RuntimeConfigProvider;
                    angular.module('siemens.simaticit.common.services.runtime').provider('common.services.runtime.Config', RuntimeConfigProvider);
                    /**
                        * @ngdoc service
                        * @name common.services.runtime.commandService
                        * @module siemens.simaticit.common.services.runtime
                        *
                        * @requires $q
                        * @requires $resource
                        * @requires $http
                        * @requires service:CommandResponse
                        * @requires service:ExecutionError
                        * @requires common.services.runtime.commandModel
                        * @requires common.services.runtime.Config
                        *
                        * @description
                        * A data service, used to retrieve **runtime** data.
                        * This service provides APIs to execute runtime commands.
                        *
                        *
                        * @example
                        * In a controller, the **common.services.runtime.commandService** is used as follows:
                        *
                        * ```
                        * (function () {
                        *   'use strict';
                        *
                        *   var app = angular.module('myModule');
                        *
                        *   var runtimeCtrl = 'runtimeCtrl';
                        *
                        *   function runtimeController(commandService) {
                        *       var rt = this;
                        *
                        *       var cmdModel = {
                        *           appName: "DemoApp",
                        *           commandName: "CreateContainer",
                                    params: {Name: "Test1", Product: "P-0005"}
                        *       };
                        *
                        *       rt.myData = null;
                        *
                        *       rt.executeCommand = function () {
                        *       commandService.invoke(cmdModel).then(function (data) {
                        *            //get response data.
                        *            rt.myData = data;
                        *        },function(error){
                        *            //error response
                        *        });
                        *
                        *   }
                        *
                        *
                        *   app.controller(runtimeCtrl, ['common.services.runtime.commandService', runtimeController]);
                        * })();
                        *
                        *
                        * ```
                        *
                        */
                    var BusinessCommands = (function () {
                        function BusinessCommands($q, $resource, $http, $translate, common, CommandResponse, ExecutionError, RuntimeCommandModel, businessConfig, loggerService) {
                            var _this = this;
                            this.$q = $q;
                            this.$resource = $resource;
                            this.$http = $http;
                            this.$translate = $translate;
                            this.common = common;
                            this.CommandResponse = CommandResponse;
                            this.ExecutionError = ExecutionError;
                            this.RuntimeCommandModel = RuntimeCommandModel;
                            this.businessConfig = businessConfig;
                            this.loggerService = loggerService;
                            this.ERRORS = function (statusCode) {
                                switch (statusCode) {
                                    case 404: return _this.$translate.instant('ERRORS.404');
                                    case 503: return _this.$translate.instant('ERRORS.503');
                                    case 400: return _this.$translate.instant('ERRORS.400');
                                    case 403: return _this.$translate.instant('ERRORS.403');
                                    case 500: return _this.$translate.instant('ERRORS.500');
                                    case '4XX': return _this.$translate.instant('ERRORS.4XX');
                                    case '5XX': return _this.$translate.instant('ERRORS.5XX');
                                }
                            };
                            this.transformResObj = function (data, headersGetter, statusCode) {
                                var res = null;
                                if (data) {
                                    try {
                                        var Jsondata = JSON.parse(data);
                                        if (Jsondata.Error) {
                                            res = new _this.CommandResponse(Jsondata.Succeeded, new _this.ExecutionError(Jsondata.Error.ErrorCode, Jsondata.Error.ErrorMessage));
                                            res.data = Jsondata;
                                        }
                                        else {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(Jsondata.error.code, Jsondata.error.message));
                                            res.data = Jsondata;
                                        }
                                    }
                                    catch (e) {
                                        var errorSeries = Math.floor(statusCode / 100);
                                        if (_this.ERRORS(statusCode)) {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(statusCode, 'Error: ' + _this.ERRORS(statusCode)));
                                            _this.common.logger.logError(statusCode + 'Error: ' + _this.ERRORS(statusCode) + '', 'Business Command Service');
                                        }
                                        else if (_this.ERRORS(errorSeries + 'XX')) {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(statusCode, 'Error: ' + _this.ERRORS(errorSeries + 'XX')));
                                            _this.common.logger.logError(statusCode + 'Error: ' + _this.ERRORS(errorSeries + 'XX') + '', 'Business Command Service');
                                        }
                                        else {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(-1, 'Error: ' + e.message));
                                            _this.common.logger.logError('-1: Error: ' + e.message, '', 'Business Command Service');
                                        }
                                    }
                                }
                                else {
                                    res = new _this.CommandResponse(false, new _this.ExecutionError(-1, 'Generic Error'));
                                }
                                return res;
                            };
                            this.oDataPath = businessConfig.config.oDataServiceURI;
                            this.applicationServiceUrls = businessConfig.config.applicationServiceUrls;
                        }
                        BusinessCommands.prototype.transformDataObj = function (data) {
                            return { command: data };
                        };
                        BusinessCommands.prototype.callCommand = function (path) {
                            return this.$resource('', {}, {
                                cmd: {
                                    method: 'Post',
                                    url: path,
                                    transformRequest: [this.transformDataObj].concat(this.$http.defaults.transformRequest),
                                    transformResponse: [this.transformResObj].concat(this.$http.defaults.transformResponse)
                                }
                            });
                        };
                        /**
                          * @ngdoc method
                          * @name common.services.runtime.commandService#execute
                          * @module siemens.simaticit.common.services.runtime
                          * @deprecated Use the {@link common.services.runtime.commandService#invoke invoke} method instead.
                          * @param {String} publicName The public name of the command to be executed.
                          * @param {Object} payload The payload object containing the command parameters.
                          * @returns {Object} Promise object containing the command result.
                          * @description Executes runtime commands and returns a promise object to retrieve **runtime** data.
                          *
                          */
                        /**
                      * @ngdoc method
                      * @access internal
                      * @name common.services.runtime.commandService#execute
                      * @module siemens.simaticit.common.services.runtime
                      *
                      * @param {String} appName The app name of the command to be executed.
                      * @param {String} commandName The name of the command to be executed.
                      * @param {Object} payLoad The payload object of command parameters.
                      *
                      * @returns {Object} Promise object containing the command result.
                      * @description Executes runtime commands and returns a promise object to retrieve runtime data.
                      *
                      */
                        /**
                       * @ngdoc method
                       * @name common.services.runtime.commandService#execute
                       * @module siemens.simaticit.common.services.runtime
                       *
                       * @param {CommandModel} object See {@link type:CommandModel}
                       *
                       * @returns {Object} Promise object containing the command result.
                       * @description Executes runtime commands and returns a promise object to retrieve runtime data.
                       * @deprecated Use the {@link common.services.runtime.commandService#invoke invoke} method instead.
                       */
                        BusinessCommands.prototype.execute = function () {
                            var _this = this;
                            var deferred = this.$q.defer();
                            var path = '';
                            //creating the input object
                            var inputObject = this.processArguments(arguments);
                            if (undefined === inputObject || null === inputObject) {
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.businessCommand.executeInvalidInput'))) });
                                return deferred.promise;
                            }
                            //calling the command
                            var formatCommand;
                            if (!inputObject.commandName) {
                                //error
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.businessCommand.executeInvalidCommand'))) });
                                return deferred.promise;
                            }
                            if (!inputObject.params) {
                                inputObject.params = {};
                            }
                            if (null === inputObject.appName || '' === inputObject.appName || undefined === inputObject.appName) {
                                formatCommand = inputObject.commandName;
                            }
                            else {
                                formatCommand = inputObject.appName + '_' + inputObject.commandName;
                            }
                            path = this.oDataPath + formatCommand;
                            this.callCommand(path).cmd(inputObject.params, function (data) {
                                deferred.resolve(data);
                            }, function (err) {
                                var exeError = _this.common.setExecutionError(err);
                                deferred.reject(exeError);
                            });
                            return deferred.promise;
                        };
                        /**
                         * @ngdoc method
                         * @name common.services.runtime.commandService#invoke
                         * @module siemens.simaticit.common.services.runtime
                         *
                         * @param {CommandModel} object See {@link type:CommandModel}
                         *
                         * @returns {Object} Promise object containing the command result.
                         * @description Executes a runtime command and returns a Promise object containing the result.
                         */
                        BusinessCommands.prototype.invoke = function (inputObject) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            var path, appPath = '';
                            var formatCommand;
                            if (!inputObject) {
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.businessCommand.executeInvalidInput'))) });
                                return deferred.promise;
                            }
                            if (!inputObject.commandName) {
                                //error
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.businessCommand.executeInvalidCommand'))) });
                                return deferred.promise;
                            }
                            if (!inputObject.params) {
                                inputObject.params = {};
                            }
                            if (!inputObject.appName) {
                                appPath = this.oDataPath;
                            }
                            else {
                                var applicationServiceUrls = this.applicationServiceUrls;
                                var appName = inputObject.appName;
                                appPath = applicationServiceUrls[appName];
                                if (!appPath || appPath.trim() === '') {
                                    if (!this.oDataPath || this.oDataPath.trim() === '') {
                                        deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.business.noConfig'))) });
                                        return deferred.promise;
                                    }
                                    else {
                                        appPath = this.oDataPath;
                                    }
                                }
                            }
                            if (appPath.slice(-1) !== "/") {
                                appPath = appPath + '/';
                            }
                            formatCommand = inputObject.commandName;
                            path = appPath + formatCommand;
                            this.callCommand(path).cmd(inputObject.params, function (data) {
                                deferred.resolve(data);
                            }, function (err) {
                                var exeError = _this.common.setExecutionError(err);
                                deferred.reject(exeError);
                            });
                            return deferred.promise;
                        };
                        //This method is made public only for the sake of accessing it from backend service.(To avoid code redundancy). 
                        //As this method is not exposed, ng-doc is not written for this.
                        BusinessCommands.prototype.processArguments = function (parameters) {
                            var result = null;
                            if (parameters && parameters.length) {
                                switch (parameters.length) {
                                    case 1:
                                        if (parameters[0] instanceof this.RuntimeCommandModel) {
                                            result = parameters[0];
                                        }
                                        break;
                                    case 2:
                                        result = new this.RuntimeCommandModel();
                                        if ('string' === typeof parameters[1]) {
                                            result.appName = parameters[0];
                                            result.commandName = parameters[1];
                                            result.params = {};
                                        }
                                        else if ('object' === typeof parameters[1]) {
                                            result.commandName = parameters[0]; //the first argument is the full public name
                                            result.params = parameters[1];
                                        }
                                        break;
                                    case 3:
                                        result = new this.RuntimeCommandModel();
                                        result.appName = parameters[0];
                                        result.commandName = parameters[1];
                                        result.params = parameters[2];
                                        break;
                                    default:
                                        break;
                                }
                            }
                            return result;
                        };
                        return BusinessCommands;
                    }());
                    BusinessCommands.$inject = ['$q', '$resource', '$http', '$translate', 'common', 'CommandResponse', 'ExecutionError', 'common.services.runtime.commandModel',
                        'common.services.runtime.Config', 'common.services.logger.service'];
                    runtime.BusinessCommands = BusinessCommands;
                    angular.module('siemens.simaticit.common.services.runtime').service('common.services.runtime.commandService', BusinessCommands);
                })(runtime = services.runtime || (services.runtime = {}));
            })(services = common_1.services || (common_1.services = {}));
        })(common = simaticit.common || (simaticit.common = {}));
    })(simaticit = siemens.simaticit || (siemens.simaticit = {}));
})(siemens || (siemens = {}));
//# sourceMappingURL=businessCommand.svc.js.map
/// <reference path="../../../scripts/typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../scripts/typings/angularjs/angular.d.ts" />
'use strict';
var siemens;
(function (siemens) {
    var simaticit;
    (function (simaticit) {
        var common;
        (function (common_1) {
            var services;
            (function (services) {
                var runtime;
                (function (runtime) {
                    /**
                    * @ngdoc provider
                    * @name common.services.runtime.BusinessDataConfig
                    * @module siemens.simaticit.common.services.runtime
                    * @access internal
                    * @description
                    * Configures the path to the OData endpoint to utilize engineering data services
                    * used to generate required information
                    *
                    * @property {string} config.oDataServiceURI Gets the URI of the data service
                    */
                    angular.module('siemens.simaticit.common.services.runtime').provider('common.services.runtime.BusinessDataConfig', [function () {
                            this.config = {
                                oDataServiceURI: ''
                            };
                            this.$get = function () {
                                return {
                                    config: this.config
                                };
                            };
                        }]);
                    /**
                    * @ngdoc service
                    * @name common.services.runtime.SystemDataService
                    * @module siemens.simaticit.common.services.runtime
                    *
                    * @description
                    * This service is used to retrieve system data and execute system commands.
                    *
                    * @example
                    * In a controller, the **common.services.runtime.SystemDataService** can be used as follows:
                    *
                    * ```
                    *
                    *    (function () {
                    *     'use strict';
                    *
                    *       function RuntimeAccessController($scope, SystemDataService) {
                    *            var vm = this;
                    *            var entityName = 'MyEnitytName';
                    *            var options = "$filter= Id ne '2'";
                    *            function get() {
                    *                SystemDataService.findAll(entityName, options).then(function (data) {
                    *                    vm.entityValue = data.value;
                    *                },
                    *                function(error){
                    *                    vm.entityValue = error.data.error.errorMessage;
                    *                });
                    *            }
                    *
                    *           function invokeCommand() {
                    *               var inputObject = {};
                    *               inputObject.commandName = 'myCmmandName';
                    *               inputObject.params = {'Name':'XYZ', 'Id':456};
                    *               SystemDataService.invoke(inputObject).then(function (data) {
                    *                   vm.invokeResult = "Command execution succeeded = " + data.succeeded;
                    *               }, function (error) {
                    *                   vm.invokeResult = error.data.error.errorMessage;;
                    *               });
                    *           }
                    *           // Getting entity data
                    *           get();
                    *
                    *           // Invoking a command
                    *           invokeCommand();
                    *       }
                    *       RuntimeAccessController.$inject = ['$scope', 'common.services.runtime.SystemDataService'];
                    *
                    *       angular
                    *         .module('siemens.simaticit.common.examples')
                    *         .controller('RuntimeAccessController', RuntimeAccessController);
                    *    })();
                    *
                    *```
                    */
                    var BusinessSystemService = (function () {
                        function BusinessSystemService($q, $resource, $http, $translate, $timeout, common, CommandResponse, ExecutionError, RuntimeCommandModel, engineeringBusinessConfig, entityConfig, commandConfig) {
                            var _this = this;
                            this.$q = $q;
                            this.$resource = $resource;
                            this.$http = $http;
                            this.$translate = $translate;
                            this.$timeout = $timeout;
                            this.common = common;
                            this.CommandResponse = CommandResponse;
                            this.ExecutionError = ExecutionError;
                            this.RuntimeCommandModel = RuntimeCommandModel;
                            this.engineeringBusinessConfig = engineeringBusinessConfig;
                            this.entityConfig = entityConfig;
                            this.commandConfig = commandConfig;
                            this.ERRORS = function (statusCode) {
                                switch (statusCode) {
                                    case 404: return _this.$translate.instant('ERRORS.404');
                                    case 503: return _this.$translate.instant('ERRORS.503');
                                    case 400: return _this.$translate.instant('ERRORS.400');
                                    case 403: return _this.$translate.instant('ERRORS.403');
                                    case 500: return _this.$translate.instant('ERRORS.500');
                                    case '4XX': return _this.$translate.instant('ERRORS.4XX');
                                    case '5XX': return _this.$translate.instant('ERRORS.5XX');
                                }
                            };
                            this.transformResObj = function (data, headersGetter, statusCode) {
                                var res = null;
                                if (data) {
                                    try {
                                        var Jsondata = JSON.parse(data);
                                        //odata Response Error
                                        if (Jsondata['odata.error']) {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(Jsondata['odata.error'].code, Jsondata['odata.error'].message.value));
                                            _this.common.logger.logError(Jsondata['odata.error'].code + ' : ' + Jsondata['odata.error'].message.value, '', 'Engineering Data Service');
                                        }
                                        //odata Response with data
                                        if (Jsondata['@odata.context']) {
                                            res = new _this.CommandResponse(true, new _this.ExecutionError(0, ''));
                                            //res.value = Jsondata.value;
                                            var suffix = '$entity';
                                            if (Jsondata['@odata.context'].indexOf(suffix, Jsondata['@odata.context'].length - suffix.length) !== -1) {
                                                delete Jsondata['@odata.context'];
                                                res.value = [Jsondata];
                                            }
                                            else {
                                                res.value = Jsondata.value;
                                            }
                                            // parse count from response
                                            if (Jsondata['@odata.count']) {
                                                res.count = Jsondata['@odata.count'];
                                            }
                                        }
                                        //http error
                                        if (Jsondata.error) {
                                            res = new _this.CommandResponse('false', new _this.ExecutionError(Jsondata.error.code, Jsondata.error.message));
                                            _this.common.logger.logError(Jsondata.error.code + ' : ' + Jsondata.error.message, '', 'Engineering Data Service');
                                        }
                                    }
                                    catch (ex) {
                                        var errorSeries = Math.floor(statusCode / 100);
                                        if (_this.ERRORS(statusCode)) {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(statusCode, 'Error: ' + _this.ERRORS(statusCode)));
                                            _this.common.logger.logError(statusCode + 'Error: ' + _this.ERRORS(statusCode) + '', 'Engineering Data Service');
                                        }
                                        else if (_this.ERRORS(errorSeries + 'XX')) {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(statusCode, 'Error: ' + _this.ERRORS(errorSeries + 'XX')));
                                            _this.common.logger.logError(statusCode + 'Error: ' + _this.ERRORS(errorSeries + 'XX') + '', 'Engineering Data Service');
                                        }
                                        else {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(-1, "Error: " + ex.message));
                                            _this.common.logger.logError('-1: Error: ' + ex.message, '', 'Engineering Data Service');
                                        }
                                    }
                                }
                                else {
                                    res = new _this.CommandResponse(false, new _this.ExecutionError(-1, _this.$translate.instant('svcErrors.engineering.generic')));
                                    _this.common.logger.logError('-1: Error: Generic Error', '', 'Engineering Data Service');
                                }
                                return res;
                            };
                            this.transformResObjInvoke = function (data, headersGetter, statusCode) {
                                var res = null;
                                if (data) {
                                    try {
                                        var Jsondata = JSON.parse(data);
                                        if (Jsondata.Error) {
                                            res = new _this.CommandResponse(Jsondata.Succeeded, new _this.ExecutionError(Jsondata.Error.ErrorCode, Jsondata.Error.ErrorMessage));
                                            res.data = Jsondata;
                                        }
                                        else {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(Jsondata.error.code, Jsondata.error.message));
                                            res.data = Jsondata;
                                        }
                                    }
                                    catch (e) {
                                        var errorSeries = Math.floor(statusCode / 100);
                                        if (_this.ERRORS(statusCode)) {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(statusCode, 'Error: ' + _this.ERRORS(statusCode)));
                                            _this.common.logger.logError(statusCode + 'Error: ' + _this.ERRORS(statusCode) + '', 'Business Command Service');
                                        }
                                        else if (_this.ERRORS(errorSeries + 'XX')) {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(statusCode, 'Error: ' + _this.ERRORS(errorSeries + 'XX')));
                                            _this.common.logger.logError(statusCode + 'Error: ' + _this.ERRORS(errorSeries + 'XX') + '', 'Business Command Service');
                                        }
                                        else {
                                            res = new _this.CommandResponse(false, new _this.ExecutionError(-1, 'Error: ' + e.message));
                                            _this.common.logger.logError('-1: Error: ' + e.message, '', 'Business Command Service');
                                        }
                                    }
                                }
                                else {
                                    res = new _this.CommandResponse(false, new _this.ExecutionError(-1, 'Generic Error'));
                                }
                                return res;
                            };
                            this.oDataPath = engineeringBusinessConfig.config.oDataServiceURI;
                        }
                        BusinessSystemService.prototype.getCmd = function (path) {
                            return this.$resource('', {}, {
                                getAll: {
                                    method: 'Get',
                                    url: path,
                                    transformResponse: [this.transformResObj].concat(this.$http.defaults.transformResponse)
                                }
                            });
                        };
                        /**
                         * @ngdoc method
                         * @name common.services.runtime.SystemDataService#findAll
                         * @param {String} entityName Name of the runtime entity to be queried.
                         * @param {String} [options] An OData query string.
                         * @returns {Promise} A promise containing a {@link type:CommandResponse} object.
                         * @description
                         * Retrieves data from one of the following system entities:
                         *
                         *   * Role
                         *   * UserRoleAssociation
                         *   * GroupRoleAssociation
                         *   * User
                         *   * Group
                         */
                        BusinessSystemService.prototype.findAll = function (entityName, options) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            if (!this.entityConfig[entityName]) {
                                deferred.reject({
                                    data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.engineering.wrongEntityName')))
                                });
                            }
                            else {
                                entityName = this.entityConfig[entityName];
                                var path = this.oDataPath + entityName;
                                if (!this.oDataPath || this.oDataPath.trim() === '') {
                                    deferred.reject({
                                        data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.engineering.noConfig')))
                                    });
                                }
                                else if (!entityName || entityName === '') {
                                    deferred.reject({
                                        data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.engineering.noEntityName')))
                                    });
                                }
                                else {
                                    try {
                                        if (options) {
                                            path += '?' + options;
                                        }
                                        var fnc = this.getCmd(path);
                                        fnc.getAll(function (data) {
                                            deferred.resolve(data);
                                        }, function (err) {
                                            deferred.reject({ data: new _this.CommandResponse(false, new _this.ExecutionError(err.data.error.errorCode, err.data.error.errorMessage)) });
                                        });
                                        return deferred.promise;
                                    }
                                    catch (jse) {
                                        deferred.reject({ data: { Error: { ErrorCode: -1, ErrorMessage: jse.message } } });
                                        return deferred.promise;
                                    }
                                }
                            }
                            return deferred.promise;
                        };
                        //Invoke
                        BusinessSystemService.prototype.transformDataObj = function (data) {
                            return { command: data };
                        };
                        BusinessSystemService.prototype.callCommand = function (path) {
                            return this.$resource('', {}, {
                                cmd: {
                                    method: 'Post',
                                    url: path,
                                    transformRequest: [this.transformDataObj].concat(this.$http.defaults.transformRequest),
                                    transformResponse: [this.transformResObjInvoke].concat(this.$http.defaults.transformResponse)
                                }
                            });
                        };
                        /**
                        * @ngdoc type
                        * @name SystemCommandModel
                        * @module siemens.simaticit.common.services.runtime
                        * @description
                        * Represents a system command to be invoked using the {@link common.services.runtime.SystemDataService#invoke invoke} method.
                        *
                        * @property {string} commandName The name of the system command to be executed.
                        * @property {Object} params The JSON payload of the  command.
                        */
                        /**
                       * @ngdoc method
                       * @name common.services.runtime.SystemDataService#invoke
                       * @module siemens.simaticit.common.services.runtime
                       *
                       * @param {SystemCommandModel} inputObject {@link type:SystemCommandModel}
                       *
                       * @returns {Object} Promise object containing the command result.
                       * @description Executes one of the following system commands:
                       *
                       *    * CreateUserRoleAssociation(RoleName, UserID)
                       *    * CreateGroupRoleAssociation (RoleName, GroupID)
                       *    * DeleteUserRoleAssociation  (RoleName, UserID)
                       *    * DeleteGroupRoleAssociation (RoleName, GroupID)
                       *    * ApplyUMAC()
                       */
                        BusinessSystemService.prototype.invoke = function (inputObject) {
                            var _this = this;
                            var deferred = this.$q.defer();
                            var path, appPath = '';
                            var formatCommand;
                            if (!inputObject) {
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.businessCommand.executeInvalidInput'))) });
                                return deferred.promise;
                            }
                            if (!this.commandConfig[inputObject.commandName]) {
                                //error
                                deferred.reject({ data: new this.CommandResponse(false, new this.ExecutionError(-1, this.$translate.instant('svcErrors.businessCommand.executeInvalidCommand'))) });
                                return deferred.promise;
                            }
                            inputObject.commandName = this.commandConfig[inputObject.commandName];
                            if (!inputObject.params) {
                                inputObject.params = {};
                            }
                            appPath = this.oDataPath;
                            if (appPath.slice(-1) !== "/") {
                                appPath = appPath + '/';
                            }
                            formatCommand = inputObject.commandName;
                            path = appPath + formatCommand;
                            this.callCommand(path).cmd(inputObject.params, function (data) {
                                deferred.resolve(data);
                            }, function (err) {
                                var exeError = _this.common.setExecutionError(err);
                                deferred.reject(exeError);
                            });
                            return deferred.promise;
                        };
                        return BusinessSystemService;
                    }());
                    BusinessSystemService.$inject = ['$q', '$resource', '$http', '$translate', '$timeout', 'common', 'CommandResponse', 'ExecutionError', 'common.services.runtime.commandModel',
                        'common.services.runtime.BusinessDataConfig', 'entityConfig', 'commandConfig'];
                    runtime.BusinessSystemService = BusinessSystemService;
                    angular.module('siemens.simaticit.common.services.runtime').service('common.services.runtime.SystemDataService', BusinessSystemService);
                    angular.module('siemens.simaticit.common.services.runtime').constant('entityConfig', {
                        "Role": "PublicRole",
                        "UserRoleAssociation": "PublicUserRoleAssociation",
                        "GroupRoleAssociation": "PublicGroupRoleAssociation",
                        "User": "PublicUser",
                        "Group": "PublicGroup"
                    });
                    angular.module('siemens.simaticit.common.services.runtime').constant('commandConfig', {
                        "CreateUserRoleAssociation": "PublicCreateUserRoleAssociationCommand",
                        "CreateGroupRoleAssociation": "PublicCreateGroupRoleAssociationCommand",
                        "DeleteUserRoleAssociation": "PublicDeleteUserRoleAssociationCommand",
                        "DeleteGroupRoleAssociation": "PublicDeleteGroupRoleAssociationCommand",
                        "ApplyUMAC": "PublicApplyUMACCommand"
                    });
                })(runtime = services.runtime || (services.runtime = {}));
            })(services = common_1.services || (common_1.services = {}));
        })(common = simaticit.common || (simaticit.common = {}));
    })(simaticit = siemens.simaticit || (siemens.simaticit = {}));
})(siemens || (siemens = {}));
//# sourceMappingURL=businessSystemData.svc.js.map
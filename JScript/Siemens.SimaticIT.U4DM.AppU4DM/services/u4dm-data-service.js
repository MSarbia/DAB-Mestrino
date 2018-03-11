(function () {
    'use strict';

    /**
     * @ngdoc module
     * @name Siemens.SimaticIT.U4DM.AppU4DM.services.data
     * @module Siemens.SimaticIT.U4DM.AppU4DM.services.data
     *
     * @description
     * This module contains functionality for getting and setting data through the UA framework.
     *
     */
    var mod = angular.module('Siemens.SimaticIT.U4DM.AppU4DM.services.data', [
        'siemens.simaticit.common',
        'Siemens.SimaticIT.U4DM.AppU4DM.services.constants'
    ]);

    /**
     *  @ngdoc service
     *  @name u4dm.services.data
     *  @module Siemens.SimaticIT.U4DM.AppU4DM.services.data
     *  @description Provides an interface to the UA framework for getting and setting data.
     *
     */
    mod.factory('u4dm.services.data', [
        '$q',
        '$timeout',
        'common.base',
        'CommandResponse',
        'ExecutionError',
        'u4dm.constants',
        'u4dm.services.utility',
        '$log',
        'u4dm.services.ui',
        'uadm.services.globalization',
        u4dmDataService
    ]);

    function u4dmDataService(
        $q,
        $timeout,
        commonBase,
        commandResponse,
        executionError,
        u4dmConstants,
        u4dmUtility,
        $log,
        uiSvc,
        uadmGlobalization
    ) {
 
        var svc = {
            'getAll': getAll,
            'getAllBackground' : getAllBackground,
            'execute': execute,
            'SuccessfulGetAllResponse': SuccessfulGetAllResponse,
            'PagerOptimizer': PagerOptimizer,
            'cache': new CacheManager(),
            'spliceFilterClause': spliceFilterClause,
            'static': {
                getDependencyTypes: getDependencyTypes,
                getEquipmentLevels: getEquipmentLevels,
                getMaterialSpecificationTypes: getMaterialSpecificationTypes,
                getUoMs: getUoMs
            },
            'stripFilterClause': stripFilterClause,
            'loadEntitiesByKey': loadEntitiesByKey
        };


        var staticData = {
            DependencyType: {
                entityName: 'DependencyType',
                cache: null
            },
            EquipmentLevel: {
                entityName: 'EquipmentLevel', 
                cache: null
            },
            MaterialSpecificationType: {
                entityName: 'MaterialSpecificationType',
                cache: null
            },
            UoM: {
                entityName: 'UoM',
                cache: null
            }
        };

        return svc;


        function getAll(entityName, options) {
            var q = { appName: u4dmConstants.appName, entityName: entityName, options: options };
            if (q.entityName == 'WorkOrderExt')
            {
                q.appName = 'AppDAB';
            }
            return commonBase.services.runtime.backendService.findAll(q);
        }

        function getAllBackground(entityName, options) {
            var q = { appName: u4dmConstants.appName, entityName: entityName, options: options };
            return commonBase.services.runtime.dataService.findAll(q);
        }


        function execute(name, params) {
            var commandModel = {};
            commandModel.appName = u4dmConstants.appName;
			//DABCUSTOM
			//call the custom command on the AppDAB
            if (name == 'DABStartSerial' || 
            name == 'DABCompleteSerial' || 
            name == 'DABReplaceMaterial' ||
            name == 'DABReleaseOrder')
			{
				commandModel.appName = 'AppDAB';
			}
            commandModel.commandName = name;
            commandModel.params = params;
            return commonBase.services.runtime.backendService.invoke(commandModel).then(
                function(result) {
                    if (result.data && result.data.WarningMessage) {
                        var title = uadmGlobalization.translate('sit.u4dm.warning');
                        var text = result.data.WarningMessage;
                        uiSvc.overlay.showMessage(title, text);
                    }
                    return result;
                });
        }

        function PagerOptimizer(callback, customOptions, skipFakeCall) {
            var index = 1;
            //fake call promise to pass the FIRST time to the ICV pager
            var fakeCall = function () {
                var deferred = $q.defer();
                $timeout(function () {
                    var resp = new SuccessfulGetAllResponse([]);
                    //trick to hide No Data on loading
                    resp.count = 1;
                    deferred.resolve(resp);
                }, 1);
                return deferred.promise;
            }

            this.promiseForLanding = function (icvOptions, showOnlyReady, filterClauses, smartSearchText, seachAssigned, restrictiveSearch, wooAssigned) {
                return callback(icvOptions, showOnlyReady, filterClauses, smartSearchText, seachAssigned, restrictiveSearch, wooAssigned);
            };

            //public function to manage promises
            this.promise = function (icvOptions) {
                //if is NOT the first call use real promise
                if (index > 0) {
                    //trim to lower function

                    //if i have custom options parse and merge it
                    if (customOptions) {
                        //chain custom options
                        var optionsString = icvOptions + '&' + customOptions;
                        //combine filters
                        var com = u4dmUtility.combineFilters(optionsString);
                        //call real callback
                        return callback(com.$resultquery).then(function (result) {
                            //result.count = result.value.length > 0 ? 99999999 : 0;// without this the ICV doesn't work...check on result.value.length for 'No Data'
                            return result;
                        });
                    } else { //no custom options
                        return callback(icvOptions).then(function (result) {
                            //result.count = result.value.length > 0 ? 99999999 : 0;// without this the ICV doesn't work...check on result.value.length for 'No Data'
                            return result;
                        });
                    }
                }
                    //if is the first call
                else {
                    index++;
                    //return the fake promise
                    return fakeCall();
                }
            };
        }

        function SuccessfulGetAllResponse(data) {
            this.succeeded = "true",
            this.value = Array.isArray(data) ? data : [data];
        }


        function CacheManager() {
            var dataCache = {};
            var definedProperties = {};

            var svc = this;

            svc.addPropertyAccessors = function (props) {
                // support a comma delimited list of arguments as the property names
                var propsArray = Array.isArray(props) ? props : Array.prototype.slice.call(arguments);

                propsArray.forEach(function (prop) {
                    if (definedProperties[prop] !== undefined) {
                        console.warn("Property '" + prop + "' already defined in temp data cache!");
                    }
                    if (typeof prop === 'string') {
                        defineVolatileProperty(prop);
                    } else {
                        definePersistedProperty(prop);
                    }
                });
                //}
            };

            function defineVolatileProperty(prop) {
                if (definedProperties[prop] !== undefined) {
                    console.warn("Property '" + prop + "' already defined in temp data cache!");
                } else {
                    definedProperties[prop] = prop;
                    svc['get' + prop] = function () { return dataCache[prop]; };
                    svc['set' + prop] = function (data) {
                        dataCache[prop] = data;
                    };
                    svc['pop' + prop] = function () {
                        var data = dataCache[prop];
                        if (dataCache[prop] !== undefined) {
                            delete dataCache[prop];
                        }
                        return data;
                    };
                }
            }

            // prop structure: { name: '', entity: '', keyField: '', odataOptions: '' }
            function definePersistedProperty(prop) {
                if (definedProperties[prop.name] !== undefined) {
                    console.warn("Property '" + prop.name + "' already defined in temp data cache!");
                } else {
                    definedProperties[prop.name] = prop;
                    svc['get' + prop.name] = function (refresh) {
                        return getPersistedProperty(prop.name, prop.keyField, prop.entity, prop.odataOptions, refresh);
                    };
                    svc['set' + prop.name] = function (data) {
                        setPersistedProperty(data, prop.name, prop.keyField);
                    };
                }
            }

            function setPersistedProperty(data, propName, keyField) {
                var keyList = [];

                // cache the data in volatile storage
                dataCache[propName] = data;

                if (data) {
                    // persist the keys so we can recover from a page refresh.
                    data.forEach(function (item, index) {
                        keyList[index] = item[keyField];
                    });
                    sessionStorage.setItem(propName, JSON.stringify(keyList));
                } else {
                    sessionStorage.setItem(propName, JSON.stringify(keyList));
                }
            }

            function getPersistedProperty(propName, keyField, entityName, odataOptions, refresh) {
                var deferred = $q.defer();
                var keyListString;
                var keyList;
                var data = refresh ? null : dataCache[propName];

                if (data && data.length > 0) {
                    deferred.resolve(new SuccessfulGetAllResponse(data));
                } else {
                    try {
                        keyListString = sessionStorage.getItem(propName);
                        keyList = keyListString ? JSON.parse(keyListString) : null;
                    } catch (ex) {
                        console.error('Error parsing list of key values: ' + keyListString);
                    }

                    if (keyList && keyList.length > 0) {
                        var isKeyValueSting = checkIsValString(keyList[0]);
                        loadEntitiesByKey(keyList, keyField, entityName, odataOptions, isKeyValueSting).then(
                            function (result) {
                                // when refreshing, update the cached list with the new values
                                if (refresh) {
                                    setPersistedProperty(result.value, propName, keyField);
                                }
                                deferred.resolve(result);
                            }
                        );
                    } else {
                        deferred.resolve(new SuccessfulGetAllResponse([]));
                    }
                }
                return deferred.promise;
            }
            function checkIsValString(keyVal) {
                function isGuid(stringToTest) {
                    if (stringToTest[0] === "{") {
                        stringToTest = stringToTest.substring(1, stringToTest.length - 1);
                    }
                    var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
                    return regexGuid.test(stringToTest);
                }
                var retVal = false;
                if (isGuid(keyVal) || typeof keyVal === "number") {
                    retVal = false;
                }
                else if (typeof keyVal === "string") {
                    retVal = true;
                }
                return retVal;
            }

            //TODO: remove following methods if there is no need.
            //      added when first built service, but don't see a use for them now.
            svc.removePropertyAccessors = function (props) {
                if (Array.isArray(props)) {
                    props.forEach(function (prop) {
                        if (definedProperties[prop] !== undefined) {
                            delete definedProperties[prop];
                            delete svc['get' + prop];
                            delete svc['set' + prop];
                        }
                        if (dataCache[prop] !== undefined) {
                            delete dataCache[prop];
                        }
                    });
                }
            };

            svc.getDefinedProperties = function () {
                return Object.keys(definedProperties);
            };

            svc.getUsedProperties = function () {
                return Object.keys(dataCache);
            };
        }

        function loadEntitiesByKey(keyList, keyField, entityName, odataOptions, isKeyValueString) {
            odataOptions = odataOptions || ""; // empty string OK for options, but avoid any other falsy values.

            var deferred = $q.defer();
            var response;
            var first = 0;
            var last;
            var promises = [];
            var entityList = [];
            var loadError = null;

            // iterate the keylist loading 10 at a time. add promises from all calls to an array
            do {
                last = first + 10;
                if (last >= keyList.length) {
                    promises.push(loadEntities(keyList.slice(first)));
                } else {
                    promises.push(loadEntities(keyList.slice(first, last)));
                }
                first += 10;
            } while (first < keyList.length && !loadError);

            // wait for all calls to complete
            if (keyList.length > 0) {
                $q.all(promises).then(function () {
                    if (loadError) {
                        deferred.reject(loadError);
                    } else {
                        response = new SuccessfulGetAllResponse(entityList);
                        deferred.resolve(response);
                    }
                });
            } else {
                // handle case where empty keylist passed in. (by returning empty list)
                deferred = $q.defer();
                response = new SuccessfulGetAllResponse(entityList);
                deferred.resolve(response);
            }

            return deferred.promise;

            /**
             * builds the odata string to load multiple enties by key and makes the backend call to get the data.
             */
            function loadEntities(keys) {
                // build the filter clause from the list of keys.
                // must have at least one ID to get here.
                var ampersand = odataOptions.length > 0 ? "&" : "";
                if (isKeyValueString) {
                    var filterArray = [ampersand + "$filter=" + keyField + " eq '" + encodeURIComponent(keys[0]) + "'"];
                    for (var i = 1; i < keys.length; i++) {
                        filterArray[filterArray.length] = " or " + keyField + " eq '" + encodeURIComponent(keys[i]) + "'";
                    }
                } else {
                    var filterArray = [ampersand + "$filter=" + keyField + " eq " + encodeURIComponent(keys[0])];
                    //var filterArray = [ampersand + "$filter=" + keyField + " eq " + keys[0]];
                    for (var i = 1; i < keys.length; i++) {
                        filterArray[filterArray.length] = " or " + keyField + " eq " + encodeURIComponent(keys[i]);
                        //filterArray[filterArray.length] = " or " + keyField + " eq " + keys[i];
                    }
                }
                var filterString = filterArray.join('');

                var options = odataOptions + filterString;

                return getAll(entityName, options).then(
                    function (result) {
                        result.value.forEach(function (item) {
                            entityList.push(item);
                        });
                    },
                    function (reason) {
                        loadError = reason;
                    }
                );
            }
        }


        function getDependencyTypes(refresh, filterFunc) {
            var deferred = $q.defer();
            var data = refresh ? null : staticData.DependencyType.cache;
            var options = "$select=Id,NId&orderby=NId";
            if (data && data.length > 0) {
                data = filterFunc ? data.filter(filterFunc) : data;
                deferred.resolve(new SuccessfulGetAllResponse(data));
            } else {
                getAll(staticData.DependencyType.entityName, options).then(
                    function (result) {
                        result.value.forEach(function (item) {
                            item.localizedName = uadmGlobalization.translate('sit.u4dm.static-data.dependencyType.' + item.NId);
                        });
                        staticData.DependencyType.cache = result.value;
                        data = filterFunc ? result.value.filter(filterFunc) : result.value;
                        deferred.resolve(new SuccessfulGetAllResponse(data));
                    },
                    function (reason) {
                        deferred.reject(reason);
                    }
                );
            }
            return deferred.promise;
        }


        function getEquipmentLevels(parentLevel) {
            //coerce null/undefined to zero
            parentLevel = parentLevel || 0;

            // set levels if not already set
            var data = staticData.EquipmentLevel.cache ? staticData.EquipmentLevel.cache : setEquipmentLevels();

            // get just the levels below the specified level
            return data.filter(function (level) {
                // if level is 0 then the levels appear in dropdown was only "Enterprise" and "Site"
                if (parentLevel == 0) return level.id <= 2;

                else

                    return level.id > parentLevel;
            });

            //no querying of db, levels are fixed to the following
            function setEquipmentLevels() {
                staticData.EquipmentLevel.cache = [
                    {
                        id: u4dmConstants.equipmentLevels.ENTERPRISE,
                        name: uadmGlobalization.translate('sit.u4dm.equipment-level.enterprise')
                    },
                    {
                        id: u4dmConstants.equipmentLevels.SITE,
                        name: uadmGlobalization.translate('sit.u4dm.equipment-level.site')
                    },
                    {
                        id: u4dmConstants.equipmentLevels.AREA,
                        name: uadmGlobalization.translate('sit.u4dm.equipment-level.area')
                    },
                    {
                        id: u4dmConstants.equipmentLevels.CELL,
                        name: uadmGlobalization.translate('sit.u4dm.equipment-level.cell')
                    },
                    {
                        id: u4dmConstants.equipmentLevels.UNIT,
                        name: uadmGlobalization.translate('sit.u4dm.equipment-level.unit')
                    },
                   //// EF
                   // {
                   //     id: u4dmConstants.equipmentLevels._3DPRINTER,
                   //     name: uadmGlobalization.translate('sit.u4dm.equipment-level.3dprinter')
                   // }

                ];
                return staticData.EquipmentLevel.cache;
            }
        }


        function getUoMs(refresh, filterFunc) {
            var deferred = $q.defer();
            var data = refresh ? null : staticData.UoM.cache;
            var options = "$select=Id,NId,Name&orderby=NId";
            if (data && data.length > 0) {
                //deferred.resolve(filterFunc ? data.filter(filterFunc) : data);
                data = filterFunc ? data.filter(filterFunc) : data;
                deferred.resolve(new SuccessfulGetAllResponse(data));
            } else {
                svc.getAll(staticData.UoM.entityName, options).then(
                    function (result) {
                        result.value.forEach(function (item) {
                            item.localizedName = uadmGlobalization.translate('sit.u4dm.static-data.uoms.' + item.NId);
                        });
                        staticData.UoM.cache = result.value;
                        data = filterFunc ? result.value.filter(filterFunc) : result.value;
                        deferred.resolve(new SuccessfulGetAllResponse(data));
                    },
                    function (reason) {
                        deferred.reject(reason);
                    }
                );
            }
            return deferred.promise;
        }


        function getMaterialSpecificationTypes(refresh, filterFunc) {
            var deferred = $q.defer();
            var data = refresh ? null : staticData.MaterialSpecificationType.cache;
            var options = "$select=Id,NId&$orderby=NId";
            if (data && data.length > 0) {
                data = filterFunc ? data.filter(filterFunc) : data;
                deferred.resolve(new SuccessfulGetAllResponse(data));
            } else {
                getAll(staticData.MaterialSpecificationType.entityName, options).then(
                    function (result) {
                        var uniqueList = getUniqueList(result.value);
                        uniqueList.forEach(function (item) {
                            item.localizedName = uadmGlobalization.translate('sit.u4dm.static-data.materialSpecificationTypes.' + item.NId);
                        });
                        staticData.MaterialSpecificationType.cache = uniqueList;
                        data = filterFunc ? uniqueList.filter(filterFunc) : uniqueList;
                        deferred.resolve(new SuccessfulGetAllResponse(data));
                    },
                    function (reason) {
                        deferred.reject(reason);
                    }
                );
            }
            return deferred.promise;

            // hopefully temp workaround for bad data where we have multiple entries for same spec type
            function getUniqueList(msTypes) {
                var length = msTypes.length;
                var uniqueList = [];
                var index = 0;
                var type, currentType;
                if (length) {
                    // assumes list is sorted by NId
                    while (index < length) {
                        type = getNextType();
                        if (type) {
                            uniqueList[uniqueList.length] = type;
                            currentType = type;
                        } else {
                            break;
                        }
                    }
                }
                return uniqueList;

                // get next type that differs from current
                function getNextType() {
                    while (index < length && currentType && currentType.NId === msTypes[index].NId) {
                        index++;
                    }
                    return index < length ? msTypes[index] : null;
                }
            }
        }

        function spliceFilterClause(options, filterCriteria) {
            // return value
            var query;

            // look for an existing $filter clause
            var filterIndex = options.indexOf('$filter=');
            if (filterIndex !== -1) {
                // splice in our filter criteria
                query = options.slice(0, filterIndex + 8) + filterCriteria + " and " + options.slice(filterIndex + 8);
            } else {
                // No existing filter clause.  Just tack on filter
                query = options + "&$filter=" + filterCriteria;
            }

            return query;
        }


        function stripFilterClause(options) {
            var noFilter = options;

            // look for an existing $filter clause
            var filterIndex = options.indexOf('$filter=');
            if (filterIndex !== -1) {
                // look for the start of the next clause
                var nextClauseIndex = options.indexOf('$', filterIndex + 1);
                if (nextClauseIndex !== -1) {
                    // remove the filter criteria
                    noFilter = options.slice(0, filterIndex) + options.slice(nextClauseIndex);
                } else {
                    // there is no other clause - just return an empty string
                    noFilter = '';
                }
            }

            return noFilter;
        }
    }
})();
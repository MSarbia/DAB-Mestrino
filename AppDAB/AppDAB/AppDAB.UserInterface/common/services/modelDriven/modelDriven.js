/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
/* SIMATIC IT Unified Architecture Foundation V2.0 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
/* This module should be added to the framework */
(function () {
    'use strict';
    angular.module('siemens.simaticit.common.services.modelDriven', [])
  .provider('common.services.modelDriven.service', ['$stateProvider', function ($stateProvider) {

      var resolveRef = function (target, ref) {
          var props = ref.replace(/^#\//, '').split('/');
          var success = true;
          for (var i = 0; i < props.length; i++) {
              var s = props[i];
              if (target[s]) {
                  if (i <= props.length && typeof target[s] === 'object') {
                      target = target[s];
                  } else {
                      // Path not found, do nothing
                      success = false;
                      break;
                  }
              }
          }
          return success ? target : ref;
      };



      function handleExternalRefs(context) {
          var $http = context.$http,
              externPromise = context.externPromise,
              p = context.p,
              $q = context.$q,
              externalRefMode = context.externalRefMode,
              obj = context.obj,
                  logger = context.logger;

          externPromise.push($http.get(p.$ref).then(function (resp) {
              resolveRefs(resp.data, $q, $http, externalRefMode, logger).then(function (dataSolved) {
                  var newPrefix = '#' + context.localRefRemap + "/" + context.prop;
                  (function refReplace(data, refPrefix) {
                      for (var propName2 in data) {
                          if (data.hasOwnProperty(propName2)) {
                              var propObj = data[propName2];
                              if (typeof propObj === 'object') {
                                  if (propObj.$ref) {
                                      if (propObj.$ref.match(/^#/)) {
                                          propObj.$ref = refPrefix + propObj.$ref.substring(1);
                                      }
                                  }
                                  else {
                                      refReplace(propObj, refPrefix);
                                  }
                              }
                          }
                      }
                  })(dataSolved, newPrefix);
                  obj[context.prop] = dataSolved;
              }, function (reason) {
                  logger.logError("Error resolving module manifest ref ", reason);
              });
          },
              function (reason) {
                  logger.logError("Error processing module manifest: ", reason);
              }
          ));
      }



      var resolveRefs = function (data, theQ, theHTTP, externalRefMode, logger) {
          var externPromise = [];
          var $http = theHTTP;
          var $q = theQ;
          var d = $q.defer();

          var recurseObj = function (obj, refRemap) {
              var localRefRemap = "";
              for (var prop in obj) {

                  if (obj.hasOwnProperty(prop)) {

                      localRefRemap = refRemap;
                      var p = obj[prop];
                      if (typeof p === 'object') {
                          if (p.$ref) {
                              if (!externalRefMode && p.$ref.match(/^#/)) {
                                  obj[prop] = resolveRef(data, p.$ref);
                              }
                              else if (externalRefMode && !p.$ref.match(/^#/)) {
                                  //asynch request ... I need a closure for prop
                                  //moved outside for ... add context 
                                  handleExternalRefs({
                                      prop: prop,
                                      localRefRemap: localRefRemap,
                                      externPromise: externPromise,
                                      $http: $http,
                                      p: p,
                                      externalRefMode: externalRefMode,
                                      obj: obj,
                                      $q: $q,
                                      logger: logger
                                  });
                              }
                              else {
                                  localRefRemap = localRefRemap + "/" + prop;
                                  recurseObj(p, localRefRemap);
                              }
                          } else {
                              localRefRemap = localRefRemap + "/" + prop;
                              recurseObj(p, localRefRemap);
                          }
                      }
                  }
              }
          };

          recurseObj(data, "");
          if (externPromise.length === 0) {
              d.resolve(data);
          }
          else {
              $q.all(externPromise).then(function () {
                  d.resolve(data);
              }, function (e) {
                  d.reject(e);
              });
          }
          return d.promise;
      };
      var appmod = "common.layout.modelDriven.template";
      function addManifestState(manifest) {

          manifest.states.forEach(function (state) {

              var entity = null;
              for (var content in state.contents) {
                  if (state.contents[content].master) {
                      entity = state.contents[content].entity;
                      break;
                  }
              }
              var liststate = state.id;

              var stateController = "", stateUrl = "";

              if (state.blueprint) { //custom and backward compatibility
                  stateController = state.blueprint.controller;
                  stateUrl = state.blueprint.url;
              }
              else {
                  if (state.layoutTemplate === "masterDetails") {
                      stateController = appmod + ".MDCtrl";
                      stateUrl = "common/blueprints/masterDetailsTemplate/masterDetailsLayoutTemplate.html";
                  }
                  else { //default tempalte
                      stateController = appmod + ".SECtrl";
                      stateUrl = "common/blueprints/singleEntityTemplate/singleEntityLayoutTemplate.html";
                  }
              }
              //var stateController = appmod + state.blueprint.controller;

              // List State

              var parkParam = '';
              if (state.navigationParams) {  //smart navigation
                  state.navigationParams.forEach(function (name) {
                      parkParam = parkParam + '/:' + name;
                  });
              }
              $stateProvider.state(liststate, {
                  name: liststate,
                  url: '/' + state.urlPrefix + '-list' + parkParam,
                  views: {
                      'Canvas@': {
                          templateUrl: stateUrl, //state.blueprint.url,
                          controller: stateController,
                          controllerAs: 'vm'
                      }
                  },
                  data: {
                      title: state.title
                  }
              });
              // Process actions

              var parkActions = [];
              for (var contentName in state.contents) {
                  if (state.contents[contentName].actions) {
                      parkActions = parkActions.concat(state.contents[contentName].actions);
                  }
              }
              parkActions.filter(function (a) { return (a.behavior.fields) ? true : false; }).forEach(function (action) {
                  var stateName = liststate + '.' + action.name;

                  var parkParam = '';
                  if (action.behavior.$stateParams) {
                      Object.getOwnPropertyNames(action.behavior.$stateParams).forEach(function (name) {
                          parkParam = parkParam + '/:' + name;
                      });
                  }


                  var templateUrl, controller;

                  if (action.type) {
                      if (action.type === "command" || action.type === "confirm") {
                          templateUrl = 'common/blueprints/executeCommandTemplate/execute-commandTemplate.html';
                          //                          controller = appmod + '.ExecuteCommandCtrl';
                          controller = "common.layout.modelDriven.template" + '.ExecuteCommandCtrl';

                      }
                      else if (action.type === "overview") {
                          templateUrl = 'common/blueprints/overviewTemplate/overviewTemplate.html';
                          controller = "common.layout.modelDriven.template" + '.Overview';

                      }
                  }
                  else if (action.behavior.blueprint.url && action.behavior.blueprint.controller) {
                      templateUrl = action.behavior.blueprint.url;
                      controller = appmod + action.behavior.blueprint.controller;
                  }
                  else { //default if not specified
                      if (action.behavior.command) {
                          templateUrl = 'common/blueprints/executeCommandTemplate/execute-commandTemplate.html';
                          controller = "common.layout.modelDriven.template" + '.ExecuteCommandCtrl';
                      }
                      //TODO reintroduce side panel overview
                      //if (action.behavior.display) {
                      //    templateUrl = dir + '/templates/display-data.html';
                      //    controller = appmod + '.DisplayDataCtrl';
                      //}
                  }
                  $stateProvider.state(stateName, {
                      name: stateName,
                      url: '/' + action.name + parkParam,
                      views: {
                          'property-area-container@': {
                              templateUrl: templateUrl,
                              controller: controller,
                              controllerAs: 'vm'
                          }
                      },
                      data: {
                          title: action.label
                      }
                  });
              });

          }); // End state creation


      }
      this.$get = [
        '$http',
        '$q',
        'common.services.logger.service',
        'common.services.modelDriven.dataService',
        function ($http, $q, logger, mds) {
            var self = this;
            var svc = 'modelDriven Service';
            var manifest;
            var lastManifestDefer = null;
            var manifestMap = [];


            self.addState = function (name, state) {
                $stateProvider.state(name, state);
            };

            self.clearManifest = function () {
                manifest = null;
            };
            var _getManifest = function (path) {
                var manifest = null;
                var d = $q.defer();
                if (manifest) {
                    d.resolve(manifest);
                } else {
                    $http.get(path).then(
                      function (resp) {

                          resolveRefs(resp.data, $q, $http, true, logger).then(function (data) { // first external ref
                              resolveRefs(data, $q, $http, false, logger).then(function (data) { // then internal
                                  manifest = data;
                                  logger.logInfo("Module manifest processed:", manifest, svc);
                                  addManifestState(manifest);
                                  mds.buildManifestEntity(manifest);
                                  d.resolve(manifest);
                              }, function (reason) {
                                  d.reject(reason);
                              });

                          }, function (reason) {
                              d.reject(reason);
                          });
                      },
                      function (reason) {
                          logger.logError("Error processing module manifest: ", reason, svc);
                          d.reject(reason);
                      }
                    );
                }
                return d.promise;
            };

            self.getManifest = function (path) {
                var defer = null, manifestRequested = null;
                if (path) {
                    manifestRequested = manifestMap.filter(function (element) { return (element.path === path); })[0];
                    if (manifestRequested) {
                        return manifestRequested.promise;
                    }
                }
                else { //no manifest specified
                    if (lastManifestDefer) {
                        return lastManifestDefer.promise;
                    }
                    else {
                        defer = $q.defer();
                        defer.reject("Wrong model driven js file include order ");
                        return defer.promise;
                    }
                }
                defer = $q.defer();
                lastManifestDefer = defer;
                manifestMap.push({ path: path, promise: defer.promise });
                _getManifest(path).then(function (data) {
                    //propagate functionalBlock info for multiappl
                    if ((data.functionalBlock || data.appl) && data.states) {
                        var application = data.appl;
                        if (!data.appl) {
                            var splittedFB = data.functionalBlock.split('.');
                            application = splittedFB[splittedFB.length - 1];
                        }
                        data.states.forEach(function (state) {
                            state['functionalBlock'] = application;
                        });
                    }
                    if (!manifest) {
                        manifest = data;
                    }
                    else {
                        //try merge at least of states
                        manifest.states = manifest.states.concat(data.states);
                    }
                    defer.resolve(manifest);
                }, function (reason) {
                    defer.reject(reason);
                });
                return defer.promise;
            };
            //status init
            self.initMD = function (manifestPath) {

                self.getManifest(manifestPath);
            };

            return self;
        }
      ];


  }])
  .service('common.services.modelDriven.contextService', ['$rootScope', '$state', '$parse', function ($rootScope, $state, $parse) {
      //TODO/NOTE: this service works with only one level view (and action subview) using url hierarchy. Nested md view are not supported by the getStateCtx
      this.MDState = { "previousState": "", "previousData": {} };
      this.contextsRepository = [];
      var self = this;
      var currState = "", currData = {};
      $rootScope.$on("$stateChangeSuccess", function (event, toState, toParam, fromState, fromParam) {
          self.MDState.previousState = fromState;
          self.MDState.previousData = fromParam;
          currState = toState;
          currData = toParam;
          clearCtx();
      });
      function clearCtx() {
          var stateId = $state.$current.toString();
          self.contextsRepository = self.contextsRepository.filter(function (context) {
              return (stateId.substr(0, context.name.length) === context.name);
          });
      }
      this.setContexInfo = function (ctxObj, viewParam, viewCtrl) {
          var stateId = $state.$current.toString();
          self.contextsRepository = []; // no hierarchical md view ... so we've always only one context
          //workaround ... 
          self.contextsRepository.push({ "name": stateId, "context": ctxObj, "viewParam": viewParam, "modelViewController": viewCtrl });
      };
      this.getViewCtrl = function () {
          if (self.contextsRepository.length === 0) {
              return undefined;
          }
          return self.contextsRepository[0].modelViewController;
      };
      // unflat nested params() 
      function unflatParam(splittedParName, value, orig) {
          var retObj = orig || {};
          if (splittedParName.length === 1) {
              retObj[splittedParName[0]] = value;
          }
          else {
              if (!retObj[splittedParName[0]]) {
                  retObj[splittedParName[0]] = {};
              }
              if (splittedParName.length === 2) {
                  retObj[splittedParName[0]][splittedParName[1]] = value;
              }
              else {
                  retObj[splittedParName[0]][splittedParName[1]] = unflatParam(splittedParName.slice(1), value, retObj[splittedParName[0]]);
              }
          }
          return retObj;
      }

      this.unflatProperties = function (obj) {
          var localObj = obj;
          var props = Object.getOwnPropertyNames(localObj);
          props.forEach(function (name) {
              var spliName = name.split('.');
              if (spliName.length > 1) {
                  localObj = unflatParam(spliName, localObj[name], localObj);
                  delete localObj[name];
              }
          });
          return localObj;
      };
      this.stringformat = function () {
          if (arguments.length <= 1) { //no additional params
              return arguments[0];
          }
          var ss = arguments[0];
          var args = [];
          args = args.concat(arguments[1]);
          return ss.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
              if (m === "{{") { return "{"; }
              if (m === "}}") { return "}"; }
              if (args[n]) {
                  return args[n];
              }
              else {
                  return 'null';
              }
          });
      };
      //additionalContext is to support form expression
      this.getStateCtx = function (name, additionalContext) {
          //TODO???: Nested md view are not supported ... use only first element of contextsRepository (We've to sort the contextsRepository by state descending and parse each context obj)
          if (self.contextsRepository.length === 0) {
              return undefined;
          }
          if (name) {
              try {
                  var ttt = $parse(name);
                  var retValue = null;
                  var newProp = [];
                  if (additionalContext) {
                      newProp = Object.getOwnPropertyNames(additionalContext);
                  }
                  newProp.forEach(function (pName) { //add props
                      self.contextsRepository[0].context[pName] = additionalContext[pName];
                  });

                  retValue = ttt(self.contextsRepository[0].context);

                  newProp.forEach(function (pName) { //remove props
                      delete self.contextsRepository[0].context[pName];
                  });

                  return retValue;
              }
              catch (e) {
                  // wrong custom expression
                  return undefined;
              }
          }
          return self.contextsRepository[0].context;
      };
      this.parseExpr = function (expr, context) {
          var ttt = $parse(expr);
          return ttt(context);
      };
  }])
  .service('common.services.modelDriven.runtimeService', ['common.services.modelDriven.service', 'common.services.modelDriven.contextService', 'common.services.modelDriven.dataService', 'filterFilter', '$parse', '$state', 'common.base', '$rootScope', 'common.widgets.busyIndicator.service', function (md, mdContextSrv, multiDataService, filterFilter, $parse, $state, base, $rootScope, busyService) {
      var backendService = base.services.runtime.backendService;

      //MD navigation info
      this.ModelViewCtrl = function (screen, contextRepository, viewStateParam) {
          var self = this, contentName = null, commandBarData = null;
          var applName = screen.functionalBlock;

          if (typeof contextRepository !== "object" || contextRepository === "null") {
              return null;
          }
          mdContextSrv.setContexInfo(contextRepository, viewStateParam, self);
          contextRepository["contents"] = {};
          //give access to the $stateParams on expression
          contextRepository["viewStateParams"] = viewStateParam;
          for (var detailName in screen.contents) {
              if (screen.contents.hasOwnProperty(detailName)) {

                  contextRepository["contents"][detailName] = {};

                  angular.copy(screen.contents[detailName], contextRepository["contents"][detailName]);
              }

          }

          function createExtraConf(properties, optionalTileConf) {
              // Inspect content properties to complete ICV configuration
              var quickSearchOptions, groupFields, sortInfo, gridConfig, tileConfig;
              properties.forEach(function (p) {
                  var prop = p.value;
                  var name = p.key;
                  var displayName = prop.label || p.key;
                  if (!gridConfig) {
                      gridConfig = { columnDefs: [] };
                  }
                  if (prop.ui) {
                      if (prop.type === 'number') {
                          gridConfig.columnDefs.push({ field: name, displayName: displayName, cellFilter: 'number' });
                      }
                      else if (prop.type === 'boolean') {
                          gridConfig.columnDefs.push({ field: name, displayName: displayName, cellTemplate: '<sit-mdtoggle ng-disabled="true" sit-value="row.getProperty(\'' + name + '\')" ></sit-mdtoggle>' });
                      }
                      else {
                          gridConfig.columnDefs.push({ field: name, displayName: displayName });
                      }
                  }
                  if (prop.ui) {
                      prop.ui.forEach(function (attr) {
                          switch (attr) {
                              case 'sortable':
                              case 'sortable:asc':
                              case 'sortable:desc':
                                  if (!sortInfo) {
                                      sortInfo = {
                                          field: name,
                                          direction: attr.match(/:desc$/) ? 'desc' : 'asc',
                                          fields: []
                                      };
                                  }
                                  sortInfo.fields.push({ field: name, displayName: displayName });
                                  break;
                              case 'groupable':
                                  if (!groupFields) {
                                      groupFields = [];
                                  }
                                  groupFields.push({ field: name, displayName: displayName });
                                  break;
                              case 'quicksearch':
                                  quickSearchOptions = { enabled: true, field: name };
                                  break;
                              case 'title':
                              case 'description':
                                  if (!tileConfig) {
                                      tileConfig = {};
                                  }
                                  tileConfig[attr + 'Field'] = name;
                                  break;
                          }
                      });
                  }
              });
              if (optionalTileConf) {
                  if (!tileConfig) {
                      tileConfig = {};
                  }
                  if (optionalTileConf.titleField) {
                      tileConfig["titleField"] = optionalTileConf.titleField;
                  }
                  if (optionalTileConf.descriptionField) {
                      tileConfig["descriptionField"] = optionalTileConf.descriptionField;
                  }
                  if (optionalTileConf.propertyFields) {
                      tileConfig["propertyFields"] = optionalTileConf.propertyFields;
                  }
                  else {
                      tileConfig["propertyFields"] = [];
                  }
              }
              return {
                  sortInfo: sortInfo,
                  groupFields: groupFields,
                  quickSearchOptions: quickSearchOptions,
                  tileConfig: tileConfig,
                  gridConfig: gridConfig
              };
          }

          function fillOption(cntName) {
              var localConf = {
                  selectionMode: 'single',
                  containerID: 'itemlist',
                  viewOptions: 'c',
                  viewMode: 'c',
                  image: screen.icon,
                  onSelectionChangeCallback: function (items, item) {
                      //asynch
                      if (item && item.selected === true) {
                          contextRepository[screen.contents[cntName].selectionContext] = item;
                      } else {
                          contextRepository[screen.contents[cntName].selectionContext] = undefined;
                      }
                      if (self[cntName].onContentSelection) {
                          self[cntName].onContentSelection(items, item);
                      }
                  }
              };
              if (screen.contents[cntName].extraContentConfiguration) {
                  for (var opt in screen.contents[cntName].extraContentConfiguration) {
                      if (screen.contents[cntName].extraContentConfiguration.hasOwnProperty(opt) && opt !== "tileConfig") { //tileconfig is handled later
                          localConf[opt] = screen.contents[cntName].extraContentConfiguration[opt];
                      }
                  }
              }
              return localConf;
          }
          var parkConf = {}, parkExtraConf = {};

          function addFieldRuntimeConf(prop) {
              contextRepository.contents[contentName].runtimeConf.data.push({
                  "id": prop.key,
                  "widget": prop.value.type !== 'boolean' ? "sit-label" : "sit-mdtoggle",
                  "disabled": true,
                  "label": (prop.value && prop.value.label) ? prop.value.label : prop.key
              });
          }
          for (contentName in screen.contents) {
              if (screen.contents.hasOwnProperty(contentName)) {

                  if (screen.contents[contentName].selectionContext) {
                      contextRepository[screen.contents[contentName].selectionContext] = null;
                  }


                  if (screen.contents[contentName].mode === "table") {
                      parkConf = fillOption(contentName);
                      if (screen.contents[contentName].extraContentConfiguration) {
                          parkExtraConf = createExtraConf(screen.contents[contentName].properties, screen.contents[contentName].extraContentConfiguration.tileConfig);
                      }
                      else {
                          parkExtraConf = createExtraConf(screen.contents[contentName].properties, null);
                      }
                      parkConf.sortInfo = parkExtraConf.sortInfo;
                      parkConf.groupFields = parkExtraConf.groupFields;
                      parkConf.quickSearchOptions = parkExtraConf.quickSearchOptions;
                      parkConf.tileConfig = parkExtraConf.tileConfig;
                      parkConf.gridConfig = parkExtraConf.gridConfig;
                      contextRepository.contents[contentName].runtimeConf = parkConf;
                  }
                  else if (screen.contents[contentName].mode === "form") {
                      contextRepository.contents[contentName].runtimeConf = {
                          "layout": "Vertical",
                          "type": "Fluid",
                          "mode": "view",
                          "columns": 1,
                          "data": []
                      };

                      screen.contents[contentName].properties.forEach(addFieldRuntimeConf, { contextRepository: contextRepository, contentName: contentName });


                  }
                  //TODO: add graph support
                  //else if (screen.contents[contentName].mode === "graph") {
                  //}

              }
          }

          self.getMasterContentNames = function () {
              if (screen && screen.contents) {
                  return Object.getOwnPropertyNames(screen.contents).filter(function (contentName) {
                      return screen.contents[contentName].master;
                  });
              }
              return [];
          };

          self['commandBars'] = [];
          if (screen.activeContent) {
              contextRepository["activeContent"] = screen.activeContent;
          }
          else {
              var parkMaster = self.getMasterContentNames();
              if (parkMaster.length > 0) {
                  contextRepository["activeContent"] = parkMaster[0];
              }
          }
          //actions
          commandBarData = {
              barType: "Action",
              bar: [],
              refresh: function () {
                  this.bar.forEach(function (cmd) {
                      if (cmd.showLogic) {
                          try {
                              cmd.visibility = mdContextSrv.getStateCtx(cmd.showLogic);
                          }
                          catch (e) {
                              // wrong custom expression
                          }
                      }
                  });
              }
          };
          self['commandBars'].push(commandBarData);


          function fillCmdBar(action) {
              // Configure Action Handlers
              var currDataService = null;
              if (action.entity) {
                  currDataService = multiDataService[action.entity]; // select correct dataProvider
              }

              var btnCallback = function () {
                  var stateId = $state.$current.toString();
                  var obj, contextParam;
                  if (action.type === "navigation") { //smart navigation

                      if (action.navigationParams) {
                          obj = {};
                          contextParam = {};
                          Object.getOwnPropertyNames(action.navigationParams).forEach(function (name) {
                              obj[name] = mdContextSrv.getStateCtx(action.navigationParams[name]);
                          });
                      }
                      $state.go(action.navigationDest, obj);
                      return;
                  }
                  if (action.behavior.fields) {

                      if (action.behavior.$stateParams) {
                          obj = {};
                          contextParam = {};
                          Object.getOwnPropertyNames(action.behavior.$stateParams).forEach(function (name) {
                              obj[name] = mdContextSrv.getStateCtx(action.behavior.$stateParams[name]);
                          });
                      }
                      //TODO add contextParam to the state or search for a different technique
                      $state.go(stateId + '.' + action.name, obj);
                      return;
                  }
                  // Execute a command
                  var cmdParams = null;
                  if (action.behavior.command) {
                      if (action.behavior.commandParams) {
                          cmdParams = mdContextSrv.getStateCtx(action.behavior.commandParams);
                          var execute = function (showBusy) {
                              var outputParameters = cmdParams;

                              if (showBusy) {
                                  busyService.show();
                              }
                              //execute confirm solve formatOutput itself to provide access to the form context
                              if (action.type === "confirm") {
                                  //TODO add formatOutput support
                                  if (action.behavior.formatOutput) {
                                      outputParameters = mdContextSrv.getStateCtx(action.behavior.formatOutput);
                                  }
                              }
                              currDataService[action.name](outputParameters, applName).then(function (outcome) {
                                  var vCtrl = null;
                                  if (outcome) {
                                      if (action.behavior.exitAction) {


                                          var selectId = null;
                                          if (outputParameters && outputParameters.Id && (typeof outputParameters.Id === "string")) {
                                              selectId = outputParameters.Id;
                                          }
                                          if (!selectId && outcome.data) {
                                              var outFields = Object.getOwnPropertyNames(outcome.data);
                                              outFields = outFields.filter(function (of) {
                                                  return (of !== "Error") && (of !== "Succeeded") && (of.indexOf("@odata.") === -1);
                                              });
                                              if (outFields.length === 1 && (typeof outFields[0] === "string")) {
                                                  selectId = { id: outcome.data[outFields[0]] };
                                              }
                                          }




                                          if (action.behavior.exitAction.refreshContents) {
                                              vCtrl = mdContextSrv.getViewCtrl();
                                              if (vCtrl) {
                                                  action.behavior.exitAction.refreshContents.forEach(function (cntName) {
                                                      if (vCtrl[cntName]) {
                                                          vCtrl[cntName].refresh();
                                                      }
                                                  });
                                              }
                                          }
                                          else if (action.behavior.exitAction.refreshAndSelectContents) {
                                              vCtrl = mdContextSrv.getViewCtrl();
                                              if (vCtrl) {
                                                  action.behavior.exitAction.refreshAndSelectContents.forEach(function (cntName) {
                                                      if (vCtrl[cntName]) {
                                                          if (!selectId) {
                                                              vCtrl[cntName].refresh();
                                                          }
                                                          else {
                                                              vCtrl[cntName].refreshAndSelect(selectId);
                                                          }
                                                      }
                                                  });
                                              }
                                          }
                                          if (showBusy) {
                                              busyService.hide();
                                          }
                                      }
                                      else {
                                          if (showBusy) {
                                              busyService.hide();
                                          }
                                          $state.go(stateId, {}, { reload: true });
                                      }
                                  }
                                  else {
                                      if (showBusy) {
                                          busyService.hide();
                                      }
                                  }
                              }, backendService.backendError);
                          };
                          if (action.behavior.confirm) {


                              var confirm = action.behavior.confirm;
                              confirm = confirm.replace(/\{\{(.+?)\}\}/g, function (match, p1) {
                                  return mdContextSrv.getStateCtx(p1);
                              });

                              backendService.confirm(confirm, function () {
                                  execute();
                              }, action.label);
                          }
                          else {
                              execute(true);
                          }
                      }
                  }
                  return; // Dunno what to do at this point really...
              };

              // Add action to Command Bar
              var cmdname = "";
              if (action.behavior) {
                  if (action.behavior.command) {
                      cmdname = action.behavior.command.key;
                  }
                  if (action.behavior.display) {
                      cmdname = action.behavior.display.key;
                  }
              }
              if (cmdname.length === 0) {
                  cmdname = action.name;
              }
              var command = {
                  type: (action.main) ? 'MainCommand' : 'Command',
                  name: cmdname,
                  label: action.label,
                  tooltip: action.tooltip || action.label,
                  image: action.icon,
                  showLogic: action.behavior.showExpression, // custom attribute...
                  onClickCallback: btnCallback
              };
              if (action.authorizationCmd) {
                  command.unauthorizedBehavior = 'hide';
                  command.name = action.authorizationCmd;
              }
              commandBarData.bar.push(command);
          }



          for (contentName in screen.contents) {
              if (screen.contents[contentName].actions) {
                  screen.contents[contentName].actions.forEach(fillCmdBar);
              }

          }
          if (commandBarData.bar.length > 0) {
              commandBarData.bar.reverse();
          }

          //TODO: check for a better algorithm about how to add an additional filter to an existing OData query string
          function addNavigationFilter(query, navFilterObj) {
              var posExtension = query.indexOf('&$expand'), filterPart = query, extensionPart = "";
              if (posExtension !== -1) {
                  filterPart = query.substring(0, posExtension);
                  extensionPart = query.substring(posExtension);
              }
              Object.getOwnPropertyNames(navFilterObj).forEach(function (nameP) {
                  filterPart = filterPart + " and " + nameP + ' eq ' + navFilterObj[nameP];
              });
              return filterPart + extensionPart;
          }

          function createRunTimeAutomationObj(nameCont) {
              var content = screen.contents[nameCont];
              var mdObj = self[nameCont];
              if (content.entity) {
                  var detailsDataService = multiDataService[content.entity]; // Master data management 

                  mdObj.refresh = function () {
                      var navigationFilter = null;
                      if (content.navigationParams) {
                          navigationFilter = {};
                          content.navigationParams.forEach(function (navParName) {
                              if (viewStateParam[navParName] && viewStateParam[navParName] !== null) {
                                  navigationFilter[navParName] = viewStateParam[navParName];
                              }
                          });
                      }
                      (function (detailsObj, name, navFilter) {
                          var filter;
                          var newMode = false;
                          var params = [];
                          if (detailsObj.query) {
                              filter = detailsObj.query;
                              if (detailsObj.queryParams) {
                                  detailsObj.queryParams.forEach(function (parName) {
                                      var props = parName.split('.');
                                      if (props.length === 1) {
                                          params.push(contextRepository[parName]);
                                      }
                                      else {
                                          params.push(mdContextSrv.getStateCtx(parName));

                                      }
                                  });
                              }
                              if (params.length > 0) {
                                  filter = mdContextSrv.stringformat(detailsObj.query, params);
                              }
                              newMode = true;
                          }
                          if (navFilter) {
                              filter = addNavigationFilter(filter, navFilter);
                          }

                          detailsDataService.getAll(filter, applName).then(function (data) {
                              //asynch code
                              //reset selection ... of provide behavior conf
                              var parkData = null;
                              if (content.selectionContext && contextRepository[content.selectionContext]) {
                                  parkData = contextRepository[content.selectionContext];
                                  contextRepository[content.selectionContext] = undefined;
                                  parkData.selected = false;
                                  if (typeof self[nameCont].onContentSelection === 'function') {
                                      self[nameCont].onContentSelection(undefined, parkData);
                                  }
                              }

                              parkData = [];
                              if ((data) && (data.succeeded)) {
                                  parkData = data.value;
                              }
                              contextRepository.contents[name].runtimeData = parkData;
                              if (contextRepository.contents[name].mode === "form") {
                                  //replicate data on runtimeConf for pg support
                                  contextRepository.contents[name].runtimeConf.data.forEach(function (dataField) {
                                      dataField.value = mdContextSrv.parseExpr(dataField.id, parkData[0]);
                                  });
                              }
                          });
                      })(content, nameCont, navigationFilter);
                  };



                  mdObj.refreshAndSelect = function (identifier) {
                      var navigationFilter = null;
                      if (content.navigationParams) {
                          navigationFilter = {};
                          content.navigationParams.forEach(function (navParName) {
                              if (viewStateParam[navParName] && viewStateParam[navParName] !== null) {
                                  navigationFilter[navParName] = viewStateParam[navParName];
                              }
                          });
                      }
                      (function (detailsObj, name, navFilter) {
                          var filter;
                          var newMode = false;
                          var params = [];
                          if (detailsObj.query) {
                              filter = detailsObj.query;
                              if (detailsObj.queryParams) {
                                  detailsObj.queryParams.forEach(function (parName) {
                                      var props = parName.split('.');
                                      if (props.length === 1) {
                                          params.push(contextRepository[parName]);
                                      }
                                      else {
                                          params.push(mdContextSrv.getStateCtx(parName));

                                      }
                                  });
                              }
                              if (params.length > 0) {
                                  filter = mdContextSrv.stringformat(detailsObj.query, params);
                              }
                              newMode = true;
                          }
                          if (navFilter) {
                              filter = addNavigationFilter(filter, navFilter);
                          }

                          detailsDataService.getAll(filter, applName).then(function (data) {
                              //asynch code
                              //reset selection ... of provide behavior conf
                              var parkData = null, i = 0;
                              if (content.selectionContext && contextRepository[content.selectionContext]) {
                                  parkData = contextRepository[content.selectionContext];
                                  contextRepository[content.selectionContext] = undefined;
                                  parkData.selected = false;
                              }

                              parkData = [];
                              if ((data) && (data.succeeded)) {
                                  parkData = data.value;
                              }
                              var selectedData = null;
                              if (identifier) {
                                  for (i = 0; i < parkData.length; i++) {
                                      if (parkData[i].Id && parkData[i].Id === identifier) {
                                          parkData[i].selected = true;
                                          selectedData = parkData[i];
                                          if (content.selectionContext) {
                                              contextRepository[content.selectionContext] = parkData[i];
                                          }
                                      }
                                  }
                              }



                              contextRepository.contents[name].runtimeData = parkData;
                              if (typeof self[nameCont].onContentSelection === 'function') {
                                  self[nameCont].onContentSelection(undefined, selectedData);
                              }
                              if (contextRepository.contents[name].mode === "form") {
                                  //replicate data on runtimeConf for pg support
                                  contextRepository.contents[name].runtimeConf.data.forEach(function (dataField) {
                                      dataField.value = mdContextSrv.parseExpr(dataField.id, parkData[0]);
                                  });
                              }
                          });
                      })(content, nameCont, navigationFilter);
                  };

                  mdObj.clear = function () {
                      contextRepository.contents[nameCont].runtimeData = [];
                      if (contextRepository.contents[nameCont].mode === "form") {
                          contextRepository.contents[nameCont].runtimeConf.data.forEach(function (prop) {
                              prop.value = "";
                          });
                      }

                  };
              }
              if (content.selectionContext) {
                  mdObj.onContentSelection = undefined;
              }
          }
          //create runtime automation content objects
          for (contentName in screen.contents) {
              if (screen.contents.hasOwnProperty(contentName)) {
                  self[screen.contents[contentName].name] = {};
                  createRunTimeAutomationObj(screen.contents[contentName].name);
              }
          }

      };
  }]);
}());

(function () {

    'use strict';


    var svc = "common.services.modelDriven.dataService";
    // Define a data service for each screen
    angular.module('siemens.simaticit.common.services.modelDriven').factory(svc, [
      '$state',
      '$resource',
      '$http',
      'common.base',
      function ($state, $resource, $http, base) {
          var backendService = base.services.runtime.backendService;
          var commandService = base.services.runtime.commandService;
          var resources = {};
          resources.buildManifestEntity = function (manifest) {
              var applName = manifest.appl;
              if (!manifest.appl) {
                  var splittedFB = manifest.functionalBlock.split('.');
                  applName = splittedFB[splittedFB.length - 1];
              }
              manifest.states.forEach(function (screen) {
                  var allEntities = {};
                  var masterObj = null;
                  function addEntityAction(action) {
                      allEntities[action.entity] = true;
                      //check for object field that will be rendered in select/entity picker
                      if (action.behavior.fields) {
                          action.behavior.fields.forEach(function (propName) {
                              var prop = action.behavior.command.value.parameters[propName];
                              if (prop && (typeof prop.type === 'object')) {
                                  allEntities[prop.type.key] = true;
                              }
                          });
                      }
                  }
                  for (var content in screen.contents) {
                      if (screen.contents.hasOwnProperty(content)) {
                          allEntities[screen.contents[content].entity] = true;
                          if (screen.contents[content].master) {
                              masterObj = screen.contents[content];
                              //break;
                          }
                          if (screen.contents[content].actions) {
                              screen.contents[content].actions.forEach(addEntityAction);
                          }
                      }
                  }
                  //TODO: multiDataService should contains all entity ... because after states, commands we've use it also for picker inside command
                  Object.getOwnPropertyNames(allEntities).forEach(function (entityName) {

                      var entity = entityName;

                      //                      var prefix = '/docs/resources/' + entity + '/';

                      // LiteStore-specific code to approximate OData query response.
                      var res = null;
                      if (!resources[entity]) {  //the entity was already used by another state
                          resources[entity] = {};
                          res = resources[entity];
                          res.entity = entity;
                          res.getAll = function (options, parApplName) {
                              if (options) {
                                  return backendService.findAll({ appName: parApplName ? parApplName : applName, entityName: this.entity, options: options });
                              }
                              else {
                                  return backendService.findAll({ appName: parApplName ? parApplName : applName, entityName: this.entity });
                              }
                          };
                      }
                      else {
                          res = resources[entity];
                      }
                      // wew're building a singleton dataProvider not a specific status dataProvider, so the list of action for a dataProvider should not depend on status but extracted from functionalBlock

                      var parkActions = [];
                      function seachEntityAction(act) {
                          return act.entity === entity;
                      }
                      for (var contentName in screen.contents) {
                          if (screen.contents[contentName].actions) {
                              parkActions = parkActions.concat(screen.contents[contentName].actions.filter(seachEntityAction));
                          }
                      }
                      parkActions.forEach(function (action) {
                          if (!res[action.name]) {
                              res[action.name] = function (data, parApplName) {
                                  //                                      return commandService.execute(action.behavior.commandNamePOC, data).then(function (resp) {
                                  return commandService.invoke({ appName: parApplName ? parApplName : applName, commandName: action.behavior.commandNamePOC, params: data }).then(function (outcome) {
                                      //                                      if (action.behavior.generate) {
                                      //                                          return $http.patch(prefix + angular.fromJson(resp.data).Id + '.json',
                                      //                                          [{ "op": "add", "path": "/tags/0", "value": entity }]);
                                      //                                      }
                                      if (data && data.Id && (typeof data.Id === "string")) {
                                          return { id: data.Id };
                                      }
                                      if (outcome && outcome.data) {
                                          var outFields = Object.getOwnPropertyNames(outcome.data);
                                          outFields = outFields.filter(function (of) {
                                              return (of !== "Error") && (of !== "Succeeded") && (of.indexOf("@odata.") === -1);
                                          });
                                          if (outFields.length === 1 && (typeof outFields[0] === "string")) {
                                              return { id: outcome.data[outFields[0]] };
                                          }
                                      }
                                      return true;
                                  }, function (error) {
                                      var er = error;
                                      //TODO handle command error
                                      backendService.genericError(er.data.error.errorMessage, er.statusText);
                                      return false;

                                  });
                              };
                          }
                      });


                  });      //End allEntities loop

                  //clear entities
                  allEntities = {};
              }); // End states loop


          }

          return resources;
      }
    ]);
}());

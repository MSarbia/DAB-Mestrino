/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
/* jshint -W071*/
(function () {

    'use strict';

    var mod = "common.layout.modelDriven.template";

    var ctrl = mod + '.ExecuteCommandCtrl';


    angular.module('siemens.simaticit.common.services.modelDriven')
    .directive('sitMdtoggle', [function () {
        return {
            restrict: 'E',
            replace: false,
            scope: {},
            controller: function () {
                if (typeof this.value !== "boolean") {
                    this.value = false;
                }
                this.onChange = function () {
                    if (typeof this.changeClbk === "function") {
                        this.changeClbk(!this.value, this.value);
                    }
                }
            },
            controllerAs: 'toggleCtrl',
            bindToController: {
                value: '=?sitValue',
                changeClbk: '=?sitChange',
                disabled: '=?ngDisabled'
            },
            template: '<input type="checkbox" ng-model="toggleCtrl.value" ng-click="toggleCtrl.onChange()" ng-disabled="toggleCtrl.disabled">'
        }
    }])
    .controller(ctrl, [
      "common.services.modelDriven.dataService",
      '$q',
      '$state',
      '$stateParams',
      'common.base',
      'common.services.modelDriven.service',
      '$scope',
      '$parse',
      '$rootScope',
      'common.services.modelDriven.contextService',
      function (multiDataService, $q, $state, $stateParams, base, md, $scope, $parse, $rootScope, mdContextSrv) {

          var self = this;
          var sidePanelManager = base.services.sidePanel.service;
          var backendService = base.services.runtime.backendService;
          var stateId = $state.$current.parent.toString();
          var actionName = $state.$current.toString().replace(stateId + '.', '');
          var outputParameters = {};
          self.testcheckbox = true;
          var emptyKeepFieldValue = "";


          //method called during field onChange event
          //evaluate first the clear statement and after the disable one

          var evalndDisable = function () {
              Object.getOwnPropertyNames(self.ngClear).forEach(function (elem) {
                  if (self.ngClear[elem]) {
                      var outputParameters = self.currentItem;
                      var evaluation = mdContextSrv.getStateCtx(self.ngClear[elem], { form: outputParameters });
                      if (evaluation) {
                          var parkSelecInfo = null;
                          var isSelect = self.selectFields.filter(function (selElem) {
                              if (selElem.name === elem) {
                                  parkSelecInfo = selElem;
                                  return true;
                              }
                              return false;
                          });
                          delete self.currentItem[elem];
                          if (isSelect.length > 0 && isSelect[0].selectionContext) {
                              delete self.currentItem[isSelect[0].selectionContext];
                              self.displayData.forEach(function (elemData) { //lost selection ... remove empty value
                                  if (elemData.name === elem) {
                                      if (elemData.widgetAttributes['sit-options'].length > 0 && elemData.widgetAttributes['sit-options'][0][parkSelecInfo.value] === emptyKeepFieldValue) {
                                          elemData.widgetAttributes['sit-options'].splice(0, 1);
                                      }
                                  }
                              });
                          }
                      }
                  }
              });
              Object.getOwnPropertyNames(self.calcValue).forEach(function (elem) {
                  if (self.calcValue[elem]) {
                      var outputParameters = self.currentItem;
                      var evaluation = mdContextSrv.getStateCtx(self.calcValue[elem], { form: outputParameters });
                      if (evaluation === null || typeof evaluation === 'undefined') { // clear
                          delete self.currentItem[elem];
                      }
                      else {
                          self.currentItem[elem] = evaluation;
                      }
                  }

              });

              Object.getOwnPropertyNames(self.ngDisableItem).forEach(function (elem) {
                  if (self.ngDisableItem[elem].expression) {
                      var outputParameters = self.currentItem;
                      self.ngDisableItem[elem].value = mdContextSrv.getStateCtx(self.ngDisableItem[elem].expression, { form: outputParameters });
                  }

              });
              $rootScope.$digest();
          }

          self.currentItem = {};
          self.ngDisableItem = {};
          self.ngClear = {};
          self.calcValue = {};
          self.DigestEval = function (old, last) {
              if (old !== last) { //limit number of evaluation because if fired too frequently
                  setTimeout(evalndDisable, 0);
              }
          };

          var listener = $scope.$on('sit-property-grid.validity-changed', function (event, params) {
              self.validInputs = params.validity;
          });

          $scope.$on("$destroy", function () { listener(); });

          md.getManifest().then(function (manifest) { // Assuming manifest has already been retrieved.
              var screen = manifest.states.filter(function (s) { return s.id === stateId; })[0];
              var applName = screen.functionalBlock;
              var dataService = null;
              var action = null, content = null;
              self.renderComplete = false;
              function initAndSearchAction(elem) {
                  if (elem.name === this.act) {
                      action = elem;
                      return true;
                  }
                  return false;
              }
              for (content in screen.contents) {
                  if (screen.contents[content].actions) {
                      if (screen.contents[content].actions.some(initAndSearchAction, { act: actionName })) {
                          dataService = multiDataService[action.entity];
                          break;
                      }
                  }
              }


              self.buttonLabel = action.shortLabel || "Submit";
              //override currItem value with stateParams additional values
              function addStateParam(localCurrentItem) {
                  if ($stateParams) {
                      Object.getOwnPropertyNames($stateParams).forEach(function (name) {
                          if (['id', 'stateParamsToReturn', 'stateToReturn'].indexOf(name) === -1) { //not add predefined statusParams fields
                              localCurrentItem[name] = $stateParams[name];
                          }
                      });
                  }
              }
              //the save function, performs the action call and the exitAction
              self.save = function () {
                  var localCurrentItem = JSON.parse(JSON.stringify(self.currentItem));

                  addStateParam(localCurrentItem);

                  var contextForm = {};
                  self.selectFields.forEach(function (f) {
                      //TODO support nested params
                      if (action.behavior.fieldsOptions && action.behavior.fieldsOptions[f.name] && action.behavior.fieldsOptions[f.name].selectionContext) {
                          contextForm[action.behavior.fieldsOptions[f.name].selectionContext] = localCurrentItem[f.name];
                      }
                      if (localCurrentItem[f.name]) {
                          localCurrentItem[f.name] = localCurrentItem[f.name][f.value];
                      }
                      else {
                          localCurrentItem[f.name] = null;
                      }
                  });
                  //PArameters purge:  
                  //when in edit the currentItem is filled with the whole query result ... but we need only required params
                  Object.getOwnPropertyNames(localCurrentItem).forEach(function (paramName) {
                      var ttt = $parse(paramName);
                      var param = ttt(action.behavior.command.value.parameters);
                      if (typeof param === 'undefined') {
                          delete localCurrentItem[paramName];
                      }
                  });

                  localCurrentItem = mdContextSrv.unflatProperties(localCurrentItem);

                  outputParameters = localCurrentItem;
                  if (action.behavior.formatOutput) {
                      Object.getOwnPropertyNames(contextForm).forEach(function (nameProp) {
                          outputParameters[nameProp] = contextForm[nameProp];
                      });
                      outputParameters = mdContextSrv.getStateCtx(action.behavior.formatOutput, { form: outputParameters });
                  }

                  dataService[actionName](outputParameters, applName).then(function (outcome) {

                      var vCtrl = null;
                      if (outcome) {
                          if (mdContextSrv.MDState) {
                              if (action.behavior.exitAction) {
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
                                                  if (typeof outcome === "object" && typeof outcome.id !== "undefined") {
                                                      vCtrl[cntName].refreshAndSelect(outcome.id);
                                                  }
                                                  else {
                                                      vCtrl[cntName].refresh();
                                                  }
                                              }
                                          });
                                      }
                                  }
                                  $state.go(mdContextSrv.MDState.previousState, mdContextSrv.MDState.previousData);
                              }
                              else {
                                  $state.go(mdContextSrv.MDState.previousState, mdContextSrv.MDState.previousData, { reload: true });
                              }
                          }
                          else {
                              $state.go('^', {}, { reload: true });
                          }
                      }

                  });
              };

              self.cancel = function () {
                  sidePanelManager.close();
                  $state.go('^');
              };

              self.park_displayData = [];
              self.displayData = [];
              self.selectFields = [];
              var allFieldsPromises = [];

              action.behavior.fields.forEach(function (propName, index) {

                  self.ngDisableItem[propName] = { value: false };
                  var filter, filterParam, p;

                  var prop = action.behavior.command.value.parameters[propName];
                  if (!prop) {
                      prop = mdContextSrv.parseExpr(propName, action.behavior.command.value.parameters);
                      if (!prop) {
                          return;
                      }
                  }
                  var fieldPromise = null;

                  var field = {
                      id: propName,
                      name: propName,
                      label: prop.label || propName,
                      validation: prop.validation,
                      value: self.currentItem[propName]
                  };
                  if (action.behavior.fieldsOptions && action.behavior.fieldsOptions[propName]) {
                      if (action.behavior.fieldsOptions[propName].ngDisabled) {
                          self.ngDisableItem[propName].expression = action.behavior.fieldsOptions[propName].ngDisabled;
                      }
                      if (action.behavior.fieldsOptions[propName].label) {
                          field.label = action.behavior.fieldsOptions[propName].label;
                      }
                      if (action.behavior.fieldsOptions[propName].clear) {
                          self.ngClear[propName] = action.behavior.fieldsOptions[propName].clear;
                      }
                      if (action.behavior.fieldsOptions[propName].value) {
                          self.calcValue[propName] = action.behavior.fieldsOptions[propName].value;
                      }
                  }
                  if (prop.readOnly) {
                      field.widget = 'sit-label';
                  }
                  else if (prop.type === 'enum') {
                      field.widget = 'sit-select';
                      field.widgetAttributes = {
                          'sit-to-display': 'key',
                          'sit-to-keep': 'value',
                          'sit-options': prop.values.map(function (v) { return { key: v, value: v }; })
                      };
                      self.selectFields.push({ name: propName, value: 'value', label: 'key', index: index });
                  }
                  else if (prop.type === 'number') {
                      field.widget = 'sit-numeric';
                  }
                  else if (prop.type === 'boolean') {
                      field.widget = 'sit-mdtoggle';
                  }
                  else if (typeof prop.type === 'object' && action.behavior.fieldsOptions && action.behavior.fieldsOptions[propName] && action.behavior.fieldsOptions[propName].pickerAttrs) {
                      //new entity picker
                      field.widget = 'sit-entity-picker';
                      field.widgetAttributes = {
                          "sit-selected-attribute-to-display": "Name",
                          "sit-picker-options": {
                              containerID: propName + 'IcvContainer',
                              groupField: '',
                              alwaysShowPager: true,
                              quickSearchOptions: {
                                  enabled: false,
                                  field: 'name',
                                  filterText: ''
                              },
                              onSelectionChangeCallback: function () { },
                              selectStyle: 'alternate',
                              viewMode: 'g',
                              viewOptions: 'gsmlx'
                          }
                      };
                      if (action.behavior.fieldsOptions && action.behavior.fieldsOptions[propName]) {
                          if (action.behavior.fieldsOptions[propName].pickerAttrs) {
                              Object.getOwnPropertyNames(action.behavior.fieldsOptions[propName].pickerAttrs).forEach(function (pName) {
                                  field.widgetAttributes["sit-picker-options"][pName] = action.behavior.fieldsOptions[propName].pickerAttrs[pName];
                              });
                          }
                          if (action.behavior.fieldsOptions[propName].query) {
                              filter = action.behavior.fieldsOptions[propName].query;
                              if (action.behavior.fieldsOptions[propName].queryParams) {
                                  //solve with context
                                  filterParam = action.behavior.fieldsOptions[propName].queryParams.map(function (pName) {
                                      return mdContextSrv.getStateCtx(pName);
                                  });
                                  filter = mdContextSrv.stringformat(filter, filterParam);
                              }
                          }
                          if (action.behavior.fieldsOptions[propName].selectionContext) {
                              field.widgetAttributes["ng-change"] = function (prev, selected) {
                                  self.currentItem[action.behavior.fieldsOptions[propName].selectionContext] = selected;
                              }
                              field.widgetAttributes["sit-picker-options"].onSelectionChangeCallback = function (prev, selected) {
                                  self.currentItem[action.behavior.fieldsOptions[propName].selectionContext] = selected;
                              }
                          }

                      }
                      p = multiDataService[prop.type.key].getAll(filter, applName).then(function (data) {
                          field.widgetAttributes['sit-datasource'] = data.value;
                          var parkObj = { name: propName, value: 'Id', label: 'Name', options: data.value, index: index };
                          //The name of the command parameter may not match with entity field
                          if (prop.fieldNamePOC) {
                              parkObj.fieldNamePOC = prop.fieldNamePOC;
                          }
                          self.selectFields.push(parkObj);
                      });
                      fieldPromise = p;
                  }
                  else if (typeof prop.type === 'object') {
                      field.widget = 'sit-select';
                      field.widgetAttributes = {
                          'sit-to-display': 'Name',
                          'sit-to-keep': 'Id'
                      };
                      var displayField = "Name", keepField = "Id", distinct = false;
                      field.widgetAttributes['sit-change'] = function (prev, selected) {
                          if (!self.renderComplete || (typeof selected !== "object")) {
                              //bug 56911: some sit-change are fired by validator.js too early and with a different "selected" type (null or string), while I expect an object
                              //ignore early and wrong sit-change notification
                              return;
                          }
                          if (action.behavior.fieldsOptions && action.behavior.fieldsOptions[propName] && action.behavior.fieldsOptions[propName].selectionContext) {
                              if (selected && selected[keepField] && (selected[keepField] !== emptyKeepFieldValue)) {// && selected[displayField]) {

                                  self.currentItem[action.behavior.fieldsOptions[propName].selectionContext] = selected;
                                  if (self.displayData[index].widgetAttributes['sit-options'].length > 0 && self.displayData[index].widgetAttributes['sit-options'][0][keepField] !== emptyKeepFieldValue) {

                                      var emptySelection = {};
                                      emptySelection[keepField] = emptyKeepFieldValue;
                                      emptySelection[displayField] = '';
                                      self.displayData[index].widgetAttributes['sit-options'] = [emptySelection].concat(self.displayData[index].widgetAttributes['sit-options']);
                                  }
                              }
                              else {
                                  delete self.currentItem[action.behavior.fieldsOptions[propName].selectionContext];
                                  if (self.displayData[index].widgetAttributes['sit-options'].length > 0 && self.displayData[index].widgetAttributes['sit-options'][0][keepField] === emptyKeepFieldValue) {
                                      self.displayData[index].widgetAttributes['sit-options'].splice(0, 1);
                                  }
                              }
                          }
                          if (!selected || !selected[keepField] || !selected[displayField]) {  //deselect
                              delete self.currentItem[propName];
                          }

                          self.DigestEval(prev, selected);
                      }

                      if (action.behavior.fieldsOptions && action.behavior.fieldsOptions[propName]) {
                          if (action.behavior.fieldsOptions[propName].query) {
                              filter = action.behavior.fieldsOptions[propName].query;
                              if (action.behavior.fieldsOptions[propName].queryParams) {
                                  //solve with context
                                  filterParam = action.behavior.fieldsOptions[propName].queryParams.map(function (pName) {
                                      return mdContextSrv.getStateCtx(pName);
                                  });
                                  filter = mdContextSrv.stringformat(filter, filterParam);
                              }
                          }
                          if (action.behavior.fieldsOptions[propName].displayField) {
                              displayField = action.behavior.fieldsOptions[propName].displayField;
                              field.widgetAttributes['sit-to-display'] = displayField;
                          }
                          if (action.behavior.fieldsOptions[propName].keepField) {
                              keepField = action.behavior.fieldsOptions[propName].keepField;
                              field.widgetAttributes['sit-to-keep'] = keepField;
                          }
                          if (action.behavior.fieldsOptions[propName].distinct) {
                              distinct = action.behavior.fieldsOptions[propName].distinct;
                          }
                      }
                      p = multiDataService[prop.type.key].getAll(filter, applName).then(function (data) {
                          if (!distinct) {
                              field.widgetAttributes['sit-options'] = data.value;
                          }
                          else {
                              field.widgetAttributes['sit-options'] = _.uniq(data.value, false, function (row) {
                                  return row[displayField];
                              });
                          }
                          var parkObj = { name: propName, value: keepField, label: displayField, options: data.value, index: index };
                          if (action.behavior.fieldsOptions && action.behavior.fieldsOptions[propName] && action.behavior.fieldsOptions[propName].selectionContext) {
                              parkObj["selectionContext"] = action.behavior.fieldsOptions[propName].selectionContext;
                          }
                          //The name of the command parameter may not match with entity field
                          if (prop.fieldNamePOC) {
                              parkObj.fieldNamePOC = prop.fieldNamePOC;
                          }
                          self.selectFields.push(parkObj);
                      });
                      fieldPromise = p;
                  }
                  else {
                      // Assuming string -- TODO: Manage additional types
                      field.widget = 'sit-text';
                  }
                  if (fieldPromise) {
                      allFieldsPromises.push(
                          fieldPromise.then(function () {
                              self.displayData[index] = field;
                          }));
                  }
                  else {
                      self.displayData[index] = field;
                  }
              });

              var init = function () {
                  sidePanelManager.setTitle(action.tooltip || action.label);
                  sidePanelManager.open('e');
                  var filter;
                  if ($stateParams.id) {
                      if (action.query) {
                          filter = mdContextSrv.stringformat(action.query, $stateParams.id);
                      }
                      else {
                          filter = "$filter=Id eq " + $stateParams.id;
                      }
                      dataService.getAll(filter, applName).then(function (data) {
                          if (data.value.length > 0) {
                              //merge with context
                              action.behavior.fields.forEach(function (propName) {
                                  var realPropName = propName;
                                  var propInfo = mdContextSrv.parseExpr(propName, action.behavior.command.value.parameters);
                                  if (propInfo.fieldNamePOC) {
                                      realPropName = propInfo.fieldNamePOC;
                                  }
                                  self.currentItem[propName] = mdContextSrv.parseExpr(realPropName, data.value[0]);
                              });
                              $q.all(allFieldsPromises).then(function () {  //checked ... if allFieldsPromises is empty the success function is called immediately
                                  self.selectFields.forEach(function (f) {
                                      var val = self.currentItem[f.name];
                                      var fieldName = f.name;
                                      if (f.fieldNamePOC) {
                                          fieldName = f.fieldNamePOC;
                                      }
                                      if (f.options) {
                                          val = f.options.filter(function (i) { return i[f.value] === self.currentItem[f.name]; })[0];
                                          if (val) {
                                              self.currentItem[f.name] = {};
                                              self.currentItem[f.name][f.label] = val[f.label] ? val[f.label] : "";
                                              self.currentItem[f.name][f.value] = val[f.value] ? val[f.value] : null;
                                              var emptySelection = {};
                                              emptySelection[f.value] = emptyKeepFieldValue;
                                              emptySelection[f.label] = '';
                                              self.displayData[f.index].widgetAttributes['sit-options'] = [emptySelection].concat(self.displayData[f.index].widgetAttributes['sit-options']);
                                          }
                                          else {
                                              delete self.currentItem[f.name];
                                          }
                                      } else {
                                          self.currentItem[f.name] = { label: val, value: val };
                                      }
                                  });
                                  //ngDisable starting eval
                                  self.renderComplete = true;
                                  self.DigestEval(0, 1);
                              });
                          }
                          else {
                              self.renderComplete = true;
                          }
                      }, backendService.backendError);
                      
                  }
                  else {
                      //ngDisable starting eval
                      $q.all(allFieldsPromises).then(function () {
                          self.DigestEval(0, 1);
                      });
                      self.renderComplete = true;
                  }

                  self.validInputs = false;
              };


              init();
          }
        );
      }]
    );
}());

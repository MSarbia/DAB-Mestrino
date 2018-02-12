/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {

    'use strict';

    var mod = "common.layout.modelDriven.template";

    var ctrl = mod + '.Overview';


    angular.module('siemens.simaticit.common.services.modelDriven')
    .controller(ctrl, [
      "common.services.modelDriven.dataService",
      '$q',
      '$state',
      '$stateParams',
      'common.base',
      'common.services.modelDriven.service',
      '$scope',
      'common.services.modelDriven.contextService',
      function (multiDataService, $q, $state, $stateParams, base, md, $scope, mdContextSrv) {

          var self = this;
          var sidePanelManager = base.services.sidePanel.service;
          var backendService = base.services.runtime.backendService;
          var stateId = $state.$current.parent.toString();
          var actionName = $state.$current.toString().replace(stateId + '.', '');



          self.currentItem = {};



          md.getManifest().then(function (manifest) { // Assuming manifest has already been retrieved.
              var screen = manifest.states.filter(function (s) { return s.id === stateId; })[0];
              var applName = screen.functionalBlock;

              var dataService = null;
              var action = null,  content = null;
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

              self.cancel = function () {
                  sidePanelManager.close();
                  $state.go('^');
              };

              self.park_displayData = [];
              self.displayData = [];
              self.selectFields = [];

              function findValue(source, prop, propIndex) {
                  var index = propIndex || 0;
                  return (index + 1 === prop.length) ? source[prop[index]] : findValue(source[prop[index]], prop, index + 1);

              }
              action.behavior.fields.forEach(function (propName,index) {
                  var prop = action.behavior.command.value.parameters[propName];
                  if (!prop) {
                      var compositName = propName.split('.');
                      prop = findValue(action.behavior.command.value.parameters, compositName);
                      if (!prop) {
                          return;
                      }
                  }
                  var field = {
                      id: propName , 
                      name: propName,
                      label: prop.label || propName,
                      validation: prop.validation,
                      value: self.currentItem[propName]
                  };
                  if (prop.type === 'boolean') {
                      field.widget = 'sit-mdtoggle';
                  }
                  else {
                      field.widget = 'sit-label';
                  }
                  self.displayData[index] = field;
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
                              action.behavior.fields.forEach(function (propName) {
                                  self.currentItem[propName] = mdContextSrv.parseExpr(propName, data.value[0]);
                              });
                          }
                      }, backendService.backendError);
                  }
                  
              };


              init();
          }
        );
      }]
    );
}());

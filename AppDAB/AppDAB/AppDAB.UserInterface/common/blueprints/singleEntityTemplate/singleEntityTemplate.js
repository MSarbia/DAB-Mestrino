/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
(function () {

    'use strict';


    var mod = "common.layout.modelDriven.template";

    var ctrl = mod + '.SECtrl';

    angular.module('siemens.simaticit.common.services.modelDriven')
    .controller(ctrl, [
        '$state',
      '$rootScope',
      'common.base',
      'common.services.modelDriven.service',
      'common.services.modelDriven.runtimeService',
      '$stateParams',
      function ($state, $rootScope, base, md, mdrt, $stateParams) {

          var self = this;
          var detailName = "";
          var stateId = $state.$current.toString();
          md.getManifest().then(function (manifest) { // Assuming manifest has already been retrieved.
              var screen = manifest.states.filter(function (s) { return s.id === stateId; })[0];
              self.mdView = {};
              self.mdViewCtrl = new mdrt.ModelViewCtrl(screen, self.mdView, $stateParams);

              //Reoder contents to simplify layout management
              self.newObj = {
                  actions: self.mdViewCtrl.commandBars[0], //commandBar conf
                  activeContent: ""
              };
              //Create newObj.master, newObj.overview and newObj.details[] objects
              for (detailName in self.mdView.contents) {
                  if (self.mdView.contents[detailName].master) {
                      if (self.mdView.contents[detailName].mode === "table") {
                          self.newObj.master = self.mdView.contents[detailName];
                          self.newObj.activeContent = detailName;
                          break;
                      }
                  }
              }
              var masterName = self.newObj.master.name;
              if (self.mdViewCtrl[masterName]) {
                  self.mdViewCtrl[masterName].onContentSelection = function () {
                      self.mdViewCtrl.commandBars[0].refresh();
                  };
              }
              // Initialization function
              var init = function () {
                  self.mdViewCtrl.commandBars[0].refresh();
                  if (self.mdViewCtrl[masterName]) {
                      self.mdViewCtrl[masterName].refresh();
                  }
              };
              init();

          });
      }]);
}());

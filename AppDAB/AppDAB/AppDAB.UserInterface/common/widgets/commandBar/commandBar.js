/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */

(function () {
    'use strict';

    /**
    * @ngdoc module
    * @name siemens.simaticit.common.widgets.commandBar
    * 
    * @description
    * This module provides functionalities related to the command-bar.
    */

    angular.module('siemens.simaticit.common.widgets.commandBar', []);

})();
(function () {
    'use strict';
    //#region ng-doc comments
    /**
   *   @ngdoc directive
   *   @name sitCommandBar
   *   @module siemens.simaticit.common.widgets.commandBar
   *   @description 
   *   Directive used to model a command bar. A command bar can have multiple buttons and the behavior of each button
   *   must be defined within a function that is executed when the button is clicked.
   *
   *   Only one command bar is used within a screen to trigger the execution of commands related to a set of homogeneous entities.
   *
   *   
   *   @restrict E
   *   @param {String} sit-type Type of commands included in the command-bar (**Action** or **Tool** commands).
   *   **Note** This parameter is only used when configuring a command bar using markup, as outlined in the example.
   *   @param {Object} sit-commands 
   *   If specified, this parameter is used to configure the entire command bar, and it must be set to an object containing the following properties:
   *   * **barType**: defines the appearance of the command buttons included in the command-bar. The **barType** can be set to one of the following strings:
   *     * **Action**: only the command icon is displayed.
   *     * **Tool**: command icon and label are displayed.
   *   * **bar**: an array that contains configuration objects necessary to populate the command-bar with command buttons, separators, or groups of command buttons. Each configuration object included in the **bar** array can contain the following properties:
   *
   *     * **label**: display label of the command (mandatory if not a separator).
   *     * **name**: complete name of the command with its name space. For a group of commands, the command name is an internal identifier.
   *     * **tooltip**: _(Optional)_ a tooltip to be displayed when the mouse hovers over a command.
   *     * **visibility**: _(Optional)_ determines if the command button or group is displayed or not (default value is **true**).
   *     * **image**: a valid [FontAwesome](http://fortawesome.github.io/Font-Awesome/icons/) CSS class that determines the command icon to be displayed.
   *     * **type**: type of object to be displayed. It can be set to either **Command** or a **Sep** (for command separators) or a **Group**.
   *     * **onClickCallback**: specifies the JavaScript function to be called when a command button is clicked.
   *
   *
   *   @example
   *   ### Using markup
   *   ```
   *   <html>
   *   <sit-command-bar sit-type="action">
   *       <sit-command-group sit-label="group1" sit-name="My group name 1" sit-icon="fa-truck" sit-type="group">
   *            <sit-command ng-click="cbDevCtrl.callback" ng-show="true" sit-icon="fa-truck" sit-label="command2" sit-name="com.siemens.customcommand.command2" sit-tooltip="command"></sit-command>
   *            <sit-command ng-click="cbDevCtrl.callback" ng-show="true" sit-icon="fa-users" sit-label="command3" sit-name="com.siemens.customcommand.command3" sit-tooltip="command"></sit-command>
   *       </sit-command-group>
   *       <sit-command ng-click="cbDevCtrl.callback" ng-show="true" sit-icon="fa-beer" sit-label="command1" sit-name="com.siemens.customcommand.command1" sit-tooltip="command"></sit-command>
   *       <sit-command sit-type="sep"></sit-command>
   *       <sit-command sit-type="main" ng-click="cbDevCtrl.callback" ng-show="true" sit-icon="fa-plus" sit-label="Add new" sit-name="Add" sit-tooltip="command"></sit-command>
   *   </sit-command-bar>
   *   </html>
   *   ```
   *   ### Using a configuration object
   *   In a view template, the **sit-command-bar** directive is used as follows:
   *   ```
   *   <sit-command-bar sit-commands="vm.commandBarData"></sit-command-bar>
   *   ```
   *   The following example shows how to include a command, a separator, and a group of two commands in the command-bar by defining the **commandBarData** property in a controller.
   *   ```
   *   // ...
   *   this.commandBarData = {
   *     "barType": "Action",
   *   "bar": [
   *     {
   *       "type":"Command",
   *       "label": "Edit",
   *       "name": "toggleEdit",
   *       "tooltip": "Edit Material",
   *       "visibility": false,
   *       "image": "fa-edit",
   *       "onClickCallback": editFunction
   *     },
   *     {
   *       "type": "Sep"
   *     },
   *     {
   *       "label": "command2",
   *       "name": "My group name",
   *       "image": "fa-truck",
   *       "type": "Group",
   *       "group": [
   *         {
   *           "label": "command2",
   *           "name": "com.siemens.customcommand.command2",
   *           "image": "fa-truck",
   *           "type": "Command"
   *         },
   *         {
   *           "label": "command3",
   *           "name": "com.siemens.customcommand.command3",
   *           "image": "fa-users",
   *           "type": "Command"
   *         }
   *       ]
   *     }
   *   ]
   *  };
   * ```
   */
    //#endregion
    commandbarController.$inject = ['$scope', '$element', '$window', 'common', '$translate'];
    function commandbarController($scope, $element, $window, common, $translate) {
        var vm = this;
        var win;
        var commandTypeSep = 'Sep';
        var commandTypeGroup = 'Group';
        var commandTypeCommand = 'Command';
        var commandTypeToggle = 'toggle';
        var commandTypeMain = 'MainCommand';
        var barTypeAction = 'Action';
        var barTypeTool = 'Tool';
        vm.otherCommandsText = $translate.instant('commandBar.moreCommandsAvailable');

        vm.logErrorFn = function (message, attributes) {
            common.logger.logError(message, attributes, 'siemens.simaticit.common.widgets.commandBar');
        };

        function activate() {
            if (vm.commands !== null && vm.commands !== undefined) {
                if (!vm.validateAttributes()) {
                    return;
                }
            }
            win = angular.element($window);
            vm.winWidth = win.width();
            if (vm.checkOpenPos) {
                vm.checkOpenPos();
            }

            //listener to the resize event to detect resizing
            angular.element($window).bind('resize', windowResize);
        }

        function windowResize() {
            $scope.$apply();
            vm.winWidth = win.width();
            if (vm.checkOpenPos) {
                vm.checkOpenPos();
            }
        }

        //#region Model methods

        // validates the attributes
        vm.validateAttributes = function () {
            if (vm.commands.barType === undefined || vm.commands.barType === null) {
                vm.logErrorFn('barType can\'t be null', vm.commands);
                vm.commands = {};
                return false;
            }
            if (vm.commands.bar === undefined || vm.commands.bar === null) {
                vm.logErrorFn('commands can\'t be empty', vm.commands);
                vm.commands = {};
                return false;
            }
            vm.commands.bar = _.filter(vm.commands.bar, function (command) {
                if (command.type === undefined || command.type === null) {
                    vm.logErrorFn('command type is mandatory', command);
                    return false;
                }
                if (command.type !== commandTypeSep) {
                    if (command.label === undefined || command.label === null) {
                        vm.logErrorFn('command label is mandatory', command);
                        return false;
                    }
                    if (command.name === undefined || command.name === null) {
                        vm.logErrorFn('command name is mandatory', command);
                        return false;
                    }
                    if (command.type === commandTypeGroup) {
                        if (command.group === undefined || command.group === null) {
                            vm.logErrorFn('When command type is group, group of commands can\'t be null or undefined', command);
                            return false;
                        }
                        command.group = _.filter(command.group, function (command) {
                            if (command.type === undefined || command.type === null) {
                                vm.logErrorFn('command type is mandatory', command);
                                return false;
                            }
                            if (command.type !== commandTypeSep) {
                                if (command.label === undefined || command.label === null) {
                                    vm.logErrorFn('command label is mandatory', command);
                                    return false;
                                }
                                if (command.name === undefined || command.name === null) {
                                    vm.logErrorFn('command name is mandatory', command);
                                    return false;
                                }
                            }
                            return true;
                        });
                    }
                    else if ((command.image === undefined || command.image === null) && (command.imageTemplate === undefined || command.imageTemplate === null)) {
                        vm.logErrorFn('command image is mandatory', command);
                        return false;
                    }
                    return true;
                }
                return true;
            });
            return true;
        };

        // calculate the cut point of the toolbar.
        vm.calculateCutOff = function () {
            var ACTION_BUTTON_WIDTH = 42;
            var ACTION_TOGGLE_WIDTH = 44;
            var SEPARATOR_WIDTH = 8;
            var ACTION_DROPDOWN_WIDTH = 70;
            var TOOL_TOGGLE_WIDTH = 76;
            var TOOL_BUTTON_WIDTH = 80;
            var TOOL_DROPDOWN_WIDTH = 80;
            var MAX_WIDTH_OFFSET = 24;
            var ALIGN_VALUE = "right";
             
            var displayMenu = false;
            var index = vm.commands.bar.length - 1;
            var indexWithMenu = index;
            var buttonWidth = 0, dropWidth = 0, toggleWidth = 0;
            var maxWidthOffset = MAX_WIDTH_OFFSET;
            if (vm.commands.barType === barTypeAction) {
                buttonWidth = ACTION_BUTTON_WIDTH;
                dropWidth = ACTION_DROPDOWN_WIDTH;
                toggleWidth = ACTION_TOGGLE_WIDTH;
            }
            if (vm.commands.barType === barTypeTool) {
                buttonWidth = TOOL_BUTTON_WIDTH;
                dropWidth = TOOL_DROPDOWN_WIDTH;
                toggleWidth = TOOL_TOGGLE_WIDTH;
            }
            var maxWidth = vm.__width - maxWidthOffset; // minus margin
            var maxWidthWithMenu = maxWidth - dropWidth;
            var currentWidth = 0;

            // we parse the content of the command bar starting from the right (only the first level) the goal is to calculate how many buttons can be displayed.
            for (var i = vm.commands.bar.length - 1; i >= 0; i--) {
                var command = vm.commands.bar[i];
                switch (command.type) {
                    case commandTypeCommand:
                        if (command.visibility) {
                            if (vm.commands.barType === barTypeTool && vm.labelAlign === ALIGN_VALUE) {
                                currentWidth += getCommandWidth(command);
                            } else {
                                currentWidth += buttonWidth;
                            }
                        }
                        break;
                    case commandTypeToggle:
                        if (command.visibility) {
                            if (vm.commands.barType === barTypeTool && vm.labelAlign === ALIGN_VALUE) {
                                currentWidth += getCommandWidth(command);
                            } else {
                                currentWidth += toggleWidth;
                            }
                        }
                        break;
                    case commandTypeGroup:
                        if (command.visibility) {
                            if (vm.commands.barType === barTypeTool && vm.labelAlign === ALIGN_VALUE) {
                                currentWidth += getCommandWidth(command);
                            } else {
                                currentWidth += dropWidth;
                            }
                        }
                        break;
                    case commandTypeSep:
                        currentWidth += SEPARATOR_WIDTH;
                        break;
                    case commandTypeMain:
                        if (command.visibility) {
                            if (vm.commands.barType === barTypeTool) {
                                if (vm.labelAlign === ALIGN_VALUE) {
                                    currentWidth += getCommandWidth(command);
                                }
                                else {
                                    currentWidth += buttonWidth;
                                }
                            }
                            else {
                                var commandWidth = $('#ButtonMainCommand' + command.name).width();
                                if (buttonWidth > commandWidth) {
                                    commandWidth = buttonWidth;
                                }
                                if (command.hasOwnProperty('commandWidth')) {
                                    if (command.commandWidth > commandWidth) {
                                        commandWidth = command.commandWidth;
                                    }
                                }
                                command.commandWidth = commandWidth;
                                currentWidth += commandWidth;
                            }
                        }
                        break;
                    default: break;
                }
                if (currentWidth <= maxWidth) { index--; }
                if (currentWidth <= maxWidthWithMenu) {
                    indexWithMenu--;
                } else {
                    maxWidthWithMenu = 0;
                } // the point in witch the collapse menu must be displayed is reached. we do not change anymore the indexWithMenu variable
                if (currentWidth > maxWidth) {// the buttons cannot be all displayed , so we must activate the collapse menu and the cutpoint index must be the indexWithMenu one.
                    index = indexWithMenu;
                    displayMenu = true;
                    break;
                }
            }
            vm.DisplayMenu = displayMenu;
            vm.MaxIndexNumber = index;
        };

        // on resize, updates the commandBar
        vm.onWindowResizeSize = function () {
            if (vm.barElement) {
                if (vm.__width !== vm.barElement.offsetWidth) {
                    vm.__width = vm.barElement.offsetWidth;
                    vm.calculateCutOff();
                    $scope.$apply();
                }
            }
        };

        //#endregion

        activate();
        $scope.$on('$destroy', function () {
            angular.element($window).unbind('resize', windowResize);
        });

        function getCommandWidth(command) {

            var ele;
            var type = command.type;
            var fontSize = '9pt';

            var cssObj = {
                'font-family': '"Segoe UI", "Arial", "sans-serif","serif"',
                'font-size': fontSize
            };


            if (type === "MainCommand" || type === "toggle" || type === "Command") {
                var tempLabel = "";
                switch (type) {
                    case 'toggle':
                        tempLabel = "toggleTool";
                        break;
                    case 'MainCommand':
                        tempLabel = "MainCommandTool";
                        break;
                    case 'Command':
                        tempLabel = "CommandTool";
                        break;

                }
                var temp = '<div data-internal-type="command-bar"  class="commandBarContainerTool tempWidthCalcDiv">' +
                  '<div  data-internal-type="command-menu-command-bar" class="right-align-align" style="display : inline;">' +
                   '<button  data-internal-type="command-button-command-bar" class="' + tempLabel + 'Button">';

                if (command.image && !command.imageTemplate) {
                    temp += '<span  data-internal-type="image-container"  class="fa-lg">' +
                                '<i class="fa ' + command.image + '"></i>' +
                             '</span>';
                } else if (command.imageTemplate) {
                    temp += '<span data-internal-type="image-container"  class="fa-lg">' + command.imageTemplate + '</span>';
                }

                temp += '<span  data-internal-type="text-container" class="' + tempLabel + 'Label">' + command.label + '</span>' +
                '</button></div></div>'
                ele = $(temp).css(cssObj);
            } else {
                ele = $('<div class="commandBarContainerTool tempWidthCalcDiv">' +
                    '<div  class="right-align-align" style="display : inline;">' +
                    '<button  data-internal-type="command-button-command-bar" class="dropdown-toggle CommandToolDropdown">' +
                '<div style="display:inline;">' +
                    '<span ng-if="cmdBarGrpBtnCtrl.group.image" class="fa-stack fa-lg">' +
                        '<i class="fa' + command.image + ' fa-stack">' +
                        '</i>' +
                    '</span>' +
                    '<div class="caret">' +
                    '</div>' +
                '</div>' +
                '<div  class="CommandToolDropdownLabel">' +
                command.label +
                '</div>' +
            '</button></div></div>').css(cssObj);
            }

            ele.appendTo($element);
            var child = $(ele).find(":button")[0];
            var width = Math.ceil($(child).outerWidth(true));
            ele.remove();
            return width;

        }
    }

    function commandBar() {
        function preLink(scope, iElem, iAttrs, ctrl) {
            var barTypeAction = 'Action';
            var barTypeTool = 'Tool';
            if (ctrl.commands === null || ctrl.commands === undefined) {
                ctrl.commands = {};
                ctrl.commands.barType = (iAttrs.sitType === 'action' || iAttrs.sitType === 'Action') ? barTypeAction : barTypeTool;
                ctrl.commands.bar = [];
                ctrl.onCommandAdded = function (eventArgs) {
                    ctrl.commands.bar[eventArgs.index] = eventArgs.command;
                };
                ctrl.onGroupAdded = function (eventArgs) {
                    ctrl.commands.bar[eventArgs.index] = eventArgs.group;
                };
                ctrl.counter = 0;
            }
        }
        function postLink(scope, element, attrs, controller) {
            //note about Chrome:
            //      Width is not avalaible from the element itself.
            //      So we get the first DIV of the directive (there is only one div at first level in this directive) and read its offsetwidth.
            //      a link to the first div is stored in the scope in order to avoid to search it each time we need it.            
            if (controller.commands.bar === undefined || controller.commands.bar === null) {
                controller.logErrorFn('commands are not defined properly', controller.commands);
                return;
            }
            if (controller.commands.bar.length === 0) {
                controller.logErrorFn('commands are not defined properly', controller.commands);
                return;
            }
            if (controller.counter !== undefined || controller.counter !== null) {
                if (!controller.validateAttributes()) {
                    return;
                }
            }

            controller.onWindowResizeSize();
            controller.calculateCutOff();
            controller.barElement = element[0].firstElementChild;
            controller.__width = controller.barElement.offsetWidth;
            controller.calculateCutOff();

            //watch on object structure modification
            scope.$watch(function () {
                return controller.commands;
            }, function () {
                controller.calculateCutOff();
            }, true);

            function onResizeElement() {
                controller.onWindowResizeSize();
            }
            function gotResized() {
                return controller.__width !== controller.barElement.offsetWidth;
            }

            scope.$watch(gotResized,
                function () {
                    setTimeout(onResizeElement, 100); //assynch call
                }, true
            );

            onResizeElement();

            controller.collapseButtonElement = element[0].querySelectorAll('#collapse-button-command-bar')[0];

            //check if menu must be oppenned at left or right
            controller.checkOpenPos = function () {

                if (controller.winWidth) {
                    var elementLeftPosition = 0;
                    if (controller.collapseButtonElement) {
                        var pos = controller.collapseButtonElement.getBoundingClientRect();
                        if (pos) {
                            if (pos.left) {
                                elementLeftPosition = pos.left;
                            }
                        }
                    }
                    if (elementLeftPosition + $('#sit-commandbar-collapse-menu').width() <= controller.winWidth) {
                        controller.openLeft = true;
                    } else {
                        controller.openLeft = false;
                    }
                } else {
                    controller.openLeft = false;
                }
                return controller.openLeft;
            };

            controller.checkOpenPos();

            scope.$watch(controller.checkOpenPos, function () {
                controller.checkOpenPos();
            });
        }
        return {
            bindToController: {
                commands: '=?sitCommands',
                labelAlign: '@sitLabelAlign'
            },
            controller: commandbarController,
            controllerAs: 'commandBarCtrl',
            link: {
                pre: preLink,
                post: postLink
            },
            restrict: 'E',
            scope: {
            },
            templateUrl: 'common/widgets/commandBar/command-bar.html',
            transclude: true
        };
    }
    angular.module('siemens.simaticit.common.widgets.commandBar').directive('sitCommandBar', commandBar);
})();
(function () {
    'use strict';
    //#region ng-doc comments
    /**
    *   @ngdoc directive
    *   @name sitCommand
    *   @module siemens.simaticit.common.widgets.commandBar
    *   @description Name of the directive related to a command.
    *
    *   @usage
    *   ```
    *       <sit-command 
    *           sit-type="command" 
    *           sit-name="commandEdit" 
    *           sit-tooltip="Edit Material" 
    *           ng-show="false" 
    *           sit-icon="fa-edit" 
    *           sit-unauthorized-behavior="disable"
    *           ng-click="vm.editFunction">edit
    *       </sit-command>
    *   ```
    * 
    *   ```
    *       <sit-command 
    *           sit-type="toggle" 
    *           sit-name="toggleEdit"
    *           sit-tooltip="toggle" 
    *           ng-show="true"
    *           sit-selected="false" 
    *           sit-icon="fa-toggle-on" 
    *           ng-click="vm.editFunction">toggle
    *       </sit-command>
    *    ```
    * 
    *   @restrict E
    * 
    *   @param {string} sit-type Type of commands included in the command bar.
    *   
    *   Possible options are:
    *   * **command** - Standard command button.
    *   * **sep** - Command bar separator.
    *   * **main** - The principle command button displayed on the screen.
    *   * **toggle** –  Command button with on/off status.
    *   @param {string} sit-name The complete name of the command (including the namespace).
    *   @param {string} sit-tooltip The tooltip of the command button. The default value is the label of the command.
    *   @param {string} [sit-icon=fa-cogs] One or more CSS classes corresponding to the icon to display for the command button.
    *   @param {string} [sit-icon-template] For internal use.
    *   @param {string} [sit-selected=false] The selection of the command button of type **toggle** puts a border around the command.
    *   @param {string} sit-unauthorized-behavior The behavior to be followed when the user is not authorized to invoke given command.
    *   Possible values are:
	*   
	*   * **show** – (default) The command button is always displayed, no checks are performed.
	*   * **hide** – The command button is not displayed if **sit-type** is not set or if it is set to a value different from **sep** and the current user does not have the rights to execute the command specified in **sit-name** (**sit-name** must be set to the command FullName)
	*   * **disable** – The command button is displayed but it is disabled if **sit-type** is not set or if it is set to a value different from **sep** and the current user does not have the rights to execute the command specified in **sit-name** (**sit-name** must be set to the command FullName)

    *   @param {Function} ng-click The function to be called on clicking the command.
    *   @param {string} value Label to be shown with the command.
    */
    /*
    * NOTE: As discussed with Fabio C., only the "markup" configuration must be documented.
    * The following parameters and example must not appear in the docs.
    *   @param {object} command JSON object that describes the command bar.
    *   @param {string} showas Defines if the group is displayed as a **Button** or a **Menu**.
    *   @param {string} bartype Type of commands included in the command bar (**Action** or **Tool** commands).
    *   @param {function} onClickCallback JavaScript function that is called when a command button is clicked.
    *   ### Using a configuration object
    *   ```
    *   <html>
    *   <script>
    *   
    *   var command = 
    *           {
    *                  "type": "Command",
    *                  "label": "Edit",
    *                  "name": "toggleEdit",
    *                  "tooltip": "Edit Material",
    *                  "visibility": false,
    *                  "image": "fa-edit",
    *                  "onClickCallback": editFunction
    *           };
    *   
    *   </script>
    *   
    *           <sit-command sit-command='command' sit-showas='Menu' sit-bartype='Action'></sit-command>
    *   
    *   </html>
    *   
    *   ```
    * 
    */
    //#endregion
    commandController.$inject = ['$state', 'common'];
    function commandController($state, common) {
        var vm = this;
        vm.logErrorFn = logErrorFn;

        function logErrorFn(message, attributes) {
            common.logger.logError(message, attributes, 'siemens.simaticit.common.widgets.commandBar command');
        }

        function isFunction(functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        }

        vm.commandClicked = function (command, $event) {
            if (!command.disabled) {//execute command callback only if command is not disabled
                if (command.type === 'toggle') {
                    command.selected = !command.selected;
                    if (vm.showas === 'Menu') {
                        $event.stopPropagation();
                    }
                }
                // Check if the property stateTransition exists
                if (command.stateTransition !== null && command.stateTransition !== undefined) {
                    //function goToState() {
                    //$state.go(command.stateTransition.to, command.stateTransition.params, command.stateTransition.options);
                    //}
                    if (typeof (command.stateTransition) !== 'string') {
                        $state.go(command.stateTransition.to, command.stateTransition.params, command.stateTransition.options);
                        //goToState();
                    }
                } else if (command.hasOwnProperty('onClickCallback')) {
                    if (isFunction(command['onClickCallback'])) {
                        command['onClickCallback'](command);
                    } else {
                        var msg = 'onClickCallback is not a function on command "' + command.name + '": \n';
                        var data = { command: command };
                        logErrorFn(msg, data);
                    }
                }
            }
        };
    }
    command.$inject = ['common.services.security.securityService', 'common.services.security.functionRightModel'];
    function command(securityService, functionRightModel) {
        function preLink(scope, element, attrs, controllers) {
            var sitCommandBarCtrl = controllers[0];
            var sitCommandCtrl = controllers[1];
            var sitCommandGroupCtrl = controllers[2];

            if ((sitCommandCtrl.command === undefined || sitCommandCtrl.command === null) && (sitCommandGroupCtrl === undefined || sitCommandGroupCtrl === null)) {
                sitCommandCtrl.index = sitCommandBarCtrl.counter++;
            }
        }
        function postLink(scope, element, attrs, controllers) {
            var sitCommandBarCtrl = controllers[0];
            var sitCommandCtrl = controllers[1];
            var sitCommandGroupCtrl = controllers[2];
            var commands = {
                main: 'main',
                mainCommand: 'MainCommand',
                MainCommand: 'MainCommand',
                sep: 'sep',
                Sep: 'Sep',
                command: 'command',
                Command: 'Command',
                toggle: 'toggle'
            };
            var isUserAuthorized = false;

            function getCommandType(type) {
                switch (type) {
                    case 'main':
                    case 'MainCommand':
                        return commands.mainCommand;
                    case 'sep':
                    case 'Sep':
                        return commands.Sep;
                    case 'command':
                    case 'Command':
                        return commands.Command;
                    case 'toggle':
                        return commands.toggle;
                    default:
                        return commands.Command;
                }
            }
            function initializeCommandProperties() {
                var transcludedElement = element.find('div[ng-transclude]');
                var label = transcludedElement.html();
                if (label.trim() !== "") {//if the directive value is provided, take that as label
                    sitCommandCtrl.command.label = label;
                } else {
                    sitCommandCtrl.command.label = attrs.sitLabel;
                }
                sitCommandCtrl.command.deniedFromAuthorization = false;
                sitCommandCtrl.command.name = attrs.sitName;
                sitCommandCtrl.command.tooltip = attrs.sitTooltip;
                sitCommandCtrl.command.visibility = (sitCommandCtrl.visibility !== undefined && sitCommandCtrl.visibility !== null) ? sitCommandCtrl.visibility : true;
                sitCommandCtrl.command.image = attrs.sitIcon ? attrs.sitIcon : 'fa-cogs';//the default value of image of the command is fa-cogs
                sitCommandCtrl.command.imageTemplate = attrs.sitIconTemplate ? attrs.sitIconTemplate : null;
                sitCommandCtrl.command.onClickCallback = sitCommandCtrl.method();
                sitCommandCtrl.command.unauthorizedBehavior = attrs.sitUnauthorizedBehavior;
                sitCommandCtrl.command.selected = (sitCommandCtrl.selected !== undefined && sitCommandCtrl.selected === true) ? sitCommandCtrl.selected : false;
            }

            if (sitCommandCtrl.command === undefined || sitCommandCtrl.command === null) {
                sitCommandCtrl.command = {};
                sitCommandCtrl.command.type = getCommandType(attrs.sitType);
                if (sitCommandCtrl.command.type !== commands.Sep) {
                    initializeCommandProperties();
                }
                if (sitCommandGroupCtrl !== undefined && sitCommandGroupCtrl !== null) {
                    sitCommandGroupCtrl.onCommandAddedToGroup(sitCommandCtrl.command);
                } else {
                    sitCommandBarCtrl.onCommandAdded(sitCommandCtrl);
                }
            }

            //sets the default value of visibility of the command
            if (!sitCommandCtrl.command.hasOwnProperty('visibility')) {
                sitCommandCtrl.command.visibility = true;
            }

            if (sitCommandBarCtrl.labelAlign) {
                sitCommandCtrl.labelAlign = sitCommandBarCtrl.labelAlign.toLowerCase();
            }

            //Authorization Integration Enhancements
            sitCommandCtrl.command.disabled = typeof sitCommandCtrl.command.disabled === 'boolean' ? sitCommandCtrl.command.disabled : false;//by default, every command is enabled
            if (!sitCommandCtrl.command.unauthorizedBehavior) {//the default value of unauthorizedBehavior of the command is 'show'
                sitCommandCtrl.command.unauthorizedBehavior = 'show';
            }
            if ((sitCommandCtrl.command.type in commands && sitCommandCtrl.command.type !== commands.Sep) && sitCommandCtrl.command.unauthorizedBehavior !== 'show') { //when unauthorizedBehavior is 'show', there is no need to check for user authorization
                //check if user is authorized
                var functionRight = new functionRightModel("business_command", sitCommandCtrl.command.name, "invoke");
                var funRightListModel = [functionRight];
                securityService.canPerformOp(funRightListModel).then(function (data) {
                    if (data) {
                        if (data.length > 0) {
                            isUserAuthorized = data[0].isAccessible;
                            if (!isUserAuthorized && sitCommandCtrl.command.unauthorizedBehavior === 'disable') {
                                sitCommandCtrl.command.disabled = true;
                            }
                            if (!isUserAuthorized && sitCommandCtrl.command.unauthorizedBehavior === 'hide') {
                                sitCommandCtrl.command.deniedFromAuthorization = true;
                                sitCommandCtrl.command.visibility = false;
                            }
                        }
                    }
                }, function (error) {
                    sitCommandCtrl.logErrorFn('-1: Command Error: user data is not present1', error);
                });
            }

            //watch on visibility in case of command behind a group button. group button must be hidded if there is no more commands behind
            if (typeof (scope.$parent.setVisibility) === 'function') {
                scope.$watch(function () {
                    return sitCommandCtrl.command.visibility;
                },
                function () {
                    scope.$parent.setVisibility(sitCommandCtrl.command);
                });
            }
            scope.$watch(function () {
                return sitCommandCtrl.visibility;
            },
            function () {
                if (sitCommandCtrl.visibility !== undefined && sitCommandCtrl.visibility !== null) {
                    sitCommandCtrl.command.visibility = sitCommandCtrl.visibility;
                }
            });

        }
        return {
            bindToController: {
                command: '=?sitCommand',
                showas: '@sitShowas',
                bartype: '@sitBartype',
                method: '&ngClick',
                visibility: '=?ngShow',
                selected: '=?sitSelected'
            },
            controller: commandController,
            controllerAs: 'cmdCtrl',
            link: {
                pre: preLink,
                post: postLink
            },
            restrict: 'E',
            require: ['^sitCommandBar', 'sitCommand', '^?sitCommandGroup'],
            scope: {},
            //templateUrl: 'common/widgets/commandBar/command.html',
            template:
                ['<div ng-transclude></div>',
                '<div ng-switch="cmdCtrl.showas" ng-show="cmdCtrl.command.visibility && !cmdCtrl.command.deniedFromAuthorization">',
                '    <div ng-switch-when="Button" id="Button{{cmdCtrl.command.type}}{{cmdCtrl.command.name}}">',
                '        <button data-internal-type="command-button-command-bar"',
                '                ng-class="[{Action:\'{{cmdCtrl.command.type}}ActionButton\',Tool:\'{{cmdCtrl.command.type}}ToolButton\'}[cmdCtrl.bartype],{\'toggle\': cmdCtrl.command.type === \'toggle\' && cmdCtrl.command.selected}]"',
                '                ng-click="cmdCtrl.commandClicked(cmdCtrl.command)" title="{{cmdCtrl.command.tooltip || cmdCtrl.command.label}}" ng-disabled="cmdCtrl.command.disabled">',
                '            <span data-internal-type="image-container" ng-if="cmdCtrl.command.image && !cmdCtrl.command.imageTemplate" class="fa-lg">',
                '                <i class="fa {{cmdCtrl.command.image}}"></i>',
                '            </span>',
                '           <span data-internal-type="image-container" ng-if="cmdCtrl.command.imageTemplate" class="fa-lg" ng-bind-html="cmdCtrl.command.imageTemplate"></span>',
                '           <span data-internal-type="text-container" ng-if="cmdCtrl.bartype==\'Tool\' || cmdCtrl.command.type==\'MainCommand\'" class="{{cmdCtrl.command.type}}{{cmdCtrl.bartype}}Label">{{cmdCtrl.command.label}}</span>',
                '        </button>',
                '    </div>',
                '    <div ng-switch-when="Menu">',
                '        <div data-internal-type="command-menu-command-bar" type="button" class="btnMenu" style="text-align:left" ng-click="cmdCtrl.commandClicked(cmdCtrl.command, $event)" title="{{cmdCtrl.command.tooltip || cmdCtrl.command.label}}" ng-disabled="cmdCtrl.command.disabled">',
                '            <span data-internal-type="image-container" ng-if="cmdCtrl.command.image && !cmdCtrl.command.imageTemplate" class="fa {{cmdCtrl.command.image}}"></span>',
                '            <span data-internal-type="image-container" ng-if="cmdCtrl.command.imageTemplate" ng-bind-html="cmdCtrl.command.imageTemplate"></span>',
                '            <label data-internal-type="text-container" class="menuLabel" onclick="event.preventDefault();" ng-class="!cmdCtrl.command.image && cmdCtrl.labelAlign === \'right\' ? \'menu-label-icon-margin\' : \'menu-label-margin\'">',
                '                {{cmdCtrl.command.label}}',
                '                <input type="checkbox" style="float:right" ng-show="cmdCtrl.command.type === \'toggle\'" ng-checked="cmdCtrl.command.selected"/>',
                '            </label>',
                '        </div>',
                '    </div>',
                '</div>'].join('\n'),
            transclude: true
        };
    }
    angular.module('siemens.simaticit.common.widgets.commandBar').directive('sitCommand', command);
})();
(function () {
    'use strict';
    //#region ng-doc comments
    /**
     *   @ngdoc directive
     *   @name sitCommandGroup
     *   @module siemens.simaticit.common.widgets.commandBar
     *   @description _(Internal)_ Name of the directive related to a group of commands.
     *   @example
     *   ```
     *   <sit-command-group sit-label="group1" sit-name="My group name 1" sit-tooltip="CommandBar Group" sit-icon="fa-truck" sit-type="group">
     *        <sit-command ng-click="cbDevCtrl.callback" ng-show="true" sit-icon="fa-truck" sit-label="command2" sit-name="com.siemens.customcommand.command2" sit-tooltip="command" sit-type="cmdgroup"></sit-command>
     *        <sit-command ng-click="cbDevCtrl.callback" ng-show="true" sit-icon="fa-users" sit-label="command3" sit-name="com.siemens.customcommand.command3" sit-tooltip="command" sit-type="cmdgroup"></sit-command>
     *        <sit-command ng-click="cbDevCtrl.callback" sit-icon="fa-users" sit-label="command4" sit-name="com.siemens.customcommand.command4" sit-tooltip="command" sit-type="cmdgroup"></sit-command>
     *   </sit-command-group>
     *   ```
     *   @restrict E
     *
     *   @param {string} sit-type Type of commands included in the command-bar (**group** commands).
     *   @param {string} sit-label Label to be shown with the group.
     *   @param {string} sit-tooltip The tooltip of the command group button. The default value is the label of the command group button.
     *   @param {string} sit-name The complete name of the group (including name space), used only as ID for group.
     *   @param {string} sit-icon The group icon to be displayed (via FontAwesome icon set).
     */
    /*
    * NOTE: As discussed with Fabio C., only the "markup" configuration must be documented.
    * The following parameters and example must not appear in the docs.
    *
    *   @param {object} command Set of commands included within the group and displayed using a flyout menu.
    *   @param {string} showas Define if the group is diplayed as a **Button** or a **Menu**.
    *   @param {string} bartype Type of commands included in the command-bar (**Action** or **Tool** commands).
    *
    *   #### Using a configuration object
    *   ```
    *   <html>
    *   
    *   <script>
    *   
    *   var command = 
    *       {
    *              "type": "Group",
    *              "label": "Group 1",
    *              "name": "My group name",
    *              "tooltip": "Command Group"
    *              "image": "fa-truck",
    *              "group": [
    *                      {
    *                          "label": "command2",
    *                          "name": "com.siemens.customcommand.command2",
    *                          "image": "fa-truck",
    *                          "visibility": true,
    *                          "type": "Command",
    *                          'onClickCallback': callback
    *                      },
    *                      {
    *                          "label": "command3",
    *                          "name": "com.siemens.customcommand.command3",
    *                          "image": "fa-users",
    *                          "visibility": true,
    *                          "type": "Command",
    *                          'onClickCallback': callback
    *                      },
    *                      {
    *                          "label": "command4",
    *                          "name": "com.siemens.customcommand.command4",
    *                          "image": "fa-users",
    *                          "type": "Command",
    *                          'onClickCallback': callback
    *                       }
    *               ]
    *       };
    *   
    *   </script>
    *   
    *           <sit-command-group sit-command='command' sit-showas='Menu' sit-bartype='Tool'></sit-command-group>
    *   
    *   </html>
    */
    //#endregion
    commandGroupController.$inject = ['$scope', '$window'];
    function commandGroupController($scope, $window) {
        var win = angular.element($window);
        var vm = this;
        function activate() {
            vm.winWidth = win.width();
            if (vm.checkOpenPos) {
                vm.checkOpenPos();
            }
            //listener to the resize event to detect resizing
            angular.element($window).bind('resize', windowResize);
        }

        function windowResize() {
            vm.winWidth = win.width();
            if (vm.checkOpenPos) {
                vm.checkOpenPos();
            }
        }
        activate();
        $scope.$on('$destroy', function () {
            angular.element($window).unbind('resize', windowResize);
        });
    }
    function commandGroup() {
        function preLink(scope, element, attrs, controllers) {
            var sitCommandGroupCtrl = controllers[1];
            if (sitCommandGroupCtrl.group === undefined || sitCommandGroupCtrl.group === null) {
                sitCommandGroupCtrl.group = {};
                sitCommandGroupCtrl.group.image = attrs.sitIcon;
                sitCommandGroupCtrl.group.imageTemplate = attrs.sitIconTemplate ? attrs.sitIconTemplate : null;
                sitCommandGroupCtrl.group.label = attrs.sitLabel;
                sitCommandGroupCtrl.group.tooltip = attrs.sitTooltip;
                sitCommandGroupCtrl.group.name = attrs.sitName;
                sitCommandGroupCtrl.group.type = 'Group';
                sitCommandGroupCtrl.group.group = [];
                sitCommandGroupCtrl.onCommandAddedToGroup = function (command) {
                    sitCommandGroupCtrl.group.group[sitCommandGroupCtrl.group.group.length] = command;
                    sitCommandGroupCtrl.group.group = _.uniq(sitCommandGroupCtrl.group.group);
                    sitCommandGroupCtrl.sendGroupToCommandBar = true;
                };
                sitCommandGroupCtrl.index = controllers[0].counter++;
            }
        }
        function postLink(scope, element, attrs, controllers) {

            function onClickDropdown(event) {
                if ($(event.target).parents('div[data-internal-type="group-submenu-command-bar"]').length || $(event.target).data('internal-type') === 'group-submenu-command-bar') {
                    event.stopPropagation();
                    event.preventDefault();
                }
            }

            $('.dropdown-menu').on("click.bs.dropdown", onClickDropdown);

            var sitCommandBarCtrl = controllers[0];
            var sitCommandGroupCtrl = controllers[1];
            if (sitCommandGroupCtrl.sendGroupToCommandBar) {
                sitCommandBarCtrl.onGroupAdded(sitCommandGroupCtrl);
            }
            sitCommandGroupCtrl.groupButtonElement = element[0];

            //check if menu must be oppenned at left or right
            sitCommandGroupCtrl.checkOpenPos = function () {
                if (sitCommandGroupCtrl.winWidth) {
                    //var parentL = 0;
                    var elementLeftPosition = 0;
                    if (sitCommandGroupCtrl.groupButtonElement) {
                        var pos = sitCommandGroupCtrl.groupButtonElement.getBoundingClientRect();
                        if (pos) {
                            if (pos.left) {
                                elementLeftPosition = pos.left;
                            }
                        }
                    }
                    if (elementLeftPosition >= (sitCommandGroupCtrl.winWidth / 2)) {
                        sitCommandGroupCtrl.openLeft = true;
                    } else {
                        sitCommandGroupCtrl.openLeft = false;
                    }
                } else {
                    sitCommandGroupCtrl.openLeft = false;
                }
                return sitCommandGroupCtrl.openLeft;
            };
            sitCommandGroupCtrl.checkOpenPos();
            //hide the group button if there is no more visible commands inside
            scope.setVisibility = function (onCommand) {
                if (onCommand.visibility) {
                    sitCommandGroupCtrl.groupVisibility = true;
                }
                else {
                    var tmp = false;
                    for (var i = 0; i < sitCommandGroupCtrl.group.group.length; i++) {
                        if (sitCommandGroupCtrl.group.group[i].visibility) {
                            tmp = true;
                            break;
                        }
                    }
                    sitCommandGroupCtrl.groupVisibility = tmp;
                }
                // mandatory for change display detection of the command bar.
                sitCommandGroupCtrl.group.visibility = sitCommandGroupCtrl.groupVisibility;
            };

            scope.$watch(sitCommandGroupCtrl.checkOpenPos, function () {
                sitCommandGroupCtrl.checkOpenPos();
            });

            scope.$on('$destroy', function () {
                $('.dropdown-menu').off("click.bs.dropdown", onClickDropdown);
            });
        }
        return {
            bindToController: {
                group: '=?sitGroup',
                showas: '@sitShowas',
                bartype: '@sitBartype',
                labelAlign: '@sitLabelAlign'
            },
            controller: commandGroupController,
            controllerAs: 'cmdBarGrpBtnCtrl',
            link: {
                pre: preLink,
                post: postLink
            },
            restrict: 'E',
            require: ['^sitCommandBar', 'sitCommandGroup'],
            scope: {},
            //templateUrl: 'common/widgets/commandBar/command-group.html',
            template:
                ['<div>',
    '<div ng-switch="cmdBarGrpBtnCtrl.showas" ng-show="cmdBarGrpBtnCtrl.groupVisibility">',
        '<div ng-switch-when="Button" class="btn-group ">',
            '<button data-internal-type="group-button-command-bar" ng-class="{Action:\'dropdown-toggle CommandActionDropdown\',Tool:\'dropdown-toggle CommandToolDropdown\'}[cmdBarGrpBtnCtrl.bartype]" data-toggle="dropdown" title="{{ cmdBarGrpBtnCtrl.group.tooltip || cmdBarGrpBtnCtrl.group.label }}">',
                '<div style="display:inline;" ng-if="cmdBarGrpBtnCtrl.labelAlign !== \'right\'">',
                    '<span ng-if="cmdBarGrpBtnCtrl.group.image" class="fa-stack fa-lg">',
                        '<i class="fa {{cmdBarGrpBtnCtrl.group.image}} fa-stack">',
                        '</i>',
                    '</span>',
                    '<div class="caret">',
                    '</div>',
                '</div>',
                '<div ng-if="cmdBarGrpBtnCtrl.bartype==\'Tool\' && cmdBarGrpBtnCtrl.labelAlign !== \'right\'" class="CommandToolDropdownLabel">',
                '{{cmdBarGrpBtnCtrl.group.label}}',
                '</div>',
                '<span ng-if="cmdBarGrpBtnCtrl.group.image && cmdBarGrpBtnCtrl.labelAlign === \'right\'" class="fa-lg right-align">',
                        '<i class="fa {{cmdBarGrpBtnCtrl.group.image}} ">',
                        '</i>',
                    '</span>',
                '<span class="caret" ng-if="cmdBarGrpBtnCtrl.labelAlign === \'right\'">',
                '</span>',
                '<span ng-if="cmdBarGrpBtnCtrl.bartype==\'Tool\' && cmdBarGrpBtnCtrl.labelAlign === \'right\' " class="CommandToolDropdownLabel">',
                '{{cmdBarGrpBtnCtrl.group.label}}',
                '</span>',
            '</button>',

            '<ul data-internal-type="menu-command-bar" class="dropdown-menu commandBarDropdownMenu " ng-class="{\'commandBarDropdownMenuAlignRight\':cmdBarGrpBtnCtrl.openLeft}" role="menu" data-toggle="dropdown">',
                '<li ng-repeat="subcommand in cmdBarGrpBtnCtrl.group.group" class="commandBarDropdownItem">',

                    '<div ng-switch="subcommand.type">',


                        '<div data-internal-type="menu-item-command-bar" ng-switch-when="Command">',
                            '<sit-command sit-command="subcommand" sit-showas="Menu" sit-bartype="{{cmdBarGrpBtnCtrl.bartype}}">',
                            '</sit-command>',
                        '</div>',

                        '<div ng-switch-when="Sep">',
                            '<div data-internal-type="menu-separator-command-bar" class=" divider menuDivider" />',
                        '</div>',

                        '<div data-internal-type="menu-item-command-bar" ng-switch-when="toggle">',
                            '<sit-command sit-command="subcommand" sit-showas="Menu" sit-bartype="{{cmdBarGrpBtnCtrl.bartype}}">',
                            '</sit-command>',
                        '</div>',

                        '<div ng-switch-default>',
                            'Unknown sub command type: Allowed values are "Command" or "Sep"',
                        '</div>',

                    '</div>',

                '</li>',
            '</ul>',
        '</div>',
        '<div ng-switch-when="Menu" class="dropdown-submenu " ng-class="{\'pull-left\':cmdBarGrpBtnCtrl.openLeft}">',

            '<div data-internal-type="group-submenu-command-bar" class=\'btnMenu\' style="text-align:left" title="{{cmdBarGrpBtnCtrl.group.tooltip || cmdBarGrpBtnCtrl.group.name}}">',
                '<span ng-if="cmdBarGrpBtnCtrl.group.image" class="fa {{cmdBarGrpBtnCtrl.group.image}}  ">',
                '</span>',
                '<label class="menuLabel">',
                '{{cmdBarGrpBtnCtrl.group.label}}',
                '</label>',
                '<span class="fa fa-caret-right">',
                '</span>',
            '</div>',

            '<ul data-internal-type="submenu-command-bar" class="dropdown-menu commandBarDropdownMenu " role="menu">',
                '<li class="commandBarDropdownItem" ng-repeat="subcommand in cmdBarGrpBtnCtrl.group.group">',

                    '<div ng-switch="subcommand.type">',


                        '<div data-internal-type="submenu-item-command-bar" ng-switch-when="Command">',
                            '<sit-command sit-command="subcommand" sit-showas="Menu" sit-bartype="{{cmdBarGrpBtnCtrl.bartype}}">',
                            '</sit-command>',
                        '</div>',

                        '<div data-internal-type="submenu-separator-command-bar" ng-switch-when="Sep">',
                            '<div class="divider menuDivider">',
                            '</div>',
                        '</div>',

                        '<div data-internal-type="submenu-item-command-bar" ng-switch-when="toggle">',
                            '<sit-command sit-command="subcommand" sit-showas="Menu" sit-bartype="{{cmdBarGrpBtnCtrl.bartype}}">',
                            '</sit-command>',
                        '</div>',

                        '<div ng-switch-default>',
                            'Unknown sub command type: Allowed values are "Command" or "Sep"',
                        '</div>',

                    '</div>',

                '</li>',
            '</ul>',

        '</div>',
        '<ng-transclude ng-show=false>',
        '</ng-transclude>',
    '</div>',
'</div>'].join('\n'),
            transclude: true
        };
    }
    angular.module('siemens.simaticit.common.widgets.commandBar').directive('sitCommandGroup', commandGroup);
})();
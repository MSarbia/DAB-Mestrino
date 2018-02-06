/* SIMATIC IT Unified Architecture Foundation V2.1 | Copyright (C) Siemens AG 2017. All Rights Reserved. */
/**
 * @ngdoc module
 * @name siemens.simaticit.common.widgets.filter
 * 
 * @description
 * This module provides functionalities related to defining filter clauses and applying them to a given data set.
 */
(function () {
    'use strict';

    angular.module('siemens.simaticit.common.widgets.filter', [
        //'siemens.simaticit.common.services.logger'
    ]);

})();
/*jshint -W117,-W098, -W027 */
(function () {
    'use strict';
    //#region ng-doc comments
    /**
    * @ngdoc type
    * @name FilterField
    * @module siemens.simaticit.common.widgets.filter
    * @description An object containing the configuration settings for the data fields used to set filter criteria. Each element of the array contains the configuration for one data field.
    * @property {Array<String>} [allowedCompareOperators=undefined] _(Optional)_ Specifies the allowed compare operator(s) for a particular filter field.The accepted possible values are as follows:
    * * **=**
    * * **<>**
    * * **<=**
    * * **>=**
    * * **<**
    * * **>**
    * * **in**
    * * **contains**
    * * **startsWith**
    * * **endsWith**
    *
    * **Note** : Depending on the type(numer, string, date, boolean) of the field, there is a restriction on the allowed operators. Hence if the operators specified in the allowedCompareOperators list does not fall under the restrict list, they will be removed. If none of the allowedCompareOperators match the restrict list then the default set of operators for the type will be shown.
    *    
    * @property {Boolean} [default=false] 
    * Specifies if a clause should be made automatically for this data field.
    * 
    * The **sitFilter** directive always shows at least one clause in the UI. 
   * When the UI is first shown, all elements of the **sitFilterFields** list are checked
    * to see if any have the **default** property set to true. 
    * If so, a clause is created for each.
    * If no configured data fields have the **default** property set true,
    * then a clause is created for the first field in the list regardless of **default** value.
    * 
    * @property {String} [displayName=undefined] 
    * Defines a user friendly name to show in the dropdown list of data fields that may be used for filtering.
    * 
    * @property {String} [field=undefined] 
    * Specifies the name of the data field to apply the filter criteria against.
    * 
    * @property {String} [type='string'] 
    * Specifies the type of data contained in the data field.
    * The following is a list of allowed values.
    * * **string**
    * * **number**
    * * **date**
    * * **boolean**
    * 
    * This affects the type of UI element used for data input.
    * 
    * @property {String} validation A validation rule supported by the data input widget.
    * @property {String[]} [values=undefined] 
    * Defines a set of predefined values a user can select from. 
    * 
    * @property {String} widget
    * The name of a **Property Grid** widget to use for data input. 
    * 
    * This allows a developer to override the default widget used for data input based on data type.
    * If specified, this widget is used regardless of data type.
    * 
    */

    /**
     * @ngdoc type
     * @name FilterClause
     * @module siemens.simaticit.common.widgets.filter
     * @description Filter clauses are produced by the **sitFilterDirective**.
     * An array of these objects are passed to the function set as the **sitFilterCallback**.
     * 
     * @property {Object} [filterField]
     * This identifies the data field that is the target of the clause.
     * It is the original configuration object passed in the **sitFilterFields** collection.
     * 
     * @property {String} [andOr]
     * Defines the logical comparison to apply with the prior clause. 
     * The value will be one of the following:
     * * **and**
     * * **or**
     * 
     * The value is undefined for the first clause in the list.
     * 
     * @property {Boolean} [matchCase]
     * Specifies if the string comparison must be case-sensitive.
     *     
     * @property {String} [operator]
     * Defines the type of comparison to perform with the value of the data field.
     * The value will be one of the following:
     * * **=**: The data field value must equal the clause value.
     * * **<>**: The data field value must not equal the clause value.
     * * **<**: The data field value must be less than the clause value.
     * * **<=**: The data field value must be less than or equal to the clause value.
     * * **>**: The data field value must be greater than the clause value.
     * * **>=**: The data field value must be greater than or equal to the clause value.
     * * **in**: The data field value must match one of the specified allowed values.
     * The **values** property will be a comma separated list of allowed values.
     * * **contains**: The data field value must be a string that contains the clause value as a substring.
     * * **startsWith**: The data field value must be a string that starts with the clause value.
     * * **endsWith**: The data field value must be a string that ends with the clause value.
     * 
     * @property {String} [value]
     * Defines the value to compare against the data field value.
     * 
     * When the **in** operator is specified for the clause, 
     * the value may be a comma separated list of values. 
     * 
	 */

    /**
     * @ngdoc type
     * @name FilterOptions
     * @module siemens.simaticit.common.widgets.filter
     * @description An object providing a detailed description for all the options supported
     * by the **sitFilterOptions** parameter of the {@link siemens.simaticit.common.widgets.filter.sitFilter} directive.
     *
     * @property {Boolean} [showDefaultClause = true] If set to false , it will hide the clause that appears by default when no sit-clauses or any default clause is set.
     *
     */

    /**
     * @ngdoc directive
     * @module siemens.simaticit.common.widgets.filter
     * @name sitFilter
     * 
	 * @restrict E
	 * 
	 * @description 
	 * Provides a UI for defining filter criteria.
     *
	 * @usage 
     * As an element:
     * ```
     *  <sit-filter
     *    sit-filter-fields="filterFieldsArr"
     *    sit-filter-options="filterOptionsObj"
     *    sit-apply-callback="applyCallbackFunc"
     *    sit-reset-callback="resetCallbackFunc">
     *  </sit-filter>
     * ```
	 * @param {FilterField} sitFilterFields For a description of this object see {@link FilterField}.
	 * 
	 * @param {Object} sitFilterOptions For a description of this object see {@link FilterOptions}.
     *
	 * @param {Function} [sitApplyCallback]
	 * Specifies the function to call when the user clicks the **Apply** button.
	 * 
	 * @param {Function} [sitResetCallback]
	 * Specifies the function to call when the user clicks the **Reset** button.
	 * 
	 * The function takes one argument. The value is an array of JSON objects
	 * representing the clauses defined by the user in the UI. For detailed information on the structure of each clause see {@link FilterClause}.
	 * 
     *
     * @example
     * The following example shows how to configure a filter widget:
     *
     * In Controller
     * ```
     *  (function () {
     *      FilterDemoController.$inject = [];
     *      function FilterDemoController() {
     *          var self = this;
     *          self.filterConfig = {
     *              filterFields: [{
     *                  default: false,
     *                  displayName: 'Last Name',
     *                  field: 'lastName',
     *                  type: 'string',
     *              }, {
     *                  default: false,
     *                  displayName: 'Title',
     *                  field: 'title',
     *                  type: 'string',
     *                  values: ['Mr', 'Mrs', 'Ms', 'Rev', 'Dr'],
     *                  widget: 'sit-select'
     *              }, {
     *                  default: false,
     *                  displayName: 'Birthday',
     *                  field: 'birthdate',
     *                  type: 'date'
     *              }],
     *              filterOptions: {},
     *              applyCallback: function () {
     *                  //content goes here
     *              },
     *              resetCallback: function () {
     *                  //content goes here
     *              }
     *          }
     *      }
     *  })();
     * ```
     * In Template   
     *```        
     *      <sit-filter sit-filter-fields="ctrl.filterConfig.filterFields"
     *                  sit-filter-options="ctrl.filterConfig.filterOptions"
     *                  sit-apply-callback="ctrl.filterConfig.applyCallback"
     *                  sit-reset-callback="ctrl.filterConfig.resetCallback">
     *      </sit-filter>
     *```   
     */

    angular.module('siemens.simaticit.common.widgets.filter').directive('sitFilter', FilterDirective);
    FilterDirective.$inject = ['$translate'];
    function FilterDirective($translate) {
        return {
            restrict: 'E',
            scope: {},
            bindToController: {
                sitFilterFields: '=',
                sitFilterOptions: '=',
                sitApplyCallback: '&',
                sitFilterServerSide: '=?', //it is only needed because we had to know in filter id it is serverside or not in order to show the matchcase checkbox
                sitResetCallback: '&',
                sitClauses: '=',
                allowGrouping: '=sitAllowGrouping',
                sitHideApplyReset: '='
            },
            templateUrl: 'common/widgets/filter/sit-filter.html',
            link: function (scope, element, attr, ctrl) {
                //scope.$watch('sitFilterFields', ctrl.initialize);
                scope.$watch('sitFilterFields', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        ctrl.initialize();
                    }
                });
            },
            controller: FilterController,
            controllerAs: 'FilterCtrl'
        };
    }
    FilterController.$inject = ['$translate', '$scope', 'common.services.logger.service'];
    function FilterController($translate, $scope, logger) {
        var ctrl = this;
        ctrl.logger = logger.getModuleLogger('siemens.simaticit.common.widgets.filter');
        ctrl.dateFormat = 'longDate';
        ctrl.dateTimeOptions = {
            format: 'medium',
            showSeconds: true
        };
        var operators = {
            AND: {
                id: 'and',
                value: $translate.instant('common.and')
            },
            OR: {
                id: 'or',
                value: $translate.instant('common.or')
            }
        };

        var ops = {
            eq: { id: '=', display: '=' },
            neq: { id: '<>', display: '<>' },
            lt: { id: '<', display: '<' },
            lteq: { id: '<=', display: '<=' },
            gt: { id: '>', display: '>' },
            gteq: { id: '>=', display: '>=' },
            in: { id: 'in', display: $translate.instant('common.in') },
            con: { id: 'contains', display: $translate.instant('common.contains') },
            sw: { id: 'startsWith', display: $translate.instant('common.starts-with') },
            ew: { id: 'endsWith', display: $translate.instant('common.ends-with') },
            isnull: { id: 'isnull', display: $translate.instant('common.isNull') },
            isnotnull: { id: 'isnotnull', display: $translate.instant('common.isNotNull') }
        };

        //ctrl.clauses = [];
        ctrl.dateOperators = [ops.eq, ops.neq, ops.lt, ops.lteq, ops.gt, ops.gteq, ops.isnull, ops.isnotnull];
        ctrl.numberOperators = [ops.eq, ops.neq, ops.lt, ops.lteq, ops.gt, ops.gteq, ops.in,ops.isnull, ops.isnotnull];
        ctrl.stringOperators = [ops.eq, ops.neq, ops.in, ops.con, ops.sw, ops.ew,ops.isnull, ops.isnotnull];
        ctrl.booleanOperators = [ops.eq, ops.neq];
        ctrl.guidOperators = [ops.eq, ops.neq];

        initMethods();
        ctrl.initialize();
        ctrl.setAPIMethods();

        function initMethods() {
            ctrl.setWidget = setWidget;
            ctrl.setValidation = setValidation;
            ctrl.makeClause = makeClause;
            ctrl.setDefaultValue = setDefaultValue;
            ctrl.fieldChanged = fieldChanged;
            ctrl.operatorChanged = operatorChanged;
            ctrl.addClause = addClause;
            ctrl.removeClause = removeClause;
            ctrl.addEmptyClause = addEmptyClause;
            ctrl.getOperators = getOperators;
            ctrl.reset = reset;
            ctrl.apply = apply;
            ctrl.addDefaultClauses = addDefaultClauses;
            ctrl.initialize = initialize;
            ctrl.getFilterClauses = getFilterClauses;
            ctrl.setAPIMethods = setAPIMethods;
        }

        // set the widget member of the given clause
        function setWidget(clause) {

            // if the user set a widget on the filter field, assign it to the clause.  This overrides all.
            if (clause.filterField.widget) {
                clause.widget = clause.filterField.widget;
                return;
            }
            if (clause.filterField.type === 'number' || clause.filterField.type === 'string') {
                if (!clause.filterField.values || clause.filterField.values.length === 0) {
                    // no list of values
                    clause.widget = (clause.filterField.type === 'number') ? 'sit-numeric' : 'sit-text';
                }
                else if (clause.operator === ops.in.id) {
                    // 'in' operator
                    clause.widget = (clause.filterField.values.length <= 10) ? 'sit-multi-select' : 'sit-text';
                }
                else {
                    // not the 'in' operator
                    clause.widget = (clause.filterField.values.length <= 20) ? 'sit-select' : 'sit-entity-picker';
                }

            } else if (clause.filterField.type === 'boolean') {
                clause.widget = 'sit-select';
            } else if (clause.filterField.type === 'date') {
                clause.widget = 'sit-datepicker';
            } else if (clause.filterField.type === 'guid') {
                clause.widget = 'sit-text';
            }
        }
        // set the validation object based on the the filterField's validation value
        function setValidation(clause) {
            if (clause.widget === 'sit-checkbox') {
                $.extend(clause.validation, clause.filterField.validation, { required: false });
            } else {
                clause.filterField.validation && typeof clause.filterField.validation.required === 'boolean' ? clause.validation = clause.filterField.validation : $.extend(clause.validation, clause.filterField.validation, { required: true });
            }
        }
        // create a filter clause based on the given filter field
        function makeClause(filterField) {
            var clause = {
                filterField: filterField,
                andOr: 'and',
                operator: ops.eq.id,
                matchCase: false,
                validation: {}
            };


            ctrl.setDefaultValue(clause);
            ctrl.setWidget(clause);
            ctrl.setValidation(clause);

            return clause;
        }

        //set the default option value
        function setDefaultOption(filterField) {
            if (!filterField.hasOwnProperty('selectValues') && filterField.type === 'boolean') {
                filterField.selectValues = [{ id: true, name: true }, { id: false, name: false }];
            }
        }

        // get a default value and set it to the appropriate member on the given clause
        function setDefaultValue(clause) {

            // if we have a list of values, default to the first one
            if (clause.filterField.type === 'boolean') {
                clause.selectValue = clause.filterField.selectValues[0];
                clause.value = clause.filterField.selectValues[0].id;
            } else if (clause.filterField.type === 'date') {
                var now = new Date();
                clause.value = now;//.toISOString();
            } else if (clause.filterField.selectValues && clause.filterField.selectValues.length) {
                clause.selectValue = clause.filterField.selectValues[0];
                clause.value = clause.filterField.selectValues[0].id;
            } else if (clause.filterField.type === 'number') {
                clause.value = 0;
            } else if (clause.filterField.type === 'string' || clause.filterField.type === 'guid') {
                clause.value = '';
            } else {
                clause.value = 'UNKNOWN TYPE';
                ctrl.logger.logWarn('Field ' + clause.filterField.field + ' has unknown type: ' + clause.filterField.type);
            }
        }

        // return a default opearator for the type of the given filter field
        //ctrl.getDefaultOperator = function (filterField) {

        //}

        // user changed the field for the given clause
        function fieldChanged(oldType, clause) {
            // need check for changing data
            if (!clause.obsolete) {
                if (clause.filterField.type !== oldType || (clause.filterField.values && clause.filterField.values.length > 0)) {
                    ctrl.setDefaultValue(clause);
                }
                ctrl.setWidget(clause);
                ctrl.setValidation(clause);
            }
        }

        // user changed the operator for a field
        function operatorChanged(clause) {
            if (!clause.obsolete) {
                ctrl.setWidget(clause);
            }
        }

        // add a new clause after the given clause
        function addClause(afterClause) {
            if (!ctrl.sitFilterFields) {
                return;
            }

            // if we aren't given an afterClause, then append to the end of the array
            var afterIndex = afterClause ? ctrl.clauses.indexOf(afterClause) + 1 : ctrl.clauses.length;
            ctrl.clauses.splice(afterIndex, 0, ctrl.makeClause(ctrl.sitFilterFields[0]));

            // If a clause is added after a clause which is inside a group, add it to the group .
            if (afterClause && 'grpId' in ctrl.clauses[afterIndex - 1] && ctrl.clauses[afterIndex - 1].grpClass.indexOf('grp-end') === -1) {
                appendClauseToGroup(afterIndex);
            }
        }

        // remove the given clause from the list of filter clauses
        function removeClause(removeThisClause) {
            var removeIndex = ctrl.clauses.indexOf(removeThisClause);
            ctrl.clauses.splice(removeIndex, 1);

            // If the removed clause was included in a group, recheck the grouping
            if ('grpId' in removeThisClause) {
                reArrangeGrouping(removeIndex, removeThisClause.grpClass, removeThisClause.grpId);
            }
        }

        // make sure we have at lease one clause (for UI)
        function addEmptyClause() {
            if (ctrl.clauses.length === 0 && ctrl.setDefaultClause) {
                ctrl.addClause();
            }
        }

        // return an array of operators appropriate to the given clause's data type
        function getOperators(clause) {
            // need check for data change
            if (!clause.obsolete) {
                if (clause.filterField.type === 'string') {
                    return operatorToDispalay(ctrl.stringOperators, clause);
                } else if (clause.filterField.type === 'number') {
                    return operatorToDispalay(ctrl.numberOperators, clause);
                } else if (clause.filterField.type === 'date') {
                    return operatorToDispalay(ctrl.dateOperators, clause);
                } else if (clause.filterField.type === 'boolean') {
                    return operatorToDispalay(ctrl.booleanOperators, clause);
                } else if (clause.filterField.type === 'guid') {
                    return operatorToDispalay(ctrl.guidOperators, clause);
                } else {
                    ctrl.logger.logWarn('Field ' + clause.filterField.field + ' has unknown type: ' + clause.filterField.type);
                }
            }
        }

        function operatorToDispalay(operators, clause) {
            var allowedCompareOperators = clause.filterField.allowedCompareOperators;
            var displayOperators = [];
            if (allowedCompareOperators && allowedCompareOperators.length > 0) {
                operators.forEach(function (operator) {
                    allowedCompareOperators.indexOf(operator.id) !== -1 && displayOperators.push(operator);
                });
                if (!allowedCompareOperators.includes(clause.operator) && displayOperators.length > 0) {
                    clause.operator = displayOperators[0].id;
                }
                return displayOperators.length > 0 ? displayOperators : operators;
            } else {
                return operators;
            }
        }

        // user clicked button to reset all clauses
        function reset() {
            // clear any existing clauses 
            ctrl.clauses = [];

            // notify that user clicked reset
            if (ctrl.sitResetCallback !== undefined) {
                // callback
                ctrl.sitResetCallback();
            } else {
                // event if no callback hooked up
                $scope.$emit('sit-filter.reset');
            }

            // put back the default clauses
            ctrl.addDefaultClauses();
        }

        // user clicked button to apply clauses
        function apply() {
            // Some widgets track an object, not a single value.  Grab only the value.
            ctrl.clauses.forEach(function (clause) {
                if (clause.widget === 'sit-entity-picker' || clause.widget === 'sit-select') {
                    clause.value = clause.selectValue.id;
                } else if (clause.widget === 'sit-checkbox') {
                    clause.value = clause.checkValue[0].checked;
                }
            });

            //var foo = JSON.stringify(ctrl.clauses);
            $scope.$emit('sit-filter.apply', ctrl.clauses);
            if (ctrl.sitApplyCallback !== undefined) {
                // callback
                ctrl.sitApplyCallback({ clauses: ctrl.clauses });
            }
            //else {
            //    // event if no callback hooked up
            //    $scope.$emit('sit-filter.apply', ctrl.clauses);
            //}
        }

        // add any default filter fields to the list of clauses
        function addDefaultClauses() {
            if (ctrl.sitFilterFields) {
                ctrl.sitFilterFields.forEach(function (filterField) {
                    if (filterField.default === true) {
                        ctrl.clauses.push(ctrl.makeClause(filterField));
                    }
                });
            }

        }

        function clauseSelectionChange() {
            ctrl.isGroupingEnabled = areAdjacentClauses(ctrl) && isValidGrouping();
        }

        function areAdjacentClauses(ctrl) {
            ctrl.selectedClauses = [];
            var i = 0, selectedCount = 0, length = ctrl.clauses.length, isGroupEnabled = false, lastSelectedIndex = -1;
            for (i; i < length; i++) {
                if (ctrl.clauses[i].selected) {
                    selectedCount++;
                    if ((lastSelectedIndex !== -1) && ((i - lastSelectedIndex) > 1)) {
                        return false;
                    }
                    lastSelectedIndex = i;
                    ctrl.selectedClauses.push(ctrl.clauses[i]);
                }
            }
            isGroupEnabled = selectedCount > 1 ? true : false;
            return isGroupEnabled;
        }

        // Groups selected clauses into a particular group
        function group() {
            if (!ctrl.isGroupingEnabled) {
                return;
            }
            ++ctrl.lastGrpId;
            var i = 0, length = ctrl.selectedClauses.length;
            for (i; i < length; i++) {
                ctrl.selectedClauses[i].grpId = ctrl.lastGrpId;
                ctrl.selectedClauses[i].grpClass = 'grp';
                if (i === 0) {
                    ctrl.selectedClauses[i].grpClass += ' grp-start';
                } else if (i === length - 1) {
                    ctrl.selectedClauses[i].grpClass += ' grp-end';
                }
            }
            ++ctrl.noOfGroups;
            removeSelection();
        }

        function unGroup(grpId) {
            var i = 0, length = ctrl.clauses.length;
            for (i; i < length; i++) {
                if ('grpId' in ctrl.clauses[i] && ctrl.clauses[i].grpId === grpId) {
                    delete ctrl.clauses[i].grpId;
                    delete ctrl.clauses[i].grpClass;
                }
            }
            --ctrl.noOfGroups;
            if (ctrl.noOfGroups < 1) {
                ctrl.lastGrpId = -1;
            }

            // check if any selected clauses are eligible for grouping after the current group is deleted
            if (ctrl.selectedClauses.length > 1 && !ctrl.isGroupingEnabled) {
                clauseSelectionChange();
            }
        }

        // Function to be executed when a new clauses is added to an existing grouping
        function appendClauseToGroup(newClauseIndex) {
            ctrl.clauses[newClauseIndex].grpId = ctrl.clauses[newClauseIndex - 1].grpId;
            ctrl.clauses[newClauseIndex].grpClass = 'grp';
        }

        // Function to be executed whne a clauses is removed from grouping
        function reArrangeGrouping(removeIndex, grpClass, grpId) {
            if (getGroupCount(grpId) < 2) {
                unGroup(grpId);
                return;
            }
            if (grpClass.indexOf('grp-end') !== -1) {
                ctrl.clauses[removeIndex - 1].grpClass = grpClass;
            } else if (grpClass.indexOf('grp-start') !== -1) {
                ctrl.clauses[removeIndex].grpClass = grpClass;
            }
        }

        function getGroupCount(grpId) {
            var count = 0, i = 0, length = ctrl.clauses.length;
            for (i; i < length; i++) {
                if (ctrl.clauses[i].grpId === grpId) {
                    ++count;
                }
            }
            return count;
        }

        function isValidGrouping() {
            var i = 0, length = ctrl.selectedClauses.length;
            for (i; i < length; i++) {
                if ('grpId' in ctrl.selectedClauses[i]) {
                    return false;
                }
            }
            return true
        }

        function removeSelection() {
            ctrl.isGroupingEnabled = false;
            var i = 0, length = ctrl.clauses.length;
            for (i; i < length; i++) {
                ctrl.clauses[i].selected = false;
            }
        }

        // Initialises the marchcase and logical(andOr) operators for the filter clauses
        function initOptions() {
            ctrl.setDefaultClause = ctrl.sitFilterOptions && typeof ctrl.sitFilterOptions.showDefaultClause === 'boolean' ? ctrl.sitFilterOptions.showDefaultClause : true;
            ctrl.isMatchCaseShown = ctrl.sitFilterOptions && typeof ctrl.sitFilterOptions.showMatchCase === 'boolean' ? ctrl.sitFilterOptions.showMatchCase : true;
            ctrl.logicalOperator = ctrl.sitFilterOptions && ctrl.sitFilterOptions.allowedOperators ? ctrl.sitFilterOptions.allowedOperators.trim().toLowerCase() : 'andor';
            configureAndOrOperators(ctrl.logicalOperator);
        }

        function configureAndOrOperators(logicalOperator) {
            switch (logicalOperator) {
                case 'and': ctrl.operatorOptions = [operators.AND];
                    break;
                case 'or': ctrl.operatorOptions = [operators.OR];
                    break;
                default: ctrl.operatorOptions = [operators.AND, operators.OR]; ctrl.logicalOperator = 'andor'; break
            }
        }


        function initialize() {
            ctrl.isGroupingEnabled = false;
            ctrl.lastGrpId = -1;
            ctrl.selectedClauses =[];
            ctrl.noOfGroups = 0;
            ctrl.clauseSelectionChange = clauseSelectionChange;
            ctrl.group = group;
            ctrl.unGroup = unGroup;

            initOptions();

            if (ctrl.clauses) {
                ctrl.clauses.forEach(function (clause) {
                    clause.obsolete = true;
                });
            }
            ctrl.clauses = [];

            // create values for the pg-select widget
            if (ctrl.sitFilterFields) {
                ctrl.sitFilterFields.forEach(function (filterField) {

                    // unnecessary hasOwnProperty check?
                    if (filterField.hasOwnProperty('values') && Array.isArray(filterField.values)) {

                        // create array for the pg-select element
                        filterField.selectValues = [];
                        filterField.values.forEach(function (val) {
                            filterField.selectValues.push({
                                id: val,
                                name: val
                            });
                        });
                    } else if (filterField.type === 'boolean' && !filterField.hasOwnProperty('values')) {
                        setDefaultOption(filterField);
                    }

                });
            }

            if (!ctrl.sitClauses) {
                ctrl.addDefaultClauses();
            } else {
                setAdditionalClauseInfo(ctrl.sitClauses)
                ctrl.clauses = ctrl.sitClauses;
            }

            ctrl.addEmptyClause();
            setClauseOptions(ctrl.clauses, ctrl.isMatchCaseShown, ctrl.logicalOperator);
            ctrl.multiSelectPlaceHolder = $translate.instant('common.none');

            $scope.$watch(function () {
                return ctrl.sitClauses
            }, function (newVal, oldVal) {
                if (newVal) {
                    ctrl.clauses = newVal;
                    ctrl.allowGrouping && checkClausesForGrouping(ctrl);
                }
            });

            $scope.$watch(function () {
                return ctrl.sitFilterOptions
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    initOptions();
                    setClauseOptions(ctrl.clauses, ctrl.isMatchCaseShown, ctrl.logicalOperator);
                }
            },true);
        }

        function setAdditionalClauseInfo(clauses){
            if (!ctrl.sitFilterFields) {
                return;
            }
            clauses.forEach(function (clause) {
                if (!clause.filterField && clause.filterFieldId){
                    var filterField = _.find(ctrl.sitFilterFields, function (filterfield) { return filterfield.id === clause.filterFieldId })
                    clause.filterField = filterField;
                    if (!clause.widget) { setWidget(clause); }
                }
                clause.validation = clause.validation ? clause.validation : clause.filterField.validation;
            });
        }

        // Function for setting the groups when the sit-clauses are passed by the user ( this is based on the rule that grpId will be an integer )
        // Note that grouping is considered valid only when adjacent clauses in the array have the same group id. 
        // If a clause at index 1 and index 4 have the same group id, it will be ignored as they are not adjacent.
        function checkClausesForGrouping(ctrl) {
            var i = 0, length = ctrl.clauses.length;
            var group = [], grpId = -1;
            for (i; i < length; i++) {
                var clause = ctrl.clauses[i];
                if ('grpId' in clause) {
                    if (clause.grpId === parseInt(clause.grpId, 10) && clause.grpId > -1) {
                        // If the current clause grpId matches with the previous grpId push it to the group
                        if (grpId === clause.grpId) {
                            grpId = clause.grpId;
                            group.push(i);
                        } else {
                            if (group.length > 1) {
                                // create the group that was intialised
                                createGroup(ctrl, group);

                                // initialises the nexy group to be created
                                group = initialiseGroup(group, i)
                            } else if (group.length === 1) {
                                // Delete grpId when this is the only clauses with a particular group id
                                delete clause.grpId;
                            } else {
                                // initialises the first group
                                group = initialiseGroup(group, i)
                            }
                            grpId = clause.grpId;
                            // update lastGrpId variable so that no two groups have the same id. lastGrpId is set to the highest grpId so that it can be incremented thereon.
                            ctrl.lastGrpId = (grpId > ctrl.lastGrpId) ? grpId : ctrl.lastGrpId;
                        }
                    } else {
                        // Delete grpId when it is not an integer
                        delete clause.grpId;
                    }
                }
            }
            // This is executed when the loop exits. If there is any group remaining to be created, it will be created.
            if (group.length > 1) {
                createGroup(ctrl, group);
            } else if (group.length === 1) {
                // Delete grpId when this is the only clauses with a particular group id
                delete ctrl.clauses[group[0]].grpId;
            }
        }

        function createGroup(ctrl, group) {
            ++ctrl.noOfGroups;
            setGroupClases(group);
        }

        function initialiseGroup(group, i) {
            group = [];
            group.push(i);
            return group;
        }

        function setGroupClases(group) {
            var i = 1, length = group.length;
            ctrl.clauses[group[0]].grpClass = 'grp grp-start';
            ctrl.clauses[group[length - 1]].grpClass = 'grp grp-end';
            for (i; i < (length - 1) ; i++) {
                ctrl.clauses[group[i]].grpClass = 'grp';
            }
        }

        function setClauseOptions(clauses, isMatchShown, logicalOperator) {
            if (clauses.length > 0) {
                clauses.forEach(function (clause) {
                    clause.matchCase = isMatchShown === false ? isMatchShown : clause.matchCase;
                    clause.andOr = logicalOperator && logicalOperator !== 'andor' ? logicalOperator : clause.andOr;
                })
            }
        }

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.filter
         * @name FilterOptions#getFilterClauses
         *
         * @description
         * An API method which returns current filter clauses
         *
         * @returns {Array} filter clauses array
         */
        function getFilterClauses() {
            return ctrl.clauses;
        }

        function setAPIMethods() {
            ctrl.sitFilterOptions.getFilterClauses = ctrl.getFilterClauses;
        }

        //// add any default filter fields to the list of clauses
        //if ($scope.sitFilterFields) {
        //    $scope.sitFilterFields.forEach(function (filterField) {
        //        if (filterField.default === true) {
        //            ctrl.clauses.push(ctrl.makeClause(filterField));
        //        }
        //    });
        //}

        //ctrl.addEmptyClause();

    }

})();

/*jshint -W084, -W089, -W098 */
(function () {
    'use strict';

    /**
     * @ngdoc service
     * @module siemens.simaticit.common.widgets.filter
     * @name sitFilterService
     * 
     * @description
     * This service provides functionalities to support the {@link sitFilter} directive. 
     * 
     */
    function FilterService($parse, logger) {        
        var svc = this;
        var msPerDay = 1000 * 60 * 60 * 24;
        svc.dateConvertFailures = 0;
        svc.logger = logger.getModuleLogger('siemens.simaticit.common.widgets.filter');

        svc.convertValue = convertValue;
        svc.addTesterFunctions = addTesterFunctions;
        svc.filterArray = filterArray;
        svc.getODataFilterString = getODataFilterString;
        svc.getQuickSearchFilter = getQuickSearchFilter;
        svc.escapeODataValue = escapeODataValue;

        function escapeODataValue(value) {
            var escapedValue = value.replace(/%/g, '%25');
            escapedValue = escapedValue.replace(/'/g, '\'\'');
            escapedValue = escapedValue.replace(/&/g, '%26');
            escapedValue = escapedValue.replace(/#/g, '%23');
            escapedValue = escapedValue.replace(/\+/g, '%2B');
            return escapedValue;
        }

        // INTERNAL
        // convert the given value to the apprpriate type for the given clause
        function convertValue(valueToConvert, clause) {
           
            // TODO - try/catch for type conversion failure?
            if (clause.filterField.type === 'number') {
                return Number(valueToConvert);
            } else if (clause.filterField.type === 'date') {
                var isDateTime = clause.filterField.widget === 'sit-date-time-picker';
                // get number of ms
                var dateTimeToConvert = (valueToConvert instanceof Date) ? (valueToConvert) : (new Date(valueToConvert));
                //get complete millisecond for date-time-picker and get millisecond till date for date-picker
                var ms = isDateTime ? dateTimeToConvert.setMilliseconds(0) : dateTimeToConvert.setHours(0, 0, 0, 0);

                if (isNaN(ms)) {
                    svc.dateConvertFailures++;

                    // don't want to log many many messages to the console
                    if (svc.dateConvertFailures === 1) {
                        svc.logger.logWarn('Unable to convert value to Date: ' + valueToConvert);
                    }
                    return 0;
                }

                // convert to number of days since the epoch (1/1/1970)
                return clause.filterField.widget === 'sit-date-time-picker' ? (ms / msPerDay) : Math.floor(ms / msPerDay)
                //return new Date(valueToConvert);
            } else if (clause.filterField.type === 'boolean') {
                return Boolean(valueToConvert);
            } else if (clause.filterField.type === 'string') {
                var stringValue = String(valueToConvert);

                if (!clause.matchCase) {
                    stringValue = stringValue.toLowerCase();
                }

                return stringValue;
            }
        }

        // INTERNAL
        // take the given list of clauses and functions that will test for that condition

        function addTesterFunctions(clauses) {
            clauses.forEach(function (clause) {
                var clauseFunction;

                if (clause.operator === 'in') {
                    //convert  to string
                    var convetToStr;
                    if (typeof clause.value === "number") {
                        convetToStr = String(clause.value);
                    } else {
                        convetToStr = clause.value;
                    }
                    // clause value is comma-delimited string 
                    var clauseValues = convetToStr.split(',').map(function (clauseValue) {
                        return svc.convertValue(clauseValue, clause);
                    });

                    clauseFunction = function (testObj) {
                        // make sure the object we are testing has the property.  If not, no match
                        if (!clause.filterField.field) {
                            return false;
                        }

                        // only one needs to match
                        return clauseValues.some(function (clauseVal) {
                            var valueToConvert;
                            var clauseArr = clause.filterField.field.split('.');
                            //To do:can this be more efficient?
                            valueToConvert = testObj[clauseArr[0]];
                            for (var i = 1; i < clauseArr.length; i++) {
                                //filter for [Objects]
                                if (angular.isArray(valueToConvert)) {
                                    var j;
                                    var convertLength = valueToConvert.length;
                                    for (j = 0; j < convertLength; j++) {
                                        if (commonIn(valueToConvert[j][clauseArr[i]]) === true) {
                                            return true;
                                        }
                                    }
                                    return false;
                                }
                                valueToConvert = valueToConvert[clauseArr[i]];
                            }
                            //filter for Array
                            if (angular.isArray(valueToConvert) && !valueToConvert[0][clauseArr[clauseArr.length - 1]]) {
                                var k;
                                var aryconvertLength = valueToConvert.length;
                                for (k = 0; k < aryconvertLength; k++) {
                                    if (commonIn(valueToConvert[k]) === true) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                            return commonIn(valueToConvert);

                            function commonIn(valueToConvert) {
                                var objVal = svc.convertValue(valueToConvert, clause);
                                //var objVal = svc.convertValue(testObj[clause.filterField.field], clause);
                                return objVal === clauseVal;
                            }
                        });
                    };
                }
                else {
                    var clauseValue = svc.convertValue(clause.value, clause);

                    clauseFunction = function (testObj) {

                        if (!clause.filterField.field) {
                            return false;
                        }
                        // make sure the object we are testing has the property.  If not, no match
                        var clauseArr = clause.filterField.field.split('.');
                        var valueToConvert, nextProp;
                        while (testObj && clauseArr.length) {
                            nextProp = clauseArr.shift();
                            if (clause.operator !=='isnull' && !testObj.hasOwnProperty(nextProp) && !angular.isArray(testObj)) {
                                return false;
                            }
                            if (testObj[nextProp]) {
                                valueToConvert = (typeof testObj === 'object') ? testObj[nextProp] : testObj;
                                testObj = testObj[nextProp];
                            }
                        }

                        //filter for array and [objects]
                        if (angular.isArray(valueToConvert)) {
                            var i;
                            var convertLength = valueToConvert.length;
                            for (i = 0; i < convertLength; i++) {
                                if (valueToConvert[i][nextProp]) {
                                    if (convertAndMatch(valueToConvert[i][nextProp]) === true) {
                                        return true;
                                    }
                                }
                                else if (convertAndMatch(valueToConvert[i]) === true) {
                                    return true;
                                }

                            }
                            return false;
                        }
                        return convertAndMatch(valueToConvert);

                        function convertAndMatch(valueToConvert) {
                            var objVal ;//= svc.convertValue(valueToConvert, clause);
                            if (clause.operator === 'isnull' || clause.operator === 'isnotnull') {
                                objVal = valueToConvert;
                            } else {
                                objVal = svc.convertValue(valueToConvert, clause);
                            }
                           
                            // TODO - can compare dates this way?
                            if (clause.operator === '=') {
                                return objVal === clauseValue;
                            } else if (clause.operator === '<>') {
                                return objVal !== clauseValue;
                            } else if (clause.operator === '<') {
                                return objVal < clauseValue;
                            } else if (clause.operator === '<=') {
                                return objVal <= clauseValue;
                            } else if (clause.operator === '>') {
                                return objVal > clauseValue;
                            } else if (clause.operator === '>=') {
                                return objVal >= clauseValue;
                            } else if (clause.operator === 'contains') {
                                return objVal.indexOf(clauseValue) !== -1;
                            } else if (clause.operator === 'startsWith') {
                                return objVal.substring(0, clauseValue.length) === clauseValue;
                            } else if (clause.operator === 'endsWith') {
                                return objVal.slice(-clauseValue.length) === clauseValue;
                            } else if (clause.operator === 'isnull') {
                                 return !objVal;
                            } else if (clause.operator === 'isnotnull') {
                               return !(!objVal) ;
                            }
                        }
                    };

                }
                clause.testerFunction = clauseFunction;
            });
        }

        /**
         * @ngdoc method
         * @name sitFilterService#filterArray
         * @description
         * Filters an array of data by applying the specified filter criteria.
         * 
         * Use this method to apply filter criteria locally on the client.
         * 
         * @param {Object[]} [clauses]
         * Contains the filter criteria.
         * 
         * Each clause is a filtering operation to be applied to one data field.
         * 
         * @param {Object[]} [filterMe]
         * The data array to filter.
         * 
         * @returns {Object[]} The function returns an array of objects 
         * that match the filter criteria.
         * 
         */
        function filterArray(clauses, filterMe) {
            svc.dateConvertFailures = 0;

            // if no clauses, then no filtering
            if (clauses.length === 0) {
                return filterMe;
            }

            // add tester functions to the clauses
            svc.addTesterFunctions(clauses);

            // build expression for angular to parse and evaluate
            var resultsExpression = clauses.reduce(function (expression, clause, index) {
                var operator = '';

                if (index !== 0) {
                    if (clause.andOr === 'and') {
                        operator = ' &&';
                    } else if (clause.andOr === 'or') {
                        operator = ' ||';
                    }
                }
                return expression + operator + ' results[' + index + ']';
            }, '');

            // create expression evaluator function
            var exprEvaluator = $parse(resultsExpression);

            // evaluate each object in the array to see if it matches the filter clauses
            var filtered = filterMe.filter(function (testObj) {
                // each element in the array represents whether the test object satisfies a clause
                var resultsArray = clauses.map(function (clause) {
                    return clause.testerFunction(testObj);
                });

                // have angular evaluate the expression, given the clause test results for this object
                return exprEvaluator({ results: resultsArray });
            });

            if (svc.dateConvertFailures > 1) {
                svc.logger.logWarn('Unable to convert ' + svc.dateConvertFailures + ' values to Dates');
            }
            return filtered;
        }

        /**
         * @ngdoc method
         * @module siemens.simaticit.common.widgets.filter
         * @name sitFilterService#getODataFilterString
         * 
         * @description
         * Retrieves an OData query string based on the specified clauses.
         * 
         * Use this method to apply filter criteria when acquiring data from a server using an OData query.
         * 
         * @param {Object[]} [clauses]
         * A list of clause objects.
         * 
         * Each object represents a filter condition for a single data field. 
         * 
         * @returns {String} The function returns a string to use as the content
         * of an OData $filter query option.
         * 
         * For example, in the following OData query fragment:
         * ```
         *      $filter=startswith(LastName, 'sm')
         * ```
         * The portion provided by this function would be **startswith(LastName, 'sm')**.
         * 
         * 
         */
        function getODataFilterString(clauses) {
            var filterString = "";
            if (!clauses || clauses.length === 0) {
                return filterString;
            }


            /**
             * clause has format {
             *      filterField,    // object: { field, type, displayName, values, default, widget, validataion }
             *      andOr,          // text string: and, or  
             *      operator,       // text string: =, <>, <, <=, >, >=, in, contains, startsWith, endsWith
             *      matchCase,      // boolean: 
             *      validation,     // not needed at this point
             *      value,          // 
             * }
             */

            function getClauseString(clause) {
                var clauseString = "";

                // gets a clause string for basic compare operatations. (eq, le, ...)
                function getCompareString(operator, compareVal) {
                    var retVal = "";

                    if (compareVal === undefined) {
                        compareVal = clause.value;
                    }

                    if (clause.filterField.type === 'string') {
                        compareVal = escapeODataValue(compareVal);
                        retVal = clause.filterField.field + " " + operator + " '" + compareVal + "'";
                    } else if (clause.filterField.type === 'date') {
                        if (Object.prototype.toString.apply(compareVal) === '[object Date]') {
                            var isDateTime = clause.filterField.widget === 'sit-date-time-picker';
                            var startTime = new Date(compareVal.getTime());
                            isDateTime ? startTime.setMilliseconds(0) : startTime.setHours(0, 0, 0, 0);
                            // add 1 second worth of milliseconds in case of date-time-picker or add 24 hours worth of milliseconds in case of date picker
                            var endTime = isDateTime ? new Date(startTime.getTime() + 1000) : new Date(startTime.getTime() + (24 * 60 * 60 * 1000));

                            if (clause.operator === '=') {
                                retVal = '(' + clause.filterField.field + ' ge ' + startTime.toISOString() + ' and ' + clause.filterField.field + ' lt ' + endTime.toISOString() + ')';
                            } else if (clause.operator === '<>') {
                                retVal = '(' + clause.filterField.field + ' lt ' + startTime.toISOString() + ' or ' + clause.filterField.field + ' ge ' + endTime.toISOString() + ')';
                            } else if (clause.operator === '<') {
                                retVal = '(' + clause.filterField.field + ' lt ' + startTime.toISOString() + ')';
                            } else if (clause.operator === '<=') {
                                retVal = '(' + clause.filterField.field + ' lt ' + endTime.toISOString() + ')';
                            } else if (clause.operator === '>') {
                                retVal = '(' + clause.filterField.field + ' ge ' + endTime.toISOString() + ')';
                            } else if (clause.operator === '>=') {
                                retVal = '(' + clause.filterField.field + ' ge ' + startTime.toISOString() + ')';
                            } 
                        }
                    } else {
                        retVal = clause.filterField.field + " " + operator + " " + compareVal;
                    }

                    return retVal;
                }

                // gets a clause string for one of the substring containing functions. (contains, startswith, endswith)
                function getContainString(containFunction) {
                    var escapedValue = escapeODataValue(clause.value);
                    return containFunction + "(" + clause.filterField.field + ", '" + escapedValue + "')";
                }

                function getString(operator) {
                    return   clause.filterField.field +  " " + operator +  " null";
                }

                // gets a clause string when a field value must match a list of specified values
                function getInString() {
                    var retVal = "";

                    var i;
                    var values = clause.value.split(',');
                    if (values.length > 0) {
                        retVal = "(";
                        values.forEach(function (val, idx) {
                            if (idx > 0) {
                                retVal += " or ";
                            }
                            retVal += getCompareString('eq', val);
                        });
                        retVal += ")";
                    }

                    return retVal;
                }

                if (clause.operator === '=') {
                    clauseString = getCompareString('eq');
                } else if (clause.operator === '<>') {
                    clauseString = getCompareString('ne');
                } else if (clause.operator === '<') {
                    clauseString = getCompareString('lt');
                } else if (clause.operator === '<=') {
                    clauseString = getCompareString('le');
                } else if (clause.operator === '>') {
                    clauseString = getCompareString('gt');
                } else if (clause.operator === '>=') {
                    clauseString = getCompareString('ge');
                } else if (clause.operator === 'in') {
                    clauseString = getInString();
                } else if (clause.operator === 'contains') {
                    clauseString = getContainString('contains');
                } else if (clause.operator === 'startsWith') {
                    clauseString = getContainString('startswith');
                } else if (clause.operator === 'endsWith') {
                    clauseString = getContainString('endswith');
                } else if (clause.operator === 'isnull') {
                    clauseString = getString('eq');
                } else if (clause.operator === 'isnotnull') {
                    clauseString = getString('ne');
                }

                return clauseString;
            }

            // build full filter string by concatenating each clause string
            clauses.forEach(function (clause, idx) {
                // If clauses are grouped, apply the grouping.
                var groupStart = "";
                if ('grpId' in clause && clause.grpClass && clause.grpClass.indexOf('grp-start') !== -1) {
                    groupStart = '(';
                }
                if (idx === 0) {
                    filterString = groupStart + getClauseString(clause);
                } else {
                    filterString += " " + clause.andOr + " " + groupStart + getClauseString(clause);
                }
                if ('grpId' in clause && clause.grpClass && clause.grpClass.indexOf('grp-end') !== -1) {
                    filterString += ')';
                }
            });


            return filterString;
        }

        /**
         * @ngdoc method
         * @name sitFilterService#getQuickSearchFilter
         * @description
         * Retrieves a {@link siemens.simaticit.common.services.filterSort.FilterManager} object configured to filter data items for a specific data field.
         * 
         * @param {String} [filterField=undefined] The name of the field to use for filtering data.
         * 
         */
        function getQuickSearchFilter(filterField) {
            return new FilterManager(filterField);
        }

        /**
         * @ngdoc type
         * @name FilterManager
         * @module siemens.simaticit.common.services.filterSort
         * @description
         * Provides an API to filter a collection of data items.
         * 
         * The filtering is limited to doing a **begins with**, **contains**, or **ends with** match on a configured data field.
         * Use the ** * ** character as a wildcard before and/or after a string.
         * 
         * * test*: matches any value starting with "test".
         * * *test: matches any value ending with "test".
         * * *test*: matches any value containing "test".
         * * test: matches a value that equals "test".
         * * te*st: matches a value that equals "te*st".
         * 
         */
        function FilterManager(filterField) {
            var fm = this;
            fm.getFilteredData = getFilteredData;
            var searchType = {
                beginsWith: 0,
                contains: 1,
                endsWith: 2,
                equals: 3
            };

            var currentSearchText;
            var currentSearchType;

            // sets the search text and type to use when testing a value for a match
            // only called if filterText length > 0
            function setSearchParams(filterText) {
                if (filterText[0] === "*") {
                    if (filterText[filterText.length - 1] === "*") {
                        currentSearchType = searchType.contains;
                        currentSearchText = filterText.substr(1, filterText.length - 2);
                    } else {
                        currentSearchType = searchType.endsWith;
                        currentSearchText = filterText.substr(1);
                    }
                } else {
                    currentSearchType = searchType.beginsWith;
                    currentSearchText = filterText.substr(0, filterText.length);
                }
                currentSearchText = currentSearchText.toLowerCase();
            }

            var props = (filterField) ? (filterField.split('.')) : undefined;
            var expression = (filterField) ? ('obj') : 'obj[undefined]';
            if (props) {
                for (var pix = 0; pix < props.length; pix++) {
                    expression += '[\'' + props[pix] + '\']';
                }
            }
            var evalFieldFunc = $parse(expression);//({ obj: item });

            //
            // only called if filterText length > 0
            function matchesFilter(item) {
                var match = false;
                var index;

                var fieldVal = evalFieldFunc({ obj: item });
                if (fieldVal === undefined || fieldVal === null) {
                    fieldVal = '';
                } else {
                    fieldVal = fieldVal.toLowerCase();
                }

                switch (currentSearchType) {
                    case searchType.beginsWith:
                        match = fieldVal.indexOf(currentSearchText) === 0;
                        break;
                    case searchType.endsWith:
                        index = fieldVal.lastIndexOf(currentSearchText);
                        match = index !== -1 && index === (fieldVal.length - currentSearchText.length);
                        break;
                    case searchType.contains:
                        match = fieldVal.indexOf(currentSearchText) !== -1;
                        break;
                    case searchType.equals:
                        match = fieldVal === currentSearchText;
                        break;
                    default: break;
                }
                return match;
            }

            /**
             * @ngdoc method
             * @name FilterManager#getFilteredData
             * @description
             * Retrieves the data items from a collection where the value of the
             * configured data field begins with the specified text.
             * 
             * @param {Object[]} [data=undefined] The data to filter.
             * 
             * @param {String} [filterText=undefined] The text to match against the configured data field.
             */
            function getFilteredData(data, filterText) {
                var filteredData = [];
                if (data && data.length > 0) {
                    if (filterText !== undefined && filterText !== null && filterText.length > 0) {
                        setSearchParams(filterText);
                        var i, item;
                        for (i = 0, item; data[i]; i++) {
                            item = data[i];
                            if (matchesFilter(item, filterText)) {
                                filteredData.push(item);
                            }
                        }
                    } else {
                        filteredData = data;
                    }
                }
                return filteredData;
            }
        }

    }
    FilterService.$inject = ['$parse', 'common.services.logger.service'];
    angular.module('siemens.simaticit.common.widgets.filter').service('common.widgets.filter.service', FilterService);

})();
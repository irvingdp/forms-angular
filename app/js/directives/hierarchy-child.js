formsAngular

.directive('fngHierarchyChild', function($compile, ngDragDropService) {

    return {

        restrict: 'E',

        replace: true,

        compile: function(tElement, tAttrs, transclude) {

            return {
                post: function(scope, element, attrs) {

                    var template =
                        '<div class="hierarchy-list {{field.dataType}}" ' +
                        'jqyoui-draggable="{animate:true}" data-drag="true" data-jqyoui-options="{revert: true}">' +
                            '<div ng-switch on="toggleEditableElement">' +
                                '<div ng-switch-when="true" ng-class= "{hoverindicator: hoverLine}" data-drop="true" jqyoui-droppable="{animate:true, onDrop: \'onDrop\', onOver: \'onOver\', onOut: \'onOut\'}"> ' +
                                    '<span class="name" ng-click="toggleChildren()"><i class="{{iconType}}"></i>{{field.name}}</span>' +
                                    '<span class="label">' +
                                        '<span ng-if="field.label.length > 0">{{field.label}}</span>' +
                                        '<span ng-if="field.label == undefined">empty</span>' +
                                    '</span>' +
                                    '<span class="controls">' +
                                        '<span ng-if="field.type == \'container\'">' +
                                            '<i class="icon-plus-sign" ng-click="addChild($event, field.elementNo)"></i>' +
                                        '</span>' +
                                        //call to removeLine
                                        '<i class="icon-minus-sign" ng-click="removeLine(\'{{model}}\', {{field.elementNo}})"></i>' +
                                        '<span ng-if="field.type != \'container\'">' +
                                            '<i class="icon"></i>' +
                                        '</span>' +
                                        '<i class="icon-edit" ng-click="editElement()"></i>' +
                                    '</span>' +
                                '</div>' +
                                '<div ng-switch-when="false">' +
                                    '<form-input schema="{{schemaName}}" subschema="true" elementNo="{{field.elementNo}}" index={{index}}></form-input>' +
                                    '<button btn ng-click="updateElement()">done</button>' +
                                '</div>' +
                            '</div>' +
                            '<div class="children" ng-if="field.content">' +
                                '<span ng-if="field.content != undefined">' +
                                    '<span ng-switch on="toggleChildElement">' +
                                        '<span ng-switch-when="true">' +
                                            '<fng-hierarchy-child ng-repeat=\'field in field.content\'></fng-hierarchy-child>' +
                                        '</span>' +
                                    '</span>' +
                                '</span>' +
                            '</div>' +
                        '</div>';

                    var $template = angular.element(template);
                    $compile($template)(scope);
                    element.append($template);

                    scope.index = getIndex(scope.model, scope.field.elementNo);

                    scope.toggleChildElement = true;

                    toggleFolderIcon();

                    function toggleFolderIcon() {

                        if (scope.field.type === 'container') {

                            if (scope.toggleChildElement === true) {
                                scope.iconType = 'icon-folder-open';
                            } else {
                                scope.iconType = 'icon-folder-close';
                            }

                    } else {
                        scope.iconType = 'icon-file';
                    }

                }

                    scope.toggleChildren = function () {
                        scope.toggleChildElement =  !scope.toggleChildElement;
                        toggleFolderIcon();

                    }

                    function getIndex(model, elementNo) {

                        var record = scope.record,
                            index = -1;

                        for (var i = 0; i < record[model].length; i++) {
                            if (record[model][i]['elementNo'] === elementNo) {
                                return i;
                            }
                        }

                        return i;

                    }

                    scope.hoverLine = false;

                    scope.onDrop = function(event, ui) {

                        // event.stopPropagation();

                        var element = angular.element(event.target).scope().field;

                        var newParentElementNo = element.elementNo;

                        if (element.type === 'container') {

                            

                            var childElementNo = ui.draggable.scope().field.elementNo;

                            var index = getIndex('Hierarchy', childElementNo);

                            scope.record.Hierarchy[index].parent = newParentElementNo;



                            // ui.draggable.scope().field.parent = angular.element(event.target).scope().field.elementNo;

                            scope.parsePath();

                        }


                        scope.onOut(event, ui);



                    }

                    scope.onOver = function(event, ui) {

                        // console.log(scope.hoverLine);

                        var element = angular.element(event.target).scope().field;

                        if (element.type === 'container') {

                            scope.hoverLine = !scope.hoverLine;

                            scope.$apply();
                        }


                    }

                    scope.onOut = function(event, ui) {

                        var element = angular.element(event.target).scope().field;

                        if (element.type === 'container') {

                            scope.hoverLine = !scope.hoverLine;

                            scope.$apply();

                        }

                    }

                    scope.toggleEditableElement = (scope.field.name !== '' ? true : false);

                    scope.updateElement = function() {

                        scope.parsePath();

                        scope.toggleEditableElement = !scope.toggleEditableElement;

                    }

                    scope.editElement = function() {

                        // var index = getIndex(scope.model, field.elementNo);

                        scope.toggleEditableElement = !scope.toggleEditableElement;

                    }

                    scope.removeLine = function(model, elementNo) {

                        var record = scope.record,
                            index = -1,
                            proceed;

                        if (scope.field.content) { //its got children - do you want to delete them?
                            proceed = false;

                            scope.errorMessage = 'Error';


                            // scope.alertTitle = alertTitle ? alertTitle : "Error!";
                            // scope.errorMessage = 'errString';

                        } else {
                            proceed = true;
                        }

                        if (proceed) {

                            index = getIndex(model, elementNo)

                            if (index !== -1) {
                                scope.remove(model, index);
                            };

                        }

                    }

                    scope.addChild = function(ev, parent) {

                        var arrayField = scope.add();

                        arrayField.push({
                            elementNo: scope.getNextElementNo(arrayField),
                            parent: parent

                        });
                    }
                }
            }
        }
    };
});
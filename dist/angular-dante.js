'use strict';

angular.module('angular-dante', [])
    .directive('dante', ["$timeout", function($timeout) {
        return {
            require: 'ngModel',
            restrict: 'AE',
            scope: {
                bindOptions: '=',
                fireSave: '=fireSave',
                activateAutoSave: '=activateAutoSave',
            },
            link: function(scope, element, attrs, ctrl) {
                var elOpt = { el: element };
                var opts = {};
                var prepOpts = function() {
                    if (attrs.options) {
                        opts = scope.$eval(attrs.options);
                    }
                    var bindOpts = {};
                    if (scope.bindOptions !== undefined) {
                        bindOpts = scope.bindOptions;
                    }
                    opts = angular.extend(elOpt, opts, bindOpts);
                };
                prepOpts();

                scope.$watch('activateAutoSave', function(autoSave) {
                    if(!autoSave) return;
                    scope.store();
                });

                scope.$watch('fireSave', function(fireSave) {
                    //Hack for forced the save, have to be improved
                    if(fireSave === undefined) return;
                    ctrl.$setViewValue(scope.getContent());
                });

                scope.getContent = function() {
                    return element.find('.section-inner').html();
                }

                scope.checkForStore = function() {
                    if(!scope.content) {
                        scope.content = scope.getContent();
                        return scope.store();
                    }

                    if(scope.content === scope.getContent()) {
                        return scope.store();
                    }

                    scope.content = scope.getContent();
                    scope.$apply(function() {
                        ctrl.$setViewValue(scope.getContent());
                        return scope.store();
                    });
                }

                scope.store = function() {
                    return $timeout(function() {
                        return scope.checkForStore();
                    }, 6000);
                };

                ctrl.$render = function() {
                    if (!this.editor) {
                        this.editor = new Dante.Editor(opts);
                        this.editor.start();
                    }

                    if(!ctrl.$isEmpty(ctrl.$viewValue)) {
                        element.find('.section-inner').html(ctrl.$viewValue);
                    }
                };
            }
        };
    }]);

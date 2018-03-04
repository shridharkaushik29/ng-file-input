angular.module("ngFileInput", [])

        .directive("fileInput", [
            '$files',
            function ($files) {
                return {
                    replace: true,
                    require: "ngModel",
                    restrict: "A",
                    link: function ($scope, element, attr, ngModel) {
                        element.on('click', function () {
                            var options = {};
                            if (attr.multiple !== undefined) {
                                options.multiple = true;
                            }
                            $files.choose(options).then(function (files) {
                                ngModel.$setViewValue(files);
                            })
                        })
                    }
                }
            }
        ])

        .provider("$files", function () {
            this.$get = [
                '$q',
                function ($q) {
                    var service = {};

                    var input = angular.element("<input class=\"ng-shridhar-files\" type=\"file\">").appendTo("body").hide();

                    service.choose = function (config) {
                        var defer = $q.defer();
                        var options = _.merge(config, {});

                        if (options.multiple) {
                            input.attr('multiple', true);
                        } else {
                            input.removeAttr("multiple");
                        }

                        if (options.accept) {
                            var accept;
                            if (_.isArray(options.accept)) {
                                accept = options.accept.join(",");
                            } else {
                                accept = options.accept;
                            }
                            input.attr("accept", accept);
                        } else {
                            input.removeAttr("accept");
                        }

                        input.off("change");

                        input.one('change', function () {
                            var files;
                            if (options.multiple) {
                                files = this.files;
                            } else {
                                files = this.files[0];
                            }
                            files = service.mapInfo(files);
                            defer.resolve(files);
                            input.remove();
                        })

                        input.click();

                        return defer.promise;
                    }

                    service.mapInfo = function (files) {
                        if (files instanceof FileList) {
                            files = Array.from(files);
                        }
                        if (_.isArray(files)) {
                            _.forEach(files, function (val) {
                                val.url = URL.createObjectURL(val);
                            });
                        } else if (_.isObject(files)) {
                            files.url = URL.createObjectURL(files);
                        }
                        return files;
                    }

                    return service;
                }
            ]
        })
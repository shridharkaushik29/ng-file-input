angular.module("ngFileInput", [])

        .directive("fileInput", [
            '$files',
            function ($files) {
                return {
                    replace: true,
                    require: "ngModel",
                    restrict: "AEC",
                    template: "<input type=\"file\">",
                    link: function ($scope, element, attr, ngModel) {

                        ngModel.$parsers.push(function (value) {
                            if (value) {
                                var files;
                                if (attr.multiple !== undefined) {
                                    files = value;
                                } else {
                                    files = value[0];
                                }
                                files = $files.mapInfo(files);
                                return files;
                            } else {
                                return value;
                            }
                        });

                        element.on('change', function () {
                            ngModel.$setViewValue(this.files);
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

                    var input = angular.element("<input type=\"file\">");

                    angular.element("body").append(input);

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

                        input.hide().click();

                        input.one('change', function () {
                            var files;
                            if (options.multiple) {
                                files = this.files;
                            } else {
                                files = this.files[0];
                            }
                            files = service.mapInfo(files);
                            defer.resolve(files);
                        })

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
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
                            $files.choose().then(function (files) {
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

                    service.choose = function (config) {
                        var defer = $q.defer();
                        var options = _.merge(config, {});
                        var input = angular.element("<input type=\"file\">");

                        angular.element("body").append(input);

                        input.hide();

                        if (options.multiple) {
                            input.attr('multiple', true);
                        }

                        if (options.accept) {
                            var accept;
                            if (_.isArray(options.accept)) {
                                accept = options.accept.join(",");
                            } else {
                                accept = options.accept;
                            }
                            input.attr("accept", accept);
                        }

                        input.click();

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
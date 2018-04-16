# ng-file-input
A great library for handling files for AngularJS 1.x.

It uses <code>ng-model</code> api for handling file inputs. This library includes a directive for file inputs using any clickable element, but if you want to handle file inputs manually it also provides <code>$files</code> factory for choosing files manually.

Just forget the old traditional <code>&lt;input type="file"></code> method for choosing files.

<hr>

Dependencies:

<ul>

<li>AngularJS 1.x</li>
<li>jQuery 3.3.1 or greater</li>
<li>Lodash 4.17.5 or greater</li>

Usage:

In head:

<pre>

<script src='bower_components/jquery/dist/jquery.min.js'></script>
<script src='bower_components/lodash/dist/lodash.min.js'></script>
<script src='bower_components/angular/angular.min.js'></script>
<script src='bower_components/ng-file-input/ng-file-input.js'></script>

</pre>

Add dependency:

<pre>

angular.module("myApp", ["ngFileInput"])

</pre>

<b>Using Directive:</b>

<small>Single File</small>
<pre>

&lt;button file-input ng-model="file"></button>

&lt;img ng-src="{{file.url}}">

</pre>

<small>Multiple Files</small>
<pre>

&lt;button file-input multiple="true" ng-model="files"></button>

&lt;img ng-repeat="file in files" ng-src="{{file.url}}">

</pre>

<b>Note: The multiple attribute is watched for changes, so yoiu can use any scope variable there.</b>

<b>Using Factory: </b>

<pre>

angular.module("myApp")

      .controller("ctrl",function($files){
            $scope.chooseFile = function(){
                $files.choose({
                    multiple: true, // true for mutiple files, default is false.
                    accepts: ['.jpg','.png','.gif'] // An array containing the extensions you want to be accepted
                }).then(function(files){
                    //Do whatever you want to do with the files
                    console.log(files);
                })
            }
      })

</pre>

/*!
 * angular-directive-boilerplate
 * https://github.com/mohsen1/angular-directive-boilerplate
 * Version: 0.0.7 - 2014-10-06T23:00:10.537Z
 * License: MIT
 */


'use strict';

var module = angular.module('mohsen1.json-schema-view', ['RecursionHelper']);

module.directive('jsonSchemaView', function (RecursionHelper) {
  function link($scope) {
    $scope.isCollapsed = false;

    /*
     * Toggles the 'collapsed' state
    */
    $scope.toggle = function() {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    /*
     * Determines if a property is a primitive
    */
    $scope.isPrimitive = function(property){
      return ['string', 'boolean', 'integer', 'int'].indexOf(property.type) > -1;
    };
  }
  return {
    restrict: 'E',
    templateUrl: 'json-schema-view.html',
    replcae: true,
    scope: {
      'schema': '='
    },
    compile: function(element) {

      // Use the compile function from the RecursionHelper,
      // And return the linking function(s) which it returns
      return RecursionHelper.compile(element, link);
    }
  };
});

module.directive('primitiveProperty', function (RecursionHelper) {
  function link($scope) {

    /*
     * Returns true if property is required in given schema
    */
    $scope.isRequired = function(property, schema) {
      schema = schema || $scope.$parent.schema;

      if (Array.isArray(schema.required) && property.name) {
        return schema.required.indexOf(property.name) > -1;
      }

      return false;
    };

    /*
     * Checks and see if an object (_obj_) has a member with _propName_ name
    */
    $scope.has = function(obj, propName) {
      return Object.keys(obj).indexOf(propName) > -1;
    };
    }
  return {
    restrict: 'E',
    templateUrl: 'primitive.html',
    replcae: true,
    scope: {
      property: '='
    },
    compile: function(element) {

      // Use the compile function from the RecursionHelper,
      // And return the linking function(s) which it returns
      return RecursionHelper.compile(element, link);
    }
  };
});
'use strict';

// from http://stackoverflow.com/a/18609594
angular.module('RecursionHelper', []).factory('RecursionHelper', ['$compile', function($compile){
  return {
    /**
     * Manually compiles the element, fixing the recursion loop.
     * @param element
     * @param [link] A post-link function, or an object with function(s)
     * registered via pre and post properties.
     * @returns An object containing the linking functions.
     */
    compile: function(element, link){
      // Normalize the link parameter
      if(angular.isFunction(link)){
        link = { post: link };
      }

      // Break the recursion loop by removing the contents
      var contents = element.contents().remove();
      var compiledContents;
      return {
        pre: (link && link.pre) ? link.pre : null,
        /**
         * Compiles and re-adds the contents
         */
        post: function(scope, element){
          // Compile the contents
          if(!compiledContents){
            compiledContents = $compile(contents);
          }
          // Re-add the compiled contents to the element
          compiledContents(scope, function(clone){
            element.append(clone);
          });

          // Call the post-linking function, if any
          if(link && link.post){
            link.post.apply(null, arguments);
          }
        }
      };
    }
  };
}]);

angular.module("mohsen1.json-schema-view").run(["$templateCache", function($templateCache) {$templateCache.put("json-schema-view.html","<div class=\"json-schema-view\" ng-class=\"{collapsed: isCollapsed}\"><a class=\"toggler\" ng-click=\"toggle()\"></a> <span class=\"title\" ng-click=\"toggle()\">{{schema.title}}</span> <span class=\"opening brace\">{</span><div class=\"description\">{{schema.description}}</div><div class=\"property\" ng-repeat=\"property in schema.properties\"><span class=\"name\">{{property.name}}</span> <span class=\"colon\">:</span><primitive-property ng-if=\"isPrimitive(property)\" property=\"property\"></primitive-property><span ng-if=\"property.type === \'array\'\" class=\"opening bracket\">Array [</span><json-schema-view ng-if=\"property.type === \'array\'\" schema=\"property.items\"></json-schema-view><span ng-if=\"property.type === \'array\'\" class=\"closing bracket\">]</span></div><span class=\"closeing brace\">}</span></div>");
$templateCache.put("primitive.html","<span class=\"primitive\"><span class=\"type\">{{property.type}}</span> <span class=\"required\" ng-if=\"isRequired(property, schema)\">*</span> <span class=\"format\" ng-if=\"!isCollapsed && has(property, \'format\')\">({{property.format}})</span> <span class=\"range minimum\" ng-if=\"!isCollapsed && has(property, \'minimum\')\">minimum:{{property.minimum}}</span> <span class=\"range maximum\" ng-if=\"!isCollapsed && has(property, \'maximum\')\">maximum:{{property.maximum}}</span></span>");}]);
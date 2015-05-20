angular.module('tag.search', ['ngNewRouter'])
  .controller('tagSearchController', ['$scope', '$location', '$http', '$router', 'TagFn', TagSearchControllerFn])
  .directive('tagSearch', ['$location', '$http', '$timeout', tagSearchFn]);

var Ra = require('ramda');

function TagSearchControllerFn($scope, $location, $http, $router, TagFn) { "use strict";

  var previous_matched;
  var previous_page;

  var refreshTags = angular.bind(this, function (tagObject) {
    angular.extend(this, tagObject);

    if (this.words && this.partial !== Ra.last(this.words) && !angular.equals(previous_matched, this.matched)) {
      // direct to search page with tag params
      $location.url($router.generate('search', { queryParams: { tags: this.matched }}));
      previous_matched = this.matched;
    }
  });

  var tagString = angular.bind(this, function () {
    return this.string;
  });

  // redirect and reset cached variables
  var redirectBack = angular.bind(this, function () {
    this.partial  = false;
    previous_matched = false;
    $location.url(previous_page);
  });

  var updateTagModule = angular.bind(this, function () {
    // cache previous_page url when leaving non search page
    if ($location.path() !== '/search') {
      previous_page = $location.url();
    } else {
      this.captureFocus();
    }
    var updated_params = $location.search()["tags[]"];
    this.string = updated_params ? parseParams(updated_params) : '';
  });

  function parseParams(params) {
    return params.toString().replace(/,/g, ' ');
  }

  function pageUrl () {
    return $location.url();
  }

  TagFn.then(refreshTags);

  $scope.$watch(pageUrl, updateTagModule);

  $scope.$watch(tagString, function (newValue, oldValue) {
    if (!newValue && !!oldValue) { 
      redirectBack();      
    }
    if (newValue && newValue !== oldValue) {
      TagFn.then(function (fn) {
        refreshTags(fn.parse(newValue));
      });
    }
  });
}

function tagSearchFn ($location, $http, $timeout) {
  return {
    restrict: 'A',
    scope: true,
    controller: 'tagSearchController',
    controllerAs: 'tag',
    templateUrl: 'directives/tag/tag.html',
    link: function(scope, element, attrs) {

      var parent_element = element[0];
      var keymap = { 38: -1, 40: 1 };
      var list = parent_element.getElementsByTagName('li');

      scope.tag.captureFocus = function () {
        parent_element.querySelector('#search-input').focus();
      };

      scope.tag.selectTag = function (tag) {
        scope.tag.string = scope.tag.string.replace(/\S+$/, tag);
        scope.tag.captureFocus();
      };

      function focusButton(list, id) {
        list[id].getElementsByTagName('button')[0].focus();
      }

      parent_element.getElementsByTagName('input')[0].addEventListener('keydown', function (event) {
        var i = 0;
        if (event.keyCode === 40) {
          event.preventDefault();
          parent_element.getElementsByTagName('ul')[0].addEventListener('keydown', function (event) {
            var pos = i + keymap[event.keyCode];
            if (pos >= 0 && pos < list.length) {  
              event.preventDefault();
              focusButton(list, i = pos);
            }
          });
          focusButton(list, i);
        }
      });
    }
  };
}

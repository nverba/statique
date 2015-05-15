angular.module('tag.search', ['ngNewRouter'])
  .controller('tagSearchController', ['$scope', '$location', '$http', '$router', TagSearchControllerFn])
  .directive('tagSearch', ['$location', '$http', '$timeout', tagSearchFn]);

var _ = require('lodash');

function TagSearchControllerFn($scope, $location, $http, $router) {

  var previous_tags;
  var previous_page;

  var allocateTags = angular.bind(this, function (response) {
    this.tags_index = _.keys(response.data);
  });

  var tagString = angular.bind(this, function () {
    return this.string;
  });

  var updateTags = angular.bind(this, function (tag_string) {
    var tags = _.uniq(tag_string.split(/[, ]+/));

    // set tag directive scoped properties
    this.partials = difference(tags, this.tags_index);
    this.partial  = _.last(this.partials);
    this.filter   = tagFilter(this.partial, tags);

    var matching_tags = difference(tags, this.partials);

    if (this.partial !== _.last(tags) && !angular.equals(previous_tags, matching_tags)) {
      // direct to search page with tag params
      $location.url($router.generate('search', { queryParams: { tags: matching_tags }}));
      previous_tags = matching_tags;
    }
  });

  // redirect and reset cached variables
  var redirectBack = angular.bind(this, function () {
    this.partial  = false;
    previous_tags = false;
    $location.url(previous_page);
  });

  // return source items not in reference, case insensitive
  function difference(source, reference) {
    return _.filter(source, function (item) {
      return !hasIn(reference, item);
    });
  }

  // collection has case insensitive match
  function hasIn(source, matcher) {
    return _.find(source, function (item) {
      return matchIn(item).test(matcher);
    });
  }

  // match case insensitive partials
  function matchInPart(string) {
    return new RegExp(['^' + string], 'i');
  }

  // match case insensitive string
  function matchIn(string) {
    return new RegExp(['^' + string + '$'], 'i');
  }

  function tagFilter(partial, tags) {
    return function (tag) {
      // suggested tag is not in active tags && partial matches start of tag
      return !hasIn(tags, tag) && matchInPart(partial).test(tag);
    };
  }

  function parseParams(params) {
    return params.toString().replace(/,/g, ' ');
  }

  $http.get('./build/indexes/tags/tags.json').then(allocateTags);

  function pageUrl () {
    return $location.url();
  }

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

  $scope.$watch(pageUrl, updateTagModule);

  $scope.$watch(tagString, function (newValue, oldValue) {
    if (!newValue && !!oldValue) { 
      redirectBack();      
    }
    if (newValue && newValue !== oldValue) {
      updateTags(newValue);
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

      scope.tag.captureFocus = function () {
        element[0].querySelector('#search-input').focus();
      };

      scope.tag.selectTag = function (tag) {
        scope.tag.string = scope.tag.string.replace(/\S+$/, tag);
        scope.tag.captureFocus();
      };
    }
  };
}

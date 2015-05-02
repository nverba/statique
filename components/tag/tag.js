'use strict';

var _ = require('lodash');

angular.module('tag.component', ['ngNewRouter'])
  .controller('TagController', ['$http', '$rootScope', '$router', '$location', TagControllerFn])
  .directive('focusInput', [FocusInputDirectiveFn]);

var PATH_HISTORY;
var LOCATION;

function TagControllerFn($http, $rootScope, $router, $location) {

  var last_tags = [];
  this.unmatched_word = '';
  this.tags = [];
  this.filter = {};

  this.searchString = angular.bind(this, function searchStringFn() {
    return this.search_string;
  });

  // Prevent reinitialising on extra calls by router...   bug with router atm.

  if ($location.url() === LOCATION) { this.search_string = ''; return; }
  LOCATION = $location.url();

  if ($location.path() !== '/search') {
    PATH_HISTORY = $location.url();
  }

  var params = ($location.search()["tags[]"] || '').toString().replace(/,/g, ' ');

  var updateTags = angular.bind(this, function (newValue, oldValue) {

    if (!newValue && $location.path() === '/search') {
      $location.url(PATH_HISTORY || '/posts');
    }

    if (!newValue) { return; } 

    var words = _.uniq(_.words(newValue)); 

    this.init.then(function (tags_index) {

      this.unmatched_word = _.last(_.difference(words, tags_index));
      this.tags        = _.without(words, this.unmatched_word);
      this.filter      = filterTags(this.unmatched_word, this.tags);

      if (!this.unmatched_word) {
        $location.url($router.generate('search', { queryParams: { tags: this.tags }  }));
        last_tags = this.tags;
      }
    }.bind(this));

  });

  var allocateTags = angular.bind(this, function (response) {
    return (this.tags_index = _.keys(response.data));
  });

  function filterTags(unmatched_word, matched) {
    return function (tag) {
      return _.indexOf(matched, tag) < 0 && (new RegExp(['^' + unmatched_word], 'i')).test(tag);
    };
  }

  this.addTag = function addTagFn(tag) {
    this.search_string = this.search_string.replace(/\S+$/, tag + ' ');
  };

  $rootScope.$watchCollection(this.searchString, updateTags);
  this.init = $http.get('./build/indexes/tags/tags.json').then(allocateTags);
  this.search_string = params ? params + ' ' : '';

}

// DIRECTIVE FUNCTIONS

var INPUT_FOCUS;

function FocusInputDirectiveFn() {
  return {
    restrict: 'A',
    scope: true,
    link: focusInputLink
  };

  function focusInputLink(scope, $element, attrs) {

    if (INPUT_FOCUS) {
      $element[0].focus();
    }

    $element[0].addEventListener('focus', function (event) {
      INPUT_FOCUS = true;
    });

    $element[0].addEventListener('blur', function (event) {
      INPUT_FOCUS = false;
    });

    scope.$watchCollection('tag.search_string', function (newValue) {
      
      if (newValue.length) {
        $element[0].focus();
      }

    });

  }
}

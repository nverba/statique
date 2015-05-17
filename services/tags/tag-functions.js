'use strict';

var Ra = require('ramda');

angular.module('tag.functions', ['ngNewRouter', 'ngSanitize'])
  .factory('TagFn', ['$http', TagFunctionsFn]);

function TagFunctionsFn ($http) {

  var tagFn = {};

  function caseInMatchFn(str1, str2) {
    return str1.toLowerCase() === str2.toLowerCase();
  }

  tagFn.parse = function (search_string) {

    var difference = Ra.differenceWith(caseInMatchFn, Ra.uniq(search_string.split(/[, ]+/)));

    tagFn.words     = Ra.uniq(search_string.split(/[, ]+/));
    tagFn.unmatched = difference(tagFn.index);
    tagFn.partial   = Ra.last(tagFn.unmatched);
    tagFn.matched   = difference(tagFn.unmatched);

    var regexPartial = new RegExp(['^' + tagFn.partial], 'i');

    tagFn.tagFilter = function (tag) {
      // suggested tag is not in active tags && partial matches start of tag
      var result = !Ra.containsWith(caseInMatchFn, tag, tagFn.matched) && regexPartial.test(tag);
      return result;
    };

    return tagFn;
  };

  var allocateTags = angular.bind(this, function (tags) {
    tagFn.index = Ra.keys(tags.data);
    return tagFn;
  });

  return $http.get('./build/indexes/tags/tags.json').then(allocateTags);
}

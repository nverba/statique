'use strict';

var Ra = require('ramda');

angular.module('search.component', ['ngNewRouter', 'statique:filters'])
  .controller('SearchController', ['$rootScope', '$location', '$http', '$q', SearchControllerFn]);

var tag_cache = {};

function SearchControllerFn($rootScope, $location, $http, $q) {

  var arrayLowerCase = Ra.map(function (string) {
    return string.toLowerCase();
  });

  // count in & weed out the duplicates for ordering
  var countUniq = Ra.uniqWith(function(a, b) {
    if (a.title === b.title) {
      b.count = b.count ? b.count + 1 : 2;
      return true;
    }
  });

  var params = $location.search()["tags[]"];
  // coerce to array, params can be single string or array of strings
  var params_array  = params ? [].concat(params) : [];
  var unloaded_tags = Ra.difference(params_array, Ra.keys(tag_cache));
  var activeTagsOf  = Ra.pick(params_array);

  this.params = params_array;
  this.match_params = arrayLowerCase(this.params);

  var fetch = Ra.map(function (name) {
    return $http.get('./build/tags/' + name.toLowerCase() + '.json').then(function (result) {
      tag_cache[name] = result.data;
    });
  });

  var allocateResults = angular.bind(this, function () {
    this.results = countUniq(Ra.flatten(Ra.values(activeTagsOf(tag_cache))));
  });
 
  // When all tags loaded
  $q.all(fetch(unloaded_tags)).then(allocateResults);
}

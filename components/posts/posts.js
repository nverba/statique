'use strict';

angular.module('posts.component', ['ngNewRouter', 'statique:filters'])
  .controller('PostsController', ['$http', '$location', PostsControllerFn]);

function PostsControllerFn($http, $location) {

  var allocatePosts = angular.bind(this, function (result) {
    this.page = result.data;
  });

  function fetchPosts(id) {
    return $http.get('./build/indexes/posts/' + id + '.json');
  }

  fetchPosts($location.search().page || 0).then(allocatePosts);
 
}

'use strict';

angular.module('posts.component', ['ngNewRouter', 'statique:filters'])
  .controller('PostsController', ['$http', '$location', PostsControllerFn]);

function PostsControllerFn($http, $location) {

  function fetchPosts(id) {
    return $http.get('./build/indexes/posts/' + id + '.json');
  }

  var allocatePosts = function (result) {
    this.page = result.data;
  }.bind(this);

  fetchPosts($location.search().page || 0).then(allocatePosts);
 
}

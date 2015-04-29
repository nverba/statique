require('angular');
require('angular-sanitize');
require('./router.es5.js'); // use modified "working" version of angular-new-router till 1.0 released.

require('./filters.js');
require('../../components/tag/tag.js');
require('../../components/post/post.js');
require('../../components/posts/posts.js');
require('../../components/search/search.js');

angular.module('statique', ['ngNewRouter', 'posts.component', 'post.component', 'search.component', 'tag.component'])
  .controller('RouteController', ['$router', RouteController]);

function RouteController($router) {

  $router.config([
    { path: '/', redirectTo: '/posts' },
    { 
      path: '/posts',
      components: {
        'default': 'posts',
        'tags': 'tag'
      }
    },
    { 
      path: '/post/:id',
      components: {
        'default': 'post',
        'tags': 'tag'
      }
    },
    { 
      path: '/search',
      components: {
        'default': 'search',
        'tags': 'tag'
      }
    }
  ]);
}

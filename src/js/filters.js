angular.module('statique:filters', [])
  .filter('parseLink', function(){
    return function (post) {
      if (!post) { return; }
      return post.date + '-' + post.title.replace(/\s+/g, '-').toLowerCase();
    };
  }).filter('parseDate', function(){
    return function (text) {
      if (!text) { return; }
      return new Date(text.slice(0, 10));
    };
  });

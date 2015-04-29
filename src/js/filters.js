angular.module('statique:filters', [])
  .filter('parseKey', function(){
    return function (text) {
      if (!text) { return; }
      return text.replace(/_/g, '-').toLowerCase();
    };
  }).filter('parseUrlDate', function(){
    return function (text) {
      if (!text) { return; }
      return new Date(text.slice(0, 10));
    };
  });

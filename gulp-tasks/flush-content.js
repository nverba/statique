var gulp = require('gulp');
var del  = require('del');

gulp.task('flush:content', function (cb) {
  del([
    'build/indexes/posts/*.*',
    'build/indexes/tags/*.*',
    'build/tags/*.*'
  ], cb);
});

var gulp = require('gulp');

gulp.task('build:source', ['build:index', 'build:js', 'build:css']);
gulp.task('build:posts', ['build:flush', 'build:posts', 'build:tags']);

gulp.task('watch:source', ['build:source'], function() {
  gulp.watch(['./components/**/*', './src/**/*', './statique-config.json'], ['build:source']);
});

gulp.task('watch:posts', ['build:posts'], function() {
  gulp.watch(['./posts/**/*'], ['build:posts']);
});

gulp.task('default', ['build:posts']);

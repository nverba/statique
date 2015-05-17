var gulp = require('gulp');

gulp.task('build:source', ['build:index', 'build:js', 'build:css']);
gulp.task('build:content', ['flush:content', 'build:posts', 'build:tags']);

gulp.task('watch:source', ['build:source'], function() {
  gulp.watch(['./components/**/*', './directives/**/*', './services/**/*', './src/**/*', './statique-config.json'], ['build:source']);
});

gulp.task('watch:posts', ['build:content'], function() {
  gulp.watch(['./posts/**/*'], ['build:content']);
});

gulp.task('default', ['build:content']);

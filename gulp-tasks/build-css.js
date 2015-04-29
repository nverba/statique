var gulp   = require('gulp');
var sass   = require('gulp-sass');
var inject = require('gulp-inject');

gulp.task('build:scss', function () {

  // Collect all .scss file names from components and inject into main.scss

  return gulp.src('./src/scss/main.scss')
    .pipe(inject(
      gulp.src(['./components/**/*.scss'], {read: false}), {
        relative: true,
        starttag: '/* {{name}}:{{ext}} */',
        endtag: '/* endinject */',
        transform: function (filepath) {
          return filepath === 'main.scss' ? '' : '@import "' + filepath + '";';
        }
      }
    ))
  .pipe(gulp.dest('./src/scss/'));
});

// use sass plugin to buils css files from main.scss
 
gulp.task('build:css', ['build:scss'], function () {
  gulp.src('./src/scss/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('./build/css'));
});

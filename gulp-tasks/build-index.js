var gulp    = require('gulp');
var inject  = require('gulp-inject');
var sass    = require('gulp-sass');
var gutil   = require('gulp-util');
var config  = require('../statique-config.json');
var replace = require('gulp-replace');

// build root index.html from src/index.html, embedd profile image as base64 and above the fold src/template.scss.

gulp.task('build:index', function () {

  var scssSrc = gulp.src(['./src/scss/template.scss'], {read: true}).pipe(sass());
  var imgSrc  = gulp.src(config.profileImage, {read: true});

  return gulp.src('./src/index.html')
    .pipe(inject(scssSrc, {
      starttag: '/* {{name}}:{{ext}} */',
      endtag: '/* endinject */',
      transform: function (filepath, file) {
        return file.contents.toString();
      }
    }))
    .pipe(inject(imgSrc, {
        starttag: '<!-- profile:img -->',
        endtag: '<!-- endinject -->',
        relative: true,
        transform: function (filepath, file) {
          return '<img alt="Profile Image" src="data:image/png;base64,' + file.contents.toString('base64') + '" />';
        }
      }
    ))
    .pipe(replace(/<!-- statique:title -->/, config.title))
    .pipe(replace(/<!-- statique:name -->/, config.name))
    .pipe(replace(/<!-- statique:tagline -->/, config.tagline))
    .pipe(gulp.dest('./'));
});

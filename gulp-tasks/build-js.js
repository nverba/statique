// BUILD JAVASCRIPT 

var gulp       = require('gulp');
var browserify = require('browserify');
var uglify     = require('gulp-uglify');
var streamify  = require('gulp-streamify');
var source     = require('vinyl-source-stream');

// use browserify to build build/main.js from src/app.js with injected deps.

gulp.task('build:js', function() {

  var bundleStream = browserify({ entries: './src/js/app.js', debug: false }).bundle();
 
  bundleStream
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(source('main.js'))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('./build/js'));
});

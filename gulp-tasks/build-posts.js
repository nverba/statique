var gulp           = require('gulp');
var map            = require('vinyl-map');
var fm             = require('html-frontmatter');
var ext_replace    = require('gulp-ext-replace');
var groupAggregate = require('gulp-group-aggregate');

var src  = './posts/*.md';
var dest = './build/indexes/posts';

gulp.task('build:posts', ['flush:content'], function () {

  var i = 0;
  var posts_per_page = 10;

  function createBufferFile(source, group, i) {

    var page      = { posts: source };
    group         =  parseInt(group, 10);
    page.previous = group === 0 ? false : (group - 1).toString(10);
    page.next     = group === Math.ceil(i / posts_per_page) -1 ? false : (group + 1).toString(10);

    return new Buffer(JSON.stringify(page), "utf-8");
  }

  var extractFrontmatter = map(function(code) {
    var data = fm(code.toString());
    return data ? JSON.stringify(data) : "{}";
  });

  var group = groupAggregate({

    group: function () {
      return Math.floor(i++ / posts_per_page); // group in batches
    },
    aggregate: function (group, files) {
      
      var output = files.map(function (file) {
        return JSON.parse(file.contents.toString());
      });

      return {
        path: group + '.json',
        contents: createBufferFile(output, group, i)
      };
    }
  });

  return gulp.src(src)
    .pipe(extractFrontmatter)
    .pipe(ext_replace('.json'))
    .pipe(group)
    .pipe(gulp.dest(dest));

});

var gulp        = require('gulp');
var jsoncombine = require('gulp-jsoncombine');
var fs          = require('fs');

var src  = ['./build/indexes/posts/*.json'];
var dest = './build/indexes/tags';
var tags_loc = './build/tags/';

gulp.task('build:tags', ['build:posts'], function () {

  function compileTagsFn(data) {

    var tags = {};

    // Iterate post tags & create tag array & push post permalink path data

    function getTags(post) {

      function allocateTags(tag) {
        tags[tag] = tags[tag] || [];
        tags[tag].push(post.key);
      }

      post.tags.forEach(allocateTags);
    }

    // Iterate data & Pass each post to getTags

    for (var filename in data) {
      data[filename].posts.forEach(getTags);
    }

    // For completed tags object element, create new file in tags directory,
    // then, replace tag path data with .length, i.e. number of documents referencing that tag

    for (var tag in tags) {
      fs.writeFile(tags_loc + tag.toLowerCase() + '.json', JSON.stringify(tags[tag]));
      tags[tag] = tags[tag].length;
    }

    // Return tags as buffer to be passed to dest

    return new Buffer(JSON.stringify(tags), "utf-8");
  }

  return gulp.src(src)
    .pipe(jsoncombine("tags.json", compileTagsFn))
    .pipe(gulp.dest(dest));

});

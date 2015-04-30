var gulp   = require('gulp');
var faker  = require('faker');
var del    = require('del');
var fs     = require('fs');
var config =  require('../statique-config.json');

var numberOfPosts = 40;

gulp.task('fake:data', ['flush:fake'], function () {

  var tags = ["php", "javascript", "html", "css", "jquery", "angularjs", "chrome", "http", "svg", "photoshop", "canvas", "png", "icons", "graphics", "ajax", "ember", "backbone"];

  var author = faker.name.firstName();

  for(var x=0; x<numberOfPosts; x++) {

    var random_tags = {};
    for (var i=0; i <=3; i++) {
      random_tags[faker.random.array_element(tags)] = true;
    }

    var date  = faker.date.past().toISOString().slice(0, 16).replace(/T/, '-').replace(/:/, '');
    var title = faker.company.catchPhrase().replace(/\//, '-');
    var key   = date + '-' + title.replace(/-/g, '_').replace(/\s+/g, '-');
    var permalink = date + '-' + title.replace(/\s+/g, '-').toLowerCase();

var fake_data = "<!--\n\
title: " + title.charAt(0).toUpperCase() + title.slice(1) + "\n\
author: " + author + "\n\
date: " + date + "\n\
permalink: " + config.rootUrl + "#/post/"  + permalink + "\n\
key: " + key + "\n\
tags: [" + Object.keys(random_tags).toString() + "]\n\
-->\n\
\n" + faker.lorem.paragraphs();

    fs.writeFile('./posts/' + permalink + '.md', fake_data);

  }
});

gulp.task('flush:fake', function (cb) {
  del([
    'posts/*.*'
  ], cb);
});

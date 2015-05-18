var gulp   = require('gulp');
var faker  = require('faker');
var del    = require('del');
var fs     = require('fs');
var config =  require('../statique-config.json');

var numberOfPosts = 40;

gulp.task('fake:data', ['flush:fake'], function () {

  var tags = ["PHP", "JavaScript", "HTML", "CSS", "JQuery", "Angularjs", "Chrome", "HTTP", "SVG", "Photoshop", "canvas", "PNG", "icons", "graphics", "ajax", "Ember", "Backbone", "HTML5", "design", "UX", "IX", "search", "Regex", "free", "premium", "FOSS", "params", "system", "source", "2015", "ES6", "directive", "controller", "inject", "service", "factory", "scope", "digest", "kittens", "unicorns", "rainbows", "beards", "Technology", "hacks", "make", "NPM", "templates", "bears", "Windows", "Linux", "OSX", "IOS", "Android", "JVM", "CSS3"];

  var author = faker.name.firstName();

  for(var x=0; x<numberOfPosts; x++) {

    var random_tags = {};
    for (var i=0; i <=3; i++) {
      random_tags[faker.random.array_element(tags)] = true;
    }

    var date  = faker.date.past().toISOString().slice(0, 16).replace(/T/, '-').replace(/:/, '');
    var title = faker.company.catchPhrase().replace(/\//, '-');
    var link = date + '-' + title.replace(/\s+/g, '-').toLowerCase();

var fake_data = "<!--\n\
title: " + title.charAt(0).toUpperCase() + title.slice(1) + "\n\
author: " + author + "\n\
date: " + date + "\n\
link: " + link + "\n\
tags: [" + Object.keys(random_tags).toString() + "]\n\
-->\n\
\n" + faker.lorem.paragraphs();

    fs.writeFile('./posts/' + link + '.md', fake_data);

  }
});

gulp.task('flush:fake', function (cb) {
  del([
    'posts/*.*'
  ], cb);
});

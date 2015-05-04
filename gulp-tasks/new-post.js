var gulp   = require('gulp');
var argv   = require('yargs').argv;
var config =  require('../statique-config.json');
var fs     = require('fs');

gulp.task('new:post', function () {

var date = new Date().toISOString().slice(0, 16).replace(/T/, '-').replace(/:/, '');
var key = date + '-' + argv.title.replace(/-/g, '_').replace(/\s+/g, '-');
var permalink = date + '-' + argv.title.replace(/\s+/g, '-').toLowerCase();

var new_post = "<!--\n\
title: " + argv.title + "\n\
author: " + config.name + "\n\
date: " + date + "\n\
permalink: " + config.rootUrl + "#/post/"  + permalink + "\n\
key: " + key + "\n\
tags: []\n\
-->\n\
\n";

  fs.writeFile('./posts/' + permalink + '.md', new_post);

});







'use strict';
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var config = {
  html: 'src/index.html',
  js: 'src/**/*.js',
  scss: 'src/**/*.scss',

  distCssFiles: 'dist/css/*.css',

  dist: 'dist/',
  distCss: 'dist/css/'
};

gulp.task('inject', ['sass'], function(){
  var target = gulp.src(config.html);
  var sources = gulp.src([config.distCssFiles], {read: false});
  return target.pipe(plugins.inject(sources))
          .pipe(gulp.dest(config.dist));
});

gulp.task('sass', function(){
  return gulp.src(config.scss)
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest(config.distCss));
});

gulp.task('watch', function(){

})
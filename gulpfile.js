(function() {
    'use strict';
    var gulp = require('gulp');
    var $ = require('gulp-load-plugins')();
    var del = require('del');

    var config = {
        html: 'src/index.html',
        js: 'src/**/*.js',
        scss: 'src/**/*.scss',

        distCss: 'dist/**/*.css',

        dist: 'dist/'
    };

    gulp.task('inject', ['sass'], function() {
        var target = gulp.src(config.html);
        var sources = gulp.src([config.distCss], {
            read: false
        });
        return target.pipe($.inject(sources))
            .pipe(gulp.dest(config.dist));
    });

    gulp.task('sass', function() {
        return gulp.src(config.scss, {base: './src'})
            .pipe($.sass().on('error', $.sass.logError))
            .pipe(gulp.dest(config.dist));
    });

    gulp.task('js', function(){
      return gulp.src(config.js, {base: './src'})
                .pipe($.jscs({fix: true}))
                .pipe($.jscs.reporter())
                .pipe($.jscs.reporter('fail'))
                // .pipe($.jshint())
                // .pipe($.jshint.reporter('jshint-stylish'))
                // .pipe($.jshint.reporter('fail'));

    });

    gulp.task('clean', function(){
      return del(config.dist);
    });

    gulp.task('watch', function() {

    });
})();

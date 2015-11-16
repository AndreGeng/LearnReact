(function() {
    'use strict';
    var gulp = require('gulp');
    var $ = require('gulp-load-plugins')();
    var del = require('del');
    var source = require('vinyl-source-stream');
    var buffer = require('vinyl-buffer');
    var browserify = require('browserify');
    var watchify = require('watchify');
    var browserSync = require('browser-sync');
    var reload = browserSync.reload;
    var reactify = require('reactify');

    var config = {
        indexHtml: 'src/index.html',
        html: ['src/**/*.html', '!src/index.html'],
        js: 'src/**/*.jsx',
        scss: 'src/**/*.scss',

        entry: 'src/comment_box.jsx',

        distCss: 'dist/**/*.css',
        distJs: 'dist/**/*.js',
        distHtml: ['dist/**/*.html', '!dist/index.html'],

        dist: 'dist/'
    };

    gulp.task('cpHtml', function(){
        del.sync(config.distHtml);
        return gulp.src(config.html)
            .pipe(gulp.dest(config.dist));
    });

    gulp.task('inject', ['sass', 'js'], function() {
        var target = gulp.src(config.indexHtml);
        var sources = gulp.src([config.distCss, config.distJs], {
            read: false
        });
        return target.pipe($.inject(sources, {
                ignorePath: config.dist,
                addRootSlash: false
            }))
            .pipe(gulp.dest(config.dist));
    });
    gulp.task('sass', function() {
        del.sync([config.distCss]);
        return gulp.src(config.scss, {
                base: './src'
            })
            .pipe($.sass().on('error', $.sass.logError))
            .pipe(gulp.dest(config.dist));
    });


    gulp.task('js-lint', function() {
        return gulp.src(config.js, {
                base: './src'
            })
            .pipe($.jshint({ linter: require('jshint-jsx').JSXHINT }))
            .pipe($.jshint.reporter('jshint-stylish'))
            // .pipe($.jshint.reporter('fail'))
            .pipe($.jscs({
                fix: true
            }))
            .pipe($.jscs.reporter());
            // .pipe($.jscs.reporter('fail'));

    });
    var b = watchify(browserify({
            entries: config.entry,
            debug: true,
            transform: [reactify]
        }));
    b.on('update', bundle);
    b.on('log', $.util.log);
    function bundle(){
        return b.bundle()
            .on('error', function(err){
              $.util.log($.util.colors.red(err.message));
              $.util.beep();
              this.emit('end');
            })
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe($.sourcemaps.init({
                loadMaps: true
            }))
            // Add transformation tasks to the pipeline here.
            // .pipe($.uglify())
            .pipe($.sourcemaps.write('./'))
            .pipe(gulp.dest(config.dist));
    }
    gulp.task('js', ['js-lint'], function(){
        del.sync([config.distJs]);
        return bundle();
    });

    gulp.task('serve', ['cpHtml', 'inject'], function(){
        browserSync.init({
            server: {
                baseDir: config.dist
            }
        });

        gulp.watch(config.scss, ['inject']);
        gulp.watch(config.html, ['cpHtml']);
        gulp.watch(config.dist + '**/*', reload);
    });

    gulp.task('clean', function() {
        return del(config.dist);
    });
})();

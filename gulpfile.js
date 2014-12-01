var gulp = require('gulp'),
// gulp modules
    autoprefixer = require('gulp-autoprefixer'),
    bower = require('gulp-bower'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    livereload = require('gulp-livereload'),
    minifyCss = require('gulp-minify-css'),
    newer = require('gulp-newer'),
    plumber = require('gulp-plumber'),
    run = require('gulp-run'),
    uglifyJs = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
// image optimizers
    jpegtran = require('imagemin-jpegtran'),
    optipng = require('imagemin-optipng'),
    svgo = require('imagemin-svgo'),
// native modules
    del = require('del'),
    runSequence = require('run-sequence');

/**
 * Installation tasks
 */
gulp.task('install-bower', function () {
    return bower();
});

gulp.task('install', ['install-bower']);

/**
 * Build templates tasks
 */
gulp.task('clean-templates', function (cb) {
    del(['./**/*.html'], cb);
});

gulp.task('build-templates', function () {
    return gulp.src(
        [
            'sources/pages/**/*.jade'
        ],
        {base: 'sources/pages'})
        .pipe(plumber())
        .pipe(jade())
        .pipe(gulp.dest('.'));
});

/**
 * Build stylesheets tasks
 */
gulp.task('clean-stylesheets', function (cb) {
    del(['stylesheets'], cb);
});

gulp.task('build-stylesheets', function () {
    return gulp.src('sources/stylesheets/tenside.less')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(less({
            compress: true
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('.', {sourceRoot: '../sources/stylesheets'}))
        .pipe(gulp.dest('stylesheets'));
});

/**
 * Build javascripts tasks
 */
gulp.task('clean-javascripts', function (cb) {
    del(['javascripts'], cb);
});

gulp.task('build-javascripts', function () {
    return gulp.src(
        [
            '/home/tristan/workspace/tenside/tenside.github.io/bower_components/jquery/dist/jquery.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'sources/javascripts/**/*.js'
        ])
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglifyJs())
        .pipe(concat('tenside.js'))
        .pipe(sourcemaps.write('.', {sourceRoot: '../sources/javascripts'}))
        .pipe(gulp.dest('javascripts'));
});

/**
 * Build images tasks
 */
gulp.task('clean-images', function (cb) {
    del(['images'], cb);
});

gulp.task('build-images', function () {
    return gulp.src(
        [
            'sources/images/**/*.{jpg,png,svg}'
        ],
        {base: 'sources/images'})
        .pipe(plumber())
        .pipe(newer('images'))
        // TODO imagemin break contao logo
        // .pipe(imagemin({
        //     use: [jpegtran(), optipng(), svgo()]
        // }))
        .pipe(gulp.dest('images'));
});

/**
 * Build fonts task
 */

gulp.task('clean-fonts', function (cb) {
    del(['fonts'], cb);
});

gulp.task('build-fonts', function () {
    return gulp.src(['bower_components/font-awesome/fonts/*', 'bower_components/bootstrap-material-design/dist/fonts/Material-Design-Icons.*'])
        .pipe(plumber())
        .pipe(newer('fonts'))
        .pipe(gulp.dest('fonts'));
});

/**
 * Global build tasks
 */
gulp.task('clean', ['clean-templates', 'clean-stylesheets', 'clean-javascripts', 'clean-images', 'clean-fonts']);

gulp.task('build', function () {
    runSequence(
        'clean',
        ['build-templates', 'build-stylesheets', 'build-javascripts', 'build-images', 'build-fonts']
    );
});

gulp.task('watch', function () {
    livereload.listen();
    gulp.watch(['sources/pages/**/*.jade', 'sources/templates/**/*.jade'], function() {
        runSequence('build-templates', livereload.changed);
    });
    gulp.watch('sources/stylesheets/**/*.less', function() {
        runSequence('build-stylesheets', livereload.changed);
    });
    gulp.watch('sources/javascripts/**/*.less', function() {
        runSequence('build-javascripts', livereload.changed);
    });
    gulp.watch('sources/images/**/*', function() {
        runSequence('build-images', livereload.changed);
    });
});

gulp.task('default', function () {
    runSequence(
        ['build-templates', 'build-stylesheets', 'build-javascripts', 'build-images', 'build-fonts'],
        'watch'
    );
});

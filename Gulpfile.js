/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

// Include gulp
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');

// Include plugins
var plugins = require('gulp-load-plugins')();

var Server = require('karma').Server;

// unit test
gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/test/unit/karma.conf.js',
    singleRun: true
  }, done).start();
});

// e2e test
gulp.task('connect', function() {
  return plugins.connect.server({
    root: 'build/',
    port: 9000
  });
});

gulp.task('webdriver_update', plugins.protractor.webdriver_update_specific({
	browsers: ['ignore_ssl']
}));

gulp.task('protractor', ['connect', 'webdriver_update'], function() {
  return gulp.src(["test/integration/spec/**.js"], { read: false })
    .pipe(plugins.protractor.protractor({
        configFile: "test/integration/protractor.conf.js"
    }))
    .on('error', function(e) { throw e; });
  });

gulp.task('disconnect', function() {
  return plugins.connect.serverClose();
});

// clean
gulp.task('clean',function(){
  return del(['dist','build']);
});

// dist

gulp.task('htmlmin', function() {
  return gulp.src('build/**/*.html')
    .pipe(plugins.htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('uglify', function() {
  return gulp.src('build/scripts/app.min.js')
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('cleanCss', function() {
  return gulp.src('build/**/*.css')
    .pipe(plugins.cleanCss())
    .pipe(gulp.dest('dist/'));
});

gulp.task('minify', ['uglify', 'htmlmin', 'cleanCss']);

// FIXME can we do this with a parametric task?
gulp.task('copy-lib-dist', function() {
  return gulp.src('bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});

// dependencies

gulp.task('bower', function() {
  return plugins.bower();
});

// copy
gulp.task('copy-js', function() {
  return gulp.src('src/scripts/**')
    .pipe(gulp.dest('build/scripts'));
});

gulp.task('copy-data', function() {
  return gulp.src('src/data/**')
    .pipe(gulp.dest('build/data'));
});

gulp.task('copy-html', function() {
  return gulp.src('src/html/**')
    .pipe(gulp.dest('build/'));
});

gulp.task('copy-css', function() {
  return gulp.src('src/styles/**')
    .pipe(gulp.dest('build/styles'));
});

gulp.task('copy-lib', function() {
  return gulp.src('bower_components/**')
    .pipe(gulp.dest('build/bower_components'));
});

gulp.task('copy-build', ['copy-js',  'copy-data', 'copy-html',
                        'copy-css', 'copy-lib']);

// build

gulp.task('populate_player', function() {
  return plugins.run('node build_scripts/populate_player.js build',{silent:true}).exec()
  .pipe(plugins.rename("start_player.json"))
  .pipe(gulp.dest('build/data'));
});

gulp.task('populate_data', function() {
  return plugins.run('node build_scripts/populate_data.js build',{silent:true}).exec();
});

gulp.task('generate_isotopes', function() {
  return plugins.run('node build_scripts/generate_isotopes.js build',{silent:true}).exec();
});

gulp.task('generate_syntheses', function() {
  return plugins.run('node build_scripts/generate_syntheses.js build',{silent:true}).exec();
});

gulp.task('generate_achievement_functions', function() {
  return plugins.run('node build_scripts/generate_achievement_functions.js build',{silent:true}).exec();
});

gulp.task('sort_resources', function() {
  return plugins.run('node build_scripts/sort_resources.js build',{silent:true}).exec();
});

gulp.task('babel', function() {
  return gulp.src(['build/scripts/modules/module.js',
    'build/scripts/**/*!(module.js)'])
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    .pipe(plugins.concat('app.min.js'))
    .pipe(gulp.dest('build/scripts'));
});

// public tasks
gulp.task('build', function(callback) {
  runSequence(
    'clean',
    'bower',
    'copy-build',
    'generate_isotopes',
    'generate_syntheses',
    'generate_achievement_functions',
    'sort_resources',
    'populate_player',
    'populate_data',
    'babel',
    callback);
});

gulp.task('build-unit-test', function(callback) {
  runSequence('build', 'karma', callback);
});

gulp.task('dist', function(callback) {
  runSequence('build', 'minify', 'copy-lib-dist', callback);
});

gulp.task('unit-test', function(callback) {
  runSequence('dist', 'karma', callback);
});

gulp.task('e2e-test', function(callback) {
  runSequence('dist', 'protractor', 'disconnect',
              callback);
});

gulp.task('test', ['unit-test', 'e2e-test']);

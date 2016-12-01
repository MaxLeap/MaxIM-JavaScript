'use strict';
const gulp = require('gulp');
const serve = require('gulp-serve');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

const outputOfAMD = 'dist';
const outputOfCMD = 'lib';

gulp.task('clean-amd', cb => {
    del(outputOfAMD, cb);
});

gulp.task('clean-cmd', cb => {
    del(outputOfCMD, cb);
});

gulp.task('build-amd', () => {
    let tsProject = ts.createProject('tsconfig.json', {module: 'amd'});
    return tsProject
        .src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outputOfAMD));
});

gulp.task('build-cmd', () => {
    let tsProject = ts.createProject('tsconfig.json', {module: 'commonjs'});
    return tsProject
        .src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outputOfCMD));
});

gulp.task('serve', serve('.'));
gulp.task('default', ['clean-cmd', 'build-cmd', 'clean-amd', 'build-amd']);
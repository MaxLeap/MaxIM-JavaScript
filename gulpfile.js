'use strict';

const gulp = require('gulp');
const serve = require('gulp-serve');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

const OUTPUT = 'dist';

gulp.task('clean', cb => {
    del(OUTPUT, cb)
});

gulp.task('build-with-sourcemaps', () => {
    return tsProject
        .src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('build', () => {
    return tsProject
        .src()
        .pipe(tsProject())
        .js
        .pipe(gulp.dest(OUTPUT));
});

gulp.task('serve', serve('.'));
gulp.task('default', ['clean', 'build']);
gulp.task('build-dev', ['clean', 'build-with-sourcemaps']);
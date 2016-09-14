const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const del = require('del');

const OUTPUT = 'dist';

gulp.task('clean', cb => {
    del(OUTPUT, cb)
});

gulp.task('build', () => {
    return tsProject.src()
        .pipe(ts(tsProject))
        .js.pipe(gulp.dest(OUTPUT));
});

gulp.task('default', ['clean', 'build']);
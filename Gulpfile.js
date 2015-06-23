var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

gulp.task('lint', function() {
    gulp.src(['src/**/*.js', 'test/**/*.js'])
        .pipe(jshint({
            esnext: true
        }))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', function() {
    require('babel/register');
    gulp.src(['test/**/*Test.js'])
        .pipe(mocha({
            reporter: 'spec'
        }));
});

gulp.task('clean', function() {
    del('dist');
});

gulp.task('dist', ['lint', 'test', 'clean'], function() {
    gulp.src(['src/chusha.js'])
        .pipe(babel({
            modules: 'umd'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('chusha.min.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['lint', 'test', 'dist']);
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var mocha = require('gulp-mocha');

gulp.task('lint', function() {
    gulp.src(['src/**/*.js', 'test/**/*.js'])
        .pipe(jshint({
            esnext: true
        }))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', function() {
    require('6to5/register');
    gulp.src(['test/**/*.js'])
        .pipe(mocha({
            reporter: 'nyan'
        }));
});

gulp.task('default', ['lint', 'test']);
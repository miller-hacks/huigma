var gulp = require('gulp');
    gutil = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    react = require('gulp-react'),
    rename = require('gulp-rename');

gulp.task('default', function() {
    gulp.start('fonts', 'styles', 'react', 'scripts');
});

gulp.task('fonts', function() {
    return gulp.src('bower_components/font-awesome/fonts/*')
        .pipe(gulp.dest('application/static/fonts/'));
});

gulp.task('styles', function() {
    return gulp.src([
            'bower_components/font-awesome/css/font-awesome.css', 
            'application/static/css/*.css'
        ])
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        .pipe(concat('all.css'))
        .pipe(gulp.dest('application/static/build/'));
});

gulp.task('react', function () {
    return gulp.src('application/static/js/*.jsx')
        .pipe(react())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(rename({extname: 'js'}))
        .pipe(gulp.dest('application/static/js/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('application/static/js/'));
});

gulp.task('scripts', function () {
    return gulp.src([
            'bower_components/react/react-with-addons.min.js', 
            'bower_components/jquery/dist/jquery.min.js',
            'application/static/js/*.min.js'
        ])
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest('application/static/build/'));
});
var gulp = require('gulp');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var uglifycss = require('gulp-uglifycss');
var livereload = require('gulp-livereload');

gulp.task('js', function() {

	var jsFiles = ['src/js/*'];

	gulp.src(mainBowerFiles().concat(jsFiles))
		.pipe(filter('*.js'))
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/assets/js'))
		.pipe(livereload());
});

gulp.task('css', function() {

	var cssFiles = ['src/css/*'];

	// gulp-order if order of css files mather. Example if using normalize.css

	gulp.src(mainBowerFiles().concat(cssFiles))
		.pipe(filter('*.css'))
		.pipe(concat('main.css'))
		.pipe(uglifycss())
		.pipe(gulp.dest('public/assets/css'))
		.pipe(livereload());
});

gulp.task('watch', function() {
	livereload.listen(['8080', '127.0.0.1']);

	gulp.watch('src/js/*.js', ['js']);

	gulp.watch('src/css/*.css', ['css']);
});

gulp.task('default', ['js', 'css', 'watch'], function() {});
var gulp = require('gulp');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var uglifycss = require('gulp-uglifycss');
var livereload = require('gulp-livereload');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var fs = require('fs');
var replace = require('gulp-replace');
var config = require('./config.js');

gulp.task('lint', function() {
	return gulp.src('src/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('setup', function() {
	fs.mkdir('public/s', function(err) { });
	fs.mkdir('data/', function(err) {
		fs.writeFile('data/data.json', '{}', function(err) { });
	});
});

gulp.task('js', function() {

	var jsFiles = ['src/js/*'];

	gulp.src(jsFiles)
		.pipe(filter('*.js'))
		.pipe(replace('SERVER_IP', config.ipadress))
		.pipe(replace('SERVER_PORT', config.port))
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/assets/js'))
		.pipe(livereload());
});

gulp.task('css', function() {

	var cssFiles = ['src/css/*'];

	// gulp-order if order of css files mather. Example if using normalize.css

	gulp.src(cssFiles)
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

gulp.task('build', ['js', 'css', 'lint', 'setup'], function() {});
gulp.task('default', ['js', 'css', 'watch'], function() {});

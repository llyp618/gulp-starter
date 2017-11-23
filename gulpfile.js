var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var connect = require('gulp-connect');
var watch = require('gulp-watch');
var fileinclude = require('gulp-file-include');
var clean = require('gulp-clean');
var webpack = require('webpack-stream')
var named = require('vinyl-named');

var isProd = process.env.NODE_ENV === 'production'
var webpackConfig = isProd ? require('./webpack.prod.config.js') : require('./webpack.config.js')

gulp.task('build:css', function () {
	return gulp.src(['src/less/*.less', 'src/less/**/*.less'])
		.pipe(less().on('error', function (e) { console.error(e.message); this.emit('end') }))
		.pipe(postcss([autoprefixer({ browsers: ['last 5 versions'] })]))
		.pipe(gulp.dest('dist/css'))
		.pipe(connect.reload());
});

gulp.task('build:html', function () {
	return gulp.src(['src/html/*.html', 'src/html/**/*.html', '!src/html/include/*.html'])
		.pipe(fileinclude({
			prefix: '@@',
			basepath: 'src/html'
		}))
		.pipe(gulp.dest('dist/html'))
		.pipe(connect.reload());
});



gulp.task('build:js', function () {
	return gulp.src(['src/entries/*.js'])
		.pipe(named())
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest('dist/js/'))
		.pipe(connect.reload());
});
gulp.task('build:img', function () {
	return gulp.src('src/img/**/*.?(png|jpg|gif)')
		.pipe(gulp.dest('dist/img'))
		.pipe(connect.reload());
});

gulp.task('build:libs', function () {
	return gulp.src('src/libs/**/*.*')
		.pipe(gulp.dest('dist/libs'))
		.pipe(connect.reload());
});
gulp.task('webserver', function () {
	console.log('connecting...')
	connect.server({
		root: 'dist',
		port: 5666,
		livereload: true
	})
});
gulp.task('clean', function(){
	return gulp.src('dist')
		.pipe(clean());
});
gulp.task('watch', function () {
	watch('src/less/**/*.less', function () {
		gulp.start("build:css");
	});
	watch(['src/html/*.html', 'src/html/**/*.html'], function () {
		gulp.start("build:html");
	});
	watch('src/entries/*.js', function () {
		gulp.start("build:js");
	});
	watch('src/**/*.?(png|jpg|gif)', function () {
		gulp.start('build:img');
	});
	watch('src/libs/**/*.*', function () {
		gulp.start('build:libs');
	});
});

gulp.task('dev', ['watch', 'webserver']);

gulp.task('pro', ['clean'], function(){
	gulp.start('build:css','build:html','build:img', 'build:libs', 'build:js')
})







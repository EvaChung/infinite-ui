var gulp = require('gulp');
var header = require('gulp-header');
var footer = require('gulp-footer');
var concat = require('gulp-concat');
var remember = require('gulp-remember');
var prettify = require('gulp-jsbeautifier');
var compress = require('gulp-yuicompressor');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var compass = require('gulp-compass');
var argv = require('yargs').argv;
var browserSync = require("browser-sync");
var reload = browserSync.reload;

/**
 * 全局部件
 */
var globWidgets = [
    './src/js/pubsub.js',
    './src/js/alert.js',
    './src/js/cookie.js',
    './src/js/loading.js',
    './src/js/tip.js',
];

/**
 * UI组件
 * @场景：PC端，IE8+
 */
var pcComponents = [
    './src/js/tooltip.js',
    './src/js/emailSuffix.js',
    './src/js/placeholder.js',
    './src/js/fadeSlide.js',
    './src/js/typeCount.js'
];

/**
 * UI组件
 * @场景：移动端，Android 4.2+ , IOS 6+
 */
var mobileComponents = [
    './src/js/hideNavbar.js',
    './src/js/fresh.js',
    './src/js/panel.js',
    './src/js/mpicker.js'
];


/**
 * UI组件
 * @场景：适应多端
 */
var commonComponents = [
    './src/js/layer.js',
    './src/js/returnTop.js',
    './src/js/tab.js',
    './src/js/ajaxForm.js',
    './src/js/validate.js',
    './src/js/tokenize.js'
];

/**
 * 核心功能
 * @描述：包含结构、某些组件需依赖的工具集，强制依赖
 */
var coreUtil = ['./src/js/index.js'];


var headerText = '(function($, window, document, undefined) {';
var footerText = '}(jQuery, window, document, undefined));';


var components = coreUtil.concat(globWidgets, commonComponents, argv.pc ? pcComponents : (argv.mobi ? mobileComponents : pcComponents.concat(mobileComponents)));


/**
 * gulp build --pc        编译pc
 * gulp build --mobi      编译mobile
 */
gulp.task('build', function() {
    gulp.src(components)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('iui.js'))
        .pipe(header(headerText))
        .pipe(footer(footerText))
        .pipe(prettify({ config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE' }))
        .pipe(gulp.dest('./dist/'))
        .pipe(compress({ type: 'js' }))
        .pipe(rename('iui.min.js'))
        .pipe(gulp.dest('./dist/'));

    gulp.src('./src/sass/*.scss')
        .pipe(compass({
            config_file:'./config.rb',
            css: './dist/',
            sass: './src/sass/'
        }))
        .pipe(gulp.dest('./dist/'))

});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('fresh', function() {
    gulp.src(['./examples/*.html','./src/js/*.js']).pipe(reload({
        stream: true
    }));
});
gulp.task('watch', ['browser-sync', 'fresh'], function() {
    gulp.watch(['./examples/*.html','./src/js/*.js'], ['fresh']);
});

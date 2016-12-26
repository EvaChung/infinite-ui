var gulp = require('gulp');
var header = require('gulp-header');
var footer = require('gulp-footer');
var concat = require('gulp-concat');
var remember = require('gulp-remember');
var prettify = require('gulp-jsbeautifier');
var compress = require('gulp-yuicompressor');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var argv = require('yargs').argv;
var browserSync = require("browser-sync");
var sass = require('gulp-sass');
var reload = browserSync.reload;


/**
 * 全局部件
 */
var globWidgets = [
  './src/js/pubsub.js',
  './src/js/alert.js',      //活动这边用到的
  './src/js/cookie.js',
  './src/js/loading.js',    //活动这边用到的
  './src/js/alert.js',        //活动这边用到的
];

/**
 * UI组件
 * @场景：PC端，IE8+
 */
var pcComponents = [
  // './src/js/tooltip.js',
  './src/js/emailSuffix.js',    //活动pc这边用到的
  './src/js/placeholder.js',    //活动pc这边用到的
  './src/js/typeCount.js',
  // './src/js/lrselect.js',
  // './src/js/iselector.js',    //活动pc这边用到的
  './src/js/tokenize.js',
  './src/js/dialog.js',
  './src/js/popover.js'
];

/**
 * UI组件
 * @场景：移动端，Android 4.2+ , IOS 6+
 */
var mobileComponents = [
  './src/js/hideNavbar.js',
  './src/js/fresh.js',
  './src/js/panel.js',
  './src/js/mpicker.js'     //活动wap这边用到的
];


/**
 * UI组件
 * @场景：适应多端
 */
var commonComponents = [
  './src/js/layer.js',        //活动这边用到的
  './src/js/tabs.js',
  './src/js/share.js',        //活动这边用到的
  './src/js/exist.js',        //活动这边用到的
  './src/js/ajaxError.js',    //活动这边用到的
  './src/js/ajaxForm.js',     //活动这边用到的
  './src/js/validate.js',     //活动这边用到的
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


});

gulp.task('sass', function () {
  return gulp.src(['./src/sass/*.scss'])
    .pipe(sass({
      outputStyle:'expanded',
      sourceComments:true,
      }).on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('fresh', function() {
  gulp.src(['./examples/**/*.html', './src/js/*.js','./examples/**/*.js']).pipe(reload({
    stream: true
  }));
});


gulp.task('watch', ['browser-sync', 'sass', 'fresh'], function() {
  gulp.watch(['./examples/**/*.html', './src/js/*.js','./examples/**/*.js','./dist/**/*.css'], ['fresh']);
   gulp.watch('./src/sass/*.scss', ['sass','fresh']);
});

var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var pug = require('gulp-pug');
var path = require('path');
var cache = require('gulp-cached');

var paths = {
  sass: ['./scss/**/*.scss'],
  pug: ['./pug/**/*.pug']
};

//sends compiled pug file to correct directory
function pugDestination(file) {
  var dest = path.basename(file.path).replace('.html', '/');

  if (file.path.match(/templates\//) !== null) {
    file.path = file.path.replace('templates/', '');
    return './www/components/' + dest;
  } else {
    return './www/'
  }
}

gulp.task('default', ['sass', 'pug']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(cache('sass-cache'))
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/assets/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/assets/css/'))
    .on('end', done);
});

gulp.task('pug', function(done) {
  gulp.src('./pug/**/*.pug')
    .pipe(cache('pug-cache'))
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(pugDestination))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.pug, ['pug']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

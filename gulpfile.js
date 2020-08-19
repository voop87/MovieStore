const gulp = require('gulp'),
      plumber = require('gulp-plumber'),
      sourcemap = require('gulp-sourcemaps'),
      rename = require('gulp-rename'),
      del = require('del'),
      posthtml = require('gulp-posthtml'),
      include = require('posthtml-include'),
      htmlmin = require('gulp-htmlmin'),
      //jsmin = require('gulp-uglify'),
      pipeline = require('readable-stream').pipeline,
      //svgstore = require('gulp-svgstore'),
      imagemin = require('gulp-imagemin'),
      //webp = require('gulp-webp'),
      less = require('gulp-less'),
      postcss = require('gulp-postcss'),
      autoprefixer = require('autoprefixer'),
      csso = require('gulp-csso'),
      server = require('browser-sync').create();

gulp.task('css', function () {
  return gulp.src('src/less/style.less')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename('style.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(server.stream());
});

gulp.task('html', function () {
  return gulp.src('src/*.html')
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest('build'));
});

gulp.task('copy', function () {
  return gulp.src([
    'src/fonts/**/*.{woff,woff2}',
    'src/img/**',
    'src/js/**',
    'src/*.ico'
  ], {
    base: 'src'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('clean', function () {
  return del('build');
});

gulp.task('htmlmin', function () {
  return gulp.src('build/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'));
});
/*
gulp.task('jsmin', function () {
  return pipeline(
    gulp.src('build/js/*.js'),
    jsmin(),
    gulp.dest('build/js')
  );
});
*/
gulp.task('server', function () {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch('src/less/**/*.less', gulp.series('css'));
  gulp.watch('src/*.html', gulp.series('html', 'refresh'));
});

gulp.task('refresh', function () {
  server.reload();
  done();
});

gulp.task('build', gulp.series(
  'clean',
  'copy',
  'css',
  'html',
  'htmlmin',
  //'jsmin'
));

gulp.task('start', gulp.series('build', 'server'));

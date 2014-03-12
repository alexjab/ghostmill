var gulp = require ('gulp');
var concat = require ('gulp-concat');
var uglify = require ('gulp-uglify');

gulp.task ('jquery', function () {
  gulp.src (['./js_data/jquery.js'])
  .pipe (uglify ())
  .pipe (concat ('jquery.min.js'))
  .pipe (gulp.dest ('./js_data/'));
});

gulp.task ('socket.io', function () {
  gulp.src (['./js_data/socket.io.js'])
  .pipe (uglify ())
  .pipe (concat ('socket.io.min.js'))
  .pipe (gulp.dest ('./js_data/'));
});

gulp.task ('default', ['jquery', 'socket.io']);

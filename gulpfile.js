var gulp = require ('gulp');
var concat = require ('gulp-concat');
var uglify = require ('gulp-uglify');

gulp.task('default', function() {
  gulp.src (['./js_data/jquery.js', './js_data/socket.io.js'])
  .pipe (uglify ())
  .pipe (concat ('all.min.js'))
  .pipe (gulp.dest ('./js_data/'));
});


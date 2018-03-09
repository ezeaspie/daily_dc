const gulp = require("gulp");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");

gulp.task('sass', function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.scss', ['sass']);
});

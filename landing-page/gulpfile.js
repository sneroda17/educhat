var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var useref = require("gulp-useref");
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');

gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "app"
    }
  });
});

gulp.task("sass", function () {
  return gulp.src("app/scss/**/*.scss") // get all .scss files in the scss folder
  .pipe(sass())
  .pipe(gulp.dest("app/styles"))
  .pipe(browserSync.reload({
    stream: true
  }))
});

gulp.task("useref", function() {
  return gulp.src("app/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulp.dest("dist"))
});

gulp.task("watch", ["browserSync", "sass" ], function() {
  gulp.watch("app/scss/**/*.scss", ["sass"]);
  gulp.watch("app/*.html", browserSync.reload);
  gulp.watch("app/scripts/**/*.js", browserSync.reload);
  // other tasks come here...
});
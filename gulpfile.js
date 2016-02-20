var gulp = require("gulp"),
    babel = require("gulp-babel")
    rollup = require("gulp-rollup");

gulp.task('default', function() {
  console.log('Hello World');
});

gulp.task('html-copy', function() {
  gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist'))
})

gulp.task('main-process', function() {
  gulp.src('src/main.js')
    .pipe(rollup())
    .pipe(babel())
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['main-process'])
  gulp.watch('src/**/*.html', ['html-copy'])
})

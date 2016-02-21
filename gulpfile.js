var gulp = require("gulp"),
    babel = require("gulp-babel")
    rollup = require("gulp-rollup")
    jetpack = require("fs-jetpack");

gulp.task('default', function() {
  console.log('Hello World');
});

gulp.task('clean', function(callback) {
  jetpack.cwd('dist').dirAsync('.', {empty: true});
  jetpack.cwd('lib').dirAsync('.', {empty: true});
})

gulp.task('babel', function() {
  gulp.src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'))
})

gulp.task('static', function() {
  gulp.src('static/**/*')
    .pipe(gulp.dest('dist'))
})

gulp.task('build', ['babel', 'static'])

/*
gulp.task('app', function() {
  gulp.src('app/app.js')
    .pipe(gulp.dest('dist'));
})

gulp.task('main-process', function() {
  gulp.src('src/main.js')
    .pipe(rollup())
    .pipe(babel())
    .pipe(gulp.dest('dist'))
})
*/

gulp.task('watch', ['build'], function() {
  gulp.watch('src/**/*', ['build'])
  gulp.watch('static/**/*', ['build'])
})

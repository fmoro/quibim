const gulp = require('gulp');
const ts = require('gulp-typescript');
const jasmine = require('gulp-jasmine');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
const tslint = require('gulp-tslint');
const nodemon = require('gulp-nodemon');
const alias = require('path-alias-resolver/gulp');

gulp.task('build', function() {
  const merge = require('merge2');
  const tsProject = ts.createProject('tsconfig.json');
  var tsResult = tsProject.src().pipe(tsProject());
  return merge([
    tsResult.dts.pipe(gulp.dest('./definitions')),
    tsResult.js.pipe(gulp.dest(tsProject.config.compilerOptions.outDir)),
    tsResult.js.pipe(
      alias('./dist', {
        router: '../dist/router',
        controller: '../dist/controller',
        service: '../dist/service',
        factory: '../dist/factory',
        utils: '../dist/utils',
      })
    )
  ]);
});

gulp.task('lintAndBuild', function(cb) {
  runSequence('tslint', 'build', cb);
});

gulp.task('clean', function() {
  return gulp.src('dist', { read: false }).pipe(clean());
});

gulp.task('test:run', function() {
  return gulp.src('dist/spec/**').pipe(jasmine());
});

gulp.task('watch', ['default'], function() {
  gulp.watch('src/*.ts', ['default']);
});

gulp.task('test', [], function(cb) {
  runSequence('clean', 'lintAndBuild', 'test:run', cb);
});

gulp.task('default', [], function(cb) {
  runSequence('clean', 'lintAndBuild', 'start', cb);
});

gulp.task('tslint', () =>
  gulp
    .src('src/**/*.ts')
    .pipe(
      tslint({
        formatter: 'verbose'
      })
    )
    .pipe(tslint.report())
);

gulp.task('start', function() {
  nodemon({
    script: 'dist/index.js',
    ext: 'js html',
    env: { NODE_ENV: 'development' }
  });
});

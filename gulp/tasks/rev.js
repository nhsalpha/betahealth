const gulp = require('gulp');
const gulpIgnore = require('gulp-ignore');
const print = require('gulp-print');
const RevAll = require('gulp-rev-all');

const paths = require('../paths');
const config = require('../../config/config');

gulp.task('rev', () => {
  const revAll = new RevAll({
    hashLength: 32,
    dontRenameFile: ['rev-manifest.json'],
  });

  // only revision if on production
  if (config.env !== 'production') {
    return gulp;
  }

  return gulp.src(`${paths.output}/**/*.*`)
    .pipe(gulpIgnore.exclude('*.map'))
    .pipe(print())
    .pipe(revAll.revision())
    .pipe(gulp.dest(paths.build))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest(paths.build));
});

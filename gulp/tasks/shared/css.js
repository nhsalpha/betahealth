const sass = require('gulp-sass');
const importOnce = require('node-sass-import-once');
const gulpif = require('gulp-if');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const config = require('../../../config/config');
const paths = require('../../paths');

const isProduction = config.env === 'production';

// add extra sass paths
const SASS_PATHS = [
  `${paths.nodeModules}`,
];

function handleError(error) {
  sass.logError.call(this, error);
  process.exit(1);
}

module.exports = (gulp) => {
  return gulp.src(`${paths.sourceStyles}/**/*.scss`)
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(sass({
      includePaths: SASS_PATHS,
      outputStyle: isProduction ? 'compressed' : 'expanded',
      importer: importOnce,
      importOnce: {
        index: true,
        css: true
      }
    }).on('error', handleError))
    .pipe(autoprefixer({
      browsers: ['> 0%', 'IE 8'],
    }))
    .pipe(gulpif(!isProduction, sourcemaps.write('.')))
    .pipe(gulp.dest(`${paths.outputStyles}`));
};

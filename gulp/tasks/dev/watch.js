const gulp = require('gulp');
const paths = require('../../paths');
const browserSync = require('browser-sync').get('bs-proxy');

// Monitor sass, js and view code for changes and trigger
// rebuilds or refreshes as needed
module.exports = {
  dep: ['build', 'serve', 'browserSync'],
  nativeTask: () => {
    gulp.watch(`${paths.sourceJS}/**/*.js`, ['webpack-dev']);
    gulp.watch(`${paths.sourceImages}/**/*`, ['images']);
    gulp.watch(`${paths.sourceStyles}/**/*.scss`, ['css']);
    gulp.watch([
      `${paths.sourceApp}/**/*.js`,
      `${paths.projectDir}/+(config|lib|public)/**/*.js`,
      `${paths.sourceViews}/**/*.nunjucks`,
      `${paths.projectDir}/**/*.md`,
    ]).on('change', browserSync.reload);
  },
};

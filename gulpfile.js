/*
  gulpfile.js
  ===========
  Rather than manage one giant configuration file responsible
  for creating multiple tasks, each task has been broken out into
  its own file in gulpfile.js/tasks. Any files in that directory get
  automatically required below.
  To add a new task, simply add a new task file that directory.
*/

const gulp = require('gulp');
const gulpRequireTasks = require('gulp-require-tasks');

const config = require('./config/config');

gulpRequireTasks({
  path: `${process.cwd()}/gulp/tasks/build`,
});


// Only load development tasks when not in production.
// This means we can move some of the dependencies to devDependencies
if (config.env !== 'production') {
  gulpRequireTasks({
    path: `${process.cwd()}/gulp/tasks`,
  });
}

gulp.task('default', ['build']);

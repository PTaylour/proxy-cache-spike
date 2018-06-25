'use strict'

const gulp = require('gulp')
const babel = require('gulp-babel')

const es2015 = babel({presets: ['es2015']})

const buildDirectory = (dirName) => gulp.src(dirName + '/**/*.js')
  .pipe(es2015)
  .pipe(gulp.dest('dist/' + dirName))

const buildFile = (fileName) => gulp.src(fileName)
  .pipe(es2015)
  .pipe(gulp.dest('dist'))

gulp.task('default', () => buildFile('server.js'))
gulp.task('buildSrc', () => buildDirectory('src'))

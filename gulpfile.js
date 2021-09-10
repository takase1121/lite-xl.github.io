const childProcess = require('child_process')
const { watch, src, dest, series, parallel } = require('gulp')

const sass = require('gulp-sass')(require('sass'))
const sourcemaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss')

const exec = (...cmd) => childProcess.spawn(cmd[0], cmd.slice(1), { stdio: 'inherit' })

// we'll need to filter this, but not now
const flags = () => src('./node_modules/flag-icon-css/flags/4x3/*.svg')
  .pipe(dest('./assets/flags/4x3'))

const css = () => src('./src/_assets/scss/style.scss', { allowEmpty: true })
  .pipe(sourcemaps.init())
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(postcss())
  .pipe(sourcemaps.write('.'))
  .pipe(dest('./assets/css'))

const eleventy = () => exec('npx', '@11ty/eleventy')

const watchCss = () => watch('./**/*.scss', parallel(css))
const watchEleventy = () => exec('npx', '@11ty/eleventy', '--serve')

exports.default = series(flags, css, eleventy)
exports.gh_ci = series(flags, css)
exports.dev = series(flags, css, parallel(watchCss, watchEleventy))

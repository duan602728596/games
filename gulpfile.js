const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const prettify = require('gulp-prettify');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber');
const browserSync = require('browser-sync').create();

const errorHandler = (error)=>{
  const args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    messages: '<%= error.message %>'
  }).apply(this, args);
};

function pugProject(){
  const src = `${ __dirname }/src/html/**/*.pug`;
  const build = `${ __dirname }/build/html`;
  return gulp.src(src)
    .pipe(changed(build, {
      extension: '.html'
    }))
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(pug({
      pretty: true
    }))
    .pipe(prettify({
      indent_size: 2,
      unformatted: ['br', 'var']
    }))
    .pipe(gulp.dest(build));
}

function sassProject(){
  const src = `${ __dirname }/src/style/**/*.sass`;
  const build = `${ __dirname }/build/style`;
  return gulp.src(src)
    .pipe(changed(build, {
      extension: '.css'
    }))
    .pipe(sass({
      outputStyle: 'compact'
    }).on('error', sass.logError))
    .pipe(gulp.dest(build));
}

function babelProject(){
  const src = `${ __dirname }/src/script/**/*.js`;
  const build = `${ __dirname }/build/script`;
  return gulp.src(src)
    .pipe(changed(build, {
      extension: '.js'
    }))
    .pipe(plumber({
      errorHandler: errorHandler
    }))
    .pipe(babel({
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              ie: 11,
              edge: 12,
              chrome: 40,
              firefox: 40
            },
            debug: false,
            modules: false,
            useBuiltIns: false,
            uglify: false
          }
        ],
        '@babel/preset-flow'
      ]
    }))
    .pipe(gulp.dest(build));
}

function imgProject(){
  const src = `${ __dirname }/src/image/**/*.*`;
  const build = `${ __dirname }/build/image`;
  return gulp.src(src)
    .pipe(changed(src))
    .pipe(imagemin())
    .pipe(gulp.dest(build));
}

function watchProject(){
  gulp.watch(`${ __dirname }/src/html/**/*.pug`, gulp.series(imgProject, pugProject));
  gulp.watch(`${ __dirname }/src/style/**/*.sass`, gulp.series(imgProject, sassProject));
  gulp.watch(`${ __dirname }/src/script/**/*.js`, babelProject);
}

function browserSyncProject(){
  browserSync.init({
    server: {
      baseDir: './build/',
      index: 'html/index.html'
    },
    port: 4399,
    files: './build/',
    startPath: 'html/index.html'
  });
}

gulp.task('default', gulp.series(
  gulp.parallel(pugProject, sassProject, babelProject, imgProject),
  gulp.parallel(watchProject, browserSyncProject)
));
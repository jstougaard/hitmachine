var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
    rename: {
        'gulp-ruby-sass': 'sass'
    }
});
var del = require('del');
var karma = require('karma').server;
var browserSync = require('browser-sync');
var spawn = require('child_process').spawn;


// VARIABLES ======================================================
var isDist = $.util.env.type === 'dist';
var outputFolder = isDist ? 'dist' : 'build';
var node; // Reference to running node server
var config = {
    bowerDir: "./vendor"
};

var globs = {
  sassMainFile: 'main.scss',
  sassDir: 'src/style',
  sass: 'src/style/**/*.scss',
  templates: 'src/templates/**/*.html',
  assets: 'src/assets/**/*.*',
  app: 'src/app/**/*.ts',
  // karma typescript preprocessor generates a bunch of .ktp.ts which gets picked
  // up by the watch, rinse and repeat
  appWithDefinitions: ['src/**/*.ts', '!src/**/*.ktp.*'],
  integration: 'src/tests/integration/**/*.js',
  index: 'src/index.html',
  serverFiles: ['server.js', 'server/**/*.js'],
  server: 'server.js'
};

var destinations = {
  css: outputFolder + "/style",
  fonts: outputFolder + "/fonts",
  js: outputFolder + "/src",
  libs: outputFolder + "/vendor",
  assets: outputFolder + "/assets",
  index: outputFolder
};

// When adding a 3rd party we want to insert in the html, add it to
// vendoredLibs, order matters
var vendoredLibs = [
    config.bowerDir + '/angular/angular.js',
    config.bowerDir + '/ui-router/release/angular-ui-router.js',
    config.bowerDir + '/angular-slider/slider.js',
    config.bowerDir + '/angular-drag-and-drop-lists/angular-drag-and-drop-lists.js',
    config.bowerDir + '/angular-socket-io/socket.js',
    config.bowerDir + '/underscore/underscore.js',
    config.bowerDir + '/jquery/dist/jquery.js',
    config.bowerDir + '/screenfull/dist/screenfull.js',
    config.bowerDir + '/angular-screenfull/dist/angular-screenfull.js'
];

// Will be filled automatically
var vendoredLibsMin = [];

var injectLibsPaths = {
  dev: [],
  dist: []
};

var injectPaths = {
  dev: [],
  dist: []
};

vendoredLibs.forEach(function(lib) {
  // take the filename
  var splittedPath = lib.split('/');
  var filename = splittedPath[splittedPath.length -1];
  injectLibsPaths.dev.push(destinations.libs + '/' + filename);
  // And get the minified version
  filename = filename.split('.')[0] + '.min.js';
  splittedPath[splittedPath.length - 1] = filename;
  vendoredLibsMin.push(splittedPath.join('/'));
  injectLibsPaths.dist.push(destinations.libs + '/' + filename);
});

['dev', 'dist'].forEach(function (env) {
  injectPaths[env] = injectLibsPaths[env].concat([
    destinations.js + "/app/**/module.js",
    isDist ? destinations.js + '/app.js' : destinations.js + "/app/**/*.js",
    destinations.js + "/templates.js",
    destinations.css + "/*.css"
  ]);
});

var tsProject = $.typescript.createProject({
  declarationFiles: true,
  noExternalResolve: true
});

// TASKS ===========================================================

gulp.task('sass', function () {
  return $.sass(globs.sassDir + "/" + globs.sassMainFile, {
          /*style: 'compressed',*/
          sourcemap: true,
          loadPath: [
              globs.sassDir,
              config.bowerDir + '/bootstrap-sass-official/assets/stylesheets',
              config.bowerDir + '/fontawesome/scss'
          ]
      }).on('error', $.sass.logError)

    .pipe($.autoprefixer())  // defauls to > 1%, last 2 versions, Firefox ESR, Opera 12.1
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(destinations.css))
    ; //.pipe(browserSync.reload({stream: true}));
});

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
    .pipe(gulp.dest(destinations.fonts)); 
});

gulp.task('ts-lint', function () {
  return gulp.src(globs.app)
    .pipe($.tslint())
    .pipe($.tslint.report('prose', {emitError: true}));
});

gulp.task('ts-compile', function () {
  var tsResult = gulp.src(globs.appWithDefinitions)
    .pipe($.typescript(tsProject));

  return tsResult.js.pipe(isDist ? $.concat('app.js') : $.util.noop())
    .pipe($.ngAnnotate({gulpWarnings: false}))
    .pipe(isDist ? $.uglify() : $.util.noop())
    .pipe(isDist ? $.wrap({ src: './iife.txt'}) : $.util.noop())
    .pipe(gulp.dest(destinations.js))
    ; //.pipe(browserSync.reload({stream: true}));
});

gulp.task('templates', function () {
  return gulp.src(globs.templates)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({moduleName: 'templates'}))
    .pipe($.concat('templates.js'))
    .pipe(isDist ? $.uglify() : $.util.noop())
    .pipe(gulp.dest(destinations.js))
    ; //.pipe(browserSync.reload({stream: true}));
});

gulp.task('clean', function (cb) {
  del(['dist/', 'build/'], cb);
});

gulp.task('karma-watch', function(cb) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, cb);
});

gulp.task('browser-sync', function () {
  return browserSync({
    open: false,
    server: {
      baseDir: "./build"
    },
    watchOptions: {
      debounceDelay: 1000
    }
  });
});

gulp.task('copy-vendor', function () {
  return gulp.src(isDist ? vendoredLibsMin : vendoredLibs)
    .pipe(gulp.dest(destinations.libs));
});

gulp.task('copy-assets', function () {
  return gulp.src(globs.assets)
    .pipe(gulp.dest(destinations.assets));
});

gulp.task('index', function () {
  var target = gulp.src(globs.index);
  var _injectPaths = isDist ? injectPaths.dist : injectPaths.dev;

  return target.pipe(
    $.inject(gulp.src(_injectPaths, {read: false}), {
      ignorePath: outputFolder,
      addRootSlash: false
    })
  ).pipe(gulp.dest(destinations.index));
});

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', function() {
    if (node) node.kill();
    node = spawn('node', [globs.server], {stdio: 'inherit'});
    node.on('close', function (code) {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
});

gulp.task('watch', function() {
  gulp.watch(globs.sass, gulp.series('sass'));
  gulp.watch(globs.appWithDefinitions, gulp.series('ts-lint', 'ts-compile'));
  gulp.watch(globs.templates, gulp.series('templates'));
  gulp.watch(globs.index, gulp.series('index'));
  gulp.watch(globs.assets, gulp.series('copy-assets'));
  gulp.watch(globs.serverFiles, gulp.series('server'));
});

gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel('sass', 'icons', 'copy-assets', 'ts-compile', 'templates', 'copy-vendor'),
    'index'
  )
);

gulp.task(
  'default',
  gulp.series('build', gulp.parallel(/*'browser-sync',*/ 'server', 'watch' /*, 'karma-watch'*/))
);


// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill();
});

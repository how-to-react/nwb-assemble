var readFileSync = require('jsonfile').readFileSync;
var assemble = require('assemble');
var extname = require('gulp-extname');
var inject = require('gulp-inject');
var app = assemble({
  layout: 'src/views/layouts/default-layout.hbs',
});

app.task('load', function (cb) {
  app.src('src/views/**/*.hbs', {layout: 'default.hbs'});
  app.data('src/views/_data/*.json');
  app.partials('src/views/**/*.hbs');
  app.layouts('src/views/layouts/*.hbs');
  app.pages('src/views/pages/*.hbs');
  app.helpers('src/_helpers/*.js');
  app.helpers(require('handlebars-helpers')());
  cb();
});

app.task('assemble', ['load'], function () {
  var manifestPath = `${process.cwd()}/dist/manifest.json`;
  var manifest = readFileSync(manifestPath);
  var sources = app.src(Object.values(manifest).map(file => `${process.cwd()}/dist/${file}`), {read: false});

  return app.toStream('pages')
  .pipe(app.renderFile())
  .pipe(extname())
  .pipe(inject(sources, {ignorePath: 'dist'}))
  .pipe(app.dest('dist'));
});

app.task('default', ['assemble']);

module.exports = app;

const pa11y = require('pa11y');
const chalk = require('chalk');
const fs = require('fs');
const packageJson = fs.readFileSync('./package.json');
const port = packageJson.serverPort || 5000;
const glob = require("glob");

glob("**/*.html", {
  cwd: `${process.cwd()}/dist`
},function (er, files) {
  const paths = files.filter(function (file) {
    return file !== 'assets/index.html';
  }).map(function (file) {
    return {
      file: file,
      url: `0.0.0.0:${port}/${file}`,
    }
  });
  const counts = {
    notices: [],
    warnings: [],
    errors: [],
  };
  Promise.all(paths.map(function (path) {
    return pa11y(path.url, {
        // includeNotices: true,
        includeWarnings: true,
        // actions: (packageJson.accessibility && packageJson.accessibility.actions) ? packageJson.accessibility.actions : [],
        screenCapture: `${process.cwd()}/.screenshots/${path.file}.png`,
      });
  })).then(function(reports) {
    /**
     { documentTitle: 'Front end starter',
        pageUrl: 'http://0.0.0.0:5000/index-page-2.html',
        issues:
         [ { code: 'WCAG2AA.Principle2.Guideline2_4.2_4_2.H25.2',
             context: '<title>Front end starter</title>',
             message: 'Check that the title element describes the document.',
             type: 'notice',
             typeCode: 3,
             selector: 'html > head > title' } ] }
     */
    return Promise.all(reports.map(report => {
      console.log(`${chalk.blue(report.documentTitle)} (${chalk.blue(chalk.underline(report.pageUrl))})`);
      if (report.issues.length === 0) {
        console.log(`${chalk.green('No issues found 🎉')}`);
        console.log('');
        return;
      }
      console.log(`${chalk.cyan(`Found ${report.issues.length} issue${report.issues.length === 1 ? '' : 's'}`)}`);
      const notices = report.issues.filter(function(t) { return t.typeCode === 3; });
      if (notices.length) {
        counts.notices = counts.notices.concat(notices);
        console.log(` - ${chalk.magenta(`${notices.length} notice${notices.length === 1 ? '' : 's'}`)}`);
      }

      const warnings = report.issues.filter(function(t) { return t.typeCode === 2; });
      if (warnings.length) {
        counts.warnings = counts.warnings.concat(warnings);
        console.log(` - ${chalk.yellow(`${warnings.length} warning${warnings.length === 1 ? '' : 's'}`)}`);
        warnings.map(function(err, k) {
          console.log(`   - ${chalk.red(`${k+1})`)} ${chalk.red(chalk.bold(err.message))}`);
          console.log(`      ${chalk.red('HTML: ')}${chalk.yellow(err.context)} (${err.selector})`);
          console.log('');
        });
      }

      const errors = report.issues.filter(function(t) { return t.typeCode === 1; });
      if (errors.length) {
        counts.errors = counts.errors.concat(errors);
        console.log(` - ${chalk.red(`${errors.length} error${errors.length === 1 ? '' : 's'}`)}`);
        errors.map(function(err, k) {
          console.log(`   - ${chalk.red(`${k+1})`)} ${chalk.red(chalk.bold(err.message))}`);
          console.log(`      ${chalk.red('HTML: ')}${chalk.yellow(err.context)} (${err.selector})`);
          console.log('');
        });
      }
      console.log('');
    })).then(function() {
      if (counts.errors.length !== 0) {
        console.log(chalk.bgRed(`Tests failed, found ${counts.errors.length} error${counts.errors.length === 1 ? '' : 's'}`));
        process.exit(1);
      }
    });
  });
});


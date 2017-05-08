#!/usr/bin/env node


// API-PIKI command line tool
const program = require('commander');
const generator = require('./src/lib/generator');
const path = require('path');
const fs = require('fs');

let specFile;

program
    .usage('[options] <spec>')
    .version(require('./package.json').version)
    .arguments('<spec>')
    .action((spec) => {
      specFile = spec;
    })
    .option('-o, --out [outDir]', 'Output directory for generated test files. Default: ./test/api-swag')
    .option('-f, --forceAuth', 'Force generation of authenticated tests using Basic Authentication, even if spec doesn\'t declare it. In this case be sure to set USERNAME and USERPASSWD env variables when running tests')
    .parse(process.argv);

if (typeof specFile === 'undefined') {
  console.log('\n Nothing to do here... API specification file / URL not provided');
  process.exit(1);
} else {
  const swaggerPath = (specFile.startsWith('http:') || specFile.startsWith('https:')) ? specFile : `file://${path.resolve(specFile)}`;
  if (swaggerPath.startsWith('file:') && !fs.existsSync(path.resolve(specFile))) {
    console.log('\n Specified file doesn\'t exist. Please check it.\n');
    process.exit(1);
  }
  console.log(`\nGenerating API tests for ${specFile}`);
  console.log(`Target directory is ${program.out ? program.out : '(DEFAULTING to) ./api-swag'}`);
  if (program.forceAuth) {
    console.log('Basic Authorization forcing enabled.');
  }

  generator.run(swaggerPath, program.out, { forcedAuth: Boolean(program.forceAuth) })
        .then((files) => {
          console.log('\nGenerated files:');
          for (const f of files) {
            console.log(f);
          }
          const altPath = `${process.cwd()}/api-swag`;
          console.log(`${program.out ? program.out : altPath}/package.json`);
          console.log('\n');
          console.log('HOW TO run tests:');
          console.log('1. (optional) if APIs are authenticated through Basic Authentication (or -f flag is used), set USERNAME and USERPASSWD env variables');
          console.log(`2. cd ${program.out ? program.out : './api-swag'} && npm i &&  [USERNAME=<username> USERPASSWD=<userpasswd>] npm test\n`);
          console.log('Example: USERNAME=james USERPASSWD=my$trongPa$$word npm test\n');
        })
        .catch((err) => {
          console.error(err);
          process.exit(1);
        });
}


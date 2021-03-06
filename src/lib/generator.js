const parser = require('./parser').parser;
const fs = require('fs');
const path = require('path');
const skeleton = require('./common/templates/skeleton');
const getCredentials = require('../utils/cmd').getBasicAuthCredentials;
const debug = require('debug')('API-SWAG:Generator');

const commonTestsFileName = 'commonTests.js';
const commonTestsDir = `${__dirname}/common`;

function createWorkingDir(dirPath) {
  const dir = path.normalize(dirPath);
  if (!fs.existsSync(dir)) {
    debug('Creating dir: ', dir);
    fs.mkdirSync(dir);
  }
}

function createPackageJSON(toDir = 'api-swag') {
  const pack = {
    name: 'API-PIKI-generated-tests',
    version: '1.1.0',
    description: 'API tests generated by API-PIKI package, edit them as required',
    license: 'MIT',
    scripts: {
      test: './node_modules/mocha/bin/mocha ./*.js --reporter=spec --no-timeouts',
    },
    devDependencies: {
      chai: '^3.5.0',
      mocha: '^3.2.0',
      nyc: '^10.1.2',
      rewire: '^2.5.2',
      supertest: '^3.0.0',
      debug: '^2.6.1',
      jsonpolice: 'latest',
    },
  };
  createWorkingDir(toDir);
  return fs.writeFileSync(path.normalize(`${toDir}/package.json`), JSON.stringify(pack));
}

function copyCommonTests({ srcFile = `${commonTestsDir}/${commonTestsFileName}`, toDir = 'api-swag' } = {}) {
  const src = path.normalize(srcFile);
  const dest = path.normalize(`${toDir}/${commonTestsFileName}`);
  debug(`copying ${src} to ${dest}`);
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(dest);
    writeStream.on('error', err => reject(err));
    writeStream.on('finish', () => {
      debug('All writes are now complete.');
      resolve(dest);
    });
    fs.createReadStream(src).pipe(writeStream);
  });
}

function writeToFile(testSkeleton, outputDir = `${process.cwd()}/api-swag`) {
  return new Promise((resolve, reject) => {
    const file = path.normalize(`${outputDir}/${testSkeleton.name}.js`);
    debug('writing file: ', file);
    createWorkingDir(outputDir);
    fs.writeFile(file, testSkeleton.skeleton, err => (err ? reject(err) : resolve(file)));
  });
}

const sketch = (parsedSwag, outputDir = `${process.cwd()}/api-swag`, options = {}) => {
  const api = parsedSwag.api;
  const tasks = [];
  for (const ep of api.endpoints) {
    for (const m of ep.methods) {
        // current version supports BASIC Authentication only
      const isAuth = options.forcedAuth || m.authSchemes.map(a => Object.values(a)[0]).includes('basic');
      const { username, userpasswd } = getCredentials();
      tasks.push(writeToFile(skeleton.getTest({ baseURL: `${api.schemes[0]}://${api.host}${api.basePath}`, endpointPath: ep.path, method: m.operation, isAuthenticated: isAuth, username: username, userpasswd: userpasswd }), outputDir));
    }
  }
  tasks.push(copyCommonTests({ toDir: outputDir }));
  return Promise.all(tasks)
        .then((values) => {
          debug('results:', values);
          console.log(`${values.length} test file${values.length > 1 || values.length < 1 ? 's' : ''} created.`);
          return values;
        });
};

exports.sketch = sketch;

exports.run = (swaggerFile, outputDir = `${process.cwd()}/api-swag`, options = {}) => {
  debug('Running parser...');
  createPackageJSON(outputDir);
  return parser.parse(swaggerFile)
        .then((api) => {
          const { forcedAuth } = options;
          return sketch(api, outputDir, forcedAuth);
        })
        .catch((err) => {
          console.dir(err);
        });
};





exports.createPackageJSON = createPackageJSON;




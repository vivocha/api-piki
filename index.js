#!/usr/bin/env node
const program = require('commander');
const generator = require('./src/lib/generator');
const path = require('path');

program
    .usage('[options] <spec>')
    .version(require('./package.json').version)
    .arguments('<spec>')
    .action( spec => {
        specFile = spec;        
    })
    .option('-o, --out [outDir]', 'Output directory for generated test files. Default: ./test/api-swag') 
    .option('-f, --forceAuth', 'Force generation of authenticated tests using Basic Authentication, even if spec doesn\'t declare it. In this case be sure to set USERNAME and USERPASSWD env variables when running tests')   
    .parse(process.argv);

    if(typeof specFile === 'undefined') {
        console.log('API specification file / URL not provided');
        process.exit(1);
    } else {        
        let swaggerPath = ( specFile.startsWith('http:') || specFile.startsWith('https:') ) ? specFile : `file://${path.resolve(specFile)}`;
        console.log(`\nGenerating API tests for ${specFile}`);
        console.log(`Target directory is ${program.out ? program.out : '(DEFAULTING to) ./api-swag'}`);
        if(program.forceAuth) {
            console.log('Basic Authorization forcing enabled.');
        }
        generator.run(swaggerPath, program.out, {forcedAuth: program.forceAuth ? true : false})
            .then( files =>  {               
                console.log('\nGenerated files:');
                for( f of files ) {
                    console.log(f);
                }
                console.log(`${program.out ? program.out : process.cwd()+'/api-swag'}/package.json`);
                console.log('\n');
                console.log('HOW TO run tests:');
                console.log('1. (optional) if APIs are authenticated through Basic Authentication (or -f flag is used), set USERNAME and USERPASSWD env variables');
                console.log(`2. cd ${program.out ? program.out : './api-swag'} && npm i &&  [USERNAME=<username> USERPASSWD=<userpasswd>] npm test\n`);
                console.log('Example: USERNAME=james USERPASSWD=my$trongPa$$word npm test\n');

            } )
            .catch( err => {                              
                console.error(err);
                process.exit(1);
            });               
        
    }


    
    
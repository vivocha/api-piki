const should = require('chai').should();
const fs = require('fs');
const path = require('path');
const {API, Endpoint, Method} = require('../src/model/api');
const { api, api2, api3 } = require('./apiMock');
let generator = require('../src/lib/generator');
const {rmdir, countFiles} = require('../src/utils/filesystem');

const outDir = path.normalize(`${process.cwd()}/api-swag`);

describe('Sketching tests for the API Mock', function() {    
    it('should result in creating all the files in the right path, one for endpoint', function(done) { 
        generator.sketch( {api: api} ).then( res => {
            countFiles(outDir).should.be.equal(res.length);
            done();
        } )
        .catch( err => done(err));                
    });
    after(function() {    
        rmdir(outDir);
    }); 
});
describe('Sketching tests for the API Mock', function() {    
    it('should result in creating all the files in the right path, one for endpoint', function(done) { 
        generator.sketch( {api: api2} ).then( res => {
            countFiles(outDir).should.be.equal(res.length);
            done();
        } )
        .catch( err => done(err));                
    });
    after(function() {    
        rmdir(outDir);
    }); 
});
describe('Sketching tests for the API Mock', function() {    
    it('should result in creating all the files in the right path, one for endpoint', function(done) { 
        generator.sketch( {api: api3} ).then( res => {
            countFiles(outDir).should.be.equal(res.length);
            done();
        } )
        .catch( err => done(err));                
    });
    after(function() {    
        rmdir(outDir);
    }); 
});
describe('Sketching tests for an empty API Mock', function() {
    before( function() {
        fs.mkdirSync(outDir);
    });    
    it('should result in creating all the files in the right path, one for endpoint', function(done) { 
        generator.sketch( {api: new API( {host: 'MOCKSERVER.api.com', basePath: '/v2', info: 'My super-cool mock APIs', schemes:['https']} )} ).then( res => {
            countFiles(outDir).should.be.equal(res.length);
            done();
        } )
        .catch( err => done(err));                
    });
    after(function() {    
        rmdir(outDir);
    });
    
});

describe('Sketching tests for the API Mock at a custom directory', function() {
    let outDir = './ANOTHER-OUTDIR';   
    it('should result in creating all the files in the right path, one for endpoint', function(done) {         
        generator.sketch( {api: api}, outDir ).then( res => {
            countFiles(outDir).should.be.equal(res.length);
            done();
        } )
        .catch( err => done(err));                
    });
    after(function() {  
        rmdir(path.normalize(outDir));
    }); 
});

describe('Running test generation for a swagger file', function() {    
    it('should result in creating all the files at the right path, one for endpoint', function(done) { 
        const fileName = 'file://'+path.resolve(process.cwd(), 'test/pet-swagger.json');
        generator.run(fileName)
            .then( res =>  {
                countFiles(outDir).should.be.equal(res.length + 1);
                done();
            } )
            .catch( err => done(err) );                     
    });
    after(function() {    
        rmdir(outDir);
    });
});

describe('Running test generation for a VVC swagger file', function() {    
    it('should result in creating all the files at the right path, one for endpoint', function(done) { 
        const fileName = 'file://'+path.resolve(process.cwd(), 'test/vvc-swagger.json');
        generator.run(fileName)
            .then( res =>  {               
                countFiles(outDir).should.be.equal(res.length + 1);
                done();
            } )
            .catch( err => done(err) );                     
    });    
    after(function() {    
        rmdir(outDir);
    });
});

describe('Running test generation for a VVC swagger file at a custom directory', function() {
    let testsDir = './ANOTHER-VVC-OUTDIR';     
    it('should result in creating all the files at the right path, one for endpoint', function(done) { 
        const fileName = 'file://'+path.resolve(process.cwd(), 'test/vvc-swagger.json');
        generator.run(fileName, testsDir)
            .then( res =>  {               
                countFiles(testsDir).should.be.equal(res.length + 1);
                done();
            } )
            .catch( err => done(err) );                     
    });    
    after(function() {    
        rmdir(path.normalize(testsDir));
    });   
});
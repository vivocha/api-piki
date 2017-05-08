const should = require('chai').should();
let rewire = require('rewire');
const fs = require('fs');
const path = require('path');
const rmdir = require('../src/utils/filesystem').rmdir;

describe('writing a skeleton to file', function() {    
    it('should result in creating the file at the right path', function(done) {
        let testGen = rewire('../src/lib/generator');
        let writeToFile = testGen.__get__("writeToFile");
        writeToFile({
            name: 'GETFakeThings', 
            skeleton: 'const info = "this is a test skeleton";'
        })
        .then(path => {
            (function(){
                fs.accessSync(path)
            }).should.not.throw(Error);           
            fs.unlinkSync(path);
            done();
        })
        .catch(err => done(err));                            
    }); 

    it('should fail in creating a wrong content', function(done) {
        let testGen = rewire('../src/lib/generator');
        let writeToFile = testGen.__get__("writeToFile");

        const file = path.normalize(`${process.cwd()}/api-swag/FAKE.js`)
        fs.writeFileSync(file, 'just a fake file');
        fs.chmodSync(file, 0444);
        writeToFile({
            name: 'FAKE', 
            skeleton: 'const fake = "test";'
        })
        .then(path => {            
            (function(){
                fs.accessSync(path)
            }).should.not.throw(Error);           
            fs.unlinkSync(path);
            done();
        })
        .catch(err => {
            should.exist(err);
            fs.unlinkSync(file);
            done()
        });                            
    });    
    

    it('should result in creating the right dirs if they not exist and writing the file at the right path', function(done) {
        const dir = path.normalize(`${process.cwd()}/api-swag`);      
        rmdir(dir);        
        let testGen = rewire('../src/lib/generator');
        let writeToFile = testGen.__get__("writeToFile");
        writeToFile({
            name: 'GETFakeThings', 
            skeleton: 'const info = "this is a test skeleton";'
        })
        .then(path => {
            (function(){
                fs.accessSync(path);
            }).should.not.throw(Error);           
            fs.unlinkSync(path);
            done()
        })
        .catch(err => done(err));                            
    });   
});


describe('Copying commonTests.js', function() {    
    it('should result in copying the default file to /api-swag', function(done) {
        let testGen = rewire('../src/lib/generator');
        let copyCommonTests = testGen.__get__("copyCommonTests");
        copyCommonTests()
        .then(() => {
              fs.existsSync(path.normalize(`${process.cwd()}/api-swag/commonTests.js`)).should.be.true;
              fs.stat(path.normalize(`${process.cwd()}/api-swag/commonTests.js`), (err, stats) => {
                    if(err) done(err);
                    else {
                        stats.size.should.be.above(0);
                        done();      
                    }
              }); 
        })
        .catch((err) => done(err));      
    });    
});

describe('Copying commonTests.js', function() {    
    it('for to a restricted destination should result in an Error', function(done) {
        let testGen = rewire('../src/lib/generator');
        let copyCommonTests = testGen.__get__("copyCommonTests");
        copyCommonTests( {toDir: './test/FAKE-TEST-DIR'} )
        .then(dest => {            
            done();                   
        })
        .catch(err => {
            should.exist(err);
            done();
        });      
    });    
});


after(function() {    
    rmdir(path.normalize(`${process.cwd()}/api-swag`));
});




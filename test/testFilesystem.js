const should = require('chai').should();
const fs = require('fs');
const path = require('path');
const rmdir = require('../src/utils/filesystem').rmdir;

describe('testing rmdir()', function() {    
    it('should remove the directory', function(done) {
        let dir = path.normalize(`${process.cwd()}/test/BAD-DIR`);
        fs.mkdirSync(dir);
        (function(){
                fs.accessSync(dir);
        }).should.not.throw(Error);
        rmdir(dir);
        (function(){
                fs.accessSync(dir);
        }).should.throw(Error);
        done();                         
    });   
    it('should remove a dir with files', function(done) {
        let dir = path.normalize(`${process.cwd()}/test/BAD-DIR`);
        fs.mkdirSync(dir);
        (function(){
                fs.accessSync(dir);
        }).should.not.throw(Error);
        let f = path.normalize(`${dir}/BAD-FILE.txt`);
        fs.writeFileSync(f, 'just a test');    
        rmdir(dir);
        (function(){
                fs.accessSync(dir);
        }).should.throw(Error);
        done();                         
    });  
    it('should remove a dir with a dir', function(done) {
        let dir = path.normalize(`${process.cwd()}/test/BAD-DIR`);
        fs.mkdirSync(dir);
        (function(){
                fs.accessSync(dir);
        }).should.not.throw(Error);
        let dirB = path.normalize(`${dir}/BAD-BAD-DIR`);
        fs.mkdirSync(dirB);
        rmdir(dir);
        (function(){
                fs.accessSync(dir);
        }).should.throw(Error);
        done();                         
    });
    it('should do nothing for an inexistent dir', function(done) {
        let dir = path.normalize(`${process.cwd()}/test/BAD-DIR`);   
        (function(){
            rmdir(dir);   
        }).should.not.throw(Error);                 
        done();                         
    });  
    
});
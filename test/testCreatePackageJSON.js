const should = require('chai').should();
const fs = require('fs');
const path = require('path');
const createPackageJSON = require('../src/lib/generator').createPackageJSON;
const {rmdir, countFiles} = require('../src/utils/filesystem');

describe('Creating a package.json', function() { 
    let testsDir = './test/ANOTHER-TEST-OUTDIR';     
    it('should result in a package.json file written at specified dir', function(done) {        
        createPackageJSON(testsDir); 
        countFiles(testsDir).should.be.equal(1);
        let pack = require('./ANOTHER-TEST-OUTDIR/package.json');
        pack.should.have.property('version');
        done();
    });    
    after(function() {    
        rmdir(path.normalize(testsDir));
    });
 
});





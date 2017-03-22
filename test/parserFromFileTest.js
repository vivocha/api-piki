const should = require('chai').should();
const path = require('path');

const fileName = 'file://'+path.resolve(process.cwd(), 'test/pet-swagger.json');

describe('importing the parser', function(){
    it('should be an Object', function(done){
        const parser = require('../src/lib/parser').parser;
        parser.should.be.an('object');
        done();
    });
    it('should have a method parse()', function(done) {
        const parser = require('../src/lib/parser').parser;
        parser.should.include.keys('parse');
        parser.parse.should.be.a('function');   
        done();
    });
});
describe('fetching a descr from an existing file', function() {
    it('should return a Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(`${fileName}`);
        swag.should.be.a('promise');
        done();        
    });
    it('should return a resolved Promise with a JSON data', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(`${fileName}`);
        swag
            .then((data) => {
                data.should.be.an('object');
                data.should.have.property('original');
                data.should.have.property('api');
                done();
            })
            .catch((err) => {
                console.dir(err);
                done(err);
            });               
    });    
});
describe('fetching a descr from an inexistent file', function() {
    it('should return a Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(`${fileName}.fake`);
        swag.should.be.a('promise');
        swag.catch((err) => {
                err.should.be.ok;
                done();
        });        
    });
    it('should return a rejected Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        parser.parse(`${fileName}.fake`)
            .catch((err) => {
                err.should.be.ok;
                done();
            });               
    });    
});






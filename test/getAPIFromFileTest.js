const should = require('chai').should();
const path = require('path');

const fileName = 'file://'+path.resolve(process.cwd(), 'test/vvc-swagger.json');


describe('fetching a descr from an existing file', function() {
    it('should return a Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(`${fileName}`);
        swag.should.be.a('promise');
        done();        
    });
    it('should return a resolved Promise with an API object', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(`${fileName}`);
        swag
            .then((data) => {
                data.should.be.an('object');
                data.should.have.property('original');
                data.should.have.property('api');
                //console.dir(data.api, {colors: true, depth: null});
                done();
            })
            .catch((err) => {
                console.dir(err);
                done(err);
            });               
    });    
});



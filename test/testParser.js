const should = require('chai').should();
const path = require('path');

const fileName = 'file://'+path.resolve(process.cwd(), 'test/vvc-swagger.json');


describe('Parse a valid Swagger (from file)', function() {    
    it('should return a resolved Promise with an API object, and API Object should have all parsed properties', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(`${fileName}`);
        swag
            .then((data) => {
                data.should.be.an('object');
                data.should.have.property('original');
                data.should.have.property('api');                
                for (ep of data.api.endpoints) {
                    ep.should.have.property('path');
                    ep.should.have.property('methods');
                    ep.should.not.have.property('authSchemes');
                    for (m of ep.methods) {                       
                        m.should.have.property('operation');
                        m.operation.should.not.be.an('object');
                        m.should.have.property('params');
                        m.should.have.property('authSchemes');
                        m.authSchemes.should.be.an('array');
                    }
                }
                done();
            })
            .catch((err) => {
                console.dir(err);
                done(err);
            });               
    });    
});



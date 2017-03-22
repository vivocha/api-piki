
const should = require('chai').should();
const {API, Endpoint, Method} = require('../src/model/api');


describe('importing and creating all API models', function(){
    it('should be OK', function(done){
        let api = new API({host: 'myserver.api.com', basePath: '/v2', info: 'My super-cool API', schemes:['https']});
        let endpoint = new Endpoint('/books', []);
        let method = new Method('GET');
        api.should.be.ok    
        endpoint.should.be.ok 
        method.should.be.ok       
        done();
    });
    
});


describe('API model, ', function(){
    it('adding new endpoints should work', function(done){
        let api = new API({host: 'myserver.api.com', basePath: '/v2', info: 'My super-cool API', schemes:['https']});
        let endpoint = new Endpoint('/books', []);
        api.addEndpoint(endpoint);
        api.endpoints.should.be.an('array');
        api.endpoints.length.should.be.equal(1);
        api.endpoints[0].path.should.be.equal('/books');    
        done();
    });
    
});

describe('Endpoint model, ', function(){
    it('methods in constructor should be an array', function(done){       
        let endpoint = new Endpoint('/books', []);
        done();
    });  
    it('methods in constructor should be an array by default when omitted', function(done){       
        let endpoint = new Endpoint('/books');
        done();
    });
    it('constructor with methods != array should throw an Error', function(done){
        (function(){
            new Endpoint('/books', {});
        }).should.throw(Error);
        done();
    });   
});






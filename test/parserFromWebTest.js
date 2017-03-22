const should = require('chai').should();
const petSwagger = 'http://petstore.swagger.io/v2/swagger.json';
const vvcSwagger = 'http://127.0.0.1:3636';

let server; 
before( function() {
        const http = require('http');
        const path = require('path');
        const fs = require('fs');

        const hostname = '127.0.0.1';
        const port = 3636;

        server = http.createServer((req, res) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            var rstream = fs.createReadStream(path.normalize(process.cwd()+'/test/vvc-swagger-wBasicAuth.json'));
            rstream.pipe(res); 
           
        });

        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
            
        });
});

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
describe('fetching a descr from an existing http URL', function() {
    it('should return a Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(petSwagger);
        swag.should.be.a('promise');
        done();        
    });
    it('should return a resolved Promise with a valid Object', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(petSwagger);
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
describe('fetching a descr from a not existing http URL', function() {
    it('should return a Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(`${petSwagger}.fake`);
        swag.should.be.a('promise');
        swag.catch((err) => {
                err.should.be.ok;
                done();
        });        
    });
    it('should return a rejected Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        parser.parse(`${petSwagger}.fake`)
            .catch((err) => {
                err.should.be.ok;
                done();
            });               
    });    
});
describe('fetching a descr from an existing https URL', function() {
    it('should return a Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(vvcSwagger);
        swag.should.be.a('promise');
        done();        
    });
    it('should return a resolved Promise with a valid Object', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(vvcSwagger);
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
describe('fetching a descr from an inexistent https URL', function() {
    it('should return a Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(`${vvcSwagger}.fake`);
        swag.should.be.a('promise');
        swag.catch((err) => {
                err.should.be.ok;
                done();
        });        
    });
    it('should return a rejected Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        parser.parse(`${vvcSwagger}.fake`)
            .catch((err) => {
                err.should.be.ok;
                done();
            });               
    });    
});
describe('fetching a descr from a malformed URL', function() {
    it('should return a Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(`\\${vvcSwagger}.fake`);
        swag.should.be.a('promise');
        swag.catch((err) => {
                err.should.be.ok;
                done();
        });        
    });
    it('should return a rejected Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        parser.parse(`||!${vvcSwagger}.fake`)
            .catch((err) => {
                err.should.be.ok;
                done();
            });               
    });    
});

describe('fetching a descr from a malformed URL', function() {
    it('should return a Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(`\\${vvcSwagger}.fake`);
        swag.should.be.a('promise');
        swag.catch((err) => {
                err.should.be.ok;
                done();
        });        
    });
    it('should return a rejected Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        parser.parse(`||!${vvcSwagger}.fake`)
            .catch((err) => {
                err.should.be.ok;
                done();
            });               
    });    
});

describe('fetching a descr from an inexistent server URL', function() {
    it('should return a Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse('https://myfakeserver.nope.com');
        swag.should.be.a('promise');
        swag.catch((err) => {
                err.should.be.ok;
                done();
        });        
    });
    it('should return a rejected Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        parser.parse('https://myfakeserver.nope.com')
            .catch((err) => {
                err.should.be.ok;
                done();
            });               
    });    
});

describe('fetching a descr from an existing https URL', function() {
    it('should return a Promise', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(vvcSwagger);
        swag.should.be.a('promise');
        done();        
    });
    it('should return a resolved Promise with a JSON data', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(vvcSwagger);
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

after( function() {
    console.log('Closing http server');
    server.close( () => {
        console.log('http server closed');
    })
});

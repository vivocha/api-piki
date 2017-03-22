const should = require('chai').should();
const path = require('path');

const fileName = 'http://127.0.0.1:3737';

let server; 
before( function() {
        const http = require('http');
        const path = require('path');
        const fs = require('fs');

        const hostname = '127.0.0.1';
        const port = 3737;

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


describe('fetching a descr from an existing url', function() {
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


after( function() {
    console.log('Closing http server');
    server.close( () => {
        console.log('http server closed');
    })
});
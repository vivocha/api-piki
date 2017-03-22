const should = require('chai').should();
const path = require('path');

const fileName = 'file://'+path.resolve(process.cwd(), 'test/vvc-swagger.json');


describe('Parsing a swagger (from file)', function() {    
    it('should return a resolved Promise with an API object, and API Object should have all VVC parsed properties', function(done) {
        const parser = require('../src/lib/parser').parser;
        let swag = parser.parse(`${fileName}`);
        swag
            .then((data) => {
                data.should.be.an('object');
                data.should.have.property('original');
                data.should.have.property('api');
                let api = data.api;

                //console.dir(api, {colors: true, depth: null});

                api.host.should.be.equal(data.original.host);
                api.basePath.should.be.equal(data.original.basePath);
                api.info.should.be.deep.equal(data.original.info);
                api.schemes.should.be.deep.equal(data.original.schemes);


                let vvcPaths = Object.keys(data.original.paths);
                for (ep of api.endpoints) {
                    ep.should.have.property('path');
                    ep.should.have.property('methods');
                    ep.should.not.have.property('authSchemes');
                    vvcPaths.should.include(ep.path);

                    let vvcMethods = Object.keys(data.original.paths[ep.path]);
                    for (m of ep.methods) {                       
                        m.should.have.property('operation');
                        m.operation.should.not.be.an('object');
                        vvcMethods.should.include(m.operation);
                        
                        m.should.have.property('params'); 
                        originalParams = data.original.paths[ep.path][m.operation].parameters.map( p  => {
                            if(p.$ref && p.$ref.startsWith('#')){
                                return data.original.parameters[p.$ref.split('/').pop()];
                            } else {
                                return p; 
                            }
                        });
                        for (p of m.params) {
                            originalParams.should.include(p);
                        }              
                                                
                        m.should.have.property('authSchemes');
                        m.authSchemes.should.be.an('array');
                        if('security' in data.original.paths[ep.path][m.operation]){
                            let security = data.original.paths[ep.path][m.operation].security.map( s => Object.keys(s).pop() );
                            for (schema of m.authSchemes) {
                                security.should.include(Object.keys(schema).pop());                         
                           }
                        } 
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



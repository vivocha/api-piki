const should = require('chai').should();
const skeleton = require('../src/lib/common/templates/skeleton');

describe('Skeleton templating', function() {    
    it('should return a valid test skeleton', function(done) {
        const test = skeleton.getTest({baseURL: 'https://api.myserver.test.com', endpointPath: '/users'});
        test.should.be.an('object');    
        test.should.have.property('name'); 
        test.should.have.property('skeleton');  
        done();          
    });    
});
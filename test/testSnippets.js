const should = require('chai').should();
const {
    skipComment,
    okSnippet,
    errorSnippet,
    commonAuthTest,
    requirements,
    jsonListingTest,
    notFoundForFakeTest,
    testNoEmptyObjsInListsTest,
    testNotValidIdsTest
    
} = require('../src/lib/common/templates/snippets');

describe('Code Snippets', function() {    
    it('JSONListing should be correct', function(done) {
        let url = 'https://a.b.c';
        let ep = '/things';
        let isAuth = true;
        let usr = 'Diego';
        let passwd = 'Armando';
        jsonListingTest(url, ep, isAuth, usr, passwd).should.be.equal(`common.testJSONListing({baseURL: "${url}", endpointPath: "${ep}", isAuthenticated: ${isAuth}, username: username, userpasswd: userpasswd });`);
        done();                         
    }); 
    it('404 for fake resources should be correct', function(done) {
        let url = 'https://a.b.c';        
        let isAuth = true;
        let usr = 'Diego';
        let passwd = 'Armando';
        notFoundForFakeTest(url, isAuth, usr, passwd).should.be.equal(`common.test404ForFakeResources({baseURL: "${url}", fakeResources: ['aDummyResource','anotherBrickIntheWall','fakeOrDieResource'], isAuthenticated: ${isAuth}, username: username, userpasswd: userpasswd });`);
        done();                         
    });
    it('testNoEmptyObjsInListsTest should be correct', function(done) {
        let url = 'https://a.b.c';   
        let ep = '/things'     
        let isAuth = true;
        let usr = 'Diego';
        let passwd = 'Armando';
        testNoEmptyObjsInListsTest(url, ep, isAuth, usr, passwd).should.be.equal(`common.testNoEmptyObjsInLists( { baseURL: "${url}", endpoint: "${ep}", isAuthenticated: ${isAuth}, username: username, userpasswd: userpasswd } );`);
        done();                         
    });     
    it('testNotValidIdsTest should be correct', function(done) {
        let url = 'https://a.b.c';   
        let ep = '/things'     
        let isAuth = true;
        let usr = 'Diego';
        let passwd = 'Armando';
        let method = 'get';
        testNotValidIdsTest(url, method, ep, {}, isAuth, usr, passwd).should.be.equal(`common.testNotValidIds( { baseURL: "${url}", method: "${method}", endpoint: "${ep}", isAuthenticated: ${isAuth}, username: username, userpasswd: userpasswd } );`);
        done();                         
    });  
    it('skipComment snippet should be correct', function(done) {
        skipComment.should.be.equal( `//This test skeleton IS INCOMPLETE. 
//To complete it read the comments below and remove the skip() function.
//See Mocha documentation for more about skip: https://mochajs.org/#inclusive-tests`);
        done();
    });
    
});


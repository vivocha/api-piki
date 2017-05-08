/**
 * Common Snippets for Chai/Should based tests
 */

const skipComment = `//This test skeleton IS INTENTIONALLY INCOMPLETE. 
//To complete it read the comments below and remove the skip() function from tests after completing them.
//See Mocha documentation for more info about skip(): https://mochajs.org/#inclusive-tests`;



const okSnippet = `    if (err) return done(err);
                    else {
                        should.not.exist(err);
                        should.exist(res.body);
                        //TODO: complete test and response body validation       
                                    
                    }
`;

const errorSnippet = `  should.exist(res.body);
                    res.body.should.be.an('object');
                    const errorBody = res.body;
                    errorBody.should.be.ok;
                    //TODO: complete error body validation
`;


const getBasicAuthCredentials = () => 'const { username, userpasswd } = common.getBasicAuthCredentials();';
const commonAuthTest = (baseURL, method, endpointPath) => `common.testAuthentication( {baseURL: "${baseURL}", method: "${method}", endpoint: "${endpointPath}", username: username, userpasswd: userpasswd});`;

const requirements = baseURL => `
const should = require('chai').should();
const supertest = require('supertest');
const common = require('./commonTests');  
const request = supertest('${baseURL}');  
`;

const jsonListingTest = (baseURL, endpointPath, isAuthenticated = false) => `common.testJSONListing({baseURL: "${baseURL}", endpointPath: "${endpointPath}", isAuthenticated: ${isAuthenticated}, username: username, userpasswd: userpasswd });`;
const notFoundForFakeTest = (baseURL, isAuthenticated = false) => `common.test404ForFakeResources({baseURL: "${baseURL}", fakeResources: ['aDummyResource','anotherBrickIntheWall','fakeOrDieResource'], isAuthenticated: ${isAuthenticated}, username: username, userpasswd: userpasswd });`;
const testNoEmptyObjsInListsTest = (baseURL, endpointPath, isAuthenticated = false) => `common.testNoEmptyObjsInLists( { baseURL: "${baseURL}", endpoint: "${endpointPath}", isAuthenticated: ${isAuthenticated}, username: username, userpasswd: userpasswd } );`;
const testNotValidIdsTest = (baseURL, method = 'get', endpointPath, body = {}, isAuthenticated = false) => `common.testNotValidIds( { baseURL: "${baseURL}", method: "${method}", endpoint: "${endpointPath}", isAuthenticated: ${isAuthenticated}, username: username, userpasswd: userpasswd } );`;
const deleteTest = ( baseURL, endpointPath, body = {}, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd' ) => `common.testDelete = ( {baseURL: "${baseURL}" , endpoint: "${endpointPath}", body:${body}, isAuthenticated: ${isAuthenticated}, username: username, userpasswd: userpasswd } );`

module.exports = {
    skipComment,
    okSnippet,
    errorSnippet,
    getBasicAuthCredentials,
    commonAuthTest,
    requirements,
    jsonListingTest,
    notFoundForFakeTest,
    testNoEmptyObjsInListsTest,
    testNotValidIdsTest,
    deleteTest
}
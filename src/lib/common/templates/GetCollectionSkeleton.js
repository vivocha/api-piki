const {
    skipComment,
    okSnippet,
    errorSnippet,
    getBasicAuthCredentials,
    commonAuthTest,
    requirements,
    jsonListingTest,
    notFoundForFakeTest,
    testNoEmptyObjsInListsTest,
} = require('./snippets');

exports.getTest = ({ baseURL, method = 'get', endpointPath, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd', isError = false, statusCode = 200, description = 'WRITE YOUR TEST CASE DESCRIPTION HERE' }) => `/**
 * Generated test skeleton for ${isAuthenticated ? 'an authenticated' : ''} ${method.toUpperCase()} ${endpointPath}
 */

${skipComment}
${requirements(baseURL)}
${getBasicAuthCredentials()}
describe('GET ${endpointPath}', function() {
${notFoundForFakeTest(baseURL, isAuthenticated, username, userpasswd)}
${isAuthenticated ? `${commonAuthTest(baseURL, method, endpointPath, username, userpasswd )}` : ''}
${jsonListingTest(baseURL, endpointPath, isAuthenticated, username, userpasswd)}
${testNoEmptyObjsInListsTest(baseURL, endpointPath, isAuthenticated, username, userpasswd)};
//the following test case is incomplete and can be used as a template to write new cases
describe.skip('${method.toUpperCase()} ${endpointPath}', function(){
    it('${description}', function(done){
        request
            .get('${endpointPath}')${isAuthenticated ? `
            .auth(username, userpasswd)`:''}
            .set('Accept', 'application/json')
            .expect(${statusCode})
            .expect('Content-Type', /json/)
            .end(function(err, res){
            ${isError ? errorSnippet : okSnippet} 
            done();               
            });
    });
});
});`; // end skeleton

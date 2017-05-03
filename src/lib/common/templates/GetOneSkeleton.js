const {
    skipComment, 
    okSnippet, 
    errorSnippet,
    getBasicAuthCredentials, 
    commonAuthTest, 
    requirements,
    testNotValidIdsTest
} = require('./snippets');

exports.getTest = ({baseURL, method = 'get', endpointPath, isAuthenticated=false, username = 'test_user', userpasswd = 'test_passw0rd', isError=false, statusCode=200, description="WRITE YOUR TEST CASE DESCRIPTION HERE"}) => {
    return  `/**
 * Generated test skeleton for ${isAuthenticated ? 'an authenticated' : ''} ${method.toUpperCase()} ${endpointPath}
 */

${skipComment}
${requirements(baseURL)}
${getBasicAuthCredentials()}
describe('GET ${endpointPath}', function() {
${isAuthenticated ? `${commonAuthTest(baseURL, method, endpointPath.replace(/{.+}/, 'aSuperFakeID'), username, userpasswd )}` : ''}
${testNotValidIdsTest(baseURL, method, endpointPath.replace(/{.+}/, ''), {}, isAuthenticated, username, userpasswd)}

describe.skip('${method.toUpperCase()} ${endpointPath} for an existing resource', function(){
    let existingID;
    before(function(done){
        //CREATE here a valid resource and save its ID in existingID variable...
        existingID = '123'; // ...replacing this line.
        done();
    });
    it('should return a 200 OK with a valid resource body', function(done){
        request
            .get(\`\${"${endpointPath}".replace(/{.+}/, existingID)}\`)${isAuthenticated ? `
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
});`}; //end skeleton     

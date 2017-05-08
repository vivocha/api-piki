const {
    skipComment,
    requirements,
    commonAuthTest,
    getBasicAuthCredentials,
} = require('./snippets');

exports.getTest = ({ baseURL, method = 'get', endpointPath, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd' }) => `/**
 * Generated test skeleton for ${isAuthenticated ? 'an authenticated' : ''} ${method.toUpperCase()} ${endpointPath}
 */
${skipComment}
${requirements(baseURL)}
${getBasicAuthCredentials()}
describe('DELETE ${endpointPath}', function() {
${isAuthenticated ? `${commonAuthTest(baseURL, method, endpointPath, username, userpasswd)}` : ''}

    //the following test case is incomplete and can be used as a template to write new cases
    describe.skip('${method.toUpperCase()} ${endpointPath}', function(){
        it('TBD, write test case in the context of your DELETE ${endpointPath} semantics');
    });



})`; // end skeleton

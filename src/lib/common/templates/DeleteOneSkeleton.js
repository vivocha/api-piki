const {
    skipComment,
    commonAuthTest,
    requirements,
    testNotValidIdsTest,
    deleteTest,
    getBasicAuthCredentials,
} = require('./snippets');

exports.getTest = ({ baseURL, method = 'get', endpointPath, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd' }) => `/**
 * Generated test skeleton for ${isAuthenticated ? 'an authenticated' : ''} ${method.toUpperCase()} ${endpointPath}
 */

${skipComment}
${requirements(baseURL)}
${getBasicAuthCredentials()}
describe('DELETE ${endpointPath}', function() {
${isAuthenticated ? `${commonAuthTest(baseURL, method, endpointPath.replace(/{.+}/, 'aSuperFakeID', username, userpasswd))}` : ''}


//TODO: Edit the following variable setting it to a valid resource body
const validResourceBody = {

};
describe.skip('${method.toUpperCase()} ${endpointPath}', function(){
    ${testNotValidIdsTest(baseURL, method, endpointPath.replace(/{.+}/, ''), {}, isAuthenticated, username, userpasswd)}
    ${deleteTest(baseURL, endpointPath, "validResourceBody", isAuthenticated, username, userpasswd)}
});

});`; // end skeleton

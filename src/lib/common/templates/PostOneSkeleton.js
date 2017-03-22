const {
    skipComment,   
    commonAuthTest, 
    requirements, 
    getBasicAuthCredentials
} = require('./snippets');

exports.getTest = ({baseURL, method = 'get', endpointPath, isAuthenticated=false, username = 'test_user', userpasswd = 'test_passw0rd', isError=false, statusCode=200, description="WRITE YOUR TEST CASE DESCRIPTION HERE"}) => {
    return  `/**
 * Generated test skeleton for ${isAuthenticated ? 'an authenticated' : ''} ${method.toUpperCase()} ${endpointPath}
 */
${skipComment}
${requirements(baseURL)}
${getBasicAuthCredentials()}
${isAuthenticated ? `${commonAuthTest(baseURL, method, endpointPath.replace(/{.+}/, 'aSuperFakeID', username, userpasswd ))}` : ''}

//the following test case is incomplete and can be used as a template to write new cases
describe.skip('${method.toUpperCase()} ${endpointPath}', function(){
    it('TBD, write test case in the context of your POST ${endpointPath}/{id} semantics');
});



`}; //end skeleton     

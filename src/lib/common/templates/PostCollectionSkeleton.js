const {
    skipComment, 
    okSnippet, 
    errorSnippet, 
    getBasicAuthCredentials,
    commonAuthTest, 
    requirements,    
} = require('./snippets');

exports.getTest = ({baseURL, method = 'get', endpointPath, isAuthenticated=false, username = 'test_user', userpasswd = 'test_passw0rd', isError=false, statusCode=200, description="WRITE YOUR TEST CASE DESCRIPTION HERE"}) => {
    return  `/**
 * Generated test skeleton for ${isAuthenticated ? 'an authenticated' : ''} ${method.toUpperCase()} ${endpointPath}
 */

${skipComment}
${requirements(baseURL)}
${getBasicAuthCredentials()}
describe('POST ${endpointPath}', function() {
${isAuthenticated ? `${commonAuthTest(baseURL, method, endpointPath, username, userpasswd )}` : ''}

describe.skip('POST Test Suite', function() {

    //the following test case is incomplete and can be used as a template to write new cases
    describe('${method.toUpperCase()} ${endpointPath} with not valid resource data', function(){
        it('should return a 400 Bad Request error', function(done) {
            //Edit this variable with a not valid resource data
            const resourceData = {

            };
            request
                .post('${endpointPath}')${isAuthenticated ? `
                .auth(username, userpasswd)`:''}
                .set('Accept', 'application/json')
                .send(resourceData)
                .expect(400)
                .expect('Content-Type', /json/)
                .end(function(err, res){
                    ${errorSnippet}
                    done();                
                });
        });

        after('the resource should not exist', function(done){
            // write here the code to check resource inexistence in your system
            //for example calling a GET /${endpointPath}/{id} and checking for a 404...

            done();
        });    
    });

    //the following test case is incomplete and can be used as a template to write new cases
    describe('${method.toUpperCase()} ${endpointPath} with valid resource data', function(){
        it('should return a 201 status and a new resource should be created', function(done) {
            //Edit this variable with a valid resource data
            const resourceData = {

            };
            request
                .post('${endpointPath}')${isAuthenticated ? `
                .auth(username, userpasswd)`:''}
                .set('Accept', 'application/json')
                .send(resourceData)
                .expect(201)
                .expect('Content-Type', /json/)
                .end(function(err, res){
                    ${okSnippet}
                    done();                
                });
        });

        it('after a successful POST, the resource should exist in the system, check for it with a GET');

        after('Delete the Resource created by POST', function(done){
            //Delete the resource from your system,
            //for example calling a DELETE /${endpointPath}/{id}
            //where {id} is the id of the resource created by POST
            done();
        });      
    });

});

});`}; //end skeleton     

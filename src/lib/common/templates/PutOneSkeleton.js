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
${isAuthenticated ? `${commonAuthTest(baseURL, method, endpointPath.replace(/{.+}/, 'aSuperFakeID', username, userpasswd ))}` : ''}


//the following test case is incomplete and can be used as a template to write new cases
describe.skip('PUT Test Suite', function() {
    ${testNotValidIdsTest(baseURL, method, endpointPath.replace(/{.+}/, ''), {}, isAuthenticated, username, userpasswd)}
    
    describe('${method.toUpperCase()} ${endpointPath} with not valid resource data', function(){
        let existingID;
        before('create a new resource for PUT tests', function(done){
            // write here the code to create a resource in your system
            // for example doing a POST...
            // save its ID in existingID variable...
            existingID = '123'; // ...replacing this line.        
            done();
        });

        it('should return a 400 Bad Request error', function(done) {
            //Edit this variable with a not valid resource data
            const resourceData = {

            };
            request
                .put(\`\${"${endpointPath}".replace(/{.+}/, existingID)}\`)${isAuthenticated ? `
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

        after('the resource should not be updated', function(done){
            // write here the code to check resource fields that shouldn't be updated
            //for example calling a GET /${endpointPath} 
            //then DELETE the resource created for test.
            done();
        });    
    });

    //the following test case is incomplete and can be used as a template to write new cases
    describe('${method.toUpperCase()} ${endpointPath} with valid resource data', function(){
        let existingID;
        before('create a new resource for PUT tests', function(done){
            // write here the code to create a resource in your system
            // for example doing a POST...
            // save its ID in existingID variable...
            existingID = '123'; // ...replacing this line.        
            done();
        });

        it('should return a 200 status the resource should be updated', function(done) {
            //Edit this variable with a valid resource data
            const resourceData = {

            };
            request
                .put(\`\${"${endpointPath}".replace(/{.+}/, existingID)}\`)${isAuthenticated ? `
                .auth(username, userpasswd)`:''}
                .set('Accept', 'application/json')
                .send(resourceData)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res){
                    ${okSnippet}
                    done();                
                });
        });
        after('the resource should be updated', function(done){
            // write here the code to check resource fields that should be updated
            //for example calling a GET /${endpointPath} 
            //then DELETE the resource created for test.
            done();
        }); 
    });
});


`}; //end skeleton     

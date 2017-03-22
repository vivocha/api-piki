/**
 * Common mocha + chai/should test for listing resources through a generic GET /resources
 */

exports.testJSONListing = ( ({baseURL, path, body = {}, username = 'test_user', userpasswd = 'test_passw0rd'}) => { 
    if (!resourceName) throw new Error('Resource name not provided. It is mandatory. E.g.: Book, User, Application');
    if (!baseURL) throw new Error('Base URL not provided');
    const request = supertest(baseURL);  
    
    describe(`GET ${path}`, function(){
        it('with valid auth, should be OK and always respond with a JSON object', function(done){
            request
                .get(`${path}`)
                .auth(username, userpasswd)
                .set('Accept', 'application/json')
                .expect((res) => {
                    if(res.status !== 200 && res.status !== 204) throw new Error(`Expected response status was 200 or 204, got ${res.status} instead`)
                })
                .expect('Content-Type', /json/, done);
        });
    });
});

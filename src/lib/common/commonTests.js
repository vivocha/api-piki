//API-Piki Common Tests

const should = require('chai').should();
const supertest = require('supertest');
const jsonpolice = require('jsonpolice');


var getEndpoint = resourceName => `/${resourceName.toLowerCase()}s`;

exports.getEndpoint = getEndpoint;

exports.getBasicAuthCredentials = () =>  ({
    username: process.env.USERNAME,
    userpasswd: process.env.USERPASSWD
});

//future developments ;)
exports.fetchJSONSchema = (schemasURL, resourceName) => { 
    return new Promise((resolve, reject) => {
        debug(`schemasURL: ${schemasURL}, resourceName: ${resourceName}`);
        const request = supertest(schemasURL+'/');
        jsonpolice.create(resourceName, {
            retriever: function retriever(url) {
                            return new Promise((resolve, reject) => {
                                request
                                    .get(url)
                                    .expect('Content-Type', /json/)
                                    .end((err, res) => {
                                        //console.log(err, res);
                                        if(err) return reject(err);                                    
                                        else resolve(res.body);
                                    });
                            });                       
            }
        })
        .then(schema => {
            return resolve(schema);
        })
        .catch(err => {
            return reject(err);
        });
    });     
};

//This function calls a GET to retrieve a list of the given resource name and tests status, content and its type.
exports.testJSONListing =  ({baseURL, endpointPath, isAuthenticated=false, username = 'test_user', userpasswd = 'test_passw0rd'}) => { 
    if (!endpointPath) throw new Error('endpoint path not provided. It is mandatory.');
    if (!baseURL) throw new Error('Base URL not provided');
    const request = supertest(baseURL);    
    console.log(`Starting testJSONListing common tests for ${baseURL}${endpointPath}`);
    describe(`GET ${endpointPath}`, function(){
        it('should be OK and always respond with a JSON', function(done){
            let req = request.get(`${endpointPath}`);
            if(isAuthenticated){
                 req.auth(username, userpasswd);
            }
            req.set('Accept', 'application/json')
                .expect((res) => {
                    if(res.status !== 200 && res.status !== 204) throw new Error(`Expected response status was 200 or 204, got ${res.status} instead`)
                })
                .expect('Content-Type', /json/, done);
        });
    });
};


//This function performs some repetitive tests about Basic Authentication against provided endpoints
exports.testAuthentication = ( {baseURL, method = 'get', endpoint, username = 'test_user', userpasswd = 'test_passw0rd'} ) => {
    if (!endpoint) throw new Error('Endpoint URL not provided. It must be provided as "/path[/:id]"');
    if (!baseURL) throw new Error('Base URL not provided');
    const request = supertest(baseURL);

    console.log(`Starting authentication common tests for ${method.toUpperCase()} ${baseURL}${endpoint}`); 

    describe(`Calling ${method.toUpperCase()} ${endpoint}`, function(){

        it('with no authentication should return a 401', function(done){
            request[method](endpoint)
                .set('Accept', 'application/json')
                .expect(401)
                .expect('Content-Type', /json/, done);
        });

        it('with wrong username, should return a 401', function(done){
            request[method](endpoint)
                .auth(username + Math.ceil(Math.random()*1000), userpasswd)
                .set('Accept', 'application/json')
                .expect(401)
                .expect('Content-Type', /json/, done);
        });

        it('with wrong password, should return a 401', function(done){
            request[method](endpoint)
                .auth(username, userpasswd + Math.ceil(Math.random()*1000))
                .set('Accept', 'application/json')
                .expect(401)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if(err) return done(err);
                    else{
                        done();
                    }
                });
        });
    });
};

//This function tests 404 Not Found errors for a given endpoint generating fake Ids
exports.testNotValidIds = ( {baseURL, method = 'get', endpoint, body = {}, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd'} ) => {
    if (!endpoint) throw new Error('Endpoint URL not provided. It must be provided as "/path[:id]"');
    if (!baseURL) throw new Error('Base URL not provided');
    if (!body && (method.toLowerCase()==='post' || method.toLowerCase()==='put')) throw new Error('Body not provided for a PUT or a POST');

    const request = supertest(baseURL);
    const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, endpoint.length-1) : endpoint;
    console.log(`Starting NotFound common tests for ${method.toUpperCase()} ${baseURL}${cleanEndpoint}`); 

    describe(`Calling ${method.toUpperCase()} ${cleanEndpoint}/:id`, function(){
        for (let i=1;i<10;i++){
            let fakeId = `${Math.ceil(Math.random()*i)}VVC${Math.random().toString(36).substr(2, 5).repeat(Math.random()*10)}`;
             it(`with a wrong, fake :id --> ${fakeId} should return a 404`, function(done){
                 let apiRequest = request[method](cleanEndpoint+'/'+fakeId);
                 if(isAuthenticated) apiRequest.auth(username, userpasswd);
                 apiRequest
                    .set('Accept', 'application/json')
                    .expect(404)
                    //CHECK the next expectation to match content-type
                    //.expect('Content-Type', /json/);
                    if (method.toLowerCase()==='post' || method.toLowerCase()==='put'){
                        apiRequest.send(body);
                    }            
                    apiRequest.end(function(err, res){
                        if(err) done(err);
                        else {
                            should.exist(res.body);
                            res.body.should.be.an('object');
                            let errorBody = res.body;
                            errorBody.should.be.ok;
                            //VALIDATE the error body response                           
                            done();
                        }
                    });
            });//-- it
         }//-- for
    });
};

//Specifying inexistent fields in path, it must not return lists of resources with empty objects
exports.testNoEmptyObjsInLists = ( {baseURL, endpoint, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd'} ) => {
    if (!endpoint) throw new Error('Endpoint URL not provided. It must be provided as "/path"');
    if (!baseURL) throw new Error('Base URL not provided');
    const request = supertest(baseURL);
    console.log(`Starting noEmptyObjects in lists common tests for GET ${baseURL}${endpoint}`);
    describe(`Calling GET ${endpoint}?fields=RandomFieldName`, function(){
        it('with not existing fields should not return empty objects', function(done){
            let req = request.get(`${endpoint}?fields=${Math.random().toString(36).substr(2, 5)}`);
            if(isAuthenticated){
                req.auth(username, userpasswd);
            }
            req.set('Accept', 'application/json')            
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function(err, res){
                    if(err) done(err);
                    else {
                        should.exist(res.body);
                        res.body.should.be.an('array');
                        let list = res.body;
                        for(let obj of list){
                            obj.should.be.ok;                        
                            obj.should.not.be.empty;
                        }                    
                        done();
                    }
               });
        });
    });
};

//This function tests the DELETE operation for an endpoint given a valid body format. 
exports.testDelete = ({baseURL, endpoint, body = {}, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd'}) => {
    if (!endpoint) throw new Error('Endpoint path name not provided. It is mandatory.');
    if (!baseURL) throw new Error('Base URL not provided');
    const request = supertest(baseURL);    
    console.log(`Starting testDelete common tests for DELETE ${baseURL}${endpoint}`);
    let validID;

    describe(`DELETE ${endpoint}`, function(){

        before('Create a Resource', function(done){        
            let req = request.post(endpoint.replace(/{.+}/, ''));
                if(isAuthenticated) req.auth(username, userpasswd);
                req.send(body)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .expect(201)
                .expect('Content-Type', /json/)
                .end(function(err, res){
                    if(err) done(err);
                    else {
                        should.exist(res.body);
                        res.body.should.be.an('object');
                        if (res.body.hasOwnProperty('id')){
                            validID = res.body.id;
                        } else {
                            validID = res.body._id;
                        }                        
                        done();                      
                    }
                });
        });

        it('should return 200 OK and the Resource should be removed', function(done){
            //DELETE
            let req = request.delete(`${endpoint.replace(/{.+}/, validID)}`);
            if(isAuthenticated) req.auth(username, userpasswd);
            req.set('Accept', 'application/json')            
                .expect(200)
                .end(function(err, res){
                    //Checking the delete
                    let req = request.get(`${endpoint.replace(/{.+}/, validID)}`)
                    if(isAuthenticated) req.auth(username, userpasswd);
                    req.set('Accept', 'application/json')
                        .expect(404)
                        .expect('Content-Type', /json/)
                        .end(function(err, res){
                            if (err) return done(err);
                            else {
                                should.not.exist(err);
                                done();
                            }                           
                        });  
                });    
        });  
    }); 
};
 
//this function tests generic 404 Not Found errors for GETs against a list of fake resources
exports.test404ForFakeResources = ({baseURL, fakeResources = ['aDummyResource','anotherBrickIntheWall','fakeOrDieResource'], isAuthenticated=false, username = 'test_user', userpasswd = 'test_passw0rd'}) => {
    const request = supertest(baseURL);
    describe('Getting a fake resource name', function(){
        for(let r of fakeResources){
            it(`like ${baseURL}/${r} should return a 404`, function(done){
                let req = request.get(`/${r}`);
                    if(isAuthenticated) req.auth(username, userpasswd);
                    req.expect(404, done);         
            });
        }    
    });
};




// API-Piki Common Tests
/* global describe it before after*/
const should = require('chai').should();
const supertest = require('supertest');
const jsonpolice = require('jsonpolice');
const debug = require('debug')('API-Piki:CommonTests');


const getEndpoint = resourceName => `/${resourceName.toLowerCase()}s`;

exports.getEndpoint = getEndpoint;

exports.getBasicAuthCredentials = () => ({
  username: process.env.USERNAME,
  userpasswd: process.env.USERPASSWD,
});

// Future developments ;)
exports.fetchJSONSchema = (schemasURL, resourceName) => new Promise((resolve, reject) => {
  debug(`schemasURL: ${schemasURL}, resourceName: ${resourceName}`);
  const request = supertest(`${schemasURL}/`);
  jsonpolice.create(resourceName, {
    retriever: function retriever(url) {
      return new Promise((resolve, reject) => {
        request
            .get(url)
            .expect('Content-Type', /json/)
            .end((err, res) => {
              if (err) return reject(err);
              return resolve(res.body);
            });
      });
    },
  })
        .then(schema => resolve(schema))
        .catch(err => reject(err));
});

// calls a GET to retrieve a list of the given resource name and tests status, content and its type.
exports.testJSONListing = ({ baseURL, endpointPath, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd' }) => {
  if (!endpointPath) throw new Error('endpoint path not provided. It is mandatory.');
  if (!baseURL) throw new Error('Base URL not provided');
  const request = supertest(baseURL);
  console.log(`Starting testJSONListing common tests for ${baseURL}${endpointPath}`);
  describe(`GET ${endpointPath}`, () => {
    it('should be OK and always respond with a JSON', (done) => {
      const req = request.get(`${endpointPath}`);
      if (isAuthenticated) {
        req.auth(username, userpasswd);
      }
      req.set('Accept', 'application/json')
                .expect((res) => {
                  if (res.status !== 200 && res.status !== 204) throw new Error(`Expected response status was 200 or 204, got ${res.status} instead`);
                })
                .expect('Content-Type', /json/, done);
    });
  });
};


// Performs some repetitive tests about Basic Authentication against provided endpoints
exports.testAuthentication = ({ baseURL, method = 'get', endpoint, username = 'test_user', userpasswd = 'test_passw0rd' }) => {
  if (!endpoint) throw new Error('Endpoint URL not provided. It must be provided as "/path[/:id]"');
  if (!baseURL) throw new Error('Base URL not provided');
  const request = supertest(baseURL);

  console.log(`Starting authentication common tests for ${method.toUpperCase()} ${baseURL}${endpoint}`);

  describe(`Calling ${method.toUpperCase()} ${endpoint}`, () => {
    it('with no authentication should return a 401', (done) => {
      request[method](endpoint)
                .set('Accept', 'application/json')
                .expect(401)
                .expect('Content-Type', /json/, done);
    });

    it('with wrong username, should return a 401', (done) => {
      request[method](endpoint)
                .auth(username + Math.ceil(Math.random() * 1000), userpasswd)
                .set('Accept', 'application/json')
                .expect(401)
                .expect('Content-Type', /json/, done);
    });

    it('with wrong password, should return a 401', (done) => {
      request[method](endpoint)
                .auth(username, userpasswd + Math.ceil(Math.random() * 1000))
                .set('Accept', 'application/json')
                .expect(401)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                  if (err) return done(err);
                  debug(res);
                  return done();
                });
    });
  });
};

// Tests 404 Not Found errors for a given endpoint generating fake Ids
exports.testNotValidIds = ({ baseURL, method = 'get', endpoint, body = {}, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd' }) => {
  if (!endpoint) throw new Error('Endpoint URL not provided. It must be provided as "/path[:id]"');
  if (!baseURL) throw new Error('Base URL not provided');
  if (!body && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) throw new Error('Body not provided for a PUT or a POST');

  const request = supertest(baseURL);
  const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, endpoint.length - 1) : endpoint;
  console.log(`Starting NotFound common tests for ${method.toUpperCase()} ${baseURL}${cleanEndpoint}`);

  describe(`Calling ${method.toUpperCase()} ${cleanEndpoint}/:id`, () => {
    for (let i = 1; i < 10; i += 1) {
      const fakeId = `${Math.ceil(Math.random() * i)}VVC${Math.random().toString(36).substr(2, 5).repeat(Math.random() * 10)}`;
      it(`with a wrong, fake :id --> ${fakeId} should return a 404`, (done) => {
        const apiRequest = request[method](`${cleanEndpoint}/${fakeId}`);
        if (isAuthenticated) apiRequest.auth(username, userpasswd);
        apiRequest
                    .set('Accept', 'application/json')
                    .expect(404);
        if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
          apiRequest.send(body);
        }
        apiRequest.end((err, res) => {
          if (err) done(err);
          else {
            should.exist(res.body);
            res.body.should.be.an('object');
            const errorBody = res.body;
            // eslint-disable-next-line
            errorBody.should.be.ok;
            // VALIDATE the error body response
            done();
          }
        });
      });// -- it
    }// -- for
  });
};

// Specifying inexistent fields in path, it must not return lists of resources with empty objects
exports.testNoEmptyObjsInLists = ({ baseURL, endpoint, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd' }) => {
  if (!endpoint) throw new Error('Endpoint URL not provided. It must be provided as "/path"');
  if (!baseURL) throw new Error('Base URL not provided');
  const request = supertest(baseURL);
  console.log(`Starting noEmptyObjects in lists common tests for GET ${baseURL}${endpoint}`);
  describe(`Calling GET ${endpoint}?fields=RandomFieldName`, () => {
    it('with not existing fields should not return empty objects', (done) => {
      const req = request.get(`${endpoint}?fields=${Math.random().toString(36).substr(2, 5)}`);
      if (isAuthenticated) {
        req.auth(username, userpasswd);
      }
      req.set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                  if (err) done(err);
                  else {
                    should.exist(res.body);
                    res.body.should.be.an('array');
                    const list = res.body;
                    for (const obj of list) {
                      /* eslint-disable */
                      obj.should.be.ok;                      
                      obj.should.not.be.empty;
                      /* eslint-enable */
                    }
                    done();
                  }
                });
    });
  });
};

// Tests the DELETE operation for an endpoint given a valid body format.
exports.testDelete = ({ baseURL, endpoint, body = {}, isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd' }) => {
  if (!endpoint) throw new Error('Endpoint path name not provided. It is mandatory.');
  if (!baseURL) throw new Error('Base URL not provided');
  const request = supertest(baseURL);
  console.log(`Starting testDelete common tests for DELETE ${baseURL}${endpoint}`);
  let validID;

  describe(`DELETE ${endpoint}`, () => {
    before('Create a Resource', (done) => {
      const req = request.post(endpoint.replace(/{.+}/, ''));
      if (isAuthenticated) req.auth(username, userpasswd);
      req.send(body)
                .set('Accept', 'application/json')
                .set('Content-Type', 'application/json')
                .expect(201)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                  if (err) done(err);
                  else {
                    should.exist(res.body);
                    res.body.should.be.an('object');
                    if (Object.prototype.hasOwnProperty.call(res.body, 'id')) {
                      validID = res.body.id;
                    } else {
                      // eslint-disable-next-line
                      validID = res.body._id;
                    }
                    done();
                  }
                });
    });

    it('should return 200 OK and the Resource should be removed', (done) => {
      // DELETE
      const req = request.delete(`${endpoint.replace(/{.+}/, validID)}`);
      if (isAuthenticated) req.auth(username, userpasswd);
      req.set('Accept', 'application/json')
                .expect(200)
                .end(() => {
                  // Checking the delete
                  const req = request.get(`${endpoint.replace(/{.+}/, validID)}`);
                  if (isAuthenticated) req.auth(username, userpasswd);
                  req.set('Accept', 'application/json')
                        .expect(404)
                        .expect('Content-Type', /json/)
                        .end((err) => {
                          if (err) return done(err);
                          should.not.exist(err);
                          return done();
                        });
                });
    });
  });
};

// this function tests generic 404 Not Found errors for GETs against a list of fake resources
exports.test404ForFakeResources = ({ baseURL, fakeResources = ['aDummyResource', 'anotherBrickIntheWall', 'fakeOrDieResource'], isAuthenticated = false, username = 'test_user', userpasswd = 'test_passw0rd' }) => {
  const request = supertest(baseURL);
  describe('Getting a fake resource name', () => {
    for (const r of fakeResources) {
      it(`like ${baseURL}/${r} should return a 404`, (done) => {
        const req = request.get(`/${r}`);
        if (isAuthenticated) req.auth(username, userpasswd);
        req.expect(404, done);
      });
    }
  });
};





class Endpoint {
  constructor(path, methods = []) {
    if (!Array.isArray(methods)) throw new Error('methods param in Endpoint constructor must be an array');
    this.path = path;
    this.methods = methods;
  }
}

class Method {
  constructor({ operation = 'get', params = {}, queryParams = {}, request = {}, responses = {}, authSchemes = [{ basic: 'basic' }] }) {
    this.operation = operation;
    this.params = params;
    this.queryParams = queryParams;
    this.request = request;
    this.responses = responses;
    this.authSchemes = authSchemes;
  }
}

class API {
  constructor({ host, basePath, info, schemes }) {
    this.host = host;
    this.basePath = basePath;
    this.info = info;
    this.endpoints = [];
    this.schemes = schemes;
  }

  addEndpoint(e) {
    this.endpoints.push(e);
  }
}

module.exports = {
  Endpoint,
  API,
  Method,
};


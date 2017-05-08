const url = require('url');
const fs = require('fs');
const request = require('request');
const _ = require('lodash');
const { API, Endpoint, Method } = require('../model/api');
const debug = require('debug')('API-SWAG:parser');

const toAPIObj = (swagData) => {
  const api = new API({
    host: swagData.host,
    basePath: swagData.basePath,
    info: swagData.info,
    schemes: swagData.schemes,
  });
  const endpoints = _.mapValues(swagData.paths, (path) => {
    const methods = [];
    for (const op of Object.keys(path)) {
      methods.push(new Method({
        operation: op,
        params: path[op].parameters ?
                    path[op].parameters.map((p) => {
                      if (p.$ref && p.$ref.startsWith('#')) {
                        return swagData.parameters[p.$ref.split('/').pop()];
                      }
                      return p;
                    }).filter(p => p.in === 'path') : [],
        queryParams: path[op].parameters ?
                    path[op].parameters.map((p) => {
                      if (p.$ref && p.$ref.startsWith('#')) {
                        return swagData.parameters[p.$ref.split('/').pop()];
                      }
                      return p;
                    }).filter(p => p.in === 'query') : [],
        responses: path[op].responses,
        authSchemes: (path[op].security) ?
                    (path[op].security.map((s) => {
                      const secKey = Object.keys(s).pop();
                      return (swagData.securityDefinitions[secKey]) ?
                            { [secKey]: swagData.securityDefinitions[secKey].type } :
                            null;
                    }).filter(p => p !== null))
                    : [],
      }));
    }
    return methods;
  });
  for (const ep in endpoints) {
    if (ep) api.addEndpoint(new Endpoint(ep, endpoints[ep]));
  }
  debug('Parsed API', api);
  return api;
};


const fetchFromWeb = specURL =>
    new Promise((resolve, reject) => {
      request({ url: specURL }, (err, res, body) => {
        if (err) reject(err);
        else if (res.statusCode === 200) {
          resolve({ original: JSON.parse(body), api: toAPIObj(JSON.parse(body)) });
        } else reject(new Error(res.statusMessage));
      });
    });

const fetchFromFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, { encoding: 'utf8' },
            (error, data) => {
              if (error) {
                reject(error);
              } else {
                resolve({ original: JSON.parse(data), api: toAPIObj(JSON.parse(data)) });
              }
            });
});

const parseSpec = (swaggerURL) => {
  try {
    const sourceURL = new url.URL(swaggerURL);
    return (sourceURL.protocol === 'http:' || sourceURL.protocol === 'https:') ? fetchFromWeb(sourceURL) : fetchFromFile(sourceURL);
  } catch (error) {
    return Promise.reject(error);
  }
};




exports.parser = {
  parse(specURL) { return parseSpec(specURL); },
};

const url = require('url');
const fs = require('fs');
const request = require('request');
const _ = require('lodash');
const {API, Endpoint, Method} = require('../model/api');
const debug = require('debug')('API-SWAG:parser');

exports.parser = {
     parse(url) { return _parse(url); }
};
const _parse = (swaggerURL) => {        
    try {
        let sourceURL = new url.URL(swaggerURL);
        return (sourceURL.protocol === 'http:' || sourceURL.protocol === 'https:') ? _fetchFromWeb(sourceURL) : _fetchFromFile(sourceURL);
    } catch (error) {
        return Promise.reject(error);
    }
};
const _fetchFromWeb = (url) => {
    return new Promise((resolve, reject) => {
        request({url: url}, (err, res, body) => {
            if(err) reject(err);
            else (res.statusCode === 200) ? resolve({ original: JSON.parse(body), api: _toAPIObj(JSON.parse(body)) }) : reject(new Error(res.statusMessage));            
        })
    });
};
const _fetchFromFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'utf8' },
            (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve( { original: JSON.parse(data), api: _toAPIObj(JSON.parse(data)) });
                }
        });
    });
};
const _toAPIObj = (swagData) => {
    let api = new API( {host: swagData.host, basePath: swagData.basePath , info: swagData.info, schemes: swagData.schemes} );   
    let endpoints = _.mapValues(swagData.paths, (path, k, o) => {    
        let methods = [];
        for (op of Object.keys(path)) {
            methods.push( new Method( { operation: op, 
                params: path[op].parameters ? 
                path[op].parameters.map( p => {
                    if(p.$ref && p.$ref.startsWith('#')){
                        return swagData.parameters[p.$ref.split('/').pop()];
                    } else {
                        return p; 
                    }
                }).filter( p => {                      
                    return p.in === 'path';                    
                }) : [],
                queryParams: path[op].parameters ?
                path[op].parameters.map( p => {
                    if(p.$ref && p.$ref.startsWith('#')){
                        return swagData.parameters[p.$ref.split('/').pop()];
                    } else {
                        return p; 
                    }
                }).filter( p => {                      
                    return p.in === 'query';                    
                }) : [],
                responses: path[op].responses,                
                authSchemes: (path[op].security) ? 
                             (path[op].security.map( s => {
                                    let secKey = Object.keys(s).pop();
                                    return (swagData.securityDefinitions[secKey]) ?
                                        {[secKey]: swagData.securityDefinitions[secKey].type} :
                                        null;

                             } ).filter( p => p!==null)) 
                             : []
            } ));
        };
        return methods;
    });
    for (ep in endpoints){
        api.addEndpoint(new Endpoint(ep, endpoints[ep]));
    }
    debug('Parsed API', api);
    //console.dir(api, {colors: true, depth: null});
    return api;
}
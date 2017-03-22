const {API, Endpoint, Method} = require('../src/model/api');

let api = new API( {host: 'MOCKSERVER.api.com', basePath: '/v2', info: 'My super-cool mock APIs', schemes:['https']} );
let method1 = new Method( {operation: 'GET'} );
let method2 = new Method( {operation: 'POST'} );
let method3 = new Method( {operation: 'PUT'} );
let endpoint1 = new Endpoint('/authors', [method1, method2]);
let endpoint2 = new Endpoint('/books', [method2, method3]);
let endpoint3 = new Endpoint('/reviews', [method1, method3]);
api.endpoints = [endpoint1, endpoint2, endpoint3];



let api2 = new API( {host: 'MOCKSERVER.api.com', basePath: '/v2', info: 'My super-cool mock APIs', schemes:['https']} );
let method21 = new Method( {operation: 'GET'} );
let method22 = new Method( {operation: 'POST'} );
let method23 = new Method( {operation: 'PUT'} );
let method24 = new Method( {operation: 'DELETE'} );
let endpoint21 = new Endpoint('/authors', [method21, method22]);
let endpoint22 = new Endpoint('/books', [method22, method23]);
let endpoint23 = new Endpoint('/reviews', [method21, method23, method24]);
api2.endpoints = [endpoint21, endpoint22, endpoint23];

let api3 = new API( {host: 'MOCKSERVER.api.com', basePath: '/v2', info: 'My super-cool mock APIs', schemes:['https']} );
let method31 = new Method( {operation: 'GET'} );
let method32 = new Method( {operation: 'POST'} );
let method33 = new Method( {operation: 'PUT'} );
let method34 = new Method( {operation: 'DELETE'} );
let endpoint31 = new Endpoint('/authors/', [method31, method32]);
let endpoint32 = new Endpoint('/books/', [method32, method33]);
let endpoint33 = new Endpoint('/reviews', [method31, method33, method34]);
api3.endpoints = [endpoint31, endpoint32, endpoint33];

module.exports = {
    api,
    api2,
    api3
}
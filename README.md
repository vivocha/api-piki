<br /><a href="https://github.com/pintux/api-piki"><img alt=":API-Piki" src="https://www.pintux.it/img/api-piki.png" width=350px/></a><br /><br />
**_Web APIs testing for lazy cats_.**<br/>
API-Piki for Node.js helps you generating recurrent test skeletons to catch bugs in your APIs described by an [OpenAPI Specification (fka Swagger) document](http://swagger.io/specification/).


[![travis build](https://img.shields.io/travis/vivocha/api-piki.svg)](https://travis-ci.org/vivocha/api-piki)
[![codecov coverage](https://img.shields.io/codecov/c/github/vivocha/api-piki.svg)](https://codecov.io/gh/vivocha/api-piki)
[![npm version](https://img.shields.io/npm/v/api-piki.svg)](https://www.npmjs.com/package/api-piki)


# API-Piki
If your Web/REST APIs are described by the [OpenAPI Specification (fka Swagger)](http://swagger.io/specification/), this tool generates some recurrent common test cases skeletons to extensively test your API.

API-Piki tools generate test cases written in JavaScript / Node.js, using [Mocha](https://mochajs.org/chai
) and [Chai / Should](http://chaijs.com) as foundation testing frameworks.

API-Piki is a perfect companion if you use **[Arrest](https://github.com/vivocha/arrest)** framework to specify and build your Web APIs with Node.js.


## Installation

```sh
npm install -g api-piki
```

## Quick Start
The quickest way to get started is to use the `piki` executable command-line tool to generate your tests, as shown below:

```bash
$ piki -o api-tests <OpenApi Spec File or URL>
```
where `<OpenApi Spec File or URL>` is the OpenAPI Spec local file path or its remote URL.

API-Piki generates all the common test suites in the specified output directory. Then, your tests are runnable (please, read **Generated code & Philosophy** section):

```bash
$ cd api-tests && npm i && npm test
```

## Command Line Options

The `piki` tests generator tool can also be further configured with the following command line flags.

    -h, --help          output usage information
    -V  --version       output the version number
    -o, --out           set output directory path   
    -f, --forceAuth     force tests generation using Basic Authentication 


## Generated code & Philosophy
Testing Web/REST APIs can be tedious and repetitive.
API-Piki philosophy is to provide a simple tool to generate some "Black Box" recurrent and common test skeletons for Web APIs described by OpenAPI Specification; then, the test skeletons can be edited and adapted in order to strictly match the particular API implementation/testing.

API-Piki tool generates the code for a set of common Mocha/Chai test suites. A different JavaScript file is generated per _method-endpoint-path_.
Generated code is not intended to be runnable as it is (despite it can be run). Instead, the ideal workflow is the following:

1. Run `piki` tool against an OpenAPI spec document;
2. Open and edit the generated test files in order to complete or adapt them (feel free to add new tests!). In particular, search for the code lines using Mocha's `describe.skip()` function (read more [here](https://mochajs.org/#inclusive-tests)) and choose to remove and adapt them to enable test cases. Also, please note that the current API-Piki version doesn't generate HTTP request bodies (it's on our roadmap).
3. Run the tests.

**WARNING**: Current version of the `piki` tool **overwrites** existing tests if you run it specifying an existing directory. So, be careful running the tool again if you edited the code.

## Limitations
Current version has the following limitations:

- `application/json` is the only supported format for endpoints;
- only Basic Authentication is supported as security scheme;
- it doesn't generate tests for pagination path params;
- it doesn't generate tests for query params;
- it doesn't generate JSON Object bodies for HTTP requests (nor parses JSON Schemas);

# Contributors

[Antonio Pintus](https://github.com/pintux) 

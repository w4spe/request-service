# request-service [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg?style=flat-square)](https://github.com/Flet/semistandard)

Simple node (v7.7.4+ required) request library.

## Installation

~~~ sh
$ npm i -S @w4spe/request-service
~~~

## Requirements

All functions set a bearer token by default, you must add `BEARER_TOKEN` to your environment variables.

## Asynchronous example

~~~ js
const requestService = require('@w4spe/requestService');

async function doSomething (data) {
  // Result contains the returned value by the API.
  const result = await requestService.post('api/do/something', data);

  return await requestService.get('api/get/anything');
}
~~~

## Synchronous example

~~~ js
const requestService = require('@w4spe/requestService');

function doSomething (data) {
  // Result contains the returned value by the API.
  const result = requestService.postSync('api/do/something', data);

  return requestService.getSync('api/get/anything');
}
~~~

## API

The following are the available functions:

- get
- getSync
- post
- postSync
- put
- putSync
- delete
- deleteSync

And their parameters:

- **url**: URL to use, required
- **data**: Data to add to body request, optional
- **isJSON**: Whether to add the data as JSON data or as URL encoded forms, optional
- **useToken**: Whether to add the authentication header

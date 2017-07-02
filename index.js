'use strict';

const deasync = require('deasync');
const encodeUrl = require('encodeurl');
const request = require('request');
const rp = require('request-promise');

async function get (url, data = null, isJson = true, useToken = true) {
  return await ajax('GET', url, data, isJson, useToken);
}

function getSync (url, data = null, isJson = true, useToken = true) {
  return ajaxSync('GET', url, data, isJson, useToken);
}

async function post (url, data = null, isJson = true, useToken = true) {
  return await ajax('POST', url, data, isJson, useToken);
}

function postSync (url, data = null, isJson = true, useToken = true) {
  return ajaxSync('POST', url, data, isJson, useToken);
}

async function update (url, data = null, isJson = true, useToken = true) {
  return await ajax('PUT', url, data, isJson, useToken);
}

function updateSync (url, data = null, isJson = true, useToken = true) {
  return ajaxSync('PUT', url, data, isJson, useToken);
}

async function _delete (url, data = null, isJson = true, useToken = true) {
  return await ajax('DELETE', url, data, isJson, useToken);
}

function deleteSync (url, data = null, isJson = true, useToken = true) {
  return ajaxSync('DELETE', url, data, isJson, useToken);
}

async function ajax (method, url, data = null, isJson = true, useToken = true) {
  const options = getOptions(method, url, data, isJson, useToken);

  const response = await rp(options);
  if (isJson) {
    return response;
  } else {
    try {
      return JSON.parse(response);
    } catch (ex) {
      return response;
    }
  }
}

function ajaxSync (method, url, data = null, isJson = true, useToken = true) {
  const options = getOptions(method, url, data, isJson, useToken);

  try {
    const response = _ajaxSync(options);

    if (isJson) {
      return response;
    } else {
      try {
        return JSON.parse(response);
      } catch (ex) {
        return response;
      }
    }
  } catch (ex) {
    if (/socket hang up/i.exec(ex.message)) {
      const message = `Resource unavailable: ${method} ${url}`;
      throw new Error(message);
    } else {
      throw ex;
    }
  }
}

function getOptions (method, url, data = null, isJson = true, useToken = true) {
  const options = {
    method: method,
    uri: encodeUrl(url),
    json: isJson
  };

  if (data !== null && isJson) {
    // Json data.
    options.body = data;
  } else if (data !== null && !isJson) {
    // URL-encoded forms.
    options.form = data;
  }

  if (useToken) {
    options.auth = {
      bearer: process.env.BEARER_TOKEN
    };
  }

  return options;
}

const _ajaxSync = deasync((options, cb) => {
  request(options, (err, res, body) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, body);
    }
  });
});

module.exports = {
  get: get,
  getSync: getSync,
  post: post,
  postSync: postSync,
  update: update,
  updateSync: updateSync,
  'delete': _delete,
  deleteSync: deleteSync
};

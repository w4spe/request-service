'use strict';

const deasync = require('deasync');
const encodeUrl = require('encodeurl');
const request = require('request');
const rp = require('request-promise');

module.exports = function (bearerToken = process.env.BEARER_TOKEN) {
  async function get (url, data = null, isJSON = true, useToken = true) {
    return await ajax('GET', url, data, isJSON, useToken);
  }

  function getSync (url, data = null, isJSON = true, useToken = true) {
    return ajaxSync('GET', url, data, isJSON, useToken);
  }

  async function post (url, data = null, isJSON = true, useToken = true) {
    return await ajax('POST', url, data, isJSON, useToken);
  }

  function postSync (url, data = null, isJSON = true, useToken = true) {
    return ajaxSync('POST', url, data, isJSON, useToken);
  }

  async function update (url, data = null, isJSON = true, useToken = true) {
    return await ajax('PUT', url, data, isJSON, useToken);
  }

  function updateSync (url, data = null, isJSON = true, useToken = true) {
    return ajaxSync('PUT', url, data, isJSON, useToken);
  }

  async function _delete (url, data = null, isJSON = true, useToken = true) {
    return await ajax('DELETE', url, data, isJSON, useToken);
  }

  function deleteSync (url, data = null, isJSON = true, useToken = true) {
    return ajaxSync('DELETE', url, data, isJSON, useToken);
  }

  async function ajax (method, url, data = null, isJSON = true, useToken = true) {
    const options = getOptions(method, url, data, isJSON, useToken);

    const response = await rp(options);
    if (isJSON) {
      return response;
    } else {
      try {
        return JSON.parse(response);
      } catch (ex) {
        return response;
      }
    }
  }

  function ajaxSync (method, url, data = null, isJSON = true, useToken = true) {
    const options = getOptions(method, url, data, isJSON, useToken);

    try {
      const response = _ajaxSync(options);

      if (isJSON) {
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

  function getOptions (method, url, data = null, isJSON = true, useToken = true) {
    const options = {
      method: method,
      uri: encodeUrl(url),
      json: isJSON
    };

    if (data !== null && isJSON) {
    // Json data.
      options.body = data;
    } else if (data !== null && !isJSON) {
    // URL-encoded forms.
      options.form = data;
    }

    if (useToken) {
      options.auth = {
        bearer: bearerToken
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

  return {
    get: get,
    getSync: getSync,
    post: post,
    postSync: postSync,
    update: update,
    updateSync: updateSync,
    'delete': _delete,
    deleteSync: deleteSync
  };
};

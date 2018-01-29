const Promise = require('bluebird');
const request = require('request-promise');
const _ = require('lodash');

const rejectMissingUrl = () => Promise.reject(new Error('Missing url'));
const rejectMissingBody = () => Promise.reject(new Error('Missing body'));

module.exports = ({apiKey = '', user = '', pass = '', version = 'v1'}) => {
  if (!apiKey) {
    throw new Error('Missing apiKey');
  }

  if (!user) {
    throw new Error('Missing user');
  }

  if (!pass) {
    throw new Error('Missing pass');
  }

  function _request(args) {
    return request.defaults({
      baseUrl: `https://app01.billbee.de/api/${version}`,
      json: true,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Billbee-Api-Key': apiKey,
      },
      auth: {
        user,
        pass
      }
    })(args).promise();
  }

  return {
    get(url, qs = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'GET', qs});
    },

    post(url, body) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      if (_.isEmpty(body)) {
        return rejectMissingBody();
      }

      return _request({url, method: 'POST', body});
    },

    put(url, body = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'PUT', body});
    },

    del(url) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'DELETE'});
    }
  };
};

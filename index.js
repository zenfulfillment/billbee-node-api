const Promise = require('bluebird');
const request = require('request-promise');
const _ = require('lodash');

const rejectMissingUrl = () => Promise.reject(new Error('Missing url'));
const rejectMissingBody = () => Promise.reject(new Error('Missing body'));

const bigIntStringify = (str) => str.replace(/:(\d{17})/g, ':"$1"');

module.exports = ({apiKey = '', user = '', pass = '', version = 'v1'} = {}, {stringifyBigInt = true} = {}) => {
  if (!apiKey) {
    throw new Error('Missing apiKey');
  }

  if (!user) {
    throw new Error('Missing user');
  }

  if (!pass) {
    throw new Error('Missing pass');
  }

  function maybeParse(res) {
    return stringifyBigInt ? JSON.parse(bigIntStringify(res)) : res;
  }

  async function delayIfLimitReached(err, fn) {
    if (err.statusCode === 429) {
      await Promise.delay(2500).then(() => fn());
    }
    throw err;
  }

  function _request(args) {
    return request.defaults({
      baseUrl: `https://app.billbee.io/api/${version}`,
      json: stringifyBigInt ? false : true,
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
      return _request({url, method: 'GET', qs})
        .then(maybeParse)
        .catch((err) => {
          return Promise.resolve(delayIfLimitReached(err, () => _request({
            url,
            method: 'GET',
            qs
          })));
        });
    },

    post(url, body) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      if (_.isEmpty(body)) {
        return rejectMissingBody();
      }

      return _request({url, method: 'POST', body, json: true})
        .catch((err) => {
          return Promise.resolve(delayIfLimitReached(err, () => _request({
            url,
            method: 'POST',
            body,
            json: true
          })));
        });
    },

    put(url, body = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'PUT', body, json: true})
        .catch((err) => {
          return Promise.resolve(delayIfLimitReached(err, () => _request({
            url,
            method: 'POST',
            body,
            json: true
          })));
        });
    },

    del(url) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'DELETE'})
        .then(maybeParse)
        .catch((err) => {
          return Promise.resolve(delayIfLimitReached(err, () => _request({
            url,
            method: 'DELETE',
          })));
        });;
    }
  };
};

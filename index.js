const Promise = require('bluebird');
const axios = require('axios');
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
    if (err.response && err.response.status === 429) {
      await Promise.delay(2500).then(() => fn());
    }
    throw err;
  }

  const axiosInstance = axios.create({
    baseURL: `https://app.billbee.io/api/${version}`,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Billbee-Api-Key': apiKey,
    },
    auth: {
      username: user,
      password: pass,
    },
  });

  function _request(config) {
    return axiosInstance(config);
  }

  return {
    get(url, params = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }
      return _request({url, method: 'GET', params})
        .then((res) => res.data)
        .then(maybeParse)
        .catch((err) => {
          return Promise.resolve(delayIfLimitReached(err, () => _request({
            url,
            method: 'GET',
            params
          })));
        });
    },

    post(url, data) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      if (_.isEmpty(data)) {
        return rejectMissingBody();
      }

      return _request({url, method: 'POST', data})
        .then((res) => res.data)
        .catch((err) => {
          return Promise.resolve(delayIfLimitReached(err, () => _request({
            url,
            method: 'POST',
            data
          })));
        });
    },

    put(url, data = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'PUT', data})
        .then((res) => res.data)
        .catch((err) => {
          return Promise.resolve(delayIfLimitReached(err, () => _request({
            url,
            method: 'POST',
            data
          })));
        });
    },

    patch(url, data = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'PATCH', data})
        .then((res) => res.data)
        .catch((err) => {
          return Promise.resolve(delayIfLimitReached(err, () => _request({
            url,
            method: 'PATCH',
            data
          })));
        });
    },

    del(url) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      return _request({url, method: 'DELETE'})
        .then((res) => res.data)
        .then(maybeParse)
        .catch((err) => {
          return Promise.resolve(delayIfLimitReached(err, () => _request({
            url,
            method: 'DELETE',
          })));
        });
    }
  };
};

const axios = require('axios');
const Promise = require('bluebird');
const _ = require('lodash');

const rejectMissingUrl = () => Promise.reject(new Error('Missing url'));
const rejectMissingBody = () => Promise.reject(new Error('Missing body'));

const bigIntStringify = (str) => str.replace(/:(\d{17})/g, ':"$1"');

module.exports = ({ apiKey = '', user = '', pass = '', version = 'v1' } = {}, { stringifyBigInt = true } = {}) => {
  if (!apiKey) {
    throw new Error('Missing apiKey');
  }

  if (!user) {
    throw new Error('Missing user');
  }

  if (!pass) {
    throw new Error('Missing pass');
  }

  const instance = axios.create({
    baseURL: `https://app.billbee.io/api/${version}`,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Billbee-Api-Key': apiKey,
    },
    auth: {
      username: user,
      password: pass
    }
  });

  function maybeParse(res) {
    return stringifyBigInt ? JSON.parse(bigIntStringify(res)) : res;
  }

  async function delayIfLimitReached(err, fn) {
    if (err.response && err.response.status === 429) {
      await Promise.delay(2500);
      return fn();
    }
    throw err;
  }

  async function _request(config) {
    try {
      const response = await instance(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  return {
    async get(url, params = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }
      try {
        const response = await _request({ url, method: 'GET', params });
        return maybeParse(response);
      } catch (err) {
        return delayIfLimitReached(err, () => _request({ url, method: 'GET', params }));
      }
    },

    async post(url, data) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      if (_.isEmpty(data)) {
        return rejectMissingBody();
      }

      try {
        return await _request({ url, method: 'POST', data, json: true });
      } catch (err) {
        return delayIfLimitReached(err, () => _request({ url, method: 'POST', data, json: true }));
      }
    },

    async put(url, data = {}) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      try {
        return await _request({ url, method: 'PUT', data, json: true });
      } catch (err) {
        return delayIfLimitReached(err, () => _request({ url, method: 'PUT', data, json: true }));
      }
    },

    async del(url) {
      if (_.isEmpty(url)) {
        return rejectMissingUrl();
      }

      try {
        const response = await _request({ url, method: 'DELETE' });
        return maybeParse(response);
      } catch (err) {
        return delayIfLimitReached(err, () => _request({ url, method: 'DELETE' }));
      }
    }
  };
};

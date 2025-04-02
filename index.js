const axios = require('axios');
const Promise = require('bluebird');

const rejectMissingUrl = () => Promise.reject(new Error('Missing url'));
const rejectMissingBody = () => Promise.reject(new Error('Missing body'));

const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

const bigIntStringify = (str) => {
  // If str is not a string, return it as is
  if (typeof str !== 'string') return str;
  
  // First, temporarily mask any TikTokOrderID occurrences
  // This pattern matches "TikTokOrderID:123456789..." with any number of digits
  const tikTokPattern = /(TikTokOrderID:\d+)/g;
  
  // Create a map of placeholders to real values
  const placeholders = {};
  let placeholderCount = 0;
  
  // Replace all TikTokOrderIDs with placeholders
  const maskedStr = str.replace(tikTokPattern, (match) => {
    const placeholder = `__TIKTOK_PLACEHOLDER_${placeholderCount++}__`;
    placeholders[placeholder] = match;
    return placeholder;
  });
  
  // Now apply the big integer conversion
  let processedStr = maskedStr.replace(/:(\d{17})/g, ':"$1"');
  
  // Restore the TikTokOrderID values
  for (const [placeholder, value] of Object.entries(placeholders)) {
    processedStr = processedStr.replace(placeholder, value);
  }
  
  return processedStr;
};

module.exports = ({apiKey = '', user = '', pass = '', version = 'v1'} = {}, {stringifyBigInt = true} = {}) => {
  if (!apiKey) {
    throw new Error('[billbee-node-api] Missing Credentials: apiKey');
  }

  if (!user) {
    throw new Error('[billbee-node-api] Missing Credentials: user');
  }

  if (!pass) {
    throw new Error('[billbee-node-api] Missing Credentials: pass');
  }

  function maybeParse(res) {
    if (!stringifyBigInt) return res;
    
    try {
      // Handle both string and object inputs appropriately
      const stringInput = typeof res === 'string' ? res : JSON.stringify(res);
      const processed = bigIntStringify(stringInput);
      return JSON.parse(processed);
    } catch (e) {
      console.error("[billbee-node-api] Error in maybeParse:", e);
      if (e.position) {
        console.error("[billbee-node-api] Context around error:", 
          typeof res === 'string' ? res.substring(e.position - 30, e.position + 30) : "N/A");
      }
      throw e;
    }
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
    return Promise.resolve(axiosInstance(config));
  }

  return {
    get(url, params = {}) {
      if (isEmpty(url)) {
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
      if (isEmpty(url)) {
        return rejectMissingUrl();
      }

      if (isEmpty(data)) {
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
      if (isEmpty(url)) {
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
      if (isEmpty(url)) {
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
      if (isEmpty(url)) {
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

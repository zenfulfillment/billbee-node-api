# billbee node api

## Usage

```js
const billbee = require('billbee-node-api')({
  apiKey: 'your-billbee-api-key',
  user: 'your@billbee-user-account.com',
  pass: 'your-api-password'
});

billbee.get('orders')
  .then((res) => console.log(res.Data));
```

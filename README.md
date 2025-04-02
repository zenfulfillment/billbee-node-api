# Billbee Node API

This is a Nodejs client for the Billbee API, providing a simple and efficient way to interact with Billbee's services. 

## Features

- Full REST API support (GET, POST, PUT, PATCH, DELETE)
- Automatic rate limiting handling
- BigInt handling for large numbers
- Promise-based API
- TypeScript-friendly with full type definitions ([index.d.ts](https://github.com/zenfulfillment/billbee-node-api/blob/master/index.d.ts))
- Built-in error handling

## Installation

```bash
npm install billbee-node-api
```

### Dependencies

- The package requires axios v1.0.0 or higher

## Usage

### Basic Setup

```js
// CommonJS import syntax
const BillbeeApiClient = require('billbee-node-api');

const billbee = BillbeeApiClient({
  apiKey: 'your-billbee-api-key',
  user: 'your@billbee-user-account.com',
  pass: 'your-api-password',
  version: 'v1' // optional, defaults to 'v1'
});
```

```js
// ES module import syntax
import * as BillbeeApiClient from 'billbee-node-api';

const billbee = BillbeeApiClient({
  apiKey: 'your-api-key',
  user: 'your-username',
  pass: 'your-password'
});
```

### TypeScript Usage

```ts
// Import
import BillbeeApiClient, { Order, Product, ResponseTypes, Endpoints } from 'billbee-node-api';

const client = BillbeeApiClient({
  apiKey: 'your-billbee-api-key',
  user: 'your@billbee-user-account.com',
  pass: 'your-api-password'
});

// Usage

// Method 1: Using standard HTTP methods
client.get<ResponseTypes.Orders.OrderList>(
  Endpoints.Orders.BASE, 
  { page: 1, pageSize: 50 }
);


// Method 2: Using type-safe request
client.request({
  path: Endpoints.Orders.byId(123),
  method: Utils.HttpMethod.GET
} as Requests.Orders.GetOrderById);

// Create a product with type checking
const newProduct: Product = {
  Id: 0, // New product
  Title: 'Test Product',
  SKU: 'TEST-123',
  Price: 99.99
};

client.post<Product>('products', newProduct)
  .then(response => {
    // response.Data is typed as Product
    console.log(response.Data.Id);
  })
  .catch(error => console.error(error));
```

### Making API Calls

```js
// GET request
billbee.get('orders')
  .then(response => console.log(response.Data))
  .catch(error => console.error(error));

// POST request
billbee.post('orders', {
  // order data
})
  .then(response => console.log(response))
  .catch(error => console.error(error));

// PUT request
billbee.put('orders/123', {
  // updated order data
})
  .then(response => console.log(response))
  .catch(error => console.error(error));

// PATCH request
billbee.patch('orders/123', {
  // partial update data
})
  .then(response => console.log(response))
  .catch(error => console.error(error));

// DELETE request
billbee.del('orders/123')
  .then(response => console.log(response))
  .catch(error => console.error(error));
```

### Advanced Options

You can disable automatic BigInt stringification by passing an options object:

```js
const BillbeeAPI = require('billbee-node-api');

const billbee = BillbeeAPI(
  {
    apiKey: 'your-billbee-api-key',
    user: 'your@billbee-user-account.com',
    pass: 'your-api-password'
  },
  { stringifyBigInt: false }
);
```

## Error Handling

The client automatically handles rate limiting (HTTP 429) by implementing a delay and retry mechanism. All API calls return promises that can be caught and handled appropriately.

## License

MIT

## Author

Zenfulfillment GmbH (devs@zenfulfillment.com)

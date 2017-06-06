# create-cert

> Super simple self signed certificates

[![Build Status](https://travis-ci.org/lukechilds/create-cert.svg?branch=master)](https://travis-ci.org/lukechilds/create-cert)
[![Coverage Status](https://coveralls.io/repos/github/lukechilds/create-cert/badge.svg?branch=master)](https://coveralls.io/github/lukechilds/create-cert?branch=master)
[![npm](https://img.shields.io/npm/v/create-cert.svg)](https://www.npmjs.com/package/create-cert)

`create-cert` is a convenient wrapper around the [`pem`](https://github.com/Dexus/pem) module. It generates a self signed certificate with sensible defaults along with an associated CA certificate to validate against. It has a Promise based API and returns the keys in a format that can be passed directly into `https.createServer`.

## Install

```shell
npm install --save create-cert
```

## Usage

```js
const createCert = require('create-cert');

createCert().then(keys => console.log(keys));
// {
//   key: '-----BEGIN RSA PRIVATE KEY-----\n...',
//   cert: '-----BEGIN CERTIFICATE-----\n...',
//   caCert: '-----BEGIN CERTIFICATE-----\n...'
// }
```

You can create a fully functioning HTTPS server like so:

```js
createCert().then(keys => {
   https.createServer(keys, (req, res) => res.end('Hi!')).listen(443);
});
```

## API

### createCert([options])

Returns a Promise which resolves to a `keys` object.

#### options

Type: `string`, `object`<br>
Default: `{ days: 365, commonName: 'example.com' }

If a string is passed in, it will be used as the commonName. You can pass in any valid option for [`pem.createCertificate()`](https://github.com/Dexus/pem#create-a-certificate) to override the defaults.

## License

MIT © Luke Childs

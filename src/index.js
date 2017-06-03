'use strict';

const pify = require('pify');
const pem = require('pem');

const renameProps = keys => Object.keys(keys).reduce((renamedKeys, key) => {
	const keyData = keys[key];
	key = key === 'certificate' ? 'cert' : key === 'clientKey' ? 'key' : key;
	renamedKeys[key] = keyData;

	return renamedKeys;
}, {});

const createCert = opts => {
	opts = Object.assign({
		days: 365,
		commonName: 'example.com'
	}, typeof opts === 'string' ? { commonName: opts } : opts);

	return pify(pem.createCertificate)({
		days: opts.days,
		selfSigned: true
	}).then(caKeys => pify(pem.createCertificate)(Object.assign({
		serviceCertificate: caKeys.certificate,
		serviceKey: caKeys.serviceKey,
		serial: Date.now()
	}, opts)).then(keys => ({
		keys: renameProps(keys),
		caKeys: renameProps(caKeys)
	})));
};

module.exports = createCert;

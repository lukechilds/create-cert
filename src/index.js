'use strict';

const pify = require('pify');
const pem = require('pem');

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
		key: keys.clientKey,
		cert: keys.certificate,
		caCert: caKeys.certificate
	})));
};

module.exports = createCert;

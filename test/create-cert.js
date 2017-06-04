import test from 'ava';
import pify from 'pify';
import pem from 'pem';
import differenceInDays from 'date-fns/difference_in_days';
import createCert from '../';

test('createCert is a function', t => {
	t.is(typeof createCert, 'function');
});

test('createCert returns a Promise', t => {
	t.true(createCert() instanceof Promise);
});

test('createCert() exposes expected properties', async t => {
	const cert = await createCert();
	const properties = ['csr', 'key', 'cert', 'serviceKey'];

	Object.keys(cert).forEach(certType => properties.forEach(prop => {
		t.true(typeof cert[certType][prop] !== 'undefined');
	}));
});

test('SSL certificate uses expected default values', async t => {
	const cert = await createCert();
	const data = await pify(pem.readCertificateInfo)(cert.keys.cert);

	t.is(data.commonName, 'example.com');
	t.is(differenceInDays(data.validity.end, data.validity.start), 365);
});

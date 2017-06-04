import test from 'ava';
import pify from 'pify';
import pem from 'pem';
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

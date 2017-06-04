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

test('passing a string sets the commonName', async t => {
	const cert = await createCert('foo.com');
	const data = await pify(pem.readCertificateInfo)(cert.keys.cert);

	t.is(data.commonName, 'foo.com');
});

test('passing an object sets the certificate settings', async t => {
	const opts = {
		commonName: 'foo.com',
		days: 1,
		organization: 'bar'
	};
	const cert = await createCert(opts);
	const data = await pify(pem.readCertificateInfo)(cert.keys.cert);

	t.is(data.commonName, opts.commonName);
	t.is(differenceInDays(data.validity.end, data.validity.start), opts.days);
	t.is(data.organization, opts.organization);
});

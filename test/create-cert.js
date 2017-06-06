import https from 'https';
import test from 'ava';
import pify from 'pify';
import pem from 'pem';
import got from 'got';
import differenceInDays from 'date-fns/difference_in_days';
import createCert from '../';

test('createCert is a function', t => {
	t.is(typeof createCert, 'function');
});

test('createCert returns a Promise', t => {
	t.true(createCert() instanceof Promise);
});

test('createCert() exposes expected properties', async t => {
	const keys = await createCert();
	['key', 'cert', 'caCert'].forEach(prop => {
		t.true(typeof keys[prop] !== 'undefined');
	});
});

test('SSL certificate uses expected default values', async t => {
	const keys = await createCert();
	const data = await pify(pem.readCertificateInfo)(keys.cert);

	t.is(data.commonName, 'example.com');
	t.is(differenceInDays(data.validity.end, data.validity.start), 365);
});

test('passing a string sets the commonName', async t => {
	const keys = await createCert('foo.com');
	const data = await pify(pem.readCertificateInfo)(keys.cert);

	t.is(data.commonName, 'foo.com');
});

test('passing an object sets the certificate settings', async t => {
	const opts = {
		commonName: 'foo.com',
		days: 1,
		organization: 'bar'
	};
	const keys = await createCert(opts);
	const data = await pify(pem.readCertificateInfo)(keys.cert);

	t.is(data.commonName, opts.commonName);
	t.is(differenceInDays(data.validity.end, data.validity.start), opts.days);
	t.is(data.organization, opts.organization);
});

test('keys object can be passed directly into https.creatServer', async t => {
	const keys = await createCert('foo.com');
	const server = https.createServer(keys, (req, res) => res.end('Hi!'));
	await pify(server.listen.bind(server))();

	const { body } = await got('https://localhost:' + server.address().port, { rejectUnauthorized: false });
	t.is(body, 'Hi!');
});

test('keys.caCert validates SSL certificate', async t => {
	const keys = await createCert('foo.com');
	const server = https.createServer(keys, (req, res) => res.end('Hi!'));
	await pify(server.listen.bind(server))();

	const { body } = await got('https://localhost:' + server.address().port, {
		ca: keys.caCert,
		headers: { host: 'foo.com' }
	});
	t.is(body, 'Hi!');
});

import test from 'ava';
import createCert from '../';

test('createCert is a function', t => {
	t.is(typeof createCert, 'function');
});

test('createCert returns a Promise', t => {
	t.true(createCert() instanceof Promise);
});

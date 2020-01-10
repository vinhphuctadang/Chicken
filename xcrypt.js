const crypto = require ('crypto');
const constants = require ('constants')
const keygen = require('./keygen.js');
function main (pk, sk) {

	// console.log (typeof (pk));
	console.log ('Public key:');
	var contentToEncrypt = "Hello World";


	var encrypted = keygen.asymEncrypt (pk, contentToEncrypt);
	console.log ('Encrypted data:'+ encrypted);
	console.log ('Private key:');
	console.log (sk);

	var decrypted = keygen.asymDecrypt (sk, encrypted, 'password');
	console.log ('Decrypted data:'+decrypted);
}

crypto.generateKeyPair('rsa', {
	modulusLength: 2048,
	publicKeyEncoding: {
		type: 'spki', // read more about this
		format: 'pem'
	},
	privateKeyEncoding: {
		type: 'pkcs8',
		format: 'pem',
		cipher: 'aes-256-cbc',
		passphrase: 'password'
	}
}, (err, publicKey, privateKey) => {
	// Handle errors and use the generated key pair.
		if (err)
			console.log (err);
		else {
			
			main (publicKey, privateKey);

		}
});
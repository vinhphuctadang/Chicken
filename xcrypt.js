const crypto = require ('crypto');
const constants = require ('constants')

function main (pk, sk) {

	// console.log (typeof (pk));
	console.log ('Public key:');
	var contentToEncrypt = "Hello World";
	var buffer = Buffer.from (contentToEncrypt, 'utf8');

	var encrypted = crypto.publicEncrypt (pk, buffer); 

	console.log ('Encrypted data:'+ encrypted.toString ('base64'));

	console.log ('Private key:');
	console.log (sk);

	var decrypted = crypto.privateDecrypt (
		{	
			"key":sk,
			passphrase:'password',			
		}
		, encrypted);
	console.log ('Decrypted data:'+decrypted.toString ());
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
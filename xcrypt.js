const crypto = require ('crypto')

function main (pk, sk) {

	var toEncrypt = "my secret text to be encrypted";
	var encryptBuffer = Buffer.from(toEncrypt);

	//encrypt using public key
	var encrypted = crypto.publicEncrypt(pk,encryptBuffer);

	//print out the text and cyphertext
	console.log("Text to be encrypted:");
	console.log(toEncrypt);
	console.log("cipherText:");
	console.log(encrypted.toString());

	//decrypt the cyphertext using the private key
	var decryptBuffer = Buffer.from(encrypted.toString("base64"), "base64");
	var decrypted = crypto.privateDecrypt(sk,decryptBuffer);

	//print out the decrypted text
	console.log("decripted Text:");
	console.log(decrypted.toString());
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
		passphrase: 'top secret'
	}
}, (err, publicKey, privateKey) => {
	// Handle errors and use the generated key pair.
		if (err)
			console.log (err);
		else 
			main (publicKey, privateKey);
});
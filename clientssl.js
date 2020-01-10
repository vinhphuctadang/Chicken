var crypto = require ('crypto');
var PASSPHRASE = 'clientsecret';

function getMsgSignature (sk, msg) {
	var signature = crypto.sign (sk, 'base64');
	var buf = Buffer.from (msg, 'utf8');
	var result = signature.update (buf);
	return result;
}

function generateRSA () {
	return new Promise ((resolve, reject) => {
		crypto.generateKeyPair('rsa', {
			modulusLength: 2048,
		  	publicKeyEncoding: {
				type: 'spki',
				format: 'pem'
		  	},
			 privateKeyEncoding: {
				type: 'pkcs8',
				format: 'pem',
				cipher: 'aes-256-cbc',
				passphrase: PASSPHRASE // replace with psudo-random bytes
			  }
		}, (err, publicKey, privateKey) => {
		  	// Handle errors and use the generated key pair.
		  	// console.log ('GET');
		  	if (err) {
		  		reject (err);
		  		return;
		  	}
			resolve ({
				pk : publicKey,
				sk : privateKey
			});
		});
	});
}

async function main () {

	var msg = 'Hello world';
	console.log ('Message: ' + msg);
	var keyPair = await generateRSA ();
	var signature = getMsgSignature (keyPair.pk, msg);
	console.log (signature);
	return 0;
}

main ().then (()=>{

}).catch ((err)=>{
	console.log (err);
})
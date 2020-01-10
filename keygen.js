var keygen = exports;

var elliptic = require('elliptic');
var EC = new elliptic.ec ('secp256k1'); // to use it multiple times

function generateKey () {
	var key = EC.genKeyPair ();
	return key;
}

function getKey (pk, sk) {
	key = EC.keyPair ({
		pub: pk,
		priv: sk,
		privEnc : 'hex',
		pubEnc : 'hex'
	}); 	
	return key;
}
// save the generated key into specified file
function saveKey (key, ofile = 'creditential.json') {
	var public = key.getPublic ('hex');
	var private = key.getPrivate ('hex');

	var toWrite = {
		pk : public,
		sk : private
	}

	var strToWrite = JSON.stringify (toWrite);
	var fs = require('fs');

	fs.writeFile(ofile, strToWrite, function (err) {
		if (err) throw err;
	});
}


function loadKey (ifile = 'creditential.json') {
	return new Promise ( (resolve, reject) => {
		var fs = require('fs');
		fs.readFile( __dirname + '/' + ifile, (err, data) => {
			if (err) {
				reject (err);
				return;
			}
			parsed = JSON.parse (data.toString ());
			try {
				key = getKey (parsed.pk, parsed.sk);
				resolve (key);
			} catch (e) {
				reject (e);
			}
		});
	});
}

// exports function to be called from other js
keygen.loadKey = loadKey; 
keygen.getKey = getKey; 

var crypto = require ('crypto');

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
		passphrase: 'top secret'
	  }
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.

});
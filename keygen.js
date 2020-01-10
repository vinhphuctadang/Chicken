var keygen = exports;
var elliptic = require('elliptic');
var EC = new elliptic.ec ('secp256k1'); // to use it multiple times
var crypto = require ('crypto');

function symEncrypt(value, useKey = key) {
	var algorithm = 'aes256';
	// var iv = Buffer.alloc (32, 0)
	var cipher = crypto.createCipher(algorithm, useKey);
    var encrypted = cipher.update(value, 'utf8', 'base64');
    encrypted += cipher.final('base64')
    return encrypted
}

function symDecrypt(encrypted, useKey = key) {
	var algorithm = 'aes256';
    var decipher = crypto.createDecipher(algorithm, useKey);
    var decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

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

function getMsgSignature (sk, msg, PASSPHRASE) { // using RSA only, SHA256 has hash function
	var sign = crypto.createSign('RSA-SHA256')
  	sign.update(msg)
  	let signature = sign.sign({
  		key:sk,
  		passphrase:PASSPHRASE
  	}, 'base64');
	return signature;
}

function verifySignature (pk, signature, msg) {// using RSA only, SHA256 has hash function
	
    const verifier = crypto.createVerify('RSA-SHA256')
    verifier.update (msg, 'utf8');

    const signatureBuf = Buffer.from (signature, 'base64')
    const result = verifier.verify(pk, signatureBuf)

	return result;
}

function generateRSA (PASSPHRASE) {
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

function asymEncrypt (pk, contentToEncrypt) {
	var buffer = Buffer.from (contentToEncrypt, 'utf8');
	var encrypted = crypto.publicEncrypt (pk, buffer); 
	return encrypted.toString ('base64');
}

function asymDecrypt (sk, encrypted, PASSPHRASE) { // encrypted in base64 format

	var buffer = Buffer.from (encrypted, 'base64');
	var decrypted = crypto.privateDecrypt (
		{	
			"key":sk,
			passphrase: PASSPHRASE,			
		}
		, buffer);	
	return decrypted.toString ('utf8');
}

// exports function to be called from other js
keygen.loadKey = loadKey; 
keygen.getKey = getKey;
keygen.symEncrypt = symEncrypt; 
keygen.symDecrypt = symDecrypt; 
keygen.asymEncrypt = asymEncrypt; 
keygen.asymDecrypt = asymDecrypt; 

keygen.getMsgSignature = getMsgSignature; 
keygen.verifySignature = verifySignature;
keygen.generateRSA = generateRSA;

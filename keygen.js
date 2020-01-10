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

keygen.loadKey = loadKey; // to exports LoadKey function
keygen.getKey = getKey; // to exports LoadKey function

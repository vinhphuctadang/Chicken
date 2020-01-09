

// Create and initialize EdDSA context
// (better do it once and reuse it)
// Dependencies
var elliptic = require('elliptic');
var crypto = require ('crypto');
var EdDSA = elliptic.eddsa;
function authenticate (crypto, username, signature, hexPublicKey) {

	
	var ec = new EdDSA('ed25519');
	// perform a hash on username
	var msgHash = crypto.createHash('md5').update (username).digest ('hex');
	var key = ec.keyFromPublic(hexPublicKey, 'hex');
	return key.verify(msgHash, signature); // validate using public key
}

var ec = new EdDSA('ed25519');
// Create key pair from secret
var key = ec.keyFromSecret('000000000'); // hex string, array or Buffer

// Sign the message's hash (input must be an array, or a hex-string)
var msg = 'toilaphuc'
var msgHash = crypto.createHash('md5').update (msg).digest ('hex');
var signature = key.sign(msgHash).toHex();

// recipient:
var pub = elliptic.utils.toHex (key.getPublic ());

console.log (authenticate (crypto, msg, signature, pub))
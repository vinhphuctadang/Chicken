const stdin = process.openStdin()
var elliptic = require('elliptic');
var crypto = require ('crypto');
var EdDSA = elliptic.eddsa;

async function prompt (){

	process.stdout.write('Enter username:')
	var name = ""
	let stuff = new Promise ((resolve, reject) => {
			stdin.addListener('data', text => {
			  name = text.toString().trim()
			  // console.log('Your name is: ' + name)
			  stdin.pause() // stop reading
			  // console.log ('Hello world');
			  resolve (name)
			});
		});
	
	let result = await stuff;
	return result;
}

function getSignResult (__msg) { // return json of hexPublic key, msg hash and signature

	var ec = new EdDSA('ed25519');
	var key = ec.keyFromSecret('111111111'); // hex string, array or Buffer, or load key from file

	// Sign the message's hash (input must be an array, or a hex-string)
	var msgHash = crypto.createHash('md5').update (__msg).digest ('hex');
	var sign = key.sign(msgHash).toHex();

	var pub = elliptic.utils.toHex (key.getPublic ());
	return {
		hexPublicKey : pub,
		msg : __msg,
		signature : sign
	}
}

prompt ().then ( (name) => {
	let toSend = getSignResult (name);
	const axios = require('axios')

	axios.post('http://localhost:8080/signup', toSend)
	.then((res) => {	  
	  console.log(res.data)
	})
	.catch((error) => {
	  console.error(error)
	})
});

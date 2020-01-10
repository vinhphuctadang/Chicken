const stdin = process.openStdin()
var elliptic = require ('elliptic');
var crypto = require ('crypto');
var keygen = require ('./keygen.js');

function input (prompt){

	console.log (prompt);
	var stuff = new Promise ((resolve, reject) => {
			stdin.addListener('data', text => {
			  name = text.toString().trim()			  
			  stdin.pause() // stop reading		
			  resolve (name)
			});
		});
	return stuff;
}

function getSignResult (key, __msg) { // return json of hexPublic key, msg hash and signature

	var msgHash = crypto.createHash('md5').update (__msg).digest ('hex');
	var pub = key.getPublic ('hex');
	var sign = key.sign(msgHash).toDER ('hex');
	// console.log (sign);
	return {
		hexPublicKey : pub,
		msg : __msg,
		signature : sign
	}
}

async function main () {
	var key = await keygen.loadKey ('creditential.json'); // will create if no key exists
	var name = await input ('Username: ');
	// console.log (key);
	var toSend = getSignResult (key, name); // after get input
	const axios = require('axios');	

	axios.post('http://localhost:8080/login', toSend)
	.then((res) => {	  
		console.log("server resp: " + res.data)
	})
	.catch((error) => {
		console.error("client err: " + error)
	})

	return true;
}

main ().then ((result) => {
	// console.log (result);
}).catch ((err) => {
	// console.log ('rejected ' + err);
});


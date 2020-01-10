
require ('dotenv').config ({
	path: '.env'
})

var crypto = require ('crypto');
var keygen = require ('./keygen.js')
var PASSPHRASE = 'clientsecret';

var ENC_KEY = "";
var SERVER_PUBLIC_KEY = "";

const axios = require('axios');	
const port = (process.env.PORT || 8080);
// function request (body) {
// 	return new Promise ((resolve, reject) => {
// 		axios.post('http://localhost:8080/login', toSend)
// 		.then((res) => {	  
// 			console.log("server resp: " + res.data)
// 		})
// 		.catch((error) => {
// 			console.error("client err: " + error)
// 		})	
// 	});
// }


async function main () {
	
	var keyPair = await keygen.generateRSA (PASSPHRASE);
	// console.log (keyPair);
	var initMsg = 'connect';

	var resp = await axios.post('http://localhost:'+port+'/', 
		{
			signature : keygen.getMsgSignature (keyPair.sk, initMsg, PASSPHRASE),
			publicKey : keyPair.pk,
			content : initMsg
		});

	// console.log (resp.data);
	var info = resp.data;

	if (!keygen.verifySignature (info.publicKey, info.signature, info.content)) {
		console.log ('Connection invalid');
	} else {

		SERVER_PUBLIC_KEY = info.publicKey;
		ENC_KEY = crypto.randomBytes (32).toString ('base64');
		EN_ENC_KEY = keygen.asymEncrypt (SERVER_PUBLIC_KEY, ENC_KEY);

		var acc_result = await axios.post('http://localhost:'+port+'/', 
			{
				signature : keygen.getMsgSignature (keyPair.sk, EN_ENC_KEY, PASSPHRASE),
				publicKey : keyPair.pk,
				key: EN_ENC_KEY
			}); // now only send the sceret to the server

		// console.log (acc_result);
		var j_acc_result = acc_result.data;
		if (!keygen.verifySignature (SERVER_PUBLIC_KEY, j_acc_result.signature, info.content)) {
			console.log ('Connection invalid');
		} else {
			if (j_acc_result.content = 'ok') {
				console.log ('Connection now use "' + ENC_KEY + '" as a symetric encrypt key');
			} else {
				console.log ('Failed establish a connection');
			}
		}
	}
	return 0;
}

main ().then ((res)=>{
	console.log ('process returns with return value ' + res);
}).catch ((err)=>{
	console.log (err);
})
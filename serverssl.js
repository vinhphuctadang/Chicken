// serverside
require ('dotenv').config ({
	path: '.env'
})

function encrypt(value, useKey = key) {
	var algorithm = 'aes256';
	// var iv = Buffer.alloc (32, 0)
	var cipher = crypto.createCipher(algorithm, useKey);
    var encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex')
    return encrypted
}

function decrypt(encrypted, useKey = key) {
	var algorithm = 'aes256';
    var decipher = crypto.createDecipher(algorithm, useKey);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
}

var 	express 	 = require ('express')
var 	bodyParser   = require("body-parser");
var 	app 		 = express ()
var 	crypto 		 = require ('crypto');
var 	app = express ()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 8080;


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
		passphrase: 'password'
	  }
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
});


app.get ('/', (req, res)=>{ // ssl auto initialization
		
	})

// app.listen (port, ()=>{
// 	console.log ("Listening on " + port);
// })
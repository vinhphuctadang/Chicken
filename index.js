// serverside
require ('dotenv').config ({
	path: '.env'
})
var 	express 	 = require ('express')
var 	bodyParser   = require("body-parser");
var 	app 		 = express ()
var 	elliptic 	 = require('elliptic');
var 	crypto 		 = require ('crypto');

var 	app = express ()
var ec = new elliptic.ec ('secp256k1'); // to use it multiple times
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

var EC = require('elliptic').ec;
// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');
var database = { // load from the database later

}
app.get ('/', (req, res)=>{
		res.send ('Please login');
	})
app.get ('/login', (req, res)=>{
		res.render ("login.ejs")
	})
app.get ('/signup', (req, res)=>{
		res.render ("signup.ejs")
	})

app.get ('/:file',  (req, res)=>{
	res.sendFile (__dirname + '/publib/'+req.params.file);
})

app.post ('/login', (req, res)=>{
		// console.log (req);
		try {
			signature = req.body.signature;
			username = req.body.msg;
			hexPublicKey = req.body.hexPublicKey;

			collection = {
				signature : signature,
				username : username,
				hexPublicKey : hexPublicKey
			}

			console.log (collection);
			if (authenticate (crypto, username, signature, hexPublicKey)) { // message is unchanged, sent by someone and intergrity assured
				if (!(username in database) || database[username] != hexPublicKey) {
					res.send ('UNKNOWN name');
					console.log ('FAILED: no such name');
				} else {
					res.send ('LOGGED IN SUCCESSFULLY');
					console.log ('success');
				}
			} else {
				res.send ('NOT ALLOWED: unrecognized identity');
				console.log ('not allowed');
			}

		} catch (e) {
			res.send ('Login fatal error: ' + e);
		}
	})

app.post ('/signup', (req, res)=>{

		username = req.body.msg;
		hexPublicKey = req.body.hexPublicKey;
		signature = req.body.signature;

		if (authenticate (crypto, username, signature, hexPublicKey)) {
			if (! (username in database)) {
				database[username] = hexPublicKey; // TODO: Registration completion intuitively
				res.send ('REGISTER COMPLETED');	
			} else {
				res.send ('REGISTER FAILED: DUPLICATE');	
			}
			
		} else {
			res.send ('Message has been modified by someone');
		}

		// res.send ('sent information: name="'+name+'" and pass="'+pass+'"')
	})

// Dependencies

function authenticate (crypto, username, signature, hexPublicKey) {
	// var ec = new EdDSA('ed25519');
	// perform a hash on username
	var msgHash = crypto.createHash('md5').update (username).digest ('hex');
	var key = ec.keyFromPublic(hexPublicKey, 'hex');
	// validate using public key
	return key.verify(msgHash, signature); 
}

app.listen (port, ()=>{
	console.log ("Listening on " + port);
})
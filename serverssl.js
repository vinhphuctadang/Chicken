// serverside
require ('dotenv').config ({
	path: '.env'
})
var 	keygen	     = require ('./keygen.js')
var 	express 	 = require ('express')
var 	bodyParser   = require("body-parser");
var 	app 		 = express ()
var 	crypto 		 = require ('crypto');
var 	app = express ()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

var KEY_PAIR = null;
var PASSPHRASE = 'mydate';
var CLIENT_PUBLIC_KEY = '';

app.post ('/', (req, res)=>{ // ssl auto initialization
		

		jbody = req.body;		
		

		if (('content' in jbody && keygen.verifySignature (jbody.publicKey, jbody.signature, jbody.content))
			|| ('key' in jbody && keygen.verifySignature (jbody.publicKey, jbody.signature, jbody.key))){
			// console.log ('verified');

			// console.log (typeof (jbody.publicKey));
			if ('content' in jbody && jbody.content == 'connect') {
				res.send (JSON.stringify ({
					signature : keygen.getMsgSignature (KEY_PAIR.sk, 'ok', PASSPHRASE),
					publicKey : KEY_PAIR.pk,
					content : 'ok'
				}));
			} else if ('key' in jbody) {

				try {
					var mutalKey = keygen.asymDecrypt (KEY_PAIR.sk, jbody.key, PASSPHRASE);
					console.log ('Now connect with symmetric key: ' + mutalKey);
					CLIENT_PUBLIC_KEY = jbody.publicKey;
				} catch (e) { 
					res.send (JSON.stringify ({
						signature : keygen.getMsgSignature (KEY_PAIR.sk, 'failed', PASSPHRASE),
						publicKey : KEY_PAIR.pk,
						content : 'failed'
					}));
				}

				res.send (JSON.stringify ({
						signature : keygen.getMsgSignature (KEY_PAIR.sk, 'ok', PASSPHRASE),
						publicKey : KEY_PAIR.pk,
						content : 'ok'
					}));
			}
		} else
			res.send ('Connection failed due to certification errors');
	});

async function main () {
	
	KEY_PAIR = await keygen.generateRSA (PASSPHRASE);

	app.listen (port, ()=>{
		console.log ("Listening on " + port);
	})
}


main ()
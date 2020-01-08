require ('dotenv').config ({
	path: '.env'
})

var 	express 	 = require ('express')
var 	bodyParser   = require("body-parser");

var 	app = express ()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

var database = { // load from the database later

}

app.get ('/', (req, res)=>{
		res.send ('HELLO WORLD');
	})
app.get ('/login', (req, res)=>{
		res.render ("login.ejs")
	})
app.get ('/signup', (req, res)=>{
		res.render ("signup.ejs")
	})
app.post ('/login', (req, res)=>{
		try {
			
		} catch (e) {
			res.send ('Login failed, due to ' + e);
		}
	})

app.post ('/signup', (req, res)=>{
		name = req.body.username;
		pass = req.body.password;
		repass = req.body.repassword;
		res.send ('sent information: name='+name+' and pass='+pass)

	})

function authentication (usr, psw){

}

function register (usr, psw) {
		
}

app.listen (port, ()=>{
	console.log ("Listening on " + port);
	})

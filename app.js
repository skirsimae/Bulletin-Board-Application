const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const pg = require('pg'); //include node postgres library.


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static('public'));

app.set('views', './public/views');
app.set('view engine', 'pug');

var connectionString = 'postgres://' + process.env.POSTGRES_USER + ':' + process.env.POSTGRES_PASSWORD + '@localhost/bulletinboard';

app.get('/', function(req, res) {
	res.render('messages');
});

app.post('/', function(req,res) {
	pg.connect( connectionString, function(err, client, done) { //connect to the database. 
		if(err){ //handle connection errors. 
			throw err;
		}
		done();

		client.query('INSERT INTO messages(title, body) values($1,$2)', [req.body.title, req.body.body]); //SQL Query --> insert data.
		done();

		res.redirect('all_messages') 
	});
});

app.get('/all_messages', function(req,res) {
	pg.connect(connectionString, function(err, client, done) {
		if(err){ //handle connection errors. 
			throw err;
		}
		done(); 

		client.query('SELECT * FROM messages', function (err, result) {
			var messages = result.rows;

			res.render('all_messages', {
				messages: messages
			});
			pg.end();
		});
	});
});

var listener = app.listen(3030, function () {
	console.log('Server has started at: ' + listener.address().port);
});
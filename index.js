require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const jp = require('jsonpath');

app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {

	io.emit('prompt');
	console.log('Client connected')

    socket.on('password', function(password) {

        if (password == process.env.password) {
			console.log('Client logged in as: '+ socket.id);

			var jsondata = fs.readFileSync('./json/table.json', 'utf8');

			io.emit('login', jsondata);
		} else {
			io.emit('fail')
			console.log('Failed login with: ' + password)
		}
    });

	socket.on('request', function(requestid) {
        console.log('Requested entry: '+ requestid);

			var jsondata = JSON.parse(fs.readFileSync('./json/table.json', 'utf8'));
			returnjson = jp.query(jsondata, `$..[?(@.id =='${requestid}')]`);
			console.log(returnjson)
			io.emit('returnEntry', returnjson);
    });

});

const server = http.listen(8080, function() {
    console.log('listening on http://localhost:8080');
});

// 
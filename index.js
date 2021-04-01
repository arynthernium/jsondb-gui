require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {

    socket.on('password', function(password) {
        if (password == process.env.password) {
			console.log('Client logged in as: '+ socket.id);

			var jsondata = JSON.parse(fs.readFileSync('table.json')
			);
			console.log(JSON.stringify(jsondata));

			jsondata.forEach(entry => {
				console.log(JSON.stringify(entry));
				console.log(entry.name)
			});

			io.send('login', `${JSON.stringify(jsondata)}`);
		} else {
			io.send('fail')
			console.log('Failed login with: ' + password)
		}
    });

});

const server = http.listen(8080, function() {
    console.log('listening on http://localhost:8080');
});
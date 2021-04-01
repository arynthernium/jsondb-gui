require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs')

app.get('/', function(req, res) {
    res.render('index.ejs');
});

io.sockets.on('connection', function(socket) {

    socket.on('password', function(password) {
        if (password == process.env.password) {
			io.send('login', JSON.parse(fs.readFileSync('./table.json')));
			console.log('Client logged in as: '+ socket.id);
		} else {
			io.send('fail')
			console.log('Failed login with: ' + password)
		}
    });

});

const server = http.listen(8080, function() {
    console.log('listening on http://localhost:8080');
});
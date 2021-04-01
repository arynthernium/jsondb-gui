require('dotenv').config();
const { json } = require('express');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const jp = require('jsonpath');
const { v4: uuidv4 } = require('uuid');

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
			console.log(returnjson);
			io.emit('returnEntry', returnjson);
    });

	socket.on('writeEntry', function(entrydata) {
		var jsondata = JSON.parse(fs.readFileSync('./json/table.json', 'utf8'));
		console.log(`Pre-write table: ${JSON.stringify(jsondata)}`);

		var entry = [];
		entry.unshift(uuidv4());
		entry.concat(JSON.parse(entrydata));

		console.log(JSON.stringify(entry));

		jsondata.concat(entry);
		console.log(JSON.stringify(jsondata));

		// entry = JSON.parse(entrydata);
        // console.log('Writing entry: '+ JSON.stringify(entry));
		// var jsondata = JSON.parse(fs.readFileSync('./json/table.json', 'utf8'));
		// console.log(`Pre-write table: ${JSON.stringify(jsondata)}`);

		// jsondata.unshift(uuidv4());
		// jsondata.push(entry);
		// console.log('Post-write table: ' + jsondata);
		// fs.writeFileSync('./json/table.json', `${JSON.stringify(jsondata)}`, function(err) {
		// 	if (err) throw err;
		// });
		// io.emit('listEntry', jsondata);
    });

});

const server = http.listen(8080, function() {
    console.log('listening on http://localhost:8080');
});

// 
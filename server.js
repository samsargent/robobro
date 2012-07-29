var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

var SerialPort = require("serialport").SerialPort

app.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


// Change serial connection to whatever your Ardunio is connected to
var serialPort = new SerialPort("/dev/tty.usbmodem621");

serialPort.on("data", function (data) {
    console.log(data);
});


// reduce logging
io.set('log level', 1); 

var clients = Array();

io.sockets.on('connection', function (socket) {	
	socket.broadcast.emit('client connected');
	// emit status socket data to update interface with connection state
	socket.emit('status', { connected: 'true' });
	
	// On 'pan' socket, write to serial port and broadcast to update other clients 
  	socket.on('pan', function (data) {
    	console.log(data);
		serialPort.write(data.pan+".");
		socket.broadcast.emit('pan', { pan: data.pan });
  	});
});